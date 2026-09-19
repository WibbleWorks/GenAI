#!/usr/bin/env python3
"""Fine-tune starter: data prep runs anywhere; QLoRA training needs a GPU (Colab).

Step 1 (here, CPU):  prepare() dedups + splits a JSONL instruction file.
Step 2 (Colab GPU):  training config below (PEFT + TRL + bitsandbytes, Lesson 14).
Step 3 (here, CPU):  starter/eval.py scores base-vs-tuned on the held-out set.

Usage:
  python train.py --data ../expected/toy_instructions.jsonl --out ./capstone-data
  python train.py --show-config   # print the Colab QLoRA config
"""

import argparse
import hashlib
import json
import os
import sys

QLORA_CONFIG = {
    "base_model": "facebook/opt-1.3b",
    "lora_r": 8,
    "lora_alpha": 16,
    "lora_dropout": 0.05,
    "lr": 2e-4,
    "epochs": 2,
    "bnb_4bit": True,
    "target": "q_proj,v_proj",
    "pins": ["transformers>=4.44", "peft>=0.12", "trl>=0.9", "bitsandbytes>=0.43"],
}


def load_jsonl(path):
    rows = []
    with open(path) as f:
        for i, line in enumerate(f, 1):
            line = line.strip()
            if line:
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError as e:
                    raise ValueError(f"{path}:{i}: bad JSON: {e}")
    return rows


def validate_row(row, i):
    for key in ("instruction", "response"):
        if key not in row or not isinstance(row[key], str) or not row[key].strip():
            raise ValueError(f"row {i}: missing/empty {key!r}")
    return {"instruction": row["instruction"].strip(), "response": row["response"].strip()}


def dedup(rows):
    seen, out = set(), []
    for r in rows:
        h = hashlib.sha256((r["instruction"] + "\x00" + r["response"]).encode()).hexdigest()
        if h not in seen:
            seen.add(h)
            out.append(r)
    return out, len(rows) - len(out)


def split(rows, test_frac=0.2):
    n_test = max(1, int(len(rows) * test_frac))
    return rows[:-n_test], rows[-n_test:]


def prepare(data_path, out_dir):
    rows = [validate_row(r, i) for i, r in enumerate(load_jsonl(data_path))]
    rows, n_dup = dedup(rows)
    if len(rows) < 10:
        raise ValueError(f"need >=10 rows after dedup, got {len(rows)}")
    train, test = split(rows)
    os.makedirs(out_dir, exist_ok=True)
    for name, part in (("train.jsonl", train), ("test.jsonl", test)):
        with open(os.path.join(out_dir, name), "w") as f:
            for r in part:
                f.write(json.dumps(r) + "\n")
    report = {"input_rows": len(rows) + n_dup, "duplicates_removed": n_dup,
              "train_rows": len(train), "test_rows": len(test)}
    print(json.dumps(report, indent=2))
    print("PREP_PASS")
    return report


COLAB_TRAINING = '''# Run on a Colab GPU (T4 or better). Pinned env first:
# pip install "transformers>=4.44" "peft>=0.12" "trl>=0.9" "bitsandbytes>=0.43" "datasets>=2.20"
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer, SFTConfig

bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype="bfloat16")
model = AutoModelForCausalLM.from_pretrained("facebook/opt-1.3b",
    quantization_config=bnb, device_map="auto")
tok = AutoTokenizer.from_pretrained("facebook/opt-1.3b")
tok.pad_token = tok.eos_token
model = get_peft_model(model, LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"], task_type="CAUSAL_LM"))
args = SFTConfig(output_dir="./capstone-qlora-out", num_train_epochs=2,
    per_device_train_batch_size=2, learning_rate=2e-4, report_to="none")
SFTTrainer(model=model, train_dataset=train_ds, args=args).train()
model.save_pretrained("./capstone-adapter")  # then merge + eval per Lesson 14
'''


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default=None)
    ap.add_argument("--out", default="./capstone-data")
    ap.add_argument("--show-config", action="store_true")
    args = ap.parse_args(argv)
    if args.show_config:
        print(json.dumps(QLORA_CONFIG, indent=2))
        print(COLAB_TRAINING)
        return 0
    if args.data:
        prepare(args.data, args.out)
        return 0
    ap.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
