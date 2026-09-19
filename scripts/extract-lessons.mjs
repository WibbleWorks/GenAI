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

// P5 pilot: these lessons are JSON-only — inline body deleted, loader fills it.
// The extractor must NEVER overwrite their JSON from inline (it would blank it).
const PILOT_JSON_ONLY = new Set(['ai_introduction']);

import { readdirSync, existsSync, readFileSync as readFs, unlinkSync } from 'node:fs';

function buildOut(lvl, lesson) {
    // Write the lesson as clean JSON (no JSDOM/window round-trip)
    const out = {
        id: lesson.id, title: lesson.title, subtitle: lesson.subtitle,
        level: lesson.level, number: lesson.number,
        estimatedTime: lesson.estimatedTime, difficulty: lesson.difficulty,
        prerequisites: lesson.prerequisites,
        // content is HTML — JSON wins for pilot lessons (inline deleted)
        content: lesson.content,
        concepts: lesson.concepts,
        quiz: lesson.quiz,
        animation: lesson.animation,
    };
    if (lesson.labChecks !== undefined) out.labChecks = lesson.labChecks;
    if (lesson.tracks !== undefined) out.tracks = lesson.tracks;
    if (lesson.capstone !== undefined) out.capstone = lesson.capstone;
    return out;
}

const CHECK = process.argv.includes('--check');
let count = 0;
// NOTE: no timestamp field — the manifest must be byte-deterministic so
// re-running the extractor on unchanged content yields zero diff.
const manifest = { count: 0, lessons: [] };
const seenPaths = new Set();
for (const lvl of levelOrder) {
    const lessons = COURSE_DATA.levels[lvl]?.lessons || {};
    const dir = join(outDir, lvl);
    if (!CHECK) mkdirSync(dir, { recursive: true });
    for (const [id, lesson] of Object.entries(lessons)) {
        const rel = `lessons/${lvl}/${id}.json`;
        seenPaths.add(rel);
        const abs = join(ROOT, rel);
        let json;
        if (PILOT_JSON_ONLY.has(id) && existsSync(abs)) {
            // Pilot: keep the JSON file as-is; verify inline no longer carries a body.
            if ((lesson.content || '').length > 0) {
                console.error(`PILOT VIOLATION: ${id} has inline content — delete it, JSON is the source.`);
                process.exitCode = 1;
            }
            json = readFs(abs, 'utf8');
            if (!CHECK) console.log(`  kept (pilot JSON-only): ${rel}`);
        } else {
            json = JSON.stringify(buildOut(lvl, lesson), null, 2);
            if (!CHECK) {
                writeFileSync(abs, json);
                console.log(`  wrote: ${rel}`);
            }
        }
        count++;
        manifest.lessons.push({
            id: lesson.id, level: lesson.level, number: lesson.number,
            path: rel,
            hash: createHash('sha256').update(json).digest('hex').slice(0, 16),
        });
    }
}
manifest.lessons.sort((a, b) => a.number - b.number);
manifest.count = count;

if (CHECK) {
    // Fail on any divergence: manifest mismatch OR stale JSON files (P4 lesson).
    let bad = 0;
    let onDisk = {};
    try { onDisk = JSON.parse(readFs(join(outDir, 'manifest.json'), 'utf8')); } catch (e) {
        console.error('  FAIL: lessons/manifest.json missing/unreadable — run extract first.');
        process.exit(1);
    }
    const want = new Map(manifest.lessons.map(l => [l.path, l.hash]));
    const got = new Map((onDisk.lessons || []).map(l => [l.path, l.hash]));
    for (const [p, h] of want) {
        if (got.get(p) !== h) { console.error(`  FAIL: manifest mismatch for ${p} — re-run extract-lessons.mjs`); bad++; }
    }
    for (const lvl of levelOrder) {
        const dir = join(outDir, lvl);
        if (!existsSync(dir)) continue;
        for (const f of readdirSync(dir).filter(f => f.endsWith('.json'))) {
            if (!seenPaths.has(`lessons/${lvl}/${f}`)) {
                console.error(`  FAIL: stale file lessons/${lvl}/${f} not in manifest — prune it`);
                bad++;
            }
        }
    }
    if (bad > 0) process.exit(1);
    console.log(`MANIFEST CHECK PASSED (${count} entries, no stale files)`);
} else {
    writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log(`  wrote: lessons/manifest.json (${count} entries)`);
    console.log(`\nExtracted ${count} lessons to ${outDir}.`);
    console.log('JSON is the source of truth; runtime loader (loader.js) prefers manifest entries.');
}