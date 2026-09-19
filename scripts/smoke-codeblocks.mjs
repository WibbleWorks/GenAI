// scripts/smoke-codeblocks.mjs
//
// P5 exec gate (no GPU, no network): static execution-safety over every
// labCheck's Python. For each check:
//   - starterCode + assertCode must COMPILE (py_compile via system python3)
//   - pyodide-assert code may only import the in-browser set
//     (stdlib + numpy/pandas/scikit-learn/scipy/micropip) — anything else
//     would silently fall back to preview and the check could never pass
//   - colab-assert starters are listed with their third-party imports so the
//     quarterly audit can spot drift against pinned pip lines
// Full behavioral execution of pyodide asserts lives in smoke-labchecks.mjs.
//
// Run: node scripts/smoke-codeblocks.mjs

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PYTHON = process.env.LABCHECK_PYTHON || 'python3';
const PYODIDE_OK = new Set(['numpy', 'pandas', 'sklearn', 'scipy', 'micropip',
  'math', 'json', 're', 'ast', 'operator', 'collections', 'itertools',
  'functools', 'random', 'statistics', 'datetime', 'time', 'hashlib']);

// --- Load COURSE_DATA via vm shim ---
const ctx = {
  console: { log: () => {}, warn: () => {}, error: () => {} },
  Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp,
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
vm.runInContext(readFileSync(join(ROOT, 'course-data.js'), 'utf8') + '\n;globalThis.COURSE_DATA = COURSE_DATA;', ctx);
ctx.window.COURSE_DATA = ctx.COURSE_DATA;
vm.runInContext(readFileSync(join(ROOT, 'practical-examples.js'), 'utf8') + '\n;globalThis.COURSE_DATA = COURSE_DATA;', ctx);
const COURSE_DATA = ctx.COURSE_DATA;

function pyCompile(code) {
  const p = join(tmpdir(), `cb-${Date.now()}-${Math.floor(Math.random() * 1e6)}.py`);
  writeFileSync(p, code);
  try {
    execFileSync(PYTHON, ['-m', 'py_compile', p], { stdio: 'pipe', timeout: 60000 });
    return null;
  } catch (e) {
    return String((e.stderr || e.stdout || e.message || e)).slice(-500);
  } finally {
    try { unlinkSync(p); } catch (e) { /* ignore */ }
  }
}

function topImports(code) {
  const out = new Set();
  for (const line of code.split('\n')) {
    let m = line.match(/^\s*import\s+([a-zA-Z0-9_\.]+)/) || line.match(/^\s*from\s+([a-zA-Z0-9_\.]+)\s+import/);
    if (m) out.add(m[1].split('.')[0]);
  }
  return [...out];
}

let pass = 0, fail = 0;
const failures = [];
for (const lvl of ['beginner', 'intermediate', 'advanced', 'expert', 'research']) {
  const lessons = (COURSE_DATA.levels[lvl] && COURSE_DATA.levels[lvl].lessons) || {};
  for (const [id, lesson] of Object.entries(lessons)) {
    for (const c of (lesson.labChecks || [])) {
      const label = `${id}/${c.id}`;
      for (const part of ['starterCode', 'assertCode']) {
        if (!c[part]) continue;
        const err = pyCompile(c[part]);
        if (err) { fail++; failures.push(`${label}.${part}: does not compile:\n${err}`); }
      }
      if (c.kind === 'pyodide-assert') {
        const imps = topImports((c.starterCode || '') + '\n' + (c.assertCode || ''));
        const bad = imps.filter(i => !PYODIDE_OK.has(i));
        if (bad.length > 0) {
          fail++; failures.push(`${label}: imports ${bad} unrunnable in Pyodide — check would preview-fallback forever`);
        } else { pass++; console.log(`  ok: ${label} (compiles, imports [${imps}] pyodide-safe)`); }
      } else {
        const imps = topImports((c.starterCode || '') + '\n' + (c.assertCode || ''));
        pass++; console.log(`  ok: ${label} [${c.kind}, third-party imports: ${imps.filter(i => !['math','json','re','ast','operator','collections'].includes(i))}]`);
      }
    }
  }
}

console.log('\n----');
if (fail > 0) {
  console.error(`CODEBLOCK SMOKE FAILED (${fail} failing, ${pass} ok)`);
  failures.forEach(f => console.error('  FAIL: ' + f));
  process.exit(1);
}
console.log(`CODEBLOCK SMOKE PASSED (${pass} checks ok)`);
