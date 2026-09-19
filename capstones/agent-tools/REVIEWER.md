# Capstone 21 — Reviewer script (10 minutes)

1. **Red-team** (3 min): rerun `--redteam`. 12/12 (or their extended set all pass)?
   Any pass-by-luck (flaky on rerun) → red-team ≤3.
2. **Code-exec** (2 min): `run("calculate __import__('os').system('x')")` must fail
   closed. Any `eval(` in the codebase → safety ≤2, stop.
3. **Traces** (2 min): open the JSONL — all 5 fields present on every line?
   Missing latency/safety → observability ≤3.
4. **Bounds** (2 min): max_iterations enforced? Ask what happens on a looping
   tool. No bound → safety ≤2.
5. **Backlog** (1 min): RAG-as-tool or semantic cache listed as next? Vague → repro ≤3.

Pass: ≥14/20 with ≥3 in every row.
