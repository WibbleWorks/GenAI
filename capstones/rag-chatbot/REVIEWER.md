# Capstone 19 — Reviewer script (10 minutes)

1. **Run** (2 min): `python3 starter/rag_chatbot.py --eval expected/golden_qa.json` (or the
   learner's extended set). Expect EVAL_PASS. If it fails, stop: reproducibility row ≤2.
2. **Serve** (2 min): `--serve`, `curl POST /ask`. Check `{answer, citations}` shape and
   that every citation appears in the corpus. Fake cite → citations row ≤2.
3. **Leakage** (2 min): ask how the golden set was built. Tuned-on-golden → eval row ≤2.
4. **Latency** (2 min): ask for the p95 number + what dominates. No measurement → serving row ≤3.
5. **Backlog** (2 min): 3 concrete next changes? Vague ("use bigger model") → reproducibility ≤3.

Pass: ≥14/20 with ≥3 in every row. Borderline: rerun eval yourself; trust the harness over prose.
