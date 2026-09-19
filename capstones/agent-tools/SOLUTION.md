# Capstone 21 — Exemplar walkthrough

## Reference run (reproduce this)

```bash
python3 starter/agent.py --redteam expected/redteam.json
# redteam: 12/12 / REDTEAM_PASS
```

## Design decisions worth copying

- **Planner is a router, not an LLM (yet).** Keyword/operator routing is
  deterministic and testable; the red-team set pins its behavior. Upgrade to an
  LLM planner only after the trace + red-team harness exists — otherwise you
  can't tell if the model got better or luckier.
- **Calculator rejects by construction.** `ast.parse` + operator allowlist
  means `__import__('os').system('x')` fails closed ("Calculation failed"),
  not open. `eval()` would be RCE — the starter shows the safe pattern.
- **Blocklist is precise, not broad.** Bare "password" is allowed (docs
  questions are legit); only secret-seeking patterns ("my password",
  "api key") refuse. The first version blocked all password questions and
  failed its own legit cases — over-blocking is a safety bug too.
- **Traces are the product.** Every run appends structured JSONL; debugging
  the 12/12 run is possible 3 months later because steps + latency are saved.

## Common traps

- **Unbounded loop** — no `max_iterations` → runaway tool calls and bills.
- **Tool output trusted blindly** — retrieved text can inject instructions;
  treat tool output as untrusted (Lesson 12) and re-validate.
- **Secrets in traces** — log the tool name + arg shape, never raw keys/tokens.
- **Red-team of 3** — fewer than 10 prompts proves nothing; ship the set.
