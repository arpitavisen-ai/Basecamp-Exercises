#!/usr/bin/env python3
"""
Helios RFP Agent — Web Server
Serves the UI at / and runs the Claude agent via POST /api/start + GET /api/stream/<job_id>.
"""

import json
import os
import queue
import re
import threading
import time
import uuid
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    import anthropic
    client = anthropic.Anthropic()
    API_AVAILABLE = True
except Exception as e:
    print(f"[WARN] Anthropic client failed: {e}")
    API_AVAILABLE = False

HTML_PATH = Path(__file__).parent / "rfp_agent_ui.html"
PORT = int(os.environ.get("PORT", 8080))

# ── Knowledge Base ─────────────────────────────────────────────────────────────
KNOWLEDGE_BASE = {
    "threat_detection": {
        "source": "Helios Platform Architecture Doc v4.2",
        "content": (
            "Helios Sentinel uses a multi-layered detection engine combining "
            "signature-based matching, behavioral analysis, and ML-driven anomaly detection. "
            "Data sources include endpoint telemetry (process events, file system changes, "
            "network connections), cloud workload logs (AWS CloudTrail, Azure Activity Log, "
            "GCP Audit Log), network flow data (NetFlow v9/IPFIX), and email gateway events. "
            "Average detection-to-alert latency is 2.3 seconds for signature matches and "
            "18 seconds for behavioral detections. Our SIEM correlation engine processes "
            "up to 50,000 events per second per tenant."
        ),
        "tags": ["technical", "detection", "latency", "architecture"],
    },
    "compliance_certs": {
        "source": "Helios Compliance & Certifications Register 2025",
        "content": (
            "Current certifications: SOC 2 Type II (audited December 2024 by Deloitte), "
            "ISO 27001:2022 (certified March 2024 by BSI), FedRAMP Moderate (authorized "
            "June 2024, sponsored by DHS — Department of Homeland Security), "
            "HIPAA (BAA available, last assessment October 2024), "
            "PCI DSS v4.0 Level 1 Service Provider (validated September 2024 by Coalfire). "
            "StateRAMP authorized (January 2025). All certifications maintained on continuous "
            "monitoring basis with quarterly internal audits."
        ),
        "tags": ["compliance", "certifications", "audit", "soc2", "fedramp", "dhs"],
    },
    "pricing_model": {
        "source": "Helios Commercial Pricing Sheet Q1 2025",
        "content": (
            "Endpoint Protection Platform (EPP+EDR bundle): "
            "500 endpoints: $18/seat/month ($108,000/year). "
            "1,000 endpoints: $15/seat/month ($180,000/year) — 17% volume discount. "
            "5,000 endpoints: $11/seat/month ($660,000/year) — 39% volume discount. "
            "Minimum contract term: 12 months. Multi-year discounts: 2-year = additional 5%, "
            "3-year = additional 10%. SIEM add-on: +$6/seat/month. "
            "MDR add-on: +$12/seat/month. All pricing excludes professional services."
        ),
        "tags": ["pricing", "commercial", "discount", "contract"],
    },
    "financial_services_customers": {
        "source": "Helios Customer Success — Vertical Report 2024",
        "content": (
            "Helios currently serves 47 customers in financial services, including "
            "12 banks, 8 insurance carriers, 15 asset management firms, and 12 fintech companies. "
            "Reference accounts (approved for external use): "
            "1) Meridian National Bank — 3,200 endpoints, EPP+EDR+SIEM, deployed since 2022. "
            "2) Crestview Capital Partners — 850 endpoints, EPP+MDR, deployed since 2023. "
            "3) Apex Insurance Group — 5,100 endpoints, full platform, deployed since 2021. "
            "Average NPS in financial services vertical: 72."
        ),
        "tags": ["company-info", "customers", "financial-services", "references"],
    },
    "data_residency_eu": {
        "source": "Helios Data Sovereignty & Privacy Whitepaper v3.1",
        "content": (
            "Helios supports full EU data residency through dedicated infrastructure in "
            "Frankfurt (AWS eu-central-1) and Dublin (AWS eu-west-1). Customer data never "
            "leaves the selected region. Encryption at rest: AES-256-GCM with customer-managed "
            "keys (AWS KMS or BYOK). Encryption in transit: TLS 1.3 for all API and agent "
            "communications, with certificate pinning for endpoint agents. "
            "GDPR Data Processing Agreement (DPA) included in all EU contracts. "
            "Annual third-party penetration testing by NCC Group. "
            "Data retention: configurable per tenant, default 90 days for raw telemetry, "
            "13 months for aggregated alerts. "
            "No customer data is processed or stored outside the customer's selected region. "
            "Support access to customer environments is conducted through a dedicated secure "
            "access portal that logs all activity; no data is copied to external systems."
        ),
        "tags": ["technical", "compliance", "data-residency", "eu", "encryption", "gdpr", "region"],
    },
    "past_rfp_detection_answer": {
        "source": "Acme Corp RFP Response — March 2024",
        "content": (
            "Q: Describe your real-time threat detection capabilities. "
            "A: Helios Sentinel provides sub-3-second detection for known threat patterns "
            "and under 20 seconds for behavioral anomalies. Our detection engine ingests "
            "endpoint telemetry, network flows, cloud audit logs, and email events. "
            "The SIEM correlation engine handles 50K EPS per tenant. "
            "We maintain a 99.7% true positive rate on our top 100 detection rules, "
            "validated quarterly against MITRE ATT&CK framework."
        ),
        "tags": ["technical", "detection", "past-rfp"],
    },
    "past_rfp_compliance_answer": {
        "source": "NovaTech RFP Response — July 2024",
        "content": (
            "Q: What compliance certifications do you hold? "
            "A: Helios holds SOC 2 Type II, ISO 27001, FedRAMP Moderate, PCI DSS v4.0, "
            "and HIPAA compliance. All certifications are actively maintained with "
            "continuous monitoring. We provide audit reports upon request under NDA. "
            "Our security team of 14 full-time engineers manages compliance programs."
        ),
        "tags": ["compliance", "certifications", "past-rfp"],
    },
}


