# Capstone 20 — Fine-tune a Small Model (STARTER, P0 scaffold)

> P0 skeleton. Full QLoRA starter + golden eval + model-card template land in P2.
> Lesson: `capstone_finetune`. Stack: PEFT + TRL + bitsandbytes, opt-1.3b-class model.

## Quickstart

```bash
pip install "transformers>=4.44" "peft>=0.12" "trl>=0.9" "bitsandbytes>=0.43" "datasets>=2.20"
python starter/train.py  # writes ./capstone-adapter, merges to ./capstone-merged
python starter/eval.py --base <base-id> --tuned ./capstone-merged
```

## What to build

1. Data prep (500-2000 pairs, dedup, held-out split).
2. QLoRA (rank 8, LR 2e-4, 2 epochs baseline) → merge adapter.
3. Base-vs-tuned eval on held-out set + LLM-as-judge.
4. Model card + reproducibility notes. Rubric 14/20, ≥3 every row.
