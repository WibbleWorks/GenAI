# Implementation Plan — Portfolio Tracks, Autograded Labs, Quantum Spin-out, JSON Runtime

**Date:** 2026-09-19
**Status:** Approved for implementation
**Decisions locked:**
- D1 (assessment): 1A + 1B — Pyodide/Colab-asserted code checks where possible, capstones as the real summative gate.
- D2 (scope): 2A + 2B — Quantum leaves core sequence, becomes separate `quantum-ai` course/appendix.
- D3 (architecture): 3A + 3B — Finish JSON runtime loader + monthly execution smoke for core lessons. Named owner required.
- Track decision: all three paths ship — Builder / Researcher / Manager (current "Leader" renamed to Manager for clarity, keep `leader` id for compat).
- Capstone decision: portfolio-grade — starter repo + expected output + submission checklist + reviewer guide, not just rubric + quiz.

This doc is the build spec. It references `CONTENT_MODEL.md`, `lesson.schema.json`, `SUSTAINABILITY_PROCESS.md`, `PROGRESS_ARCHITECTURE.md`.

---

## 0. Ground truth (verified 2026-09-19)

- 21 lessons, 105 quiz Qs, all `type: "multiple-choice"`, 4 options, 60% pass. No code-graded items.
- `lessons/<level>/<id>.json` (21 files) exported but runtime reads inline JS (`course-data.js` 858 lines, `practical-examples.js` ~5,200 lines).
- Pyodide runs sklearn/numpy/pandas/scipy only; TF/Transformers/PEFT/LangChain/Qiskit = simulated preview + Open-in-Colab.
- Placement overlay + path badge exist (`main.js:79-390`) but do NOT reorder lessons; Builder/Researcher/Leader only change recommended start.
- CI (5 jobs): syntax, version-pin lint, schema-validate, smoke, a11y. No execution test of code blocks.
- Capstones 19/20/21 have scaffold + 5x4 rubric (14/20 pass) + 5Q quiz, but no exemplar output, no starter repo, no submission artifact.

---

## 1. Workstream 1 — Autograded labs + capstones as gate (D1A + D1B)

### 1A. Autograded checks (formative, in-lesson)

**Goal:** every applied lesson has ≥1 machine-checkable exercise. MCQ stays formative.

**Schema change (`docs/lesson.schema.json` + `docs/CONTENT_MODEL.md`):**

Add optional `labChecks: LabCheck[]` to lesson (max 5 per lesson for v1):

```json
{
  "id": "rag_chunk_overlap",
  "kind": "pyodide-assert | colab-assert | mcq-code",
  "prompt": "markdown string shown in lab panel",
  "starterCode": "python string",
  "assertCode": "python string with assert statements, no network",
  "points": 1,
  "track": ["builder", "researcher", "manager"]
}
```

- `pyodide-assert`: runs in existing `AILab` (Pyodide). `assertCode` appended after user code, stdout checked for `PASS`.
- `colab-assert`: for TF/Transformers/PEFT/LangChain lessons that can't run in Pyodide. Lesson shows starter + assert cell + "paste Colab share link + output hash" for self-check. CI validates the assert cell imports under pinned versions (see §3B), not full GPU run.
- `mcq-code`: fallback for Manager track — code-reading MCQ (spot-the-bug), still 4-option but tagged `type: "mcq-code"` so analytics can separate recall vs code-reading.

Extend `Question.type` enum: `["multiple-choice", "mcq-code"]`. Keep 4-option convention. `labChecks` is separate from `quiz` so old validators don't break.

**Coverage matrix (v1 minimum):**

