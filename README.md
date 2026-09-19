# Generative AI & Machine Learning Course

An interactive, browser-based AI/ML course covering foundations, applied ML, deep learning, LLM systems, and a research-topics tier on agents, capstones, and the frontier map. Real Python execution in the browser via Pyodide; 21 lessons; 105 quiz questions (5 per lesson); 3 capstone projects with rubrics. Quantum-AI is a standalone track in `quantum-course/` (theoretical/contested, per-claim citations).

> **Status:** 21 lessons across 5 levels, 105 quiz questions (5 per lesson, all shuffled with review mode), 3 end-to-end capstone projects with rubrics, 13 interactive animations. See `docs/CRITICAL_REVIEW.md`, `docs/REMEDIATION_LOG.md`, `docs/CONTENT_ROADMAP.md`, `docs/CONTENT_MODEL.md`.

## Course Overview

The course is organized as a 5-level ladder. Each lesson has written content, an interactive animation/visualizer, and a knowledge-check quiz. Lessons are sequentially numbered 1-21.

### Learning Path

**Level 1: AI & ML Foundations** (Beginner)
1. Introduction to AI
2. Introduction to ML
3. Neural Networks Intro
4. Responsible AI & Ethics
5. Math Refresher (optional)

**Level 2: Applied Machine Learning** (Intermediate)
6. Hands-on scikit-learn
7. MLOps Basics

**Level 3: Deep Learning & Transformers** (Advanced)
8. Hands-on TensorFlow
9. Hands-on Transformers (HuggingFace)
10. Embeddings & Vector Spaces
11. Transfer Learning

**Level 4: LLM Systems & Applications** (Expert)
12. Prompt Engineering
13. RAG & Vector Databases
14. Fine-tuning & PEFT (LoRA / QLoRA)
15. LLM Evaluation
16. Hands-on LangChain (LCEL, agents, memory)
17. Frontier Topics Map (production vs research; quantum lives in `quantum-course/`)

**Level 5: Research Topics**
18. Building AI Agents
19. Capstone: Mini RAG Chatbot (with rubric)
20. Capstone: Fine-tune a Small Model (with rubric)
21. Capstone: Build an Agent with Tools (with rubric)

## Features

### Interactive Learning
- **Adaptive Quizzes**: 5 questions per lesson, **60% pass threshold** (math is meaningful: 0/20/40/60/80/100 are all achievable), question and option order shuffled per attempt to prevent memorization (Roadmap T5.7).
- **End-of-quiz Review mode** (Roadmap T5.8): see every question, your pick, the correct answer, and the explanation per question.
- **Confidence Tracking**: monitors learning progress and confidence levels; mastered = confidence >= 80.
- **Resume**: the course remembers the last lesson you viewed and reopens it on reload.

### Interactive Labs & Animations
- **Interactive AI Lab**: a code editor that runs **real Python in your browser via Pyodide** (numpy, pandas, scikit-learn, scipy supported). For TensorFlow, PyTorch, Transformers, quantum SDKs, and LangChain, falls back to a clearly labeled simulated preview with an "Open in Colab" link.
- **Animations**: 13 types — AI timeline, ML workflow, NN visualizer, classification boundary, clustering, NN trainer, transformer visualizer, LLM inference, agent simulator, **gradient descent playground** (LR/momentum/optimizer sliders), **build-a-transformer step-through**, **bias dashboard** (per-slice metrics), and **2D loss-landscape contour**. All implemented with controls.
- **Mobile-friendly**: quiz and animations remain reachable on tablet and mobile via a slide-in nav drawer (Roadmap P15/P16 fix).

### Per-code-block actions (Roadmap T3.5)
- Every code example in every lesson now has a **📋 Copy** button and a **☁️ Open in Colab** button. Open-in-Colab copies the code to your clipboard and opens a fresh Colab notebook - paste and run.

