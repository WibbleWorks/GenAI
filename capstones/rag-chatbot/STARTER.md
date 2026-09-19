# Capstone 19 — Mini RAG Chatbot (STARTER, P0 scaffold)

> P0 skeleton. Full starter + golden set + SOLUTION + SUBMISSION + REVIEWER land in P2.
> Lesson: `capstone_rag_chatbot` (research). Stack: embeddings → Chroma/FAISS → MMR rerank → cite → FastAPI → Ragas eval.

## Quickstart (30 min)

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install "fastapi>=0.115" "uvicorn>=0.30" "chromadb>=0.5" "sentence-transformers>=3.0" "ragas>=0.2"
uvicorn starter.app:app --reload  # POST /ask {question} -> {answer, citations}
```

## What to build (maps to rubric rows)

1. Ingest → chunk (with overlap) → embed → index.
2. Retrieve + MMR rerank + cite (no fake citations).
3. Serve `POST /ask`, p95 < 4s on golden set.
4. Eval golden set (`expected/golden_qa.json`, P2) — faithfulness / answer-relevance / context-relevance.
5. Self-assess against rubric (14/20, ≥3 every row) + 3-item improvement backlog.

## Env pins

See lesson code blocks for `Last verified` stamps. CI import-checks asserts in P5.
