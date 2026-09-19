# Capstone 20 — Exemplar walkthrough

## Reference run (reproduce this)

```bash
python3 starter/train.py --data expected/toy_instructions.jsonl --out /tmp/cap-data
# input_rows 14, duplicates_removed 2, train 10 / test 2, PREP_PASS
python3 starter/eval.py --golden expected/golden_eval.json \
  --base expected/base_preds.sample.jsonl --tuned expected/tuned_preds.sample.jsonl
# base keyword_hit 0.24 vs tuned 1.00, EVAL_PASS
```

## What the exemplar proves

- **Data quality is the lever.** 2/14 dupes removed; without dedup the model
  memorizes the duplicate and the "eval" flatters it. Always report
  input/dedup/train/test counts (the PREP report).
- **Base-vs-tuned, never tuned-only.** A tuned keyword_hit of 1.0 means nothing
  without the base at 0.24 beside it. The harness enforces no-regression.
- **Disjoint golden.** The golden 10 were never in the toy 14 — eval leakage
  would show as suspicious 1.0s with no learning curve. Keep tuning and
  reporting sets separate.

## Common traps

- **Forgetting check skipped** — fine-tune shifts the model; hold out general
  data or the model-card row fails.
- **Adapter never merged / not reloadable** — `merged.save_pretrained` +
  reload proof required for the reproducibility row.
- **LR/epochs cargo-culted** — 2e-4 × 2 epochs is a starting point, not a law.
  Show one ablation (e.g., r=8 vs r=16) for full marks on training setup.