### Practical Examples
- **Version-pinned code samples**: every `pip install` is enforced by `scripts/lint-version-pinning.js`; each block has a "Last verified: YYYY-MM" stamp.
- **Modern APIs**: LangChain >=0.3 (LCEL, `langchain_openai`, `invoke`), Qiskit >=1.1 (`qiskit_aer`, `FidelityQuantumKernel`), HuggingFace `max_new_tokens`, Pyodide 0.26.2 runtime.
- **Cloud guides surfaced**: Colab, SageMaker, Vertex AI, Azure ML, IBM Quantum, Amazon Braket, Google Quantum, Azure Quantum (was dead code in Phase 1; rendered into lessons in Phase 8).

## Supported Libraries & Frameworks

### Classical AI/ML
- **scikit-learn** >= 1.5 - Classic machine learning algorithms
- **TensorFlow** >= 2.16 - Deep learning with Keras
- **PyTorch** - Meta's deep learning framework
- **HuggingFace Transformers** >= 4.44 - NLP and multimodal models
- **LangChain** >= 0.3 - LLM application framework (LCEL)

### Quantum Computing
- **Qiskit** >= 1.1 - IBM's quantum framework with ML extensions
- **PennyLane** >= 0.37 - Xanadu's quantum ML framework
- **TensorFlow Quantum** - Google's quantum deep learning library
- **Cirq** >= 1.4 - Google's quantum framework for NISQ devices

## Cloud Platforms

### Classical AI Cloud
- Google Colab, Amazon SageMaker, Google Vertex AI, Azure Machine Learning

### Quantum Cloud
- IBM Quantum (Qiskit Runtime, SamplerV2), Amazon Braket, Google Quantum AI, Azure Quantum

## File Structure

```
GenAI/
├── index.html              # Main course interface
├── styles.css              # Course styling and theme
├── ai-animations.js        # 13 animation types
├── quiz-system.js          # Adaptive quiz with shuffle + review mode
├── course-data.js          # Foundations lessons (1-5)
├── practical-examples.js   # Applied lessons (6-21) with labs, cloud guides, capstones
├── main.js                 # Course controller, resume, placement test, learning paths, progress export/import
├── auth.js                 # Social login (Google/GitHub/email) + server-side progress sync via Supabase
├── auth-config.example.json # Template for Supabase config (copy to auth-config.json, gitignored)
├── README.md               # This file
├── docs/                   # Architecture, review, roadmap, schema, sustainability process
├── lessons/                # Proof-of-concept JSON lessons (one per lesson)
├── scripts/                # CI: lint-version-pinning, validate-lessons, extract-lessons
├── tests/                  # Browser smoke + axe-core accessibility
└── .github/workflows/      # CI pipeline (syntax + version-pin + schema + smoke + a11y)
```

## Getting Started

1. **Open the Course**: Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
2. **Navigate**: Use the sidebar (or the ☰ menu on mobile) to explore levels and lessons
3. **Interact**: Try the animations, the interactive lab, and the code examples
4. **Test Yourself**: Complete the knowledge check at the end of each lesson
5. **Reinforce**: The system identifies weak areas and suggests review material
6. **Resume**: Close the tab and come back - you'll pick up where you left off

## Progress Tracking

The course tracks, in `localStorage`:
- Completed lessons
- Quiz scores and mastery levels (confidence >= 80 = mastered)
- Time spent learning
- Confidence levels per topic
- The last lesson you viewed (for resume)

## Technical Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet**: Required only for cloud platform links (Colab, IBM Quantum, etc.)
- **Python**: Recommended for running code locally (Python 3.10+)

## Capstone projects

The course ships with three end-to-end capstone projects, each with scaffolded code, a rubric, and a "Definition of Done":

