# Capstone 19 — Submission checklist

Copy into your PR/README as "Self-assessment" and tick every box with evidence.

- [ ] One-command run reproduces my results (`--eval` output pasted below, EVAL_PASS at ≥0.80)
- [ ] `POST /ask` returns `{answer, citations}`; citations are all retrieved docs (no fake cites)
- [ ] p95 latency on my golden set: ___s (budget 4s); profile note: which component dominates
- [ ] Golden set: ___ items from MY corpus (≥50), disjoint from tuning data (no eval leakage)
- [ ] Ragas (or equivalent): faithfulness ___ / answer-relevance ___ / context-relevance ___
- [ ] Self-score vs rubric (14/20 to pass, ≥3 in every row): retrieval __ / citations __ / serving __ / eval __ / reproducibility __
- [ ] Improvement backlog (3 items): 1.___ 2.___ 3.___
- [ ] `pip freeze` (or env file) committed; seeds fixed; README explains corpus + chunk params

Eval output:
```
(paste)
```
