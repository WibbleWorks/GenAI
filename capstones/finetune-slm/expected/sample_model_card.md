# Model Card (sample — replace with your run)

- **Model:** capstone-merged (facebook/opt-1.3b + QLoRA r=8, alpha=16, dropout 0.05)
- **Data:** 12 toy instruction pairs after dedup (2 removed), 10 train / 2 test;
  golden eval 10 items, disjoint from training by construction
- **Training:** 2 epochs, LR 2e-4, 4-bit nf4, targets q_proj+v_proj (see `train.py --show-config`)
- **Eval (golden, held-out):** base keyword_hit 0.24 → tuned 1.00; exact-match 0.0 → 1.0
- **Intended use:** support-answer drafting with human review; NOT autonomous replies
- **Limitations:** toy domain, 10 golden items (real bar: 50+), no forgetting check on general data yet
- **Next:** bigger domain set, general-data hold-out, LLM-as-judge sample
