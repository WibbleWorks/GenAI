# Content Model

This document defines the shape of a *lesson* in the Generative AI & Machine Learning Course. It maps directly to entries under `COURSE_DATA.levels.<level>.lessons.<id>` in `course-data.js` and `practical-examples.js`, and is formalized as JSON Schema in **`docs/lesson.schema.json`**.

## Why a schema?

Today, course content lives in JavaScript source files because the renderer reads `COURSE_DATA` directly. That's fast but has costs:

- **Non-developers can't edit** content safely - one missing comma breaks the whole course's load.
- **No validation** before changes ship - broken lessons show as a blank course area (`CRITICAL_REVIEW.md` P14).
- **No version migration** path - we can't evolve saved progress when the lesson shape changes.

The schema documents the contract and lets future tooling validate edits before they ship - whether edits come from a JS file, a JSON file, or a CMS. As of phase-8 it's documentation; later phases will enforce it with a linter.

## The lesson shape

A lesson is an object with these required fields:

| Field | Type | Notes |
|-------|------|-------|
| `id` | string (snake_case) | Unique across the course; e.g. `rag_vector_databases`. |
| `title` | string | Short display title in the sidebar. |
| `subtitle` | string | Tagline shown beneath the title. |
| `level` | enum | `beginner \| intermediate \| advanced \| expert \| research`. Must match the key the lesson is filed under. |
| `number` | integer | Sequential 1..N across the whole course, no gaps (Roadmap C12). |
| `estimatedTime` | integer (minutes) | Be honest - see Roadmap T5.5. |
| `difficulty` | integer 1-5 | 1 = gentle intro, 5 = research-level. Display only. |
| `prerequisites` | string[] | Lesson IDs the user must have completed before this unlocks. Empty = always open. |
| `unlocked` | boolean (optional) | False by default (gated by prereqs). True = always unlocks. |
| `content` | string (HTML) | Body rendered inside `.lesson-container`. Use `<div class="lesson-section">` blocks. |
| `concepts` | string[] | Tags the lesson covers. Adaptive-learning reinforcement looks for these. |
| `quiz` | object | See below. |
| `animation` | object | See below. |

## Shape of `quiz`

```
{
  id: <snake_case quiz id>,
  title: string,
  passingScore: integer (0-100),
  timeLimit: integer (seconds),
  questions: [
    {
      id: "q1",   // "q<n>", within-quiz
      type: "multiple-choice",
      question: string,
      options: [ { text, isCorrect }... ], // EXACTLY 4 (course convention)
      explanation: string,                  // shown in Review mode (T5.8)
      difficulty: integer (1-3),
      concept: string                      // a tag from lesson.concepts
    }
    ...
  ]
}
```

### Quiz rules (enforced by `lesson.schema.json` and by CI)

- **Minimum 5 questions** per quiz (Roadmap T5.1). 5 yields achievable scores of 0/20/40/60/80/100, so `passingScore` should be 60 or 80 - settings like 75, 85, or 90 are mathematically unreachable and were a known bug (Review C13).
- Question display order and option order are **shuffled at runtime** (Roadmap T5.7) by `quiz-system.js`. Authors don't need to do anything - the original `isCorrect` flags are the source of truth and are mapped back to original option indices at scoring time.
- A **Review mode** (Roadmap T5.8) renders every question with the user's pick, the correct answer marked, and each `explanation`. Make sure every question's explanation actually explains the *correct* answer.

## Shape of `animation`

```
{
  type: one of (see below),
  title: string,
  description: string,
  controls: string[]   // informational; JS source is the source of truth
}
```

### Implemented animation types (as of Phase 8)

These are matched in `ai-animations.js` `drawFrame()`. Teaching a new type requires implementing a `drawXxx` method.

- `ai-timeline`
- `ml-workflow`
- `nn-visualizer`
- `classification-boundary`
- `clustering-visualizer`
- `nn-trainer`
- `transformer-visualizer`
- `llm-inference`
- `agent-simulator`

If you reference an animation `type` outside this list, the renderer falls back to a "coming soon" panel rather than throwing (fixing Review P1).

## How to add a new lesson

1. **Decide its `number` and `level`**. Renumber subsequent lessons up by one.
2. **Write the lesson object** in `course-data.js` (foundations) or `practical-examples.js` (everything else), match the schema above, and use the helpers `createCodeBlock(code, language, caption)`, `renderInteractiveLab()`, `renderCloudGuide(key)`, and `renderQuantumCloudGuide(key)`.
3. **Pin every `pip install`** with a version and add a `# Last verified: YYYY-MM` comment. The CI linter at `scripts/lint-version-pinning.js` will fail unpinned installs.
4. **Write at least 5 quiz questions** with `passingScore: 60`. Each question needs a concept tag that appears in `lesson.concepts`.
5. **Wire prereqs** so the lesson unlocks at the right point.
6. **Verify locally**:
   - `node --check course-data.js` (or `practical-examples.js`)
   - `node tests/smoke.mjs` (run a Python http server first)
7. **Open a PR**; CI runs the smoke test + version-pin linter on every change.

## Optional extensions (P0 scaffold, PLAN P1/P3/P4)

These are optional today so existing 21 lessons still validate. P1-P5 fill them in:

- `labChecks[]` (max 5): `{id, kind: pyodide-assert|colab-assert|mcq-code, prompt, starterCode?, assertCode?, points 1-5, track?: [builder|researcher|leader]}`. Pyodide kinds run in `AILab`; colab kinds are import-checked in CI.
- `Question.type`: `multiple-choice` (recall) or `mcq-code` (code-reading, same scoring, separate analytics).
- `tracks`: `{builder, researcher, leader}` each `required|recommended|optional`. Display name for `leader` is Manager; id stays `leader` for compat.
- `capstone`: `{id, starterPath, goldenSet?, latencyBudgetP95?, minRedTeam?}` pointing into `capstones/<slug>/`.
- `lessons/manifest.json` (generated by `scripts/extract-lessons.mjs`): `{id, level, number, path, hash}` sorted by number. P5 `loader.js` prefers manifest entries; hash gate fails CI on inline/JSON divergence.

## Future plans (Roadmap T6.7)

- JSON is source-of-truth-ready (manifest + extractor in place); runtime loader (`loader.js`, P5) still pending.
- Build a small admin UI that validates against this schema and writes a JSON file. Overlay bias-aware declarative authoring (Roadmap T6.7).