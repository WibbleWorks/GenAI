# Release Notes

## 2026-09-19 — Portfolio tracks release (PLAN P0–P5)

Owner: repo maintainer.

- **Autograded labs (P1):** 9 in-browser checks (5 core + 4 Manager-track) with
  starter-FAILS/solution-PASSES execution proof (`scripts/smoke-labchecks.mjs`).
- **Portfolio capstones (P2):** runnable starters + golden sets for all three
  (RAG 20/20, red-team 12/12, base-vs-tuned eval) with STARTER/SOLUTION/
  SUBMISSION/REVIEWER docs; Portfolio-Complete gate in the completion modal
  (grandfathered for pre-P2 saves).
- **Tracks (P3):** Builder/Researcher/Manager metadata on all 21 lessons;
  Next skips path-optionals; sidebar tags; badge shows required progress;
  track-signal placement bonus; cost/latency/incident/A-B Manager labs.
- **Quantum spin-out (P4):** core Lesson 17 is now the Frontier Map; quantum
  lives in `quantum-course/` with per-claim citations. Swap, not renumber
  (ids stable; progress carried forward).
- **JSON source of truth (P5):** `loader.js` overlay (JSON wins),
  `ai_introduction` pilot with no inline body, manifest hash gate, pruning
  check, codeblocks CI. CI is 7 jobs.

Upgrade notes: progress saves gain `version: 2`; old saves migrate
automatically (quantum→frontier alias, capstone grandfather flag).