| Lesson | Check kind | Example assert |
|---|---|---|
| 6 scikit-learn | pyodide-assert | StratifiedKFold split has no leakage; F1 computed correctly |
| 7 MLOps | pyodide-assert | FastAPI `/ask` schema returns `{answer, citations}`; latency logged |
| 8 TF | colab-assert | EarlyStopping + Dropout present; val gap reported |
| 9 Transformers | colab-assert | Tokenizer round-trip; attention-weight shape check |
| 10 Embeddings | pyodide-assert | Cosine sim ordering; ANN recall check on toy corpus |
| 11 Transfer | colab-assert | Frozen-base vs full-finetune param count assert |
| 12 Prompt Eng | pyodide-assert | JSON-schema validator rejects bad output; injection test string flagged |
| 13 RAG | pyodide-assert (retrieval) + colab-assert (generation) | Chunk overlap assert; MMR diversity assert; citation presence assert |
| 14 Fine-tune PEFT | colab-assert | LoRA rank/alpha config assert; adapter merge path exists |
| 15 LLM Eval | pyodide-assert | Faithfulness metric on golden set; position-rotation applied |
| 16 LangChain | colab-assert | `create_tool_calling_agent` + `max_iterations=5` assert |
| 18 Agents | colab-assert | Trace JSONL has required fields; red-team set ≥10 prompts |

Foundations 1-5: no `pyodide-assert` required; add 1 `mcq-code`/scenario each (e.g., ethics slice-metric triage).

**Renderer changes:**
- `practical-examples.js` + `course-data.js`: add `renderLabChecks(checks)` helper next to `renderInteractiveLab()`. Renders prompt + starter + Run + output. Reuse `AILab.runCode` + `_usesUnsupported` guard.
- `quiz-system.js`: accept `mcq-code` type (same scoring, different tag for analytics).
- `main.js` `saveProgress()`: persist `labChecksPassed: {lessonId: [checkIds]}` in localStorage + Supabase JSONB (extends `PROGRESS_ARCHITECTURE.md` shape, backward-compatible).

**Acceptance:** `tests/smoke.mjs` extended — every `pyodide-assert` starter + solution passes; every `colab-assert` assert cell at least imports under pinned versions in CI (no GPU).

### 1B. Portfolio-grade capstones (summative)

**Goal:** capstones 19/20/21 become hire-manager-readable portfolio artifacts.

**Per capstone, ship 4 new files (in repo, not just lesson HTML):**

```
capstones/<rag-chatbot|finetune-slm|agent-tools>/
  STARTER.md          # setup, pinned env, 30-min quickstart
  starter/            # minimal runnable skeleton (FastAPI app / training script / agent loop)
  SOLUTION.md         # exemplar walkthrough (not full copy-paste answer — inputs, outputs, trade-offs)
  expected/           # golden outputs: golden_qa.json (50-200 items), expected_traces.jsonl sample, latency budget
  SUBMISSION.md       # checklist the learner submits as PR/README section
  REVIEWER.md         # 10-min reviewer script: what to run, what good looks like, fail reasons
```

**Lesson HTML change:** replace "Definition of Done" paragraph with link to `SUBMISSION.md` checklist + rubric stays. Add `capstone: {id, starterPath, goldenSet, latencyBudgetP95, minRedTeam}` field to lesson JSON (optional, validated).

Rubric stays 5x4, 14/20 pass, ≥3 in every row — but each row now maps to a verifiable artifact (e.g., "Reproducibility: `pip freeze` + seed + one-command run reproduces golden metrics within ±2%").

**Gate rule (new, needs product call):** course "Complete" badge requires 3/3 capstone self-assessments submitted (checkbox + artifact links), not just MCQ pass. Implement as `main.js completeCourse()` check: `capstonesSubmitted.length === 3`. Keep backward-compat for existing completions (grandfather flag).

**Acceptance:** a fresh reviewer can clone starter, follow STARTER.md, run golden eval, and score the exemplar with REVIEWER.md in <30 min.

---

## 2. Workstream 2 — Quantum spin-out (D2A + D2B)

**Goal:** remove quantum from core path; keep it as maintained appendix / separate course.

**Steps:**
1. Move lesson 17 `quantum_ai_intersection` out of `expert` level in core numbering. New core: 20 lessons (1-16, 18-21 renumbered 17-20). Keep `id` stable so saved progress migrates (add `number` remap + `id` alias in loader).
2. Create `quantum-course/` sibling (or `tracks/quantum/` if mono-repo preferred — recommend sibling folder to avoid bloating core bundle):
   ```
   quantum-course/
     README.md         # positioning: "theoretical / contested, prerequisites: Lessons 3,5"
     lessons/          # reuses JSON schema; adds QM primer as lesson 1
     CITATIONS.md      # primary sources for every advantage claim (enforces T6.4)
   ```
