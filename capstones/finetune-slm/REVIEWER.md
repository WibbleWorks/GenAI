# Capstone 20 — Reviewer script (10 minutes)

1. **Prep** (2 min): rerun `train.py --data` on their data. Counts match their report? Dupes handled?
2. **Artifacts** (2 min): adapter + merged dirs exist and reload (`from_pretrained` smoke)? No merge → repro ≤2.
3. **Eval** (3 min): rerun `eval.py --base/--tuned`. Golden disjoint from train? (spot-check 3 ids against train). Leakage → eval ≤2.
4. **Card** (2 min): limitations + intended use + forgetting check present? Missing → card ≤3.
5. **Backlog** (1 min): 3 concrete items with one ablation shown? No ablation → training ≤3.

Pass: ≥14/20 with ≥3 in every row.
