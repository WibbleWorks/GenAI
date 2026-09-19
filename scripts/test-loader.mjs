// scripts/test-loader.mjs
//
// P5: proves the JSON overlay works without a browser. Stubs fetch() with
// file reads, loads inline COURSE_DATA via the vm shim, applies the loader's
// overlayJsonLessons, and asserts:
//   1. ai_introduction (pilot, inline content deleted) renders from JSON
//   2. every manifest id overlays onto a real inline lesson (no silent drops)
//   3. unknown ids (e.g. quantum-course) are ignored, never leak into core
//
// Run: node scripts/test-loader.mjs

import { readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const require = createRequire(import.meta.url);
const { overlayJsonLessons } = require('../loader.js');

// --- Inline COURSE_DATA via vm shim (same as validate-lessons.mjs) ---
const ctx = {
  console, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp,
  parseInt, parseFloat, isNaN, Infinity, NaN, undefined,
  Set, Map, Promise, Symbol, Proxy, Reflect,
  setTimeout, setInterval, clearInterval, Intl,
  requestAnimationFrame: () => {}, cancelAnimationFrame: () => {},
};
ctx.window = {
  animations: {}, quiz: {}, course: {}, aiLab: {},
  aiLabCopy: () => {}, aiLabOpenInColab: () => {},
  mountInteractiveLabs: () => {}, mountLabChecks: () => {}, mountCapstoneSubmit: () => {},
  runLabCheck: () => {}, submitCapstone: () => {}, runCurrentCode: () => {},
};
ctx.document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}, body: null };
ctx.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
try { ctx.navigator = { clipboard: { writeText: async () => {} } }; } catch (e) { /* read-only */ }
try { ctx.location = { reload: () => {} }; } catch (e) { /* read-only */ }
ctx.CanvasRenderingContext2D = class {};
ctx.Image = class {};
ctx.COURSE_DATA = undefined;
vm.createContext(ctx);
const cd = readFileSync(join(ROOT, 'course-data.js'), 'utf8');
const pe = readFileSync(join(ROOT, 'practical-examples.js'), 'utf8');
vm.runInContext(cd + '\n;globalThis.COURSE_DATA = COURSE_DATA;', ctx, { filename: 'course-data.js' });
ctx.window.COURSE_DATA = ctx.COURSE_DATA;
vm.runInContext(pe + '\n;globalThis.COURSE_DATA = COURSE_DATA;', ctx, { filename: 'practical-examples.js' });
const COURSE_DATA = ctx.COURSE_DATA;

let fail = 0;
const check = (cond, msg) => {
  if (cond) console.log('  ok: ' + msg);
  else { console.error('  FAIL: ' + msg); fail++; }
};

// File-backed fetch stub
const fetchStub = (url) => Promise.resolve(JSON.parse(readFileSync(join(ROOT, url), 'utf8')));
const manifest = JSON.parse(readFileSync(join(ROOT, 'lessons/manifest.json'), 'utf8'));
const jsonLessons = manifest.lessons.map(e => JSON.parse(readFileSync(join(ROOT, e.path), 'utf8')));

// 0. Pilot precondition: inline ai_introduction really has no body
const pilotInline = COURSE_DATA.levels.beginner.lessons.ai_introduction;
check((pilotInline.content || '') === '', 'pilot precondition: inline ai_introduction content is empty');

// 1. Overlay fills the pilot from JSON
const res = overlayJsonLessons(COURSE_DATA, jsonLessons);
const after = COURSE_DATA.levels.beginner.lessons.ai_introduction;
check(after.content.length > 1000, `pilot renders from JSON (${after.content.length} chars)`);
const fromFile = JSON.parse(readFileSync(join(ROOT, 'lessons/beginner/ai_introduction.json'), 'utf8'));
check(after.content === fromFile.content, 'pilot content byte-matches the JSON file');

// 2. Every manifest id applied, none silently dropped
check(res.applied.length === manifest.lessons.length,
  `all ${manifest.lessons.length} manifest lessons applied (${res.applied.length})`);

// 3. Unknown ids never leak into core
const r2 = overlayJsonLessons(COURSE_DATA, [{ id: 'quantum_ai_intersection', content: 'X' }, { id: 'nope', content: 'Y' }]);
check(r2.missing.length === 2 && r2.applied.length === 0, 'unknown ids ignored (quantum cannot leak into core)');
let leaked = false;
for (const lvl of Object.values(COURSE_DATA.levels)) {
  if (lvl.lessons && (lvl.lessons.quantum_ai_intersection || lvl.lessons.nope)) leaked = true;
}
check(!leaked, 'core has no quantum_ai_intersection after overlay');
void fetchStub;

console.log('\n----');
if (fail > 0) { console.error(`LOADER TEST FAILED (${fail})`); process.exit(1); }
console.log('LOADER TEST PASSED');
