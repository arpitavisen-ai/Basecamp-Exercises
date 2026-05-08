#!/usr/bin/env python3
"""
Agent Engineering Challenge — full implementation.
Extracted from Agent_Engineering_Challenge.py (Jupyter notebook) with all
TODO stubs implemented: process_rfp(), review_answers(), run_evals().
"""

# ============================================================
# Part 0: Setup
# ============================================================
import os
import json
import time
from typing import Optional
from dotenv import load_dotenv

import anthropic

load_dotenv()
client = anthropic.Anthropic()

# Verify API connectivity
try:
    _r = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=20,
        messages=[{"role": "user", "content": "Say 'ready' and nothing else."}],
    )
    print(f"[OK] API verified: {_r.content[0].text}  (model: {_r.model})")
except Exception as e:
    print(f"[FAIL] API connection: {e}")
    raise


def create_with_retry(retries=5, **kwargs):
    """client.messages.create with exponential backoff on rate limit errors."""
    for attempt in range(retries):
        try:
            return client.messages.create(**kwargs)
        except anthropic.RateLimitError:
            if attempt < retries - 1:
                wait = 60 * (2 ** attempt)
                print(f"\n  [Rate limit — waiting {wait}s, retry {attempt + 1}/{retries}]")
                time.sleep(wait)
            else:
                raise


# ============================================================
# Part 2: Mock Knowledge Base
# ============================================================
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
            "June 2024, sponsored by DHS), HIPAA (BAA available, last assessment October 2024), "
            "PCI DSS v4.0 Level 1 Service Provider (validated September 2024 by Coalfire). "
            "StateRAMP authorized (January 2025). All certifications maintained on continuous "
            "monitoring basis with quarterly internal audits."
        ),
        "tags": ["compliance", "certifications", "audit", "soc2", "fedramp"],
    },
    "pricing_model": {
        "source": "Helios Commercial Pricing Sheet Q1 2025",
        "content": (
            "Endpoint Protection Platform (EPP+EDR bundle): "
            "500 endpoints: $18/seat/month ($108,000/year). "
            "1,000 endpoints: $15/seat/month ($180,000/year) -- 17% volume discount. "
            "5,000 endpoints: $11/seat/month ($660,000/year) -- 39% volume discount. "
            "Minimum contract term: 12 months. Multi-year discounts: 2-year = additional 5%, "
            "3-year = additional 10%. SIEM add-on: +$6/seat/month. "
            "MDR add-on: +$12/seat/month. All pricing excludes professional services."
        ),
        "tags": ["pricing", "commercial", "discount", "contract"],
    },
    "financial_services_customers": {
        "source": "Helios Customer Success -- Vertical Report 2024",
        "content": (
            "Helios currently serves 47 customers in financial services, including "
            "12 banks, 8 insurance carriers, 15 asset management firms, and 12 fintech companies. "
            "Reference accounts (approved for external use): "
            "1) Meridian National Bank -- 3,200 endpoints, EPP+EDR+SIEM, deployed since 2022. "
            "2) Crestview Capital Partners -- 850 endpoints, EPP+MDR, deployed since 2023. "
            "3) Apex Insurance Group -- 5,100 endpoints, full platform, deployed since 2021. "
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
            "13 months for aggregated alerts."
        ),
        "tags": ["technical", "compliance", "data-residency", "eu", "encryption", "gdpr"],
    },
    "past_rfp_detection_answer": {
        "source": "Acme Corp RFP Response -- March 2024",
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
        "source": "NovaTech RFP Response -- July 2024",
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
    """Search the mock knowledge base. Returns top 3 matches by keyword overlap."""
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


test_results = search_knowledge_base("threat detection latency", category="technical")
print(f"[OK] Knowledge base loaded ({len(KNOWLEDGE_BASE)} entries)")
print(f"     Test search top result: {test_results[0]['source']}")


# ============================================================
# Part 3: Tool Definition
# ============================================================
SEARCH_KB_TOOL = {
    "name": "search_kb",
    "description": (
        "Search the Helios Security knowledge base for information relevant to "
        "answering an RFP question. Returns up to 3 matching documents with source "
        "attribution. Use this to find product docs, past proposal answers, compliance "
        "records, and pricing information."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "Search query -- use keywords from the RFP question",
            },
            "category": {
                "type": "string",
                "enum": ["technical", "compliance", "pricing", "company-info"],
                "description": "Optional category filter to narrow results",
            },
        },
        "required": ["query"],
    },
}