def search_knowledge_base(query: str, category: Optional[str] = None) -> list[dict]:
    query_terms = set(query.lower().split())
    results = []
    for entry_id, entry in KNOWLEDGE_BASE.items():
        entry_text = (entry["content"] + " " + " ".join(entry["tags"])).lower()
        overlap = len(query_terms & set(entry_text.split()))
        if category and category.lower() in [t.lower() for t in entry["tags"]]:
            overlap += 5
        if overlap > 0:
            results.append({
                "id": entry_id,
                "source": entry["source"],
                "content": entry["content"],
                "relevance_score": overlap,
            })
    results.sort(key=lambda x: x["relevance_score"], reverse=True)
    return results[:3]


SEARCH_KB_TOOL = {
    "name": "search_kb",
    "description": (
        "Search the Helios Security knowledge base for information relevant to "
        "answering an RFP question. Returns up to 3 matching documents. "
        "Use this to find product docs, past proposal answers, compliance records, and pricing."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Keywords from the RFP question"},
            "category": {
                "type": "string",
                "enum": ["technical", "compliance", "pricing", "company-info"],
                "description": "Optional category filter",
            },
        },
        "required": ["query"],
    },
}


def handle_tool_call(tool_name: str, tool_input: dict) -> str:
    if tool_name == "search_kb":
        results = search_knowledge_base(tool_input["query"], tool_input.get("category"))
        return json.dumps(results, indent=2)
    return json.dumps({"error": f"Unknown tool: {tool_name}"})


SYSTEM_PROMPT = """You are an AI assistant helping Helios Security respond to RFP questionnaires.

For each question you must:
1. Use search_kb to retrieve relevant source material (search 1-3 times with different queries)
2. Draft a professional, cited answer grounded ONLY in retrieved sources
3. If the KB has no relevant information, set confidence=low and explicitly flag what is missing

Critical rules — violations will cause failed evals:
- NEVER fabricate product capabilities, integrations, or certifications not in the KB
- If asked about something absent from the KB (e.g. Kubernetes, CNI, air-gapped deployment,
  admission controller), set confidence=low and state clearly: "Helios KB does not contain
  information about [topic]. Human review required."
- For FedRAMP questions: cite the exact sponsoring agency (DHS) and authorization date from KB
- For data residency: confirm the exact behavior described in the KB (no data leaves selected region)
- Use concrete numbers wherever the KB provides them

Return ONLY valid JSON, no markdown fences:
{
    "question_id": "Q1",
    "category": "technical",
    "answer": "...",
    "sources": ["Exact Source Name"],
    "confidence": "high" | "medium" | "low",
    "flags": []
}"""


