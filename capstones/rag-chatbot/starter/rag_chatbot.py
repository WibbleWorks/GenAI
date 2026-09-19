#!/usr/bin/env python3
"""Mini RAG chatbot starter — stdlib only, runnable everywhere.

Pipeline: ingest -> chunk (overlap) -> retrieve (word-overlap) -> MMR-ish
diversity rerank -> answer with citations -> serve POST /ask -> eval.

Upgrade path (Lesson 13): swap retrieve() for sentence-transformers +
Chroma/FAISS and generation for an LLM call. The interfaces stay the same.

Usage:
  python rag_chatbot.py --ask "how do I reset my password?"
  python rag_chatbot.py --serve --port 8766        # POST /ask {"question": ...}
  python rag_chatbot.py --eval ../expected/golden_qa.json
"""

import argparse
import json
import math
import re
import sys
from collections import Counter
from http.server import BaseHTTPRequestHandler, HTTPServer

# --- Tiny built-in corpus (replace with your docs in the real capstone) ---
CORPUS = {
    "billing": (
        "Billing and subscriptions. You can cancel your subscription at any time "
        "from the billing page. Refunds are available within 14 days of purchase. "
        "You can downgrade your plan mid-cycle; the change takes effect next month."
    ),
    "password": (
        "Account security. To reset your password, open settings, choose security, "
        "then reset password. A reset link is emailed to you and expires in one hour. "
        "Support cannot see your password."
    ),
    "warranty": (
        "Hardware warranty. Laptops carry a two year warranty covering manufacturing "
        "defects. The warranty does not cover accidental damage. Contact support with "
        "your serial number to start a claim."
    ),
}


STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be",
    "to", "of", "in", "on", "at", "for", "with", "how", "what", "when",
    "where", "who", "do", "does", "did", "can", "could", "would", "should",
    "i", "you", "your", "my", "me", "it", "its", "this", "that", "there",
    "here", "now", "then", "than", "so", "if", "not", "no", "any", "by",
}


def stem(word):
    """Crude suffix strip so 'refunds'/'refund' and 'emailed'/'email' match."""
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


def chunk_text(text, size=120, overlap=30):
    """Sliding-window chunks (see Lesson 13 check: chunk_overlap)."""
    assert 0 <= overlap < size
    chunks, i = [], 0
    while i < len(text):
        chunks.append(text[i:i + size])
        if i + size >= len(text):
            break
        i += size - overlap
        if chunks[-1] == "":
            break
    return [c for c in chunks if c]


def sentence_chunks(text):
    """Sentence-aligned chunks: retrieval answers read cleanly (no mid-word cuts)."""
    parts = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    chunks, cur = [], ""
    for s in parts:
        if cur and len(cur) + 1 + len(s) > 220:
            chunks.append(cur)
            cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        chunks.append(cur)
    return chunks


INDEX = [
    {"doc": doc, "chunk": chunk}
    for doc, text in CORPUS.items()
    for chunk in sentence_chunks(text)
]


def score(query, chunk):
    """Word-overlap score (upgrade: cosine over embeddings)."""
    q, c = Counter(tokenize(query)), Counter(tokenize(chunk))
    return sum((q & c).values())


def retrieve(query, k=3):
    ranked = sorted(INDEX, key=lambda e: score(query, e["chunk"]), reverse=True)
    return [e for e in ranked if score(query, e["chunk"]) > 0][:k]


def rerank_mmrd(hits, query, top_n=2):
    """Diversity rerank: prefer hits whose chunks differ from each other."""
    picked = []
    for h in hits:
        if not picked:
            picked.append(h)
            continue
        overlap = max(len(set(tokenize(h["chunk"])) & set(tokenize(p["chunk"]))) for p in picked)
        if overlap <= 8 or len(picked) < top_n:
            picked.append(h)
        if len(picked) >= top_n:
            break
    return picked[:top_n]


def ask(question, k=3):
    hits = rerank_mmrd(retrieve(question, k=k), question)
    if not hits:
        return {"answer": "I don't know based on the indexed docs.", "citations": []}
    answer = " ".join(h["chunk"] for h in hits).strip()
    citations = sorted({h["doc"] for h in hits})
    return {"answer": answer, "citations": citations}


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/ask":
            self.send_response(404)
            self.end_headers()
            return
        try:
            body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
            result = ask(body.get("question", ""))
            payload = json.dumps(result).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except Exception as e:  # noqa: BLE001 - serve a 400, never crash
            payload = json.dumps({"error": str(e)}).encode()
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

    def log_message(self, *args):
        pass


def cmd_eval(golden_path):
    golden = json.load(open(golden_path))
    n_ok, rows = 0, []
    for item in golden:
        got = ask(item["question"])
        ans_ok = item["must_contain"].lower() in got["answer"].lower()
        cite_ok = all(c in got["citations"] for c in item.get("must_cite", []))
        ok = ans_ok and cite_ok
        n_ok += ok
        rows.append((ok, item["question"][:50], got["answer"][:60], got["citations"]))
    acc = n_ok / len(golden)
    print(f"eval: {n_ok}/{len(golden)} = {acc:.2f}")
    for ok, q, a, c in rows:
        print(("PASS " if ok else "FAIL "), q, "->", a, c)
    print("EVAL_PASS" if acc >= 0.80 else "EVAL_FAIL")
    return 0 if acc >= 0.80 else 1


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--ask", default=None)
    ap.add_argument("--serve", action="store_true")
    ap.add_argument("--port", type=int, default=8766)
    ap.add_argument("--eval", default=None)
    args = ap.parse_args(argv)
    if args.eval:
        return cmd_eval(args.eval)
    if args.serve:
        print(f"serving POST /ask on :{args.port}")
        HTTPServer(("127.0.0.1", args.port), Handler).serve_forever()
        return 0
    if args.ask:
        print(json.dumps(ask(args.ask), indent=2))
        return 0
    ap.print_help()
    return 2


if __name__ == "__main__":
    sys.exit(main())
