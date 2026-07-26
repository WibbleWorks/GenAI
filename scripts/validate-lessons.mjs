// scripts/validate-lessons.mjs
//
// Roadmap T6.7. Loads the MERGED COURSE_DATA (course-data.js + practical-examples.js)
// using a minimal DOM shim, then validates every lesson against
// docs/lesson.schema.json using a lightweight schema validator (no external
// deps - the subset of JSON Schema we actually use here is small).
//
// Run locally:
//   node scripts/validate-lessons.mjs
//
// CI: runs as a CI job (see .github/workflows/ci.yml).

import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- Minimal DOM shim shared context so course-data.js + practical-examples.js evaluate ---
const ctx = {
  console,
  Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp,
  parseInt, parseFloat, isNaN, Infinity, NaN, undefined,
  Set, Map, Promise, Symbol, Proxy, Reflect,
  setTimeout, setInterval, clearInterval,
  Intl,
  requestAnimationFrame: () => {}, cancelAnimationFrame: () => {},
};
// We need `window`, `document`, `localStorage`, `navigator` available as globals
ctx.window = {
  animations: { startAnimation: () => {}, stopAnimation: () => {}, drawFrame: () => {} },
  quiz: { cancelQuiz: () => {}, startQuiz: () => {}, endQuiz: () => {}, currentQuiz: null },
  course: {
    completedLessons: new Set(), markLessonComplete: () => {}, adaptiveLearning: () => {},
    logActivity: () => {}, findLesson: () => null, showLesson: () => {},
    startAnimation: () => {}, startQuiz: () => {},
    buildNavigation: () => {}, updateProgress: () => {}, updateNavigation: () => {},
    currentLessonId: null, currentLevel: 'beginner',
    completedLessonsEl: null, avgScoreEl: null, currentScoreEl: null,
    masteredTopicsEl: null, confidenceLevelEl: null,
    progressFill: { setAttribute: () => {}, style: {} },
    progressText: null, courseNav: null,
    confidenceLevels: {}, scores: {}
  },
  aiLab: { runCurrentCode: () => {}, createInteractiveLab: () => '', runCode: async () => ({success: true, output: ''}), colabUrlFor: () => '' },
  aiLabCopy: () => {},
  aiLabOpenInColab: () => {},
  mountInteractiveLabs: () => {},
  runCurrentCode: () => {},
  quiz: { cancelQuiz: () => {} }
};
ctx.document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}, body: null };
ctx.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
try { ctx.navigator = { clipboard: { writeText: async () => {} } }; } catch (e) { /* read-only */ }
try { ctx.location = { reload: () => {} }; } catch (e) { /* read-only */ }
ctx.CanvasRenderingContext2D = class {};
ctx.Image = class {};
// Intentionally do NOT set ctx.module - the CJS export lines at the bottom
// of each file check `typeof module !== 'undefined'` and skip themselves.
// (Trying to set module would trigger block-scoped class refs that don't exist
//  outside the wrapped `if (COURSE_DATA)` block in practical-examples.js.)
ctx.COURSE_DATA = undefined;

// Create a shared context that BOTH files evaluate in
vm.createContext(ctx);

const cd = readFileSync(join(ROOT, 'course-data.js'), 'utf8');
const pe = readFileSync(join(ROOT, 'practical-examples.js'), 'utf8');

// Append a global-assignment line so the `const COURSE_DATA` declared at the top
// of course-data.js leaks into the vm context (const is block-scoped otherwise).
// In vm contexts, `globalThis` IS the context object, so this propagates correctly.
const cdForVm = cd + '\n;globalThis.COURSE_DATA = COURSE_DATA;';
const peForVm = pe + '\n;globalThis.COURSE_DATA = COURSE_DATA;';

vm.runInContext(cdForVm, ctx, { filename: 'course-data.js' });
// Make COURSE_DATA visible to practical-examples.js's `typeof COURSE_DATA` check.
// In the vm context, the `const COURSE_DATA` declaration in practical-examples.js
// would redeclare, but since the file structure is a top-level `if (typeof COURSE_DATA === 'undefined') { ... } else { ... }`,
// the check passes and the else block executes without redeclaring.
// We also copy it to ctx.window for any code using window.COURSE_DATA.
ctx.window.COURSE_DATA = ctx.COURSE_DATA;

vm.runInContext(peForVm, ctx, { filename: 'practical-examples.js' });

const courseDataLoaded = ctx.COURSE_DATA || ctx.window.COURSE_DATA;