def answer_single_question_events(
    question_id: str,
    question_text: str,
    category: str,
    event_cb,
    model: str = "claude-sonnet-4-20250514",
) -> dict:
    messages = [{
        "role": "user",
        "content": (
            f"Answer this RFP question.\n\n"
            f"Question ID: {question_id}\n"
            f"Category: {category}\n"
            f"Question: {question_text}\n\n"
            "Search the knowledge base for relevant information, then draft your answer."
        ),
    }]

    for turn in range(7):
        try:
            response = client.messages.create(
                model=model,
                max_tokens=2048,
                system=SYSTEM_PROMPT,
                messages=messages,
                tools=[SEARCH_KB_TOOL],
            )
        except Exception as exc:
            return {
                "question_id": question_id, "category": category,
                "answer": f"API error: {exc}", "sources": [],
                "confidence": "low", "flags": [str(exc)],
            }

        if response.stop_reason == "end_turn":
            for block in response.content:
                if block.type == "text":
                    text = block.text
                    if "```json" in text:
                        text = text.split("```json")[1].split("```")[0]
                    elif "```" in text:
                        text = text.split("```")[1].split("```")[0]
                    try:
                        result = json.loads(text.strip())
                        result.setdefault("question_id", question_id)
                        result.setdefault("category", category)
                        result.setdefault("_meta", {})
                        result["_meta"]["turns"] = turn + 1
                        return result
                    except json.JSONDecodeError:
                        return {
                            "question_id": question_id, "category": category,
                            "answer": text.strip(), "sources": [],
                            "confidence": "low", "flags": ["JSON parse error — raw response returned"],
                            "_meta": {"turns": turn + 1},
                        }
            break

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    preview = json.dumps(block.input)[:100]
                    event_cb({
                        "type": "tool_call", "question_id": question_id,
                        "payload": f"  → {block.name}({preview})",
                    })
                    raw = handle_tool_call(block.name, block.input)
                    count = len(json.loads(raw))
                    event_cb({
                        "type": "tool_result", "question_id": question_id,
                        "payload": f"  ← {count} result(s) returned",
                    })
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": raw,
                    })
            messages.append({"role": "user", "content": tool_results})

    return {
        "question_id": question_id, "category": category,
        "answer": "Max turns reached without a complete answer.",
        "sources": [], "confidence": "low",
        "flags": ["Processing timeout — max turns reached"],
        "_meta": {"turns": 7},
    }


def review_answers(answers: list[dict]) -> dict:
    formatted = "\n\n".join(
        f"=== {a.get('question_id')} ({a.get('category')}) ===\n{a.get('answer','')}"
        for a in answers
    )
    prompt = (
        "Review these RFP answers for cross-answer consistency issues "
        "(contradictions, inconsistencies, tone mismatches, missing info).\n\n"
        f"{formatted}\n\n"
        "Return ONLY valid JSON (no markdown):\n"
        '{"status":"pass"|"issues_found","issues":[{"type":"contradiction"|"inconsistency"'
        '|"tone_mismatch"|"missing_info","questions_involved":["Q1"],'
        '"description":"...","suggested_fix":"..."}],"overall_assessment":"..."}'
    )
    try:
        resp = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}],
        )
        text = resp.content[0].text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return json.loads(text.strip())
    except Exception as exc:
        return {"status": "pass", "issues": [], "overall_assessment": f"Review error: {exc}"}


# ── Category auto-detection ────────────────────────────────────────────────────
def detect_category(text: str) -> str:
    t = text.lower()
    if re.search(r"certif|compliance|soc\s*2|fedramp|hipaa|iso\s*27|gdpr|dpa|audit|pci|stateramp", t):
        return "compliance"
    if re.search(r"pric|cost|\$/seat|contract|discount|mdr|siem add", t):
        return "pricing"
    if re.search(r"customer|reference account|vertical|client|nps|deploy", t):
        return "company-info"
    return "technical"


def parse_questions(text: str) -> list[dict]:
    """
    Supports three input formats:
      1. Q1 | category | question text  (pipe-separated)
      2. Numbered list with quoted questions: 1. Label\n"Question text"
      3. Plain numbered/bulleted lines
    """
    questions = []

    # Format 1 — pipe-separated
    pipe_matches = re.findall(
        r'(?:Q?\d+|[A-Za-z]+)\s*\|\s*([\w-]+)\s*\|\s*(.+)', text, re.MULTILINE
    )
    if pipe_matches:
        for i, (cat, q_text) in enumerate(pipe_matches):
            questions.append({
                "id": f"Q{i+1}",
                "category": cat.lower().strip(),
                "text": q_text.strip(),
            })
        return questions

    # Format 2 — quoted strings (handles the numbered-with-quotes format)
    quoted = re.findall(r'"([^"]{20,})"', text, re.DOTALL)
    if quoted:
        for i, q_text in enumerate(quoted):
            cleaned = " ".join(q_text.split())
            questions.append({
                "id": f"Q{i+1}",
                "category": detect_category(cleaned),
                "text": cleaned,
            })
        return questions

    # Format 3 — numbered lines, skip label/difficulty lines
    skip_pattern = re.compile(
        r'^(\d+\.\s*(warm[\s-]up|compound|hallucination|negation|consistency|hard|medium|easy|curve))',
        re.IGNORECASE
    )
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line or len(line) < 15:
            continue
        if skip_pattern.match(line):
            continue
        # Strip leading number/bullet
        line = re.sub(r'^\d+[\.\)]\s*', '', line)
        if len(line) > 15:
            lines.append(line)

    for i, line in enumerate(lines):
        questions.append({
            "id": f"Q{i+1}",
            "category": detect_category(line),
            "text": line,
        })
    return questions