def handle_tool_call(tool_name: str, tool_input: dict) -> str:
    """Execute a tool call and return result as a string."""
    if tool_name == "search_kb":
        results = search_knowledge_base(
            query=tool_input["query"],
            category=tool_input.get("category"),
        )
        return json.dumps(results, indent=2)
    return json.dumps({"error": f"Unknown tool: {tool_name}"})


print("[OK] Tool definition ready")


# ============================================================
# Part 4: Level 0 Agent (single question)
# ============================================================
SYSTEM_PROMPT = """You are an AI assistant helping Helios Security respond to RFP questionnaires.

For each question, you must:
1. Use the search_kb tool to find relevant source material
2. Draft a professional, detailed answer grounded in the retrieved sources
3. Cite your sources by name
4. If the knowledge base doesn't contain enough information, flag the answer as low-confidence

Return your answer as JSON with this structure:
{
    "question_id": "Q1",
    "category": "technical",
    "answer": "Your drafted answer here...",
    "sources": ["Source Name 1", "Source Name 2"],
    "confidence": "high" | "medium" | "low",
    "flags": ["any concerns or notes for human review"]
}

Be specific, professional, and concise. Use concrete numbers from the source material."""


def answer_single_question(
    question_id: str,
    question_text: str,
    category: str,
    model: str = "claude-sonnet-4-20250514",
) -> dict:
    """Level 0 agent: answers a single RFP question using the search_kb tool."""
    messages = [
        {
            "role": "user",
            "content": (
                f"Answer this RFP question.\n\n"
                f"Question ID: {question_id}\n"
                f"Category: {category}\n"
                f"Question: {question_text}\n\n"
                f"Search the knowledge base for relevant information, then draft your answer."
            ),
        }
    ]

    max_turns = 5
    tool_calls_made = 0
    for turn in range(max_turns):
        response = create_with_retry(
            model=model,
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=[SEARCH_KB_TOOL],
        )

        if response.stop_reason == "end_turn":
            for block in response.content:
                if block.type == "text":
                    try:
                        text = block.text
                        if "```json" in text:
                            text = text.split("```json")[1].split("```")[0]
                        elif "```" in text:
                            text = text.split("```")[1].split("```")[0]
                        result = json.loads(text.strip())
                        result["_meta"] = {"tool_calls": tool_calls_made, "turns": turn + 1}
                        return result
                    except json.JSONDecodeError:
                        return {"raw_response": block.text, "parse_error": True}
            break

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    tool_calls_made += 1
                    print(f"    -> search_kb(query='{block.input.get('query','')[:50]}', category={block.input.get('category')})")
                    result = handle_tool_call(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })
            messages.append({"role": "user", "content": tool_results})

    return {"error": "Max turns reached without completing"}


print("[OK] Level 0 agent defined")

# Quick test on Q1
print("\nTesting Level 0 agent on Q1 (threat detection)...")
q1_test = answer_single_question(
    question_id="Q1",
    question_text=(
        "Describe your platform's approach to real-time threat detection. "
        "What data sources are ingested, and what is the average detection-to-alert latency?"
    ),
    category="technical",
)
print(f"  Result: confidence={q1_test.get('confidence')}, sources={len(q1_test.get('sources', []))}, tool_calls={q1_test.get('_meta', {}).get('tool_calls', '?')}")
print(f"  Answer (first 200 chars): {q1_test.get('answer', '')[:200]}...")