3. Core lesson 17 slot becomes "Frontier topics map" — 1-page survey pointing to quantum-course + agents + eval, with honest "what's production vs research" framing.
4. Update `course-data.js` / `practical-examples.js` prereq chains, `main.js` Next-Lesson, placement test (drop quantum Q), `README.md` lesson table, `lessons/` JSON re-export.
5. CI: core smoke no longer requires quantum; quantum-course gets its own `validate-lessons` run.

**Acceptance:** core course loads 20 lessons with sequential numbers, no gaps; quantum-course validates independently; no dead links.

---

## 3. Workstream 3 — JSON loader + execution smoke (D3A + D3B)

### 3A. JSON runtime loader

**Goal:** non-devs edit `lessons/<level>/<id>.json`; runtime prefers JSON, falls back to inline JS.

- New `loader.js` (no build step, `fetch()` at boot): tries `lessons/<level>/<id>.json` manifest (`lessons/manifest.json` generated by `extract-lessons.mjs`), falls back to `COURSE_DATA` inline on 404.
- `scripts/extract-lessons.mjs`: also writes `manifest.json` with `{id, level, number, hash}`. CI fails if inline JS and JSON diverge (hash check) — forces single source of truth going forward (JSON wins).
- Progress migration: add `progressVersion: 2` + `idAliases: {quantum_ai_intersection: "quantum-course/q01"}` in `main.js loadProgress()`.
- Update `docs/CONTENT_MODEL.md` §Future plans → §Current: JSON is source of truth.

**Acceptance:** delete inline lesson body for 1 pilot lesson (e.g., `ai_introduction`), course still renders from JSON; CI catches divergence.

### 3B. Execution smoke (monthly + PR)

- New `scripts/smoke-codeblocks.mjs`: extracts every `pyodide-assert` assert cell + every fenced python block tagged `exec:pyodide`, runs under Node with Pyodide-wasm or rooted Python with pinned reqs for `colab-assert` import checks.
- CI: new `codeblocks` job — `pyodide-assert` fully executed; `colab-assert` import-checked (`python -c "import langchain_openai, peft, transformers"` at pinned versions). GPU training never runs in CI.
- `SUSTAINABILITY_PROCESS.md` quarterly checklist updated: run `smoke-codeblocks`, bump "Last verified", write `RELEASE_NOTES.md` entry. Owner field added (default: repo maintainer, must be named in PR).

**Acceptance:** PR with broken assert fails CI; quarterly run updates stamps.

---

## 4. Cross-cutting — Three tracks (Builder / Researcher / Manager)

Current paths are badge-only. Make them real without forking content:

- Add `tracks` metadata per lesson in JSON: `{builder: "required|recommended|optional", researcher: ..., manager: ...}` + per-`labCheck.track`.
- `main.js`: path picker now filters sidebar emphasis (required = full opacity, optional = dimmed + "optional for your track" tag) and reorders "Next Lesson" to skip optionals. Same lessons, different sequencing — no content fork.
- Recommended routes (v1):
  - **Builder:** 1→2→3→6→7→10→12→13→16→18→19→20→21 (code-first, math optional, quantum excluded, ethics required).
  - **Researcher:** 1→2→3→5→4→10→11→9→14→15→18 (+ math-heavy extensions, proofs/loss derivations as stretch `labChecks`).
  - **Manager:** 1→2→4→12→13→15→7→19-lite (eval, cost, latency, risk, incident-response; code checks replaced by `mcq-code` + cost/latency exercises T4.5/T4.6 resurrected as Manager-only labs).
- Placement test: 3 track-specific bonus Qs (builder = debug snippet, researcher = gradient/variance, manager = slice-metric triage). Pass still 60% core + track start suggestion.
- Progress: `learningPath` already persisted; add `trackProgress: {requiredDone, optionalDone}` to header badge.

Resurrect deferred T4.5/T4.6/T4.7/T4.8 as Manager-track labs (cost estimation, latency/caching, incident rollback, A/B eval) — small markdown + calculator exercises, not full lessons.

**Acceptance:** switching track changes Next-Lesson order + sidebar dimming; smoke test covers all 3 routes.

---

