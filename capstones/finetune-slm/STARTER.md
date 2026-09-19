# Capstone 20 — Fine-tune a Small Model

End-to-end: data prep → QLoRA training → merge adapter → base-vs-tuned eval → model card.
Prereqs: Lessons 14 (Fine-tuning & PEFT), 15 (LLM Evaluation).

## Quickstart (CPU only, 5 minutes)

```bash
cd capstones/finetune-slm/starter
python3 train.py --data ../expected/toy_instructions.jsonl --out ./capstone-data
# dedups (14 -> 12 rows), splits train/test, prints PREP_PASS
python3 eval.py --golden ../expected/golden_eval.json \
  --base ../expected/base_preds.sample.jsonl --tuned ../expected/tuned_preds.sample.jsonl
# base keyword_hit ~0.24 vs tuned 1.0, EVAL_PASS (no regression, bar met)
```

## Your build (maps to rubric rows)

1. **Data** — replace the toy file with 500–2000 instruction/response pairs
   (your domain, or a slice of `databricks/databricks-dolly-15k`). Run `train.py`
   prep on it: dedup + split + report. Keep the golden set disjoint.
2. **Train (Colab GPU)** — `python3 train.py --show-config` prints the QLoRA
   recipe (rank 8, LR 2e-4, 2 epochs, 4-bit). Run the printed cell in Colab,
   save `./capstone-adapter`, merge to `./capstone-merged` (Lesson 14).
3. **Eval** — generate preds for base and merged models on YOUR held-out set,
   score with `eval.py`. Report exact-match + keyword-hit + an LLM-as-judge
   sample (Lesson 15). Watch for catastrophic forgetting: hold out 10–20%
   general data and check it too.
4. **Model card** — intended use, data provenance, base vs tuned numbers,
   limitations. See `expected/sample_model_card.md`.
5. **Repro** — seeds, `pip freeze`, one-command rerun.

## Pinned env (training)

```bash
pip install "transformers>=4.44" "peft>=0.12" "trl>=0.9" "bitsandbytes>=0.43" "datasets>=2.20"
```

## Submit

See SUBMISSION.md. Read REVIEWER.md first — it is the scoring script.