# ============================================================
# Part 5: IMPLEMENTED -- Multi-Question Agent (process_rfp)
# ============================================================
RFP_QUESTIONS = [
    {
        "id": "Q1",
        "category": "technical",
        "text": (
            "Describe your platform's approach to real-time threat detection. "
            "What data sources are ingested, and what is the average detection-to-alert latency?"
        ),
    },
    {
        "id": "Q2",
        "category": "compliance",
        "text": (
            "List all compliance certifications your organization currently holds "
            "(SOC 2, ISO 27001, FedRAMP, etc.) and the date of most recent audit for each."
        ),
    },
    {
        "id": "Q3",
        "category": "pricing",
        "text": (
            "Provide per-seat pricing for 500, 1,000, and 5,000 endpoints. "
            "Are volume discounts available? Is there a minimum contract term?"
        ),
    },
    {
        "id": "Q4",
        "category": "company-info",
        "text": (
            "How many customers do you currently serve in the financial services vertical? "
            "Provide 2-3 reference accounts."
        ),
    },
    {
        "id": "Q5",
        "category": "technical",
        "text": (
            "How does your platform handle data residency requirements for customers "
            "operating in the EU? Describe encryption at rest and in transit."
        ),
    },
]


def process_rfp(questions: list[dict]) -> list[dict]:
    """Process a full RFP questionnaire sequentially and return structured answers."""
    answers = []
    for q in questions:
        print(f"\n  Processing {q['id']} ({q['category']})...")
        t0 = time.time()
        result = answer_single_question(
            question_id=q["id"],
            question_text=q["text"],
            category=q["category"],
        )
        elapsed = time.time() - t0
        print(f"    Done in {elapsed:.1f}s | confidence={result.get('confidence', '?')} | sources={len(result.get('sources', []))}")
        answers.append(result)
    return answers


print("\n" + "=" * 60)
print("Part 5: Processing RFP (5 questions)...")
print("=" * 60)
all_answers = process_rfp(RFP_QUESTIONS)

print(f"\nSummary: {len(all_answers)} answers collected")
for ans in all_answers:
    q_id = ans.get("question_id", "?")
    conf = ans.get("confidence", "?")
    src_count = len(ans.get("sources", []))
    flags = ans.get("flags", [])
    print(f"  {q_id}: confidence={conf}, sources={src_count}, flags={flags}")


# ============================================================
# Part 6: IMPLEMENTED -- Consistency Review
# ============================================================
def review_answers(answers: list[dict]) -> dict:
    """Review all drafted answers for cross-question consistency."""
    answers_text = ""
    for ans in answers:
        answers_text += f"\n--- {ans.get('question_id', '?')} ({ans.get('category', '?')}) ---\n"
        answers_text += f"Answer: {ans.get('answer', 'N/A')}\n"
        answers_text += f"Sources: {', '.join(ans.get('sources', []))}\n"
        answers_text += f"Confidence: {ans.get('confidence', '?')}\n"

    review_prompt = f"""You are reviewing a set of RFP answers drafted by an AI agent for Helios Security.
Your job is to check for cross-answer consistency.

Look for:
1. Contradictions: Do any answers state conflicting facts (dates, numbers, capabilities)?
2. Inconsistent data points: Are the same metrics quoted differently across answers?
3. Tone mismatches: Is the tone consistent and professional across all answers?
4. Missing cross-references: Where answers touch related topics, do they align?

Here are all the drafted answers:
{answers_text}

Return your review as JSON:
{{
    "status": "pass" | "issues_found",
    "issues": [
        {{
            "type": "contradiction" | "inconsistency" | "tone_mismatch" | "missing_info",
            "questions_involved": ["Q1", "Q3"],
            "description": "Describe the issue",
            "suggested_fix": "How to resolve it"
        }}
    ],
    "overall_assessment": "Brief summary of answer quality and consistency"
}}"""

    response = create_with_retry(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        messages=[{"role": "user", "content": review_prompt}],
    )

    for block in response.content:
        if block.type == "text":
            try:
                text = block.text
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0]
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0]
                return json.loads(text.strip())
            except json.JSONDecodeError:
                return {"raw_response": block.text, "parse_error": True}

    return {"error": "No text response from review"}


