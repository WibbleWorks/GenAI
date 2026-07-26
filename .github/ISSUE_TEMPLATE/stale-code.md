---
name: "Code example is out of date"
about: "Report a code sample that no longer runs or uses a deprecated API"
title: "[Stale code] <lesson title> - <library>"
labels: ["stale-code", "content"]
assignees: []
---

## Where is the broken code?

- **Lesson:** <!-- e.g. Lesson 16: Hands-on LangChain -->
- **Code block caption:** <!-- e.g. "Tool-Calling Agent (LangChain >=0.2)" -->
- **"Last verified" stamp in the lesson:** <!-- e.g. 2025-07 -->
- **Today's date:**

## What currently fails?

<!-- Paste the exact error message or describe the API mismatch -->

```
# error output here
```

## What changed upstream?

<!-- e.g. "LangChain 0.3 removed initialize_agent; new API is create_tool_calling_agent + AgentExecutor" -->

<!-- If you can, link to the upstream changelog, migration guide, or release notes -->

## Suggested fix

<!-- Optional: minimal change that would make this example run on the current version -->

## Pin / version info

- The package(s) and version(s) you tested with: <!-- e.g. langchain==0.3.7 -->
- Python version:
- OS / environment:

---

Thanks for helping keep this course current. Out-of-date examples are the
biggest trust risk for new learners, so this gets priority.

(Maintainers: see `docs/CONTENT_ROADMAP.md` T6.1, T6.5 for the
process. Update the "Last verified" stamp when shipping the fix.)