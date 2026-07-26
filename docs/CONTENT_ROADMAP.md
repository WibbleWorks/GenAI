# Content Improvement & Extension Roadmap

**Date:** 2025-07-25 (created) / 2025-07-26 (completed)
**Status:** **ALL TIERS IMPLEMENTED.** This roadmap was the plan of record for content work following the critical review (`CRITICAL_REVIEW.md`) and remediation (`REMEDIATION_LOG.md`). Every item in Tiers 1-6 has been shipped across Phases 8-14.
**Scope:** What was done to improve and extend the training content after the critical bugs were fixed.

This roadmap is organized into six tiers, ordered by impact. All tiers are now complete. See `REMEDIATION_LOG.md` Phases 8-14 for the per-item implementation and verification details.

Each item references the review finding that motivated it (C = content, P = player/app, A = accessibility). A checkmark [x] marks completion.

---

## Tier 1 — Fill the critical content gaps

These are the table-stakes topics a modern AI/ML course is expected to cover. Each is currently absent and was flagged in the review's "Content gaps" section.

| # | Lesson | Why it matters | Suggested level | Motivated by |
|---|--------|----------------|-----------------|--------------|
| ~~T1.1~~ ✅ | **Prompt engineering** | The #1 practical LLM skill; absent today. Should cover zero-shot vs few-shot, chain-of-thought, structured output (JSON mode), system vs user roles, prompt templates, guardrails. | LLM Systems (Expert) | Content gap |
| ~~T1.2~~ ✅ | **RAG & vector databases** | Dominant production LLM pattern; absent. Should cover embeddings, chunking, retrieval, reranking, citation, evaluation. Demo with a small in-browser corpus. | LLM Systems (Expert) | Content gap |
| ~~T1.3~~ ✅ | **Fine-tuning techniques** (LoRA / QLoRA / PEFT) | How teams actually customize models today; only mentioned as a one-line "practical tip". Include a worked example with PEFT on a small task. | LLM Systems (Expert) | Content gap |
| ~~T1.4~~ ✅ | **LLM evaluation** (benchmarks, hallucination measurement, human eval) | The Responsible AI lesson flags this as missing. Critical for shipping LLMs responsibly. | Foundational tracking | C (Ethics lesson checklist) |
| ~~T1.5~~ ✅ | **MLOps basics** (deployment, monitoring, drift, model versioning) | Bridge from notebook to production. Currently zero coverage. | Applied ML (Intermediate) | Content gap |
| ~~T1.6~~ ✅ | **Embeddings & vector spaces** | Foundational to RAG, semantic search, recsys. Only mentioned in passing. | Deep Learning (Advanced) | Content gap |
| ~~T1.7~~ ✅ | **Math refresher** (linear algebra, calculus, probability - interactive) | Quantum and DL lessons currently leap in with no foundation. Make this an optional, skip-if-you-know-it module. | Foundations (Beginner, optional) | Content gap |
| ~~T1.8~~ ✅ | **Transfer learning as a concept** | Currently implicit in "fine-tuning"; should be its own explanation with feature extraction vs fine-tuning vs adaptation. | Deep Learning (Advanced) | Content gap |

**Outcome target:** Course grows from 10 to ~15-18 lessons; close the worst gaps.

---

## Tier 2 — Extend depth in existing lessons

These are topics that are currently mentioned but under-explained. Each strengthens an existing lesson without adding a new one.

| # | Topic | Extend which lesson | What to add |
|---|-------|---------------------|------------|
| ~~T2.1~~ ✅ | **Optimizers** | NN intro + TensorFlow | SGD -> Momentum -> Adam -> AdamW. Add a visualization (loss vs epoch, adjustable LR/momentum). |
| ~~T2.2~~ ✅ | **Regularization** | NN intro + TensorFlow | Dropout, L1/L2, batch norm, early stopping. Add a "spot the overfit" exercise. |
| ~~T2.3~~ ✅ | **Better evaluation** | scikit-learn | Confusion matrix is just a heatmap today. Add ROC/PR curves, precision-recall tradeoff, F1, balanced accuracy, per-slice metrics. |
| ~~T2.4~~ ✅ | **Cross-validation** | ML intro + scikit-learn | k-fold, stratified, leave-one-out. The workflow mentions validation only in passing. |
| ~~T2.5~~ ✅ | **Optimizer & loss playground** | NN intro | Interactive: pick loss (BCE/CCE/MSE), pick optimizer, watch the loss curve. |
| ~~T2.6~~ ✅ | **Real attention heatmap** | Transformers | Current visualizer shows layer/head blocks only. Add a token-to-token attention view using precomputed weights or a tiny in-browser model. |
| ~~T2.7~~ ✅ | **Tokenizer playground** | Transformers | Type text, see BPE / WordPiece / SentencePiece outputs side by side. |
| ~~T2.8~~ ✅ | **Quantum-mechanics basics** | Quantum-AI lesson | Currently jumps straight into variational circuits. Add a short "what is a qubit / superposition / entanglement" section before the code. |

---

## Tier 3 — New interactive learning tools

The current visualizations are mostly schematic. The next step is hands-on tools that produce real outputs.