| Lesson | Title | вертикаль |
|--------|-------|----------|
| 19 | **Mini RAG Chatbot** | Ingest → chunk → embed → index → retrieve → MMR rerank → cite → serve (FastAPI) → eval (Ragas) |
| 20 | **Fine-tune a Small Model** | Data prep → QLoRA training → merge adapter → eval base vs fine-tuned → model card |
| 21 | **Build an Agent with Tools** | Define tools → create_tool_calling_agent → safety guardrails → observability traces → red-team adversarial set |

Every capstone has a 5-row×4-level rubric (14/20 to pass) and a 5-question quiz.

## Quality gates in CI

`.github/workflows/ci.yml` runs on every push/PR:
1. **Syntax check** — `node --check` on every JS source file.
2. **Version-pin lint** — `scripts/lint-version-pinning.js` flags any unpinned `pip install`.
3. **Smoke test** — `tests/smoke.mjs` boots the course headlessly (via Playwright when installed), renders every lesson, runs every quiz end-to-end, and starts every animation. Exits non-zero on any failure.

Run locally without Playwright:
```bash
python3 -m http.server 8765 &
node tests/smoke.mjs
```

## Progress persistence

Progress is stored in three layers (defense in depth):

1. **localStorage** — always works, even offline. Survives browser restarts but NOT "clear browsing data" / CCleaner.
2. **Export/import** — 💾 menu in the header lets users download a JSON backup and reload it later. CCleaner defense.
3. **Server-side sync** (optional) — if `auth-config.json` is present, users can sign in with Google, GitHub, or email OTP. Progress is stored in Supabase (PostgreSQL) and synced automatically on every save. Works across devices and browsers. See `docs/PROGRESS_ARCHITECTURE.md` for setup.

Without `auth-config.json`, the course runs in localStorage-only mode with the export/import bridge. No breaking change.

## Honest Limitations

This course is honest about what it doesn't cover:

- The **Pyodide runtime** supports scikit-learn / numpy / pandas / scipy. Lessons using TensorFlow / PyTorch / Transformers / quantum SDKs / cloud clients fall back to a clearly-labeled simulated preview with "Open in Colab" for real execution.
- **Server-side progress sync** requires a Supabase project (see `docs/PROGRESS_ARCHITECTURE.md`). Without it, progress is localStorage-only with the export/import bridge.
- **JSON-backed content** is a proof-of-concept — the validator + extractor + schema are in place, but the runtime loader still reads inline JS. The `lessons/` directory contains extracted JSON files ready for a future loader.
- See `docs/CONTENT_ROADMAP.md` for future plans.

## Documentation

| Document | What it covers |
|----------|---------------|
| `docs/CRITICAL_REVIEW.md` | The original critical review (70+ findings with severity) |
| `docs/REMEDIATION_LOG.md` | Every fix applied across 14 phases, with verification |
| `docs/CONTENT_ROADMAP.md` | The 6-tier improvement plan (all tiers now implemented) |
| `docs/CONTENT_MODEL.md` | The lesson shape + how to add a new lesson |
| `docs/lesson.schema.json` | JSON Schema validating every lesson's structure |
| `docs/SUSTAINABILITY_PROCESS.md` | Quarterly audit checklist + CI pipeline + axe-core |
| `docs/PROGRESS_ARCHITECTURE.md` | Social login + server-side progress (Supabase setup guide) |

## Getting Started for Operators

1. **Deploy**: copy all files to any static host (GitHub Pages, Netlify, S3, etc.). No build step.
2. **Optional — enable social login**: follow `docs/PROGRESS_ARCHITECTURE.md` (10 minutes, free Supabase project).
3. **Optional — enable CI**: the `.github/workflows/ci.yml` runs on push/PR. 5 jobs: syntax, version-pin, schema-validate, smoke, a11y.
4. **Optional — edit content**: see `docs/CONTENT_MODEL.md` for the lesson shape and `scripts/extract-lessons.mjs` to dump lessons to JSON.

## License

Provided as educational material. Use, modify, and share for learning purposes.
