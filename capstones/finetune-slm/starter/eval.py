#!/usr/bin/env python3
"""Held-out eval harness: scores a predictions JSONL against a golden test set.

Metrics: exact-match rate + keyword-hit rate (each golden item lists
required keywords). Compares --base preds vs --tuned preds and demands the
tuned model not regress (Lesson 15: base-vs-tuned, no eval leakage — the
golden set must be disjoint from training data).

Usage:
  python eval.py --golden ../expected/golden_eval.json --preds sample_preds.json
  python eval.py --golden ../expected/golden_eval.json --base base_preds.json --tuned tuned_preds.json
"""

import argparse
import json
import sys


def load_preds(path):
    with open(path) as f:
        return [json.loads(line) for line in f if line.strip()]


def score(preds, golden):
    by_id = {p["id"]: p["response"] for p in preds}
    exact, hit, total_kw, n = 0, 0, 0, 0
    for g in golden:
        if g["id"] not in by_id:
            continue
        n += 1
        resp = by_id[g["id"]].strip().lower()
        if resp == g["response"].strip().lower():
            exact += 1
        kws = [k.lower() for k in g.get("keywords", [])]
        total_kw += len(kws)
        hit += sum(1 for k in kws if k in resp)
    if n == 0:
        raise ValueError("no prediction ids overlap the golden set — eval leakage or id mismatch?")
    return {"n": n, "exact_match": exact / n,
            "keyword_hit": (hit / total_kw) if total_kw else 1.0}


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--golden", required=True)
    ap.add_argument("--preds", default=None)
    ap.add_argument("--base", default=None)
    ap.add_argument("--tuned", default=None)
    ap.add_argument("--min-keyword-hit", type=float, default=0.80)
    args = ap.parse_args(argv)
    golden = json.load(open(args.golden))
    if args.preds:
        s = score(load_preds(args.preds), golden)
        print(json.dumps(s, indent=2))
        ok = s["keyword_hit"] >= args.min_keyword_hit
        print("EVAL_PASS" if ok else "EVAL_FAIL")
        return 0 if ok else 1
    if args.base and args.tuned:
        sb, st = score(load_preds(args.base), golden), score(load_preds(args.tuned), golden)
        print("base: ", json.dumps(sb))
        print("tuned:", json.dumps(st))
        ok = st["keyword_hit"] >= sb["keyword_hit"] and st["keyword_hit"] >= args.min_keyword_hit
        print("EVAL_PASS (no regression, bar met)" if ok else "EVAL_FAIL")
        return 0 if ok else 1
    ap.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