print("\n" + "=" * 60)
print("Part 6: Running consistency review...")
print("=" * 60)
review = review_answers(all_answers)
print(f"  Status: {review.get('status', '?')}")
print(f"  Issues found: {len(review.get('issues', []))}")
print(f"  Overall: {review.get('overall_assessment', 'N/A')}")
for issue in review.get("issues", []):
    print(f"    [{issue.get('type')}] {issue.get('questions_involved', [])}: {issue.get('description', '')[:100]}")


# ============================================================
# Part 7: Export
# ============================================================
print("\n" + "=" * 60)
print("Part 7: Exporting final output...")
print("=" * 60)
final_output = {
    "rfp_name": "Sample RFP -- Agent Engineering Challenge",
    "total_questions": len(RFP_QUESTIONS),
    "answers": all_answers,
    "review": review,
    "metadata": {
        "model": "claude-sonnet-4-20250514",
        "knowledge_base_entries": len(KNOWLEDGE_BASE),
    },
}
export_path = "rfp_output.json"
with open(export_path, "w") as f:
    json.dump(final_output, f, indent=2)
print(f"  Exported to {export_path} ({len(json.dumps(final_output))} chars)")


# ============================================================
# Part 8: IMPLEMENTED -- Eval Assertions
# ============================================================
def run_evals(answers: list[dict]) -> dict:
    """Run quality assertions against agent output."""
    results = {"passed": 0, "failed": 0, "details": []}

    def assert_it(question, assertion, passed):
        results["details"].append({"question": question, "assertion": assertion, "passed": passed})
        if passed:
            results["passed"] += 1
        else:
            results["failed"] += 1

    for ans in answers:
        q_id = ans.get("question_id", "?")
        answer_text = ans.get("answer", "")

        assert_it(q_id, "has_sources", len(ans.get("sources", [])) > 0)
        assert_it(q_id, "valid_confidence", ans.get("confidence") in ("high", "medium", "low"))
        assert_it(q_id, "answer_has_substance (>100 chars)", len(answer_text) > 100)
        assert_it(q_id, "no_parse_error", not ans.get("parse_error", False))

    # Q3: pricing answer must contain dollar amounts
    q3 = next((a for a in answers if a.get("question_id") == "Q3"), None)
    if q3:
        assert_it("Q3", "pricing_contains_dollar_amounts", "$" in q3.get("answer", ""))

    # Q2: compliance answer mentions SOC 2 and FedRAMP
    q2 = next((a for a in answers if a.get("question_id") == "Q2"), None)
    if q2:
        lower = q2.get("answer", "").lower()
        assert_it("Q2", "mentions_soc2_and_fedramp", "soc 2" in lower and "fedramp" in lower)

    # Q5: EU answer mentions encryption
    q5 = next((a for a in answers if a.get("question_id") == "Q5"), None)
    if q5:
        lower = q5.get("answer", "").lower()
        assert_it("Q5", "eu_answer_mentions_encryption", "encrypt" in lower)

    # All 5 question IDs present
    q_ids = {a.get("question_id") for a in answers}
    assert_it("ALL", "all_question_ids_present", q_ids == {"Q1", "Q2", "Q3", "Q4", "Q5"})

    return results


print("\n" + "=" * 60)
print("Part 8: Running eval assertions...")
print("=" * 60)
eval_results = run_evals(all_answers)
print(f"  {eval_results['passed']} passed, {eval_results['failed']} failed")
for detail in eval_results["details"]:
    status = "PASS" if detail["passed"] else "FAIL"
    print(f"    [{status}] {detail['question']}: {detail['assertion']}")


# ============================================================
# Final Summary
# ============================================================
print("\n" + "=" * 60)
print("FINAL SUMMARY")
print("=" * 60)
print(f"  Questions answered : {len(all_answers)}/{len(RFP_QUESTIONS)}")
print(f"  Review status      : {review.get('status', '?')}")
print(f"  Issues flagged     : {len(review.get('issues', []))}")
print(f"  Evals passed       : {eval_results['passed']}/{eval_results['passed'] + eval_results['failed']}")
print(f"  Output file        : {export_path}")
print("=" * 60)
