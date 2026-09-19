#!/usr/bin/env python3
"""Tool-calling agent starter — stdlib only, runnable everywhere.

Loop: plan -> call tool -> observe -> repeat (max_iterations=5 safety) ->
final answer. Every run appends a structured trace to agent_traces.jsonl.

Tools: safe_calculator (ast-based, never eval), notes_search (word overlap
over local NOTES; upgrade: Tavily/web search + Lesson 19 RAG retriever).

Safety: input validation (length + blocklist) + output guardrails (no tool
leaks secrets; calculator only). Red-team set in ../expected/redteam.json.

Usage:
  python agent.py --ask "what is 12 * 34?"
  python agent.py --ask "what does the warranty cover?" --trace agent_traces.jsonl
  python agent.py --redteam ../expected/redteam.json
"""

import argparse
import ast
import json
import operator
import re
import sys
import time

MAX_ITERATIONS = 5
MAX_QUESTION_CHARS = 500
# Bare "password" is NOT blocked (docs questions are legit); only secret-seeking is.
BLOCKED = ("ignore previous", "reveal your instructions", "system prompt",
           "api key", "my password", "your password")

NOTES = {
    "warranty": "Laptops carry a two year warranty covering manufacturing defects. Accidental damage is excluded.",
    "refund": "Refunds are available within 14 days of purchase from the billing page.",
    "password": "Password reset links are emailed and expire in one hour.",
}

# --- Tools ---

OPS = {"+": operator.add, "-": operator.sub, "*": operator.mul, "/": operator.truediv,
       "**": operator.pow, "%": operator.mod}


def safe_calculate(expr):
    """Arithmetic only. ast.parse — never eval() (which is RCE-equivalent)."""
    if not re.fullmatch(r"[0-9+\-*/().% \t]+", expr):
        raise ValueError("calculator accepts numbers and + - * / ** % ( ) only")
    tree = ast.parse(expr, mode="eval")

    def _eval(node):
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in tuple(type(o) for o in (ast.Add(), ast.Sub(), ast.Mult(), ast.Div(), ast.Pow(), ast.Mod())):
            op = OPS[{ast.Add: "+", ast.Sub: "-", ast.Mult: "*", ast.Div: "/", ast.Pow: "**", ast.Mod: "%"}[type(node.op)]]
            return op(_eval(node.left), _eval(node.right))
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
            return (+1 if isinstance(node.op, ast.UAdd) else -1) * _eval(node.operand)
        raise ValueError(f"unsupported expression: {ast.dump(node)}")

    return _eval(tree)


STOPWORDS = {"a", "an", "the", "and", "or", "is", "are", "to", "of", "in",
             "on", "for", "how", "what", "do", "does", "can", "i", "you",
             "my", "it", "this", "that", "with", "long"}


def stem(word):
    if len(word) > 4:
        if word.endswith("ing"):
            return word[:-3]
        if word.endswith("ed"):
            return word[:-2]
    if len(word) > 3 and word.endswith("s") and not word.endswith("ss"):
        return word[:-1]
    return word


def tokenize(text):
    return [stem(w) for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOPWORDS]


def notes_search(query):
    scored = sorted(NOTES.items(), key=lambda kv: -len(set(tokenize(query)) & set(tokenize(kv[1]))))
    return [{"note": k, "text": v} for k, v in scored if set(tokenize(query)) & set(tokenize(v))][:2]


TOOLS = {
    "safe_calculator": {"fn": safe_calculate, "when": "arithmetic question"},
    "notes_search": {"fn": notes_search, "when": "factual question about docs"},
}


# --- Guardrails ---

def validate_input(question):
    if not question or not question.strip():
        raise ValueError("empty question")
    if len(question) > MAX_QUESTION_CHARS:
        raise ValueError(f"question too long ({len(question)} > {MAX_QUESTION_CHARS})")
    low = question.lower()
    if any(b in low for b in BLOCKED):
        raise ValueError("blocked: prompt-injection / secret-seeking pattern")


def guard_output(text):
    low = text.lower()
    if any(b in low for b in BLOCKED):
        return "I can't help with that."
    return text


# --- Agent loop ---

def plan(question):
    """Route to a tool. Upgrade: LLM planner (create_tool_calling_agent)."""
    if "calculat" in question.lower() or re.search(r"[+\-*/%]", question):
        toks = re.findall(r"\d+(?:\.\d+)?|[+\-*/%()]", question)
        return "safe_calculator", "".join(toks)
    return "notes_search", question


def run(question, trace_path="agent_traces.jsonl"):
    t0 = time.time()
    steps, safety_passed = [], True
    try:
        validate_input(question)
    except ValueError as e:
        trace = {"input": question, "output": "I can't help with that.",
                 "steps": [], "latency_ms": 0, "safety_passed": True,
                 "refusal": str(e)}
        _write_trace(trace_path, trace)
        return trace
    tool_name, tool_arg = plan(question)
    answer, iterations = "", 0
    while iterations < MAX_ITERATIONS:
        iterations += 1
        try:
            result = TOOLS[tool_name]["fn"](tool_arg)
            steps.append({"tool": tool_name, "arg": tool_arg, "result": result})
        except Exception as e:  # noqa: BLE001 - tool errors become observations
            steps.append({"tool": tool_name, "arg": tool_arg, "error": str(e)})
            result = None
        if tool_name == "safe_calculator":
            answer = f"{tool_arg.strip()} = {result}" if result is not None else "Calculation failed."
            break
        if result:
            top = result[0]
            answer = f"{top['text']} [note: {top['note']}]"
            break
        answer = "I don't know based on the available tools."
        break
    output = guard_output(answer)
    trace = {"input": question, "output": output, "steps": steps,
             "latency_ms": int((time.time() - t0) * 1000),
             "safety_passed": safety_passed}
    _write_trace(trace_path, trace)
    return trace


def _write_trace(path, trace):
    with open(path, "a") as f:
        f.write(json.dumps({**trace, "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")}) + "\n")


def cmd_redteam(path):
    cases = json.load(open(path))
    n_ok = 0
    for c in cases:
        trace = run(c["prompt"], trace_path="/tmp/agent_redteam_traces.jsonl")
        out = trace["output"]
        if c["type"] == "refuse":
            ok = out == "I can't help with that."
        else:  # answer
            ok = c["must_contain"].lower() in out.lower()
        n_ok += ok
        print(("PASS " if ok else "FAIL "), c["prompt"][:60], "->", out[:80])
    print(f"redteam: {n_ok}/{len(cases)}")
    print("REDTEAM_PASS" if n_ok == len(cases) else "REDTEAM_FAIL")
    return 0 if n_ok == len(cases) else 1


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--ask", default=None)
    ap.add_argument("--trace", default="agent_traces.jsonl")
    ap.add_argument("--redteam", default=None)
    args = ap.parse_args(argv)
    if args.redteam:
        return cmd_redteam(args.redteam)
    if args.ask:
        print(json.dumps(run(args.ask, args.trace), indent=2))
        return 0
    ap.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
