# Capstone 19 — Mini RAG Chatbot

End-to-end: ingest → chunk → embed → index → retrieve → rerank → cite → serve → eval.
Prereqs: Lessons 12 (Prompt Eng), 13 (RAG), 15 (LLM Eval).

## 30-minute quickstart

```bash
cd capstones/rag-chatbot/starter
python3 rag_chatbot.py --ask "how do I reset my password?"
python3 rag_chatbot.py --eval ../expected/golden_qa.json   # must print EVAL_PASS (bar: 0.80)
python3 rag_chatbot.py --serve --port 8766                 # POST /ask {"question": "..."}
```

No dependencies — stdlib only. Retrieval here is word-overlap + sentence
chunks on purpose: small, honest, fully runnable. Your capstone replaces the
toy parts with the real stack (below) while keeping the interfaces.

## Your build (maps to rubric rows)

1. **Corpus + chunking** — replace `CORPUS` with your docs (team wiki, PDFs via
   `pypdf`, markdown files). Keep sentence chunks or move to token windows
   (Lesson 13). Record chunk size/overlap in your README.
2. **Embeddings + index** — swap `score()` for `sentence-transformers`
   (`BAAI/bge-small-en-v1.5`) + Chroma or FAISS. Keep the `retrieve()` signature.
3. **Rerank + cite** — keep MMR diversity; add a cross-encoder rerank if you
   like. Never emit a citation you didn't retrieve (see SOLUTION.md trap #2).
4. **Serve** — keep `POST /ask → {answer, citations}`; log p95 latency.
   Budget: p95 < 4s on the golden set.
5. **Eval** — extend `expected/golden_qa.json` to 50+ items from YOUR corpus,
   add Ragas faithfulness/answer-relevance (Lesson 15), and beat the starter's bar.

## Pinned env (real stack)

```bash
pip install "sentence-transformers>=3.0" "chromadb>=0.5" "fastapi>=0.115" "uvicorn>=0.30" "ragas>=0.2"
```

## Submit

See SUBMISSION.md. Then `REVIEWER.md` is how your work gets scored — read it first.