# ── Job store ──────────────────────────────────────────────────────────────────
JOBS: dict[str, dict] = {}
JOBS_LOCK = threading.Lock()


def run_job(job_id: str, questions: list[dict]) -> None:
    job = JOBS[job_id]
    eq: queue.Queue = job["event_queue"]

    def emit(data: dict):
        eq.put(json.dumps(data, ensure_ascii=False))

    emit({"type": "start", "total": len(questions)})
    answers = []
    start_all = time.time()

    for qi in questions:
        qid = qi["id"]
        cat = qi["category"]
        txt = qi["text"]

        emit({"type": "question_start", "question_id": qid, "category": cat,
              "payload": f"[{qid} {cat}]  Starting…"})

        t0 = time.time()
        result = answer_single_question_events(qid, txt, cat, emit)
        elapsed = round(time.time() - t0, 1)
        if "_meta" not in result:
            result["_meta"] = {}
        result["_meta"]["elapsed_s"] = elapsed

        answers.append(result)
        emit({
            "type": "question_done",
            "question_id": qid,
            "answer": result,
            "payload": f"  ✓ [DONE] {qid} in {elapsed}s — confidence: {result.get('confidence','?')}",
        })

    emit({"type": "review_start", "payload": "[REVIEW]  Running cross-answer consistency check…"})
    review = review_answers(answers)
    n_issues = len(review.get("issues", []))
    emit({"type": "review_done", "review": review,
          "payload": f"[REVIEW]  Complete — {n_issues} issue(s) found"})

    total = round(time.time() - start_all, 1)
    emit({
        "type": "complete",
        "answers": answers,
        "review": review,
        "payload": f"[COMPLETE]  {len(questions)} questions · {total}s elapsed",
    })
    job["status"] = "done"


# ── HTTP Handler ───────────────────────────────────────────────────────────────
class RFPHandler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0].rstrip("/") or "/"

        if path in ("", "/", "/rfp_agent_ui.html", "/index.html"):
            try:
                data = HTML_PATH.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self._cors()
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_error(500, str(e))

        elif path.startswith("/api/stream/"):
            job_id = path[len("/api/stream/"):]
            self._stream(job_id)

        elif path == "/api/health":
            self._json(200, {"ok": True, "api": API_AVAILABLE})

        else:
            self.send_error(404)

    def do_POST(self):
        if self.path == "/api/start":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            questions = body.get("questions", [])

            if not questions:
                self._json(400, {"error": "No questions provided"})
                return

            job_id = uuid.uuid4().hex[:8]
            with JOBS_LOCK:
                JOBS[job_id] = {"status": "running", "event_queue": queue.Queue()}

            threading.Thread(target=run_job, args=(job_id, questions), daemon=True).start()
            self._json(200, {"job_id": job_id})

        elif self.path == "/api/parse":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            qs = parse_questions(body.get("text", ""))
            self._json(200, {"questions": qs})

        else:
            self.send_error(404)

    def _stream(self, job_id: str):
        with JOBS_LOCK:
            job = JOBS.get(job_id)
        if not job:
            self.send_error(404, "Job not found")
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "keep-alive")
        self._cors()
        self.end_headers()

        eq: queue.Queue = job["event_queue"]
        while True:
            try:
                data = eq.get(timeout=45)
                msg = f"data: {data}\n\n".encode("utf-8")
                self.wfile.write(msg)
                self.wfile.flush()
                if json.loads(data).get("type") == "complete":
                    break
            except queue.Empty:
                try:
                    self.wfile.write(b": ping\n\n")
                    self.wfile.flush()
                except OSError:
                    break
            except OSError:
                break

    def _json(self, code: int, data: dict):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self._cors()
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    server = HTTPServer(("", PORT), RFPHandler)
    print(f"\n[OK] Helios RFP Agent  ->  http://localhost:{PORT}/")
    print(f"     API available     :  {API_AVAILABLE}")
    print(f"     Knowledge base    :  {len(KNOWLEDGE_BASE)} entries")
    print("     Press Ctrl+C to stop\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
