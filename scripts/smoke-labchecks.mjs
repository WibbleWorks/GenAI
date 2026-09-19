// scripts/smoke-labchecks.mjs
//
// P1 autograded-checks gate: loads the merged COURSE_DATA (same vm-shim as
// validate-lessons.mjs), validates every labCheck structurally, then executes
// each pyodide-assert twice with a real Python interpreter:
//   1. starterCode + assertCode must FAIL (proves the check discriminates)
//   2. reference solution + assertCode must PASS with LABCHECK_PASS
//
// Reference solutions live here (dev-only). They also seed the future
// capstone SOLUTION.md files. Learners never see this file in the course UI,
// but note nothing client-side is truly hidden — the asserts themselves ship
// in lesson data by design (P1 formative checks, capstones are the gate).
//
// Run locally:
//   LABCHECK_PYTHON=/tmp/labcheck-venv/bin/python node scripts/smoke-labchecks.mjs
// CI (P5 codeblocks job) installs "numpy pandas scikit-learn scipy" first.

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PYTHON = process.env.LABCHECK_PYTHON || 'python3';

// --- Load COURSE_DATA (same minimal shim as validate-lessons.mjs) ---
const ctx = {
  console,
  Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp,
  parseInt, parseFloat, isNaN, Infinity, NaN, undefined,
  Set, Map, Promise, Symbol, Proxy, Reflect,
  setTimeout, setInterval, clearInterval,
  Intl,
  requestAnimationFrame: () => {}, cancelAnimationFrame: () => {},
};
ctx.window = {
  animations: {}, quiz: {}, course: {}, aiLab: {},
  aiLabCopy: () => {}, aiLabOpenInColab: () => {},
  mountInteractiveLabs: () => {}, mountLabChecks: () => {}, runLabCheck: () => {},
  runCurrentCode: () => {},
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

// --- Reference solutions (must pass the asserts) ---
const SOLUTIONS = {
  sklearn_stratified_split: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)`,
  cosine_ordering: `import numpy as np

def cosine_sim(a, b):
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))`,
  json_schema_guard: `import json

def extract_json(text):
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("no JSON object found")
    try:
        obj = json.loads(text[start:end + 1])
    except json.JSONDecodeError as e:
        raise ValueError(f"invalid JSON: {e}")
    if not isinstance(obj, dict):
        raise ValueError("top-level JSON must be an object")
    missing = {"answer", "citations"} - set(obj.keys())
    if missing:
        raise ValueError(f"missing keys: {sorted(missing)}")
    return obj`,
  chunk_overlap: `def chunk_text(text, size, overlap):
    assert 0 <= overlap < size, "need 0 <= overlap < size"
    chunks, i = [], 0
    while i < len(text):
        chunks.append(text[i:i + size])
        if i + size >= len(text):
            break
        i += size - overlap
    return chunks`,
  faithfulness_scoring: `def faithfulness(answer_claims, context):
    ctx = set(context.lower().split())
    if not answer_claims:
        return 1.0
    scores = []
    for claim in answer_claims:
        words = claim.lower().split()
        hit = sum(1 for w in words if w in ctx)
        scores.append(hit / len(words))
    return sum(scores) / len(scores)`,
};

function runPython(code) {
  const path = join(tmpdir(), `labcheck-${Date.now()}-${Math.floor(Math.random() * 1e6)}.py`);
  writeFileSync(path, code);
  try {
    const out = execFileSync(PYTHON, [path], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 });
    return { exit: 0, output: out };
  } catch (e) {
    return { exit: e.status == null ? 1 : e.status, output: (e.stdout || '') + (e.stderr || '') + (e.message || '') };
  } finally {
    try { unlinkSync(path); } catch (e) { /* ignore */ }
  }
}

const KINDS = ['pyodide-assert', 'colab-assert', 'mcq-code'];
let pass = 0, fail = 0;
const failures = [];

// Python sanity: scientific deps required for pyodide-assert execution
try {
  execFileSync(PYTHON, ['-c', 'import numpy, pandas, sklearn, scipy'], { stdio: 'ignore', timeout: 60000 });
  console.log(`Python OK: ${PYTHON} has numpy/pandas/sklearn/scipy`);
} catch (e) {
  console.error(`FATAL: ${PYTHON} lacks numpy/pandas/sklearn/scipy. Install them or set LABCHECK_PYTHON.`);
  process.exit(1);
}

for (const lvl of ['beginner', 'intermediate', 'advanced', 'expert', 'research']) {
  const lessons = (COURSE_DATA.levels[lvl] && COURSE_DATA.levels[lvl].lessons) || {};
  for (const [id, lesson] of Object.entries(lessons)) {
    const checks = lesson.labChecks || [];
    if (checks.length > 5) {
      fail++; failures.push(`${id}: ${checks.length} labChecks > max 5`);
      continue;
    }
    for (const c of checks) {
      const label = `${id}/${c.id}`;
      if (!c.id || !/^[a-z][a-z0-9_]*$/.test(c.id)) { fail++; failures.push(`${label}: bad id`); continue; }
      if (!KINDS.includes(c.kind)) { fail++; failures.push(`${label}: bad kind ${c.kind}`); continue; }
      if (!c.prompt || typeof c.prompt !== 'string') { fail++; failures.push(`${label}: missing prompt`); continue; }
      if (!Number.isInteger(c.points) || c.points < 1 || c.points > 5) { fail++; failures.push(`${label}: points must be 1-5`); continue; }
      if (c.kind === 'pyodide-assert') {
        if (!c.starterCode || !c.assertCode) { fail++; failures.push(`${label}: pyodide-assert needs starterCode+assertCode`); continue; }
        if (!c.assertCode.includes('LABCHECK_PASS')) { fail++; failures.push(`${label}: assertCode must print LABCHECK_PASS`); continue; }
        // Discrimination: starter must FAIL
        const s = runPython(c.starterCode + '\n\n' + c.assertCode);
        if (s.exit === 0 && s.output.includes('LABCHECK_PASS')) {
          fail++; failures.push(`${label}: starter PASSES asserts — check does not discriminate`);
          continue;
        }
        // Solution must PASS
        const sol = SOLUTIONS[c.id];
        if (!sol) { fail++; failures.push(`${label}: no reference solution in smoke-labchecks.mjs`); continue; }
        const g = runPython(sol + '\n\n' + c.assertCode);
        if (g.exit !== 0 || !g.output.includes('LABCHECK_PASS')) {
          fail++; failures.push(`${label}: reference solution FAILS:\n${String(g.output).slice(-800)}`);
          continue;
        }
        pass++;
        console.log(`  ok: ${label} (starter fails, solution passes)`);
      } else {
        // colab-assert / mcq-code: structural only in P1 (execution lands in P5)
        pass++;
        console.log(`  ok: ${label} [${c.kind}, structural]`);
      }
    }
  }
}

console.log('\n----');
if (fail > 0) {
  console.error(`LABCHECK SMOKE FAILED (${fail} failing, ${pass} ok)`);
  failures.forEach(f => console.error('  FAIL: ' + f));
  process.exit(1);
}
if (pass === 0) {
  console.error('LABCHECK SMOKE FAILED: no labChecks found — P1 pilot needs >=1');
  process.exit(1);
}
console.log(`LABCHECK SMOKE PASSED (${pass} checks ok)`);
