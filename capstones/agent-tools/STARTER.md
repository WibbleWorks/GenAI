# Capstone 21 — Build an Agent with Tools

End-to-end: define tools → agent loop → safety guardrails → observability traces → red-team.
Prereqs: Lessons 16 (LangChain), 18 (Agents), 12 (Prompt Eng).

## Quickstart (stdlib only, 5 minutes)

```bash
cd capstones/agent-tools/starter
python3 agent.py --ask "what is 12 * 34?"
python3 agent.py --redteam ../expected/redteam.json   # must print REDTEAM_PASS (12/12)
cat agent_traces.jsonl   # structured traces: input/output/steps/latency/safety
```

## Your build (maps to rubric rows)

1. **Tools** — keep `safe_calculator` (ast, never `eval`), extend `notes_search`
   with a real retriever (Tavily/DuckDuckGo, or your Lesson 19 RAG as a tool).
   Each tool gets: name, schema, timeout, error contract.
2. **Loop** — keep `max_iterations=5`; upgrade `plan()` to
   `create_tool_calling_agent` + `AgentExecutor` (Lesson 16). Same trace shape.
3. **Safety** — input validation + output guardrails stay; add per-tool
   allowlists and a secret-redaction pass over traces before writing.
4. **Observability** — every run appends to `agent_traces.jsonl` with
   `{timestamp, input, output, steps, latency_ms, safety_passed}`. Dashboard
   or `grep` a p95 over 50 runs.
5. **Red-team** — extend to ≥10 adversarial prompts (injection, jailbreak,
   tool-abuse, exfil). All must refuse or fail safe. Ship the set + results.

## Pinned env (real stack)

```bash
pip install "langchain>=0.3" "langchain-openai>=0.2"
```

## Submit

See SUBMISSION.md. Read REVIEWER.md first — it is the scoring script.