// --- Lightweight JSON-Schema subset validator ---
function validate(obj, schema, path = '') {
    const errors = [];
    if (schema.type) {
        // JS doesn't distinguish integer vs number natively; check both forms
        if (schema.type === 'integer') {
            if (typeof obj !== 'number' || !Number.isInteger(obj)) {
                errors.push(`${path || '(root)'}: expected integer, got ${typeof obj} (${JSON.stringify(obj)})`);
                return errors;
            }
        } else if (schema.type === 'array') {
            if (!Array.isArray(obj)) {
                errors.push(`${path || '(root)'}: expected array, got ${typeof obj}`);
                return errors;
            }
        } else if (schema.type === 'object') {
            // Arrays are also typeof 'object'; reject them here
            if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
                errors.push(`${path || '(root)'}: expected object, got ${obj === null ? 'null' : typeof obj}${Array.isArray(obj) ? ' (array)' : ''}`);
                return errors;
            }
        } else if (typeof obj !== schema.type) {
            errors.push(`${path || '(root)'}: expected ${schema.type}, got ${typeof obj}`);
            return errors;
        }
    }
    if (schema.enum && !schema.enum.includes(obj)) {
        errors.push(`${path}: value "${obj}" not in enum [${schema.enum.join(', ')}]`);
    }
    if (schema.pattern && typeof obj === 'string') {
        if (!new RegExp(schema.pattern).test(obj)) errors.push(`${path}: does not match pattern ${schema.pattern}`);
    }
    if (schema.minimum !== undefined && typeof obj === 'number' && obj < schema.minimum) errors.push(`${path}: ${obj} < minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && typeof obj === 'number' && obj > schema.maximum) errors.push(`${path}: ${obj} > maximum ${schema.maximum}`);
    if (schema.minItems !== undefined && Array.isArray(obj) && obj.length < schema.minItems) errors.push(`${path}: ${obj.length} items < minItems ${schema.minItems}`);
    if (schema.maxItems !== undefined && Array.isArray(obj) && obj.length > schema.maxItems) errors.push(`${path}: ${obj.length} items > maxItems ${schema.maxItems}`);

    // Resolve $ref to $defs. If $ref can't be resolved, the resulting `def`
    // is essentially an empty schema (no constraints) and we just skip.
    let def = schema;
    if (schema.$ref) {
        const refName = schema.$ref.replace('#/$defs/', '');
        const rootDefs = schema._rootDefs?.$defs || schema.$rootDefs?.$defs || {};
        def = rootDefs[refName] || {};
    }
    if (!def) def = {};

    if (def.required && def.properties) {
        for (const req of def.required) {
            if (!(req in obj)) errors.push(`${path}.${req}: required field missing`);
        }
    }
    if (def.additionalProperties === false && def.properties) {
        for (const key of Object.keys(obj)) {
            if (!(key in def.properties)) errors.push(`${path}.${key}: additional property not allowed`);
        }
    }
    if (def.properties) {
        for (const [k, propSchema] of Object.entries(def.properties)) {
            if (k in obj) {
                // Attach root $defs so $ref resolves
                const childSchema = { ...propSchema };
                if (childSchema.$ref) childSchema._rootDefs = { $defs: schema._rootDefs?.$defs || schema.$rootDefs?.$defs || {} };
                errors.push(...validate(obj[k], childSchema, path ? `${path}.${k}` : k));
            }
        }
    }
    if (def.items && Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            const itemSchema = { ...def.items };
            if (itemSchema.$ref) itemSchema._rootDefs = { $defs: schema._rootDefs?.$defs || schema.$rootDefs?.$defs || {} };
            errors.push(...validate(obj[i], itemSchema, `${path}[${i}]`));
        }
    }
    return errors;
}

// --- Load schema and inject $defs at the root ---
const schema = JSON.parse(readFileSync(join(ROOT, 'docs', 'lesson.schema.json'), 'utf8'));
function validateWithDefs(lessonObj, label) {
    const withDefs = { ...schema };
    const rootWithDefs = { ...withDefs, _rootDefs: { $defs: schema.$defs } };
    return validate(lessonObj, rootWithDefs, label);
}

// --- Run validation over every lesson ---
const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'research'];
let pass = 0, fail = 0;
const allErrors = [];

for (const lvl of levelOrder) {
    const level = courseDataLoaded.levels[lvl];
    if (!level || !level.lessons) continue;
    for (const [id, lesson] of Object.entries(level.lessons)) {
        const errs = validateWithDefs(lesson, id);
        if (errs.length === 0) { pass++; console.log(`  ok:  ${id}`); }
        else {
            fail++;
            console.error(`  FAIL: ${id}`);
            errs.forEach(e => { console.error(`      ${e}`); allErrors.push({ id, error: e }); });
        }
    }
}

console.log('\n----');
if (fail > 0) {
    console.error(`LESSON SCHEMA VALIDATION FAILED (${fail} lesson(s) with errors, ${pass} ok)`);
    process.exit(1);
}
console.log(`LESSON SCHEMA VALIDATION PASSED (${pass} lessons valid against docs/lesson.schema.json)`);