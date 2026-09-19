# Capstone 21 — Build an Agent with Tools (STARTER, P0 scaffold)

> P0 skeleton. Full tool skeleton + traces + red-team set land in P2.
> Lesson: `capstone_agent`. Stack: `create_tool_calling_agent` + `AgentExecutor(max_iterations=5)`.

## Quickstart

```bash
pip install "langchain>=0.3" "langchain-openai>=0.2"
python starter/agent.py --ask "what is 12*34?"
# writes agent_traces.jsonl: {timestamp, input, output, steps, latency, safety_passed}
```

## What to build

1. Tools: search + safe-calculator (`ast.parse`, never raw `eval`) + optional RAG retriever.
2. Safety: input validation + output guardrails.
3. Observability: structured traces to `agent_traces.jsonl`.
4. Red-team ≥10 adversarial prompts with pass/fail. Rubric 14/20, ≥3 every row.
