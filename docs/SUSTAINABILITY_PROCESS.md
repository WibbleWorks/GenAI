# Sustainability Process

How we keep this course from drifting out of date. Points back to `CONTENT_ROADMAP.md` Tier 6.

**Owner (P5):** repo maintainer (see `docs/RELEASE_NOTES.md` per-release owner line).
The owner runs the quarterly audit and owns the codeblock-manifest pipeline.
Unowned process = no process.

## Quarterly content audit (Roadmap T6.1)

Every quarter, take a half-day pass:

- [ ] Re-run every code example against the **pinned** versions in the lesson. Run `scripts/lint-version-pinning.js` first; resolve every unpinned `pip install`.
- [ ] Bump the **"Last verified"** stamp on each touched code block to the current month.
- [ ] Spot-check 3 lessons (one per tier) for behavior changes in upstream libraries - has `langchain_openai`'s API changed? has Qiskit released a new major? (`pip index versions <pkg>` or the project's changelog.)
- [ ] Scan lessons making claims with citations (especially quantum-ML, Roadmap T4/T6.4) for retracted or superseded papers; update or hedge.
- [ ] Update the `meta.version` field in `course-data.js` (semver bump).
- [ ] Write a 5-bullet "What's changed since last quarter" entry in `docs/RELEASE_NOTES.md` (create it on first audit).

Triggered by:
- Calendar (every quarter)
- Major upstream release (LangChain minor, Qiskit major, new OpenAI embedding model)
- A burst of "out-of-date" issues (`docs/CONTENT_ROADMAP.md` T6.3)

## CI (Roadmap T6.2 + T6.5 + T6.6 + T6.7, plus P5)

`.github/workflows/ci.yml` runs **7 jobs** on every push/PR to `main`:

1. **Syntax** — `node --check` on all 6 JS source files (incl. `loader.js`).
2. **Version-pin lint** — `scripts/lint-version-pinning.js` flags every `pip install foo` without a version specifier (currently 0 unpinned).
3. **Schema validation** — `scripts/validate-lessons.mjs` validates all 21 core lessons + standalone quantum-course lessons against `docs/lesson.schema.json`.
4. **Manifest check** — `scripts/extract-lessons.mjs --check` (hash drift + stale files) + `scripts/test-loader.mjs` (JSON overlay harness, incl. the ai_introduction pilot).
5. **Codeblocks** — installs the pinned scientific floor, runs `scripts/smoke-labchecks.mjs` (starter FAILS / solution PASSES under real Python) + `scripts/smoke-codeblocks.mjs` (compiles + Pyodide-import safety).
6. **Smoke test** — `tests/smoke.mjs` boots the course headlessly (Playwright + chromium), awaits the JSON overlay, renders every lesson (asserting the pilot lesson's content is non-empty), runs every quiz end-to-end, starts every animation, and checks for console errors. Falls back to Node-only structure checks when Playwright isn't installed.
7. **Accessibility audit** — `tests/a11y.mjs` runs axe-core (`@axe-core/playwright`) against 6 page states (initial load, 3 representative lessons, quiz in progress, mobile viewport). Currently passing with 0 serious/moderate/critical violations against WCAG 2.0/2.1 AA.

A PR that fails any of these doesn't ship.

## Issue template for out-of-date code (Roadmap T6.3)

`.github/ISSUE_TEMPLATE/stale-code.md` - one tap for users to report a code sample that no longer runs against the current upstream version. Triage: if real, copy the example into the smoke test as a regression case, fix it, bump the "Last verified" stamp.

## Primary-source links (Roadmap T6.4)

Every claim that depends on an upstream paper (especially quantum advantage claims, llama-3 fine-tuning recipes, OpenAI release notes) should include a link to the primary source. When the source changes (retraction, new paper, docs reorg), audit the lesson's claim and update both the citation and the surrounding text.

## Accessibility audit (Roadmap T6.6)

The course passes the basics (`CRITICAL_REVIEW.md` A1-A6 fixes shipped in Phase 1):

- Keyboard activation on quiz options and nav items (Enter/Space)
- ARIA roles + `aria-label` on emoji-only buttons
- ARIA `valuenow/min/max` on the progress bar
- Skip-to-content link
- Esc + outside-click modal dismissal
- Adequate text contrast

For Phase 9 we want to run **axe-core** in CI alongside the smoke test:

```bash
npx -y @axe-core/playwright --with-deps chromium
node tests/a11y.mjs   # (to be written in Phase 9)
```

A stub for the future workflow step is in `.github/workflows/ci.yml`. Until the test file exists, axe-core runs locally via `npx @axe-core/cli http://localhost:8765/`.

## Content model & JSON schema (Roadmap T6.7)

See `docs/CONTENT_MODEL.md` and `docs/lesson.schema.json`. The schema documents the lesson shape so future tooling (CMS, linter, JSON-backed lessons) can validate edits before they ship. It is **enforced in CI** via `scripts/validate-lessons.mjs` (the `schema-validate` job). All 21 lessons currently pass.

To extract lessons to standalone JSON files for a future JSON-backed loader:
```bash
node scripts/extract-lessons.mjs   # writes lessons/<level>/<id>.json
```

## Progress persistence (Roadmap Phase 14)

See `docs/PROGRESS_ARCHITECTURE.md` for the social-login + server-side-storage design (Supabase Auth + PostgreSQL). The implementation lives in `auth.js` and `main.js`. Without `auth-config.json`, the course falls back to `localStorage` + export/import.