| # | Tool | Replaces / extends | Effort |
|---|------|--------------------|--------|
| ~~T3.1~~ ✅ | **Pyodide in-browser Python** | The "simulated preview" lab | Medium - the lab framework already supports run/edit; the missing piece is the WASM runtime |
| ~~T3.2~~ ✅ | **Gradient descent playground** | (new) | Low - one canvas, a few sliders |
| ~~T3.3~~ ✅ | **"Build a transformer" step-through** | (extends transformer visualizer) | Medium - embed -> positional -> attention -> FFN -> stack |
| ~~T3.4~~ ✅ | **Bias dashboard** | (new) | Medium - feed a model a dataset, per-slice metrics light up red |
| ~~T3.5~~ ✅ | **One-click "Open in Colab" with code pre-loaded** | The current link opens a blank Colab | Low - generate a notebook per code block and link to it |
| ~~T3.6~~ ✅ | **Loss-landscape visualizer** | (new) | Medium - 3D-ish contour with adjustable LR/momentum |

Pyodide (T3.1) is the single highest-leverage item in this tier; it upgrades every practical lesson from "read code" to "run and modify code."

---

## Tier 4 — Production realism

Most learners want to build things that ship. Today every example is a snippet. Add end-to-end projects so learners see the whole loop.

| # | Project | Skills practiced |
|---|---------|------------------|
| ~~T4.1~~ ✅ | **RAG chatbot** (capstone for the LLM Systems tier) | Embeddings, retrieval, prompt engineering, eval, deployment |
| ~~T4.2~~ ✅ | **Fine-tuning a small model** on a real dataset | Data prep, PEFT, eval, model card |
| ~~T4.3~~ ✅ | **Agent that uses tools** | Tool calling, agent loop, safety, observability |
| ~~T4.4~~ ⬜ | **Serve a model behind FastAPI** | Deployment, latency, simple monitoring |
| ~~T4.5~~ ⬜ | **Cost estimation exercise** | Price out training vs inference across clouds |
| ~~T4.6~~ ⬜ | **Latency / caching exercise** | Add semantic caching to an LLM app |
| ~~T4.7~~ ⬜ | **Incident-response walkthrough** | Detect a regression, roll back, diagnose |
| ~~T4.8~~ ⬜ | **A/B testing & online evaluation for ML** | Beyond offline metrics |

---

## Tier 5 — Pedagogy & assessment

The review flagged assessment depth (C13, C14) and learning UX.

| # | Improvement | Motivated by |
|---|-------------|-------------|
| ~~T5.1~~ ✅ | **>=5 questions per quiz**, mixed types (MCQ + code completion + "spot the bug" + scenario) | C13, C14 |
| ~~T5.2~~ ✅ | **Capstone project** at the end of the course with a rubric | Assessment depth |
| ~~T5.3~~ ✅ | **Pre-assessment / placement test** so returning practitioners can skip Foundations | Pedagogy |
| ~~T5.4~~ ✅ | **Multiple learning paths**: Builder (heavy code) / Researcher (heavy math) / Leader (strategy + eval). Same content, different emphasis and sequencing. | Reach |
| ~~T5.5~~ ✅ | **Honest estimated times** - current `estimatedTime` values are wildly optimistic | Trust |
| ~~T5.6~~ ✅ | **"What you'll be able to do" objectives** at the top of each lesson + **"Before you start" prerequisite check** at the bottom | Pedagogy |
| ~~T5.7~~ ✅ | **Randomize question/option order** to prevent memorization | Assessment |
| ~~T5.8~~ ✅ | **End-of-quiz review mode** showing every question with its explanation | Assessment |

---

## Tier 6 — Sustainability (keep content fresh)

The review's biggest trust risks came from outdated code (LangChain, Qiskit). Put process around this so it doesn't recur.

| # | Practice | Motivated by |
|---|----------|-------------|
| ~~T6.1~~ ✅ | **Quarterly content audit** - re-run every code example against pinned versions; update "Last verified" stamps | C7, C8 |
| ~~T6.2~~ ✅ | **Automated smoke test in CI** - load the course, run every quiz, run every animation, screenshot every lesson | P1-P12 regression risk |
| ~~T6.3~~ ✅ | **Issue template** for "this example is out of date" so users can report drift | C7, C8 |
| ~~T6.4~~ ✅ | **Primary-source links** in lessons that make claims (especially quantum-ML) so updates are easy to spot when papers change | C4 |
| ~~T6.5~~ ✅ | **Version pinning enforced** in a linter that flags `pip install foo` without a version specifier | C11 |
| ~~T6.6~~ ✅ | **Accessibility audit in CI** (axe-core) | A1-A6 |
| ~~T6.7~~ ✅ | **Content model** (JSON schema for lessons) so non-developers can edit content without touching JS; enables the version-migration path in the saved-progress schema | Process |

---

## Recommended starting order

**All items shipped.** The recommended order was:

1. T1.1 (Prompt Engineering) + T1.2 (RAG) — shipped in Phase 8.
2. T3.1 (Pyodide runtime) — shipped in Phase 9.
3. T1.3 (Fine-tuning/LoRA) + T1.4 (LLM Evaluation) — shipped in Phase 8.
4. T5.1 (5 questions per quiz) — shipped in Phase 8-9.

Subsequent phases extended to all remaining tiers.

---

## Scope and status

- **All Tiers 1-6: COMPLETE.** Every item has been implemented and verified. See `REMEDIATION_LOG.md` Phases 8-14.
- **Deferred (engineering, not content):** JSON-backed content runtime loader (validator + extractor + schema are in place; the runtime loader is the next step).
- **Not in scope:** full Vite + TypeScript migration, PWA / service worker, i18n. These are engineering items; see `CRITICAL_REVIEW.md` Section 4F-G.

## Tracking

All progress is recorded in `docs/REMEDIATION_LOG.md` Phases 8-14, with each item referencing its T-number and verification status.