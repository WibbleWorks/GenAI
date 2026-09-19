// scripts/extract-lessons.mjs
//
// Roadmap T6.7 Engineering refactor proof-of-concept: dumps the merged
// COURSE_DATA into individual JSON files under lessons/<level>/<id>.json
// so the runtime course loader can eventually read from JSON instead of
// inline-JS template strings. This script demonstrates the extraction
// path and is idempotent (overwrites if files exist).
//
// Run locally:
//   node scripts/extract-lessons.mjs [--out=lessons]

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// DOM shim + vm context (same pattern as scripts/validate-lessons.mjs)
import vm from 'node:vm';
const ctx = {
    console, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp,
    parseInt, parseFloat, isNaN, Infinity, NaN, undefined,
    Set, Map, Promise, Symbol, Proxy, Reflect,
    setTimeout: () => {}, setInterval: () => {}, clearInterval: () => {},
    Intl,
    requestAnimationFrame: () => {}, cancelAnimationFrame: () => {},
    window: {
        animations: { startAnimation: () => {}, stopAnimation: () => {}, drawFrame: () => {} },
        quiz: { cancelQuiz: () => {} },
        course: { completedLessons: new Set(), markLessonComplete: () => {}, adaptiveLearning: () => {},
                  logActivity: () => {}, findLesson: () => null, showLesson: () => {},
                  startAnimation: () => {}, startQuiz: () => {},
                  buildNavigation: () => {}, updateProgress: () => {}, updateNavigation: () => {},
                  currentLessonId: null, currentLevel: 'beginner',
                  completedLessonsEl: null, avgScoreEl: null, currentScoreEl: null,
                  masteredTopicsEl: null, confidenceLevelEl: null,
                  progressFill: { setAttribute: () => {}, style: {} },
                  progressText: null, courseNav: null, confidenceLevels: {}, scores: {} },
        aiLab: { runCurrentCode: () => {}, createInteractiveLab: () => '',
                 runCode: async () => ({ success: true, output: '' }),
                 colabUrlFor: () => '' },
        aiLabCopy: () => {}, aiLabOpenInColab: () => {},
        mountInteractiveLabs: () => {}, runCurrentCode: () => {},
    },
    document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}, body: null },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    CanvasRenderingContext2D: class {}, Image: class {},
    COURSE_DATA: undefined,
};
try { ctx.navigator = { clipboard: { writeText: async () => {} } }; } catch (e) {}
try { ctx.location = { reload: () => {} }; } catch (e) {}
vm.createContext(ctx);

const cd = readFileSync(join(ROOT, 'course-data.js'), 'utf8');
const pe = readFileSync(join(ROOT, 'practical-examples.js'), 'utf8');
vm.runInContext(cd + '\n;globalThis.COURSE_DATA = COURSE_DATA;', ctx, { filename: 'course-data.js' });
ctx.window.COURSE_DATA = ctx.COURSE_DATA;
vm.runInContext(pe + '\n;globalThis.COURSE_DATA = COURSE_DATA;', ctx, { filename: 'practical-examples.js' });
const COURSE_DATA = ctx.COURSE_DATA;

const outDir = resolve(ROOT, 'lessons');
const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'research'];

let count = 0;
const manifest = [];
for (const lvl of levelOrder) {
    const lessons = COURSE_DATA.levels[lvl]?.lessons || {};
    const dir = join(outDir, lvl);
    mkdirSync(dir, { recursive: true });
    for (const [id, lesson] of Object.entries(lessons)) {
        // Write the lesson as clean JSON (no JSDOM/window round-trip)
        // P0: carry optional PLAN fields when present so JSON stays source-of-truth-ready.
        const out = {
            id: lesson.id, title: lesson.title, subtitle: lesson.subtitle,
            level: lesson.level, number: lesson.number,
            estimatedTime: lesson.estimatedTime, difficulty: lesson.difficulty,
            prerequisites: lesson.prerequisites,
            // content is HTML — keep it as-is; this is the proof-of-concept
            content: lesson.content,
            concepts: lesson.concepts,
            quiz: lesson.quiz,
            animation: lesson.animation,
        };
        if (lesson.labChecks !== undefined) out.labChecks = lesson.labChecks;
        if (lesson.tracks !== undefined) out.tracks = lesson.tracks;
        if (lesson.capstone !== undefined) out.capstone = lesson.capstone;
        const json = JSON.stringify(out, null, 2);
        writeFileSync(join(dir, `${id}.json`), json);
        count++;
        console.log(`  wrote: lessons/${lvl}/${id}.json`);
        manifest.push({
            id: lesson.id, level: lesson.level, number: lesson.number,
            path: `lessons/${lvl}/${id}.json`,
            hash: createHash('sha256').update(json).digest('hex').slice(0, 16),
        });
    }
}
manifest.sort((a, b) => a.number - b.number);
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({ generated: new Date().toISOString(), count, lessons: manifest }, null, 2));
console.log(`  wrote: lessons/manifest.json (${count} entries)`);
console.log(`\nExtracted ${count} lessons to ${outDir}.`);
console.log('JSON is source-of-truth-ready; runtime loader (P5 loader.js) will prefer manifest entries.');