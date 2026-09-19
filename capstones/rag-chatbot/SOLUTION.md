# Capstone 19 — Exemplar walkthrough (not a copy-paste answer)

## Reference run (reproduce this)

```bash
python3 starter/rag_chatbot.py --eval expected/golden_qa.json
# eval: 20/20 = 1.00 / EVAL_PASS
```

## Why the starter scores 20/20 (and what breaks first at scale)

1. **Sentence chunks** — answers are never cut mid-phrase. Char windows
   (Lesson 13 exercise) split "expires in | one hour" across chunks; sentence
   alignment fixes citation quality before any model change.
2. **Stopwords + light stemming** — "Refunds" vs "refund", "emailed" vs "email".
   Without this, exact-overlap retrieval loses 40% on this set (measured 12/20
   before the fix). With real embeddings this matters less, but the eval would
   still catch it — that is the point of the golden set.
3. **Top-2 answer concat** — single-best-chunk drops the sentence holding the
   key phrase ("one hour" lives in chunk 2). Concatenating top-2 after MMR
   costs latency but buys recall. Track the trade-off in your README.

## Common traps (rubric rows they fail)

- **Fake citations** — emitting a doc id you didn't retrieve. Instant fail on
  the citations row. The starter only cites retrieved docs; keep that invariant.
- **Eval leakage** — tuning chunk params against the golden set then reporting
  the same set as "held-out". Split: dev set for tuning, golden for reporting.
- **Latency blindness** — cross-encoder rerank over 50 candidates blows the
  4s p95 budget. Profile first (usually the LLM call dominates), then cache.
- **Preprocessing mismatch** — query normalized differently from docs
  (stemming on one side only). The starter stems both; keep it symmetric.

## What "excellent" adds over the starter

Real embeddings + FAISS/Chroma, hybrid (BM25 + vector) retrieval, Ragas
scores on 50+ own-corpus items, p95 log, and a 3-item improvement backlog.