## 5. Phasing, effort, sequencing

| Phase | Scope | Files touched | Exit criteria |
|---|---|---|---|
| P0 scaffold | Schema + manifest + `capstones/` skeleton + quantum-course folder | `lesson.schema.json`, `CONTENT_MODEL.md`, `extract-lessons.mjs`, `capstones/*/STARTER.md` stub | CI still green; skeleton merged |
| P1 labs core | `labChecks` for lessons 6,10,12,13,15 + renderer + progress persist | `practical-examples.js`, `course-data.js`, `quiz-system.js`, `main.js`, `auth.js` shape | Smoke runs pyodide asserts green |
| P2 capstones portfolio | Starter + golden + SOLUTION + SUBMISSION + REVIEWER for 19/20/21; gate rule | `capstones/*/`, lesson HTML, `main.js completeCourse()` | External reviewer <30 min per capstone |
| P3 tracks | `tracks` metadata, Next-Lesson reorder, placement bonus Qs, Manager labs T4.5-4.8 | `main.js`, lesson JSON, `lessons/*` | All 3 routes smoke-tested |
| P4 quantum spin-out | Renumber core 20, move quantum, frontier-map lesson, fix prereqs/links | `practical-examples.js`, `course-data.js`, `README.md`, `quantum-course/` | Core 20 sequential; quantum validates solo |
| P5 loader + exec CI | `loader.js`, manifest hash gate, `smoke-codeblocks.mjs`, `codeblocks` CI job, SUSTAINABILITY owner | `loader.js`, `index.html`, `ci.yml`, `SUSTAINABILITY_PROCESS.md` | Pilot JSON-only lesson renders; broken assert fails PR |

Rough effort (solo senior, familiar with repo): P0 0.5d, P1 3-5d, P2 4-6d (exemplars dominate), P3 2-3d, P4 1-2d, P5 2-3d. Total ~13-20d. Do P0→P1→P2 first; P4 can parallelize; P5 last except manifest stub in P0.

Order rationale: labs + capstones deliver learner value even if loader slips; loader without labs is invisible.

---

## 6. Risks + mitigations

- **Scope creep (3 tracks × 20 lessons):** mitigate — tracks are metadata + ordering, never content forks. Hard rule: no track-specific lesson bodies in v1.
- **Exemplar maintenance rot:** mitigate — golden sets are tiny (50-200 items), pinned, import-checked in CI; full GPU runs are manual quarterly, owned.
- **Pyodide fragility:** mitigate — `pyodide-assert` only where sklearn/numpy/pandas suffice; everything else is `colab-assert` by policy.
- **Progress migration breakage:** mitigate — `id` stability + alias map + `progressVersion` gate with fallback to v1.
- **Quantum audience loss:** mitigate — frontier-map lesson + cross-link; quantum-course linked from core, not deleted.

---

## 7. Definition of Done (whole plan)

- [ ] Schema supports `labChecks`, `mcq-code`, `tracks`, `capstone` metadata; all 20 core + quantum lessons validate.
- [ ] Every applied core lesson has ≥1 graded check; smoke executes pyodide asserts green.
- [ ] 3 capstones have starter + golden + exemplar + submission + reviewer docs; gate rule enforced.
- [ ] 3 tracks change sequencing/emphasis; placement suggests correct start; smoke covers 3 routes.
- [ ] Quantum lives in `quantum-course/` with citations; core is 20 sequential lessons.
- [ ] JSON is source of truth with manifest hash gate; `codeblocks` CI job live; quarterly owner named.
- [ ] Docs updated: `README.md` (20 lessons + tracks + portfolio rule), `CONTENT_MODEL.md`, `SUSTAINABILITY_PROCESS.md`, `REMEDIATION_LOG.md` (Phase 15 entry).

---

## 8. Immediate next actions (for operator)

1. Create `capstones/` + `quantum-course/` folders, approve track ids (`builder|researcher|leader` — keep `leader` id, display "Manager").
2. Name quarterly owner for codeblock smoke + stamp bumps.
3. Approve gate rule: capstone submission required for "Complete" badge (grandfather existing).
4. Start P0 scaffold PR (schema + manifest + stubs) — small, reviewable, unblocks P1/P2.
