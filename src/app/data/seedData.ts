export const SEED_VERSION = 8;

export const SEED_PROBLEM_STATEMENT = `NHS trusts face growing financial and reputational exposure from patient feedback they cannot analyse at scale. The 10 Year Health Plan (July 2025) directly ties trust income to patient ratings through clinical team payments, patient power payments, and publicly published league tables updated quarterly from summer 2025. Yet most trusts still rely on manual coding, sampled data, and disconnected reporting systems that prevent timely action. There is no NHS-native platform that combines AI-powered theme classification, closed-loop feedback management, and integration with clinical systems — leaving organisations unable to detect emerging risks early or demonstrate improvement to regulators and boards.`;

export const SEED_USER_SEGMENTS = {
  chiefNurse: {
    title: "Chief Nurse / Director of Patient Experience",
    imageUrl: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goals: "Walk into every board meeting knowing which services are at risk — before the board asks\nDemonstrate a functioning feedback intelligence process to CQC Well-Led inspectors\nProtect trust income tied to patient ratings under the 10 Year Health Plan\nReceive a red alert within 24 hours when any service crosses a risk threshold\nProduce a board-ready patient experience pack without manual preparation",
    painPoints: "Finding out about ward problems from the press or a complaint — never from data\nBoard packs take the quality team 2–3 days to compile manually every quarter\nNo single view across wards, specialties, and care settings in one place\nCQC asks for feedback evidence during inspections — gathering it takes weeks\nThe 10YHP payment linkage means a poor quarter now has direct income consequences",
    motivators: "A trust-wide risk dashboard that shows the top deteriorating wards at a glance\nAutomated board pack export — PDF ready for the meeting, no manual input\nReal-time alert when sentiment on any service drops below threshold\nOne-click CQC evidence pack showing feedback trends, themes, and actions taken\nConfidence that the quality team is acting on data, not intuition",
    opportunities: "MVP: Receive a 24-hour red alert when a ward crosses the risk threshold — with the top driving theme and a direct dashboard link\nMVP: Auto-generated board pack (PDF) covering trust-wide sentiment, top risks, and trend direction\nMVP: CQC evidence export showing all feedback processed, themes identified, and actions logged\nPost-MVP: Portfolio view linking patient experience scores to clinical outcomes and 10YHP payment exposure",
    videoUrl: ""
  },
  qualityManager: {
    title: "Quality Manager / Patient Experience Lead",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goals: "Process 100% of patient feedback comments — not a 10–20% sample\nSee the top 3 deteriorating wards at a glance without wading through every metric\nDrill from a risk alert down to the specific themes and verbatim comments driving it\nReduce quarterly manual FFT coding from 2–3 days to under 2 hours\nClose the loop: log an action against a theme and track whether scores improve",
    painPoints: "Spending 2–3 days every quarter manually coding FFT free-text in Excel\nSampling 10–20% of comments means real issues go undetected until too late\nAlert dashboards that show every ward above threshold — impossible to prioritise\nNo way to prove to the board that feedback led to measurable improvement\nCQC evidence preparation is a multi-week panic before every inspection",
    motivators: "Alert dashboard defaulting to the top 3 deteriorating wards only — no alert fatigue\nAI theme classification at 91%+ accuracy on real NHS FFT data\nDrilldown in 3 clicks: alert → theme → verbatim comments\nClosed-loop action log: log a response, track whether the score recovers\nCQC evidence pack generated in hours, not weeks",
    opportunities: "MVP: Top-3 alert dashboard — only the highest-risk wards shown by default, with a 'show all' toggle\nMVP: AI theme classification on 100% of FFT and NHS App comments — no manual coding\nMVP: Drilldown from alert to top 5 themes to representative verbatims (3–10 per theme)\nMVP: Basic board pack export (PDF) covering sentiment trends and alert history\nPost-MVP: Closed-loop 'You Said, We Did' workflow; integration with Datix, PALS, NHS App",
    videoUrl: ""
  },
  wardManager: {
    title: "Ward Manager / Service Line Lead",
    imageUrl: "https://images.unsplash.com/photo-1516841273335-e39b37888115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goals: "Receive a short email every Monday morning with last week's patient feedback — no login required\nSee the top 2 concerns and top 2 positives from my ward, not a headline score\nShare at least one positive patient comment with the team at the Monday huddle\nKnow what patients are saying before a concern escalates to a complaint\nSpend less than 3 minutes engaging with feedback on a 12-hour ward shift",
    painPoints: "Feedback arrives 4–6 weeks after a patient's stay — too late to address the issue or recognise the staff involved\nAggregated satisfaction scores tell me nothing about what specifically went wrong or right\nLogging into another system during a shift is not realistic — it simply will not happen\nPositive patient comments never reach the ward team — only complaints filter through\nFeeling that feedback is collected centrally but never acted on at ward level",
    motivators: "One email, Monday 08:00, no login — readable in under 3 minutes\nAlways contains at least one positive verbatim comment from a patient — this is non-negotiable for staff morale\nTop 2 concern themes are specific and actionable, not vague satisfaction scores\nA one-tap 'share with team' link so the digest can be forwarded to the ward WhatsApp\nKnowing that feedback from my ward is being read and acted on, not just collected",
    opportunities: "MVP: Weekly ward digest email — Monday 08:00, top 2 concerns + top 2 positives + 1 verbatim quote, magic link (no login, 7-day expiry)\nMVP: 'Share with team' one-tap link included in every digest\nPost-MVP: Pre-discharge feedback capture so ward managers see same-week comments\nPost-MVP: Ward comparison view — benchmark against similar wards to identify and share good practice\nPost-MVP: Ward-facing web dashboard (deprioritised from MVP — digest is the primary touchpoint)",
    videoUrl: ""
  }
};

const rich = (html: string) => html.trim();

export const SEED_MARKET_RESEARCH = [
  {
    id: 'artefact-market',
    title: 'Market & Competitor Analysis',
    description: 'The 10 Year Health Plan creates a step-change in the materiality of patient feedback. Trust income is now directly tied to patient ratings. 311 NHS trusts. £18–40M ARR addressable. 18–24 month competitive window.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Market Moment</h2>
<p>The 10 Year Health Plan (published July 2025) creates a step-change in the materiality of patient feedback. For the first time, trust income is directly tied to patient ratings through three mechanisms:</p>
<ul>
<li><strong>Clinical team payment</strong> tied to feedback scores</li>
<li><strong>Patient power payments</strong> — patients influence whether providers get paid in full</li>
<li><strong>Public league tables</strong> including patient ratings, updated quarterly from summer 2025</li>
</ul>
<p>The Medium Term Planning Framework (October 2025) already mandates all providers capture near-real-time feedback on at least 5 wards before patient discharge — this is a <strong>current compliance requirement</strong>, not a future risk.</p>
<h2>Addressable Market</h2>
<table>
<tr><th>Segment</th><th>Annual Opportunity</th><th>Window</th></tr>
<tr><td>~311 NHS trusts (acute, mental health, community, ambulance)</td><td>£18–40M ARR core NHS. Secondary: 42 ICBs</td><td>18–24 months before a US competitor makes a serious NHS push</td></tr>
</table>
<h2>Competitive Landscape</h2>
<table>
<tr><th>Competitor</th><th>AI Themes</th><th>Risk Alert</th><th>NHS Integrations</th><th>Board Output</th><th>Our Advantage</th></tr>
<tr><td>Qualtrics</td><td>Limited</td><td>✗</td><td>✗</td><td>Template</td><td>Generic; no NHS context, no FFT/PALS ingest, no early-warning logic</td></tr>
<tr><td>Civica / Meridio</td><td>✗</td><td>✗</td><td>✓ Strong</td><td>✗</td><td>Data capture only; no analytical layer. Potential integration partner.</td></tr>
<tr><td>Cemplicity</td><td>Basic NLP</td><td>✗</td><td>Partial</td><td>Charts only</td><td>Reporting-focused, not intelligence-focused. No anomaly alerting.</td></tr>
<tr><td>NRC Health</td><td>✓</td><td>Partial</td><td>✗</td><td>✓</td><td>US product; data residency mismatch. No NHS App integration.</td></tr>
<tr><td>In-house Power BI</td><td>✗</td><td>✗</td><td>Manual</td><td>Static</td><td>Dominant 'competitor' — manual, slow, sampled. 10YHP makes this untenable.</td></tr>
<tr><td><strong>Patient Feedback Intelligence</strong></td><td>✓ Full</td><td>✓ Core</td><td>✓ All sources</td><td>✓ AI-generated</td><td>Only product combining all four: ingest, understand, alert, act.</td></tr>
</table>
<h2>Tailwinds</h2>
<ul>
<li>10YHP makes feedback financially material — direct income linkage</li>
<li>NHS App generating 10× more ratings data than legacy FFT</li>
<li>CQC Well-Led inspections increasingly scrutinise feedback use</li>
<li>Every major care scandal cited unread patient feedback as a warning sign</li>
<li>ICB consolidation creates demand for system-level views</li>
<li>NHS England actively seeking market input for a 'holistic insight system'</li>
</ul>
<h2>Headwinds</h2>
<ul>
<li>NHS procurement cycles are 12–18 months</li>
<li>Data governance / IG requirements add complexity to onboarding</li>
<li>Existing Civica/Cerner contracts create inertia at the data layer</li>
<li>Budget pressure — trusts under financial recovery may defer spend</li>
<li>10YHP implementation timeline subject to political risk</li>
</ul>`)
  },
  {
    id: 'artefact-vmost',
    title: 'VMOST — Strategic Intent',
    description: 'Vision: A NHS where every patient\'s voice is heard in time to prevent harm. Mission: Turn unstructured patient feedback into real-time intelligence that trust boards can act on.',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>V — Vision</h2>
<p>A NHS where every patient's voice is heard in time to prevent harm — not in an inquiry, after the fact.</p>
<h2>M — Mission</h2>
<p>To turn unstructured NHS patient feedback into real-time intelligence that trust boards can act on — making the patient's voice measurable, comparable, and impossible to ignore.</p>
<h2>O — Objectives</h2>
<ul>
<li>Reduce median time-from-feedback-to-action at NHS trusts from ~90 days to under 7 days</li>
<li>Achieve 80% coverage of all structured and free-text feedback sources per trust within 12 months of go-live</li>
<li>Enable trusts to demonstrate measurable feedback-driven improvements for CQC inspections</li>
</ul>
<h2>S — Strategy</h2>
<p>Land with acute trusts where financial pressure from the 10YHP is most acute. Win on risk-alerting (a capability no incumbent offers) as the initial wedge.</p>
<h2>T — Tactics</h2>
<ul>
<li><strong>Auto-generated CQC evidence pack</strong> as immediate time-to-value for quality teams</li>
<li><strong>'You Said, We Did' output</strong> as trust-facing proof of ROI for renewal conversations</li>
</ul>`)
  },
  {
    id: 'artefact-okrs',
    title: 'OKRs — Year 1',
    description: 'Four objectives across product, commercial, technical, and feedback loop pillars. All key results are measurable, time-bound, and validated through the discovery phase.',
    thumbnail: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>O1 — Prove the product works at scale in a real NHS trust</h2>
<ul>
<li><strong>KR 1:</strong> 2 NHS trusts live on the platform with >80% of feedback sources ingested by end of Q2</li>
<li><strong>KR 2:</strong> Median time from feedback ingestion to surfaced theme &lt;24 hours (vs status quo of 30–90 days)</li>
<li><strong>KR 3:</strong> At least 1 confirmed early-warning alert validated by the trust as clinically meaningful by end of Q3</li>
<li><strong>KR 4:</strong> NPS from quality leads and chief nurses at pilot sites ≥ 45</li>
</ul>
<h2>O2 — Build the commercial foundation for scalable growth</h2>
<ul>
<li><strong>KR 1:</strong> ARR of £500k by end of Year 1, on a path to £2M by end of Year 2</li>
<li><strong>KR 2:</strong> At least 1 published case study co-authored with a reference trust, with quantified outcomes</li>
<li><strong>KR 3:</strong> Listed on G-Cloud and NHS procurement frameworks by end of Q3</li>
<li><strong>KR 4:</strong> 5 trusts in active procurement (at commercial terms stage) by end of Year 1</li>
</ul>
<h2>O3 — Establish technical and data infrastructure for scale</h2>
<ul>
<li><strong>KR 1:</strong> NHS App, FFT, PALS, and complaints integrations all production-ready by end of Q2</li>
<li><strong>KR 2:</strong> Platform achieves NHS DSP Toolkit compliance and DTAC assessment by end of Q1</li>
<li><strong>KR 3:</strong> AI theme classification accuracy ≥ 91% (validated against manual expert coding on 500-comment sample)</li>
<li><strong>KR 4:</strong> Platform uptime ≥ 99.5% on a rolling 90-day basis from Q2 onwards</li>
</ul>
<h2>O4 — Create clear feedback loops from insight to improvement</h2>
<ul>
<li><strong>KR 1:</strong> 'You Said, We Did' report used by at least 1 trust to communicate improvement back to patients</li>
<li><strong>KR 2:</strong> Board-ready pack exported and used in a trust board meeting by at least 2 pilot trusts</li>
<li><strong>KR 3:</strong> At least 1 trust cites platform outputs as CQC evidence in a Well-Led assessment</li>
</ul>`)
  },
  {
    id: 'artefact-roadmap',
    title: 'Product Roadmap — Now / Next / Later',
    description: 'Phased delivery around the 10YHP implementation timeline. DTAC compliance is a prerequisite to everything — Q1 non-negotiable. Risk-alerting goes live with the MVP as the budget justification in procurement.',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<p><strong>Key sequencing decision:</strong> DSP Toolkit and DTAC compliance are prerequisite to everything — no NHS trust will sign a data processing agreement without them. These are Q1 deliverables, not Q2. Risk-alerting should go live at the same time as the MVP because it's the feature that justifies the budget in procurement conversations.</p>
<h2>Ingest Layer</h2>
<table>
<tr><th>NOW — Q1–Q2 Foundation</th><th>NEXT — Q3–Q4 Scale</th><th>LATER — Year 2+ Expand</th></tr>
<tr><td>NHS App ratings · FFT free text (API + CSV) · CSV complaints upload</td><td>PALS API · Survey platform connectors · Datix integration</td><td>Real-time streaming ingest · ICB aggregation layer</td></tr>
</table>
<h2>Understand Layer</h2>
<table>
<tr><th>NOW</th><th>NEXT</th><th>LATER</th></tr>
<tr><td>AI theme classification · Sentiment scoring · Ward/pathway mapping</td><td>Severity classification · Multi-language support · Trend detection (QoQ)</td><td>Cross-trust benchmarking · Predictive risk modelling</td></tr>
</table>
<h2>Alert Layer</h2>
<table>
<tr><th>NOW</th><th>NEXT</th><th>LATER</th></tr>
<tr><td>Sentiment deterioration alerts · Weekly digest emails</td><td>Threshold-based real-time alerts · Slack/Teams integration · Alert audit trail</td><td>Proactive risk scores · Serious incident correlation</td></tr>
</table>
<h2>Act Layer</h2>
<table>
<tr><th>NOW</th><th>NEXT</th><th>LATER</th></tr>
<tr><td>Board-ready pack (PDF) · CQC evidence export</td><td>'You Said, We Did' generator · Improvement action tracker · API for existing BI tools</td><td>Closed-loop improvement tracking · Patient-facing outcomes reporting</td></tr>
</table>
<h2>Platform</h2>
<table>
<tr><th>NOW</th><th>NEXT</th><th>LATER</th></tr>
<tr><td>DSP Toolkit compliance · DTAC assessment · Role-based access</td><td>G-Cloud listing · SSO / NHS Login · Audit logging</td><td>Multi-trust tenancy · On-premise deployment option</td></tr>
</table>`)
  },
  {
    id: 'artefact-users',
    title: 'Target Users — Primary & Secondary',
    description: 'Three primary daily users (Chief Nurse, Quality Manager, Ward Manager) plus four secondary output consumers. Economic buyer vs end user distinction is critical for renewal.',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Primary Users — Daily / Weekly Platform Interaction</h2>
<table>
<tr><th>Chief Nurse / Director of Patient Experience</th><th>Quality Manager / Patient Experience Lead</th><th>Ward Manager / Service Line Lead</th></tr>
<tr><td>Strategic owner · Board-facing · Financially exposed under 10YHP</td><td>Operational owner · Daily platform user · Process builder</td><td>Frontline responder · Alert recipient · Advocate or blocker</td></tr>
<tr><td><ul><li>Know which wards are deteriorating before board meetings</li><li>Demonstrate feedback-driven improvement to CQC</li><li>Produce board packs in minutes, not days</li><li>Early warning of income exposure from 10YHP</li></ul></td><td><ul><li>Analyse 100% of comments — not a sample</li><li>Theme drilldown to verbatim comments</li><li>CQC evidence pack in hours, not weeks</li><li>Closed loop: feedback → action → outcome tracking</li></ul></td><td><ul><li>Weekly email digest — no login required</li><li>Specific, actionable themes not just a score</li><li>Positive comment highlights for staff morale</li><li>Simple enough for a 12-hour ward shift</li></ul></td></tr>
</table>
<h2>Secondary Users — Receive Outputs, Do Not Configure</h2>
<table>
<tr><th>User</th><th>What They Receive</th></tr>
<tr><td><strong>Trust Board / NED</strong></td><td>Auto-generated board pack. One page with trend, risk flags, and narrative — not raw data.</td></tr>
<tr><td><strong>CQC Inspectors</strong></td><td>Evidence pack as part of Well-Led inspection. Validates the trust has a functioning feedback intelligence process.</td></tr>
<tr><td><strong>ICB Analytics Teams</strong></td><td>Year 2+ user. System-level rollup across trusts to spot network-wide themes and outlier providers.</td></tr>
<tr><td><strong>Patients (indirect)</strong></td><td>'You Said, We Did' output — proof that their feedback was heard and acted on. Drives future participation.</td></tr>
</table>
<h2>Economic Buyer vs End User</h2>
<p>Chief Nurse or CFO signs the contract (cares about financial risk and CQC outcomes). Quality Manager and Ward Manager are the daily users (care about workflow and time-saving). If the end user finds it burdensome, the economic buyer hears it at renewal.</p>`)
  },
  {
    id: 'artefact-jtbd',
    title: 'Jobs-to-be-Done Canvases',
    description: 'MVP-scoped JTBD canvases for all three personas. Updated post-discovery with switch triggers, workarounds, desired outcomes, and MVP feature mapping.',
    thumbnail: 'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Chief Nurse / Director of Patient Experience</h2>
<blockquote>"I need to know which services are in trouble before I walk into the board meeting — not because the media told me, and not because a complaint landed on my desk." — Chief Nurse, large acute trust (user interview, Round 1)</blockquote>
<h3>Core Job Statement</h3>
<p>When I am accountable for patient experience and trust income across a large NHS organisation, I want to be alerted to deteriorating services within 24 hours — with the driving theme identified — so I can act before a ward-level problem becomes a board-level crisis or a CQC finding.</p>
<table>
<tr><th>Functional Job</th><th>Emotional Job</th><th>Social Job</th></tr>
<tr><td>Get a risk alert when a service deteriorates, with enough context to act on it immediately</td><td>Feel in control and informed — not reactive and surprised</td><td>Be seen by the board and CQC as running a trust that takes patient feedback seriously</td></tr>
</table>
<h3>Current Workarounds (the pain we replace)</h3>
<ul>
<li>Administrator manually samples 10–20% of FFT comments each quarter and codes them in Excel</li>
<li>Monthly committee review of complaints — issues surface 4–8 weeks after they occurred</li>
<li>Finding out about ward problems from the press, a Freedom of Information request, or a coroner's letter</li>
<li>Producing CQC Well-Led evidence by manually collating spreadsheets and Word documents — 2–3 weeks of quality team time per inspection</li>
<li>Board patient experience pack prepared manually by the quality team — typically 2 days of work each quarter</li>
</ul>
<h3>Desired Outcomes (what success looks like)</h3>
<ul>
<li>Receive a red alert within 24 hours when any service crosses the risk threshold — containing: service name, threshold crossed, top driving theme, direct dashboard link</li>
<li>Walk into the board with an auto-generated PDF covering trust-wide sentiment trends, top 3 risks, and week-on-week direction — no manual preparation</li>
<li>Produce a CQC evidence export in under an hour showing all feedback processed, themes identified, and actions taken</li>
<li>Demonstrate to NHSE and inspectors that the trust has a functioning, real-time feedback intelligence process</li>
</ul>
<h3>Switch Triggers (what makes them buy)</h3>
<ul>
<li>A near-miss where patient feedback data existed but was not seen in time — ward problem went to the press before it reached the board</li>
<li>An upcoming CQC Well-Led inspection where current patient experience evidence is thin or manually assembled</li>
<li>Finance Director flagging 10YHP payment exposure — patient ratings now directly linked to trust income from summer 2025</li>
<li>MTPF compliance mandate: near-real-time ward feedback monitoring is already required from October 2025</li>
</ul>
<h3>MVP Feature Mapping</h3>
<table>
<tr><th>Job</th><th>MVP Feature</th></tr>
<tr><td>Know when a service deteriorates</td><td>24-hour red alert email with threshold, driving theme, and dashboard link</td></tr>
<tr><td>Prepare for board meeting</td><td>Auto-generated PDF board pack — sentiment trend, top 3 risks, direction indicator</td></tr>
<tr><td>Respond to CQC inspectors</td><td>One-click CQC evidence export covering all feedback, themes, and action log</td></tr>
</table>

<h2>Quality Manager / Patient Experience Lead</h2>
<blockquote>"I spend two days every quarter manually coding FFT comments in Excel. I know there must be a better way — but nobody has built one that actually works with real NHS free-text data." — Quality Manager, acute trust (user interview, Round 1)</blockquote>
<h3>Core Job Statement</h3>
<p>When I am responsible for turning patient feedback into actionable intelligence for clinical and executive audiences, I want to see the top 3 deteriorating wards at a glance and drill to the specific themes and verbatims driving each — so I can prioritise my response and stop spending days on manual data processing.</p>
<table>
<tr><th>Functional Job</th><th>Emotional Job</th><th>Social Job</th></tr>
<tr><td>Process 100% of feedback automatically; surface the highest-risk wards without alert fatigue</td><td>Feel like a strategic analyst, not a data entry clerk</td><td>Be trusted by the Chief Nurse and board to provide reliable, timely intelligence — not sampled guesswork</td></tr>
</table>
<h3>Current Workarounds (the pain we replace)</h3>
<ul>
<li>Exports FFT responses to Excel; manually reads and codes each free-text comment into themes</li>
<li>Samples 10–20% of comments — the majority go unread every quarter</li>
<li>Dashboard shows every ward above threshold — no way to prioritise; alert fatigue sets in immediately (discovery finding F3)</li>
<li>Creates CQC evidence pack by copy-pasting tables into Word — 2–3 weeks of work before every inspection</li>
<li>No systematic way to show that an improvement action changed patient feedback scores</li>
</ul>
<h3>Desired Outcomes (what success looks like)</h3>
<ul>
<li>See only the top 3 deteriorating wards by default — with a 'show all' toggle for when that's needed</li>
<li>Drill from an alert to the top 5 driving themes, then to 3–10 representative verbatim comments — in 3 clicks</li>
<li>AI classifies 100% of FFT and NHS App comments at 91%+ accuracy — no manual coding</li>
<li>Generate a board-ready PDF export in minutes, not days</li>
<li>Log an action against a theme and see whether the ward score improves in the following weeks</li>
</ul>
<h3>Switch Triggers (what makes them buy)</h3>
<ul>
<li>Quarter-end crunch: 2 days of manual coding ahead, board pack due in a week</li>
<li>A ward issue that escalated to a complaint — and the free-text warning signs were in the unread 80% of comments</li>
<li>CQC inspection scheduled — quality team needs evidence that feedback is being systematically acted on</li>
<li>Chief Nurse asking for a real-time picture of which wards are struggling — current tools can't provide it</li>
</ul>
<h3>MVP Feature Mapping</h3>
<table>
<tr><th>Job</th><th>MVP Feature</th></tr>
<tr><td>Prioritise without alert fatigue</td><td>Alert dashboard — top 3 deteriorating wards by default, 'show all' toggle</td></tr>
<tr><td>Understand what's driving the risk</td><td>Theme drilldown: alert → top 5 themes → 3–10 verbatim comments per theme</td></tr>
<tr><td>Process all feedback, not a sample</td><td>AI theme classification at 91%+ accuracy on 100% of FFT and NHS App comments</td></tr>
<tr><td>Report to board and CQC</td><td>PDF board pack export covering sentiment trend, alerts, and theme breakdown</td></tr>
</table>

<h2>Ward Manager / Service Line Lead</h2>
<blockquote>"Send me an email. One. On Monday morning. Short. Tell me what patients said about my ward last week — the good and the bad. I'll read that. I will not log into another system." — Ward Manager, A&amp;E (user interview, Round 1)</blockquote>
<h3>Core Job Statement</h3>
<p>When I am running a ward and accountable for patient experience on my patch, I want to know what patients said about my ward last week — including the positive comments — delivered to my inbox before the Monday shift, so I can address concerns early and give my team the recognition they deserve.</p>
<table>
<tr><th>Functional Job</th><th>Emotional Job</th><th>Social Job</th></tr>
<tr><td>Receive a ward-specific, readable weekly summary with no login and no new system to learn</td><td>Feel connected to patient feedback without it adding to an already overloaded shift</td><td>Share positive patient comments with the team — build a culture where staff feel their work is seen and valued</td></tr>
</table>
<h3>Current Workarounds (the pain we replace)</h3>
<ul>
<li>Feedback arrives 4–6 weeks after a patient's stay — too late to recognise the staff involved or address the issue</li>
<li>Aggregated satisfaction scores (e.g. "87% positive") give no indication of what specifically went wrong or right</li>
<li>Logging into another system during a 12-hour ward shift is not realistic — confirmed by all ward managers in Round 1 interviews</li>
<li>Positive patient comments are filtered out centrally — only complaints and concerns reach the ward</li>
<li>Feedback collected at trust level feels disconnected from day-to-day ward reality</li>
</ul>
<h3>Desired Outcomes (what success looks like)</h3>
<ul>
<li>One email, Monday 08:00, readable in under 3 minutes — no login, no app, no new system</li>
<li>Top 2 concern themes from last week — specific and actionable, not headline scores</li>
<li>Top 2 positive themes from last week — named so they can be shared with the team</li>
<li>At least 1 positive verbatim patient comment in every digest — this is structural, not optional (discovery insight)</li>
<li>A one-tap 'share with team' link so the digest can be forwarded to the ward WhatsApp group in seconds</li>
</ul>
<h3>Switch Triggers (what makes them engage)</h3>
<ul>
<li>A ward manager who reads the Monday digest and shares a patient quote at huddle — peers notice and want the same</li>
<li>A concern in the digest that the ward manager addresses the same week — before it becomes a formal complaint</li>
<li>Positive comments reach staff who had no idea patients felt that way — staff morale impact is immediate</li>
</ul>
<h3>Key Design Constraint (non-negotiable)</h3>
<p>Any touchpoint that requires a login, an app download, or more than 3 minutes of attention during a ward shift will be abandoned within two weeks. The digest is the product for this persona. A ward-facing web dashboard is post-MVP.</p>
<h3>MVP Feature Mapping</h3>
<table>
<tr><th>Job</th><th>MVP Feature</th></tr>
<tr><td>Know what patients said last week</td><td>Monday 08:00 digest email — top 2 concerns + top 2 positives + 1 verbatim quote</td></tr>
<tr><td>No login friction</td><td>Magic link in email (7-day expiry) — no account, no password, no app</td></tr>
<tr><td>Share with the team</td><td>One-tap 'share with team' link included in every digest</td></tr>
</table>`)
  },
  {
    id: 'artefact-prd',
    title: 'MVP PRD — Risk Alert Module',
    description: 'Version 0.1 · Discovery validated · 4 post-discovery pivots applied. Scope: AI theme classification, sentiment scoring, top-3 alert dashboard, weekly ward digest, board pack export.',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Problem Statement</h2>
<p>NHS trusts receive thousands of patient feedback comments per month across FFT, NHS App, PALS, and complaints. No trust has the capacity to read all of it. Emerging patient experience problems go undetected until they escalate to a serious incident, a formal complaint, or a CQC inspection finding. Under the 10YHP and the Medium Term Planning Framework, trusts now face direct income consequences for poor feedback scores and a compliance mandate for near-real-time ward monitoring.</p>
<h2>MVP Scope</h2>
<table>
<tr><th>✓ In Scope (MVP)</th><th>✗ Out of Scope (MVP)</th></tr>
<tr><td><ul><li>NHS App ratings + FFT free-text (CSV + API ingest)</li><li>AI theme classification on every comment (not sampled)</li><li>Sentiment scoring per comment, aggregated per ward</li><li>Trend detection: week-on-week and rolling 4-week change</li><li>Alert engine: top-3 deteriorating wards (post-discovery pivot)</li><li>Weekly digest email to ward managers (no login required)</li><li>Alert dashboard for Quality Manager — web app</li><li>Drilldown: alert → theme → verbatim comments</li><li>Basic board-pack export (PDF)</li><li>Role-based access: QM + Chief Nurse views</li></ul></td><td><ul><li>PALS, Datix, complaints integrations (Next phase)</li><li>Survey platform connectors (Next)</li><li>'You Said, We Did' generator (Next)</li><li>Improvement action tracker (Next)</li><li>ICB / cross-trust aggregation (Later)</li><li>Real-time streaming ingest (Later)</li><li>Multi-language support (Later)</li><li>Ward-facing web app (Later — digest is the product for WMs)</li></ul></td></tr>
</table>
<h2>Must-Have User Stories</h2>
<p><strong>US-01:</strong> As a Quality Manager, I want to see a dashboard showing the <strong>top 3 wards</strong> with the biggest sentiment deterioration in the last 4 weeks — not all wards above threshold — so I can prioritise my attention without alert fatigue.</p>
<p><strong>US-02:</strong> As a Quality Manager, I want to drill from an alert into the specific themes driving the change, so I know what to address. Theme view shows top 5 themes; each theme shows representative verbatim comments (min 3, max 10).</p>
<p><strong>US-03:</strong> As a Ward Manager, I want a weekly email digest with last week's patient feedback about my ward — including positive comments — delivered without needing to log in. Sent every Monday 08:00. Min 1 positive verbatim. Never silently skipped.</p>
<p><strong>US-04:</strong> As a Chief Nurse, I want an immediate alert when any service crosses the red threshold. Alert within 24 hours. Contains: service name, threshold crossed, top driving theme, direct link to dashboard.</p>
<h2>Non-Functional Requirements</h2>
<table>
<tr><th>Requirement</th><th>Specification</th></tr>
<tr><td>Data residency</td><td>All patient data processed and stored within UK (NHS Azure UK South / UK West). No data transits outside UK.</td></tr>
<tr><td>Compliance</td><td>DTAC assessment complete before any trust data onboarded. UK GDPR Article 9. DPIA signed by trust IG team.</td></tr>
<tr><td>Availability</td><td>99.5% uptime on a rolling 90-day basis. Planned maintenance outside 06:00–22:00 Mon–Fri.</td></tr>
<tr><td>Performance</td><td>Dashboard load &lt;2s. Alert emails within 24h. CSV processing &lt;5 min for 5,000 rows.</td></tr>
<tr><td>AI accuracy</td><td>Theme classification ≥91% overall, ≥88% per theme. No comment suppressed — low-confidence flagged, not discarded.</td></tr>
<tr><td>Accessibility</td><td>WCAG 2.1 AA. Colour is never the sole means of conveying alert status.</td></tr>
</table>`)
  },
  {
    id: 'artefact-research-plan',
    title: 'Discovery Research Plan — MVP Demo',
    description: 'Five-stage discovery plan scoped to the MVP demo: user interviews (1 round), feedback analysis, tech discovery, ideation & hypotheses, and design prototypes.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Scope — What This Discovery Covers</h2>
<p>This plan is scoped to what is required to confidently build and demonstrate the MVP. It does not attempt to validate every future feature — only the assumptions that would invalidate the MVP if wrong. The MVP scope (AI theme classification, sentiment alerting, ward digest, board pack) is treated as fixed input; discovery informs <em>how</em> to build it, not <em>whether</em> to.</p>
<h2>Stage 1 — User Interviews (1 Round)</h2>
<p><strong>Who:</strong> 6–9 participants — 2–3 Chief Nurses, 2–3 Quality Managers, 2–3 Ward Managers across 2–3 NHS trusts.</p>
<p><strong>Purpose:</strong> Validate core pain points, understand current feedback workflows, and pressure-test the MVP feature set against real daily needs.</p>
<ul>
<li>Recruit participants across trust types (acute, community, mental health)</li>
<li>Semi-structured interview guide — 45 minutes per session</li>
<li>Chief Nurse focus: board accountability, CQC anxiety, 10YHP income exposure</li>
<li>Quality Manager focus: current manual process, sampling rates, what a useful alert looks like</li>
<li>Ward Manager focus: digest format, time constraints, positive feedback appetite</li>
<li>Capture verbatim quotes; note surprises and contradictions</li>
<li>Synthesise into 5–7 key insight themes within 48 hours of final interview</li>
</ul>
<h2>Stage 2 — Feedback Analysis (Platform &amp; Dashboard Scope)</h2>
<p><strong>Purpose:</strong> Analyse interview findings and existing NHS FFT data to confirm and sharpen the MVP platform and dashboard design. Keep scope tightly bounded to what the MVP must deliver — no scope creep.</p>
<ul>
<li>Affinity map all interview observations into clusters</li>
<li>Cross-reference insight themes against MVP feature list — confirm each feature has a user need behind it</li>
<li>Identify any MVP features that lack evidence — flag for de-scoping or deferral</li>
<li>Define must-have dashboard views for each persona (Chief Nurse, Quality Manager)</li>
<li>Validate alert threshold logic against real user mental models of "urgent" vs "monitor"</li>
<li>Produce a one-page MVP scope confirmation document as a shared team reference</li>
</ul>
<h2>Stage 3 — Tech Discovery</h2>
<p><strong>Purpose:</strong> Evaluate technical options and confirm feasibility for the specific capabilities needed in the MVP. De-risk architecture decisions before build begins.</p>
<ul>
<li>NHS data ingest: FFT CSV/API, NHS App ratings — format audit across 2 trusts</li>
<li>AI/NLP model selection: evaluate options for theme classification on NHS free-text (accuracy vs cost vs latency)</li>
<li>Run a classification spike on 300–500 real FFT comments; validate against expert-coded ground truth</li>
<li>Data residency and IG requirements: confirm UK cloud hosting approach and DTAC timeline</li>
<li>Build vs buy assessment for key MVP components (alerting engine, digest delivery)</li>
<li>Document architecture decisions in a lightweight ADR (Architecture Decision Record)</li>
</ul>
<h2>Stage 4 — Ideation &amp; Hypothesis Creation</h2>
<p><strong>Purpose:</strong> Translate interview insights and tech findings into a prioritised set of testable hypotheses for the MVP. Use structured methods to surface the right problems before jumping to solutions.</p>
<ul>
<li>Run a focused HMW (How Might We) session using interview insights as prompts</li>
<li>Map jobs-to-be-done for each primary persona against MVP feature candidates</li>
<li>Generate a hypothesis backlog: "We believe [feature] will [outcome] for [persona]. We'll know this is true when [signal]."</li>
<li>Score hypotheses against MVP goals using impact × confidence</li>
<li>Select top 3–5 hypotheses to carry into prototype design</li>
<li>Document out-of-scope hypotheses to revisit post-MVP</li>
</ul>
<h2>Stage 5 — Design Prototypes</h2>
<p><strong>Purpose:</strong> Translate the top MVP hypotheses into testable low and mid-fidelity prototypes. Focus on the core dashboard and key user flows to gather directional feedback before engineering investment.</p>
<ul>
<li>Wireframe the alert dashboard (Quality Manager primary view) — top-3 deteriorating wards default</li>
<li>Wireframe the drilldown flow: alert → theme → verbatim comments</li>
<li>Wireframe the weekly ward digest email format</li>
<li>Build mid-fidelity interactive prototype of the dashboard in Figma</li>
<li>Run 2–3 informal walkthroughs with Quality Managers to gather directional feedback</li>
<li>Iterate once based on feedback; lock prototype for sprint planning reference</li>
<li>Prototype sign-off by product and design lead before development begins</li>
</ul>`)
  },
  {
    id: 'artefact-findings',
    title: 'Discovery Findings Report — All 4 Gates',
    description: 'VERDICT: BUILD — with 4 targeted pivots. All four decision gates pass. 14 interviews · 9 prototype sessions · 1 technical spike · 8 weeks. One IG pivot required (on-premise option). 1 LOI signed at £45k.',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Verdict: BUILD — with 4 targeted pivots</h2>
<p>All four decision gates pass. The problem is real, well-evidenced, and currently unsolved at scale. The 10YHP has materially increased urgency. NHS England is actively seeking market input on a 'sustainable and holistic insight system.' The technical spike confirms AI classification is achievable. One IG pivot required (on-premise option). Proceed to sprint planning with revised assumptions.</p>
<h2>Top 5 Findings That Change What We Build</h2>
<p><strong>F1 — IG gate passes, conditionally.</strong> 3 of 4 IG leads would approve a cloud processor, but only with UK data residency and DPIA completed before any patient data is transferred. One trust requires an on-premise processing option as a hard condition.</p>
<p><strong>F2 — AI accuracy reaches 89% out-of-the-box.</strong> Sentiment accuracy is strong (94%). Theme accuracy drags to 86% on dignity/respect and multi-theme comments. A revised taxonomy splitting 'dignity and respect' into two concrete sub-categories closes the gap. Estimated: 2 days of engineering.</p>
<p><strong>F3 — Alert fatigue is the #1 risk — from too many true positives, not false ones.</strong> Quality Managers didn't reject false positives; they rejected too many true positives. Only the top-3 deteriorating wards should appear in red by default.</p>
<p><strong>F4 — Ward managers will not log in — ever.</strong> All four ward managers confirmed this unprompted. The email digest is the only viable touchpoint. It must always contain at least one positive comment.</p>
<p><strong>F5 — The real near-term driver is compliance, not payment linkage.</strong> The 10YHP patient power payment is in trial phase. However, the Medium Term Planning Framework already mandates near-real-time feedback. Lead with compliance in sales conversations.</p>
<h2>Technical Spike Results</h2>
<table>
<tr><th>Theme</th><th>Accuracy</th><th>Notes</th></tr>
<tr><td>Communication</td><td>92%</td><td>Clear language cues. Model distinguishes well from dignity.</td></tr>
<tr><td>Environment &amp; facilities</td><td>95%</td><td>Most reliable. Highly concrete vocabulary (noise, cleanliness, food).</td></tr>
<tr><td>Waiting &amp; delays</td><td>93%</td><td>Time language is specific and consistent.</td></tr>
<tr><td>Clinical care &amp; treatment</td><td>89%</td><td>Main error: confusing clinical skill feedback with staffing levels.</td></tr>
<tr><td>Staffing &amp; attitudes</td><td>87%</td><td>Overlaps with communication and dignity themes.</td></tr>
<tr><td>Dignity &amp; respect</td><td>76%</td><td>Weakest category. Dignity language is often euphemistic. Requires taxonomy split.</td></tr>
<tr><td><strong>Sentiment (overall)</strong></td><td><strong>94%</strong></td><td>Strong. Positive/negative/neutral classification highly reliable.</td></tr>
<tr><td><strong>Overall accuracy</strong></td><td><strong>89%</strong></td><td>Short of 92% target. Taxonomy change closes to 91–93% without fine-tuning.</td></tr>
</table>
<h2>Gate Verdicts</h2>
<table>
<tr><th>Gate</th><th>Verdict</th><th>Evidence &amp; Conditions</th></tr>
<tr><td>IG / CISO Gate</td><td>✓ PASS</td><td>3/4 IG leads approve with conditions: UK residency, ISO 27001, Cyber Essentials Plus, DPIA. 1 trust requires on-premise — add as Year 2 option.</td></tr>
<tr><td>AI Accuracy Gate</td><td>✓ PASS (conditional)</td><td>89% overall vs 85% gate criterion. Passes gate. 92% PRD target needs taxonomy change (2-day task).</td></tr>
<tr><td>Alert Design Gate</td><td>✓ PASS</td><td>3/3 QMs tested said they would act on a red alert — but only on the top-3 design. All-wards design failed unanimously.</td></tr>
<tr><td>Commercial Gate</td><td>✓ PASS</td><td>1 LOI signed at £45k (North West acute trust). 2 trusts at commercial terms stage. Pipeline projects £200k ARR by Year 1 end.</td></tr>
</table>
<h2>PRD Pivots Before Sprint 1</h2>
<p><strong>Pivot 1 — Alert UX:</strong> Default alert dashboard shows top-3 deteriorating wards only. All wards accessible via 'show all' toggle. Alert fatigue confirmed as primary adoption risk.</p>
<p><strong>Pivot 2 — Ward Manager interface:</strong> Ward-facing web app deprioritised from MVP to Next phase. Email digest elevated to P0. Add 'share with team' one-tap link. Magic link expiry: 7 days.</p>
<p><strong>Pivot 3 — AI taxonomy:</strong> Split 'dignity and respect' into: 'Privacy and dignity' and 'Feeling dismissed or not listened to.' Revise accuracy target to ≥91% overall.</p>
<p><strong>Pivot 4 — Architecture:</strong> Add on-premise deployment option to architecture design (Year 2 delivery, architecture decision now). Post-Synnovis risk appetite shift means ~15–20% of large acute trusts may require this.</p>
<h2>Immediate Actions Before Sprint 1</h2>
<ol>
<li>Rewrite US-01 and US-03 in the PRD to reflect top-3 alert default and email-primary ward manager interface.</li>
<li>Begin DTAC and DPIA process for pilot trust immediately. Target: DPIA first draft to trust IG team within 3 weeks.</li>
<li>Apply taxonomy change and re-run classification on 500-comment validation set. Confirm ≥91% before production code is written.</li>
<li>Schedule ward naming mapping workshop with pilot trust Quality Manager before sprint planning.</li>
<li>Begin G-Cloud application process. Takes 4–8 weeks — start now, not after first contract closes.</li>
<li>Prepare Finance Director ROI pack: staff hours saved + CQC inadequate rating cost avoidance + 10YHP compliance framing.</li>
</ol>`)
  },
  {
    id: 'artefact-interview-scripts',
    title: 'User Interview Scripts — Round 1',
    description: 'Five-question interview scripts with persona responses for Chief Nurse, Quality Manager, and Ward Manager. Validates MVP scope and discovery assumptions.',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>About These Interviews</h2>
<p>These scripts were used in Round 1 of user discovery — five structured but conversational questions per persona. The goal was not to validate a solution, but to understand the real shape of the problem before anything was built. Responses are composites drawn from interviews conducted across three NHS trusts. All names are illustrative.</p>
<p><em>Interviewer tone throughout: curious, unhurried, non-leading. We are here to listen, not to pitch.</em></p>

<hr/>

<h2>Interview 1 — Sarah, Chief Nurse / Director of Patient Experience</h2>
<p><strong>Context:</strong> Sarah leads patient experience strategy for a large acute trust with 38 wards and approximately 600,000 patient contacts per year. She reports directly to the CEO and presents to the board quarterly. We met her at her trust offices, 45 minutes before a board subcommittee she needed to prepare for.</p>
<p><em>"Thank you for making time today, Sarah — we know how stretched things are. We're trying to understand what life is actually like on your side before we make any assumptions about what might help. There are no right answers here."</em></p>

<h3>Q1 · How do you currently find out when something is going wrong with patient experience on a particular ward?</h3>
<blockquote>"Honestly? In the worst cases, from the local paper. Or a Freedom of Information request arrives and that's how I find out a complaint pattern existed. The formal route is the monthly quality and safety committee — but that's six, sometimes eight weeks behind. By then you're managing an aftermath, not a situation."</blockquote>
<p><strong>What this validates:</strong> The feedback lag is real and the consequence of missing it is reputational, not just operational. The board meeting is a forcing function — Sarah needs intelligence before she walks in, not after.</p>

<h3>Q2 · When you do receive patient feedback data, what does it look like and what do you do with it?</h3>
<blockquote>"We get a quarterly summary from the quality team — usually a PowerPoint, maybe 12 slides. It has trust-level FFT scores, a few bar charts by division, and some manually selected verbatim quotes. It takes them about two days to put together. I scan it before the board meeting, flag anything that looks like a trend, and then ask the quality team to dig deeper. Which takes another week."</blockquote>
<p><strong>What this validates:</strong> The board pack is manual, slow, and sampled. Sarah is not the one who should be producing it — and she knows it. An auto-generated PDF that replaces two days of quality team work lands directly on her core job.</p>

<h3>Q3 · The 10 Year Health Plan ties trust income to patient ratings. Has that changed how your board talks about patient experience?</h3>
<blockquote>"Yes and no. The board has always cared about CQC ratings — that's been the main driver. But the payment linkage has made the finance director much more interested in patient experience data than they used to be. Which is actually useful. It means when I ask for resource, there's a financial case that someone else is making for me now."</blockquote>
<p><strong>What this validates:</strong> Compliance and CQC risk are the primary switch triggers — not 10YHP payments, which are still perceived as distant. Lead with compliance in the demo narrative.</p>

<h3>Q4 · If you received an alert that a ward's patient sentiment had dropped significantly — what would you need to see in that alert to actually act on it?</h3>
<blockquote>"I'd need to know which ward, obviously. But I'd also need to know why — not just 'sentiment is down 12 points.' Is it a staffing issue? A specific doctor? A facilities problem? If it just says 'worse,' I'll pass it to the quality team and wait. If it tells me the top theme is 'feeling dismissed by staff,' I can have a different conversation with the ward manager that afternoon."</blockquote>
<p><strong>What this validates:</strong> Alerts need the driving theme to be actionable. A score change alone is insufficient. The MVP alert design — threshold + top theme + dashboard link — is exactly right.</p>

<h3>Q5 · What would make you feel confident that a patient feedback platform was actually working — not just installed?</h3>
<blockquote>"If I walked into a board meeting and the chair asked about patient experience on a particular ward — and I already knew the answer before they finished the question. That would tell me something had fundamentally changed. Right now, that never happens. I'm always in reactive mode."</blockquote>
<p><strong>What this validates:</strong> The primary success metric for Sarah is proactive awareness — knowing before being asked. The 24-hour alert and board pack export together deliver this. This is the demo's closing line.</p>

<hr/>

<h2>Interview 2 — James, Quality Manager / Patient Experience Lead</h2>
<p><strong>Context:</strong> James has worked in patient experience quality roles for nine years across two trusts. He manages a team of two and is responsible for FFT analysis, complaints coordination, and producing evidence for CQC inspections. We met him over a video call — he was visibly tired and mentioned he had just finished a quarterly FFT report.</p>
<p><em>"Really appreciate you joining us, James — especially given the timing. We've heard from a few people that the quarterly report cycle is exhausting. We'd love to understand what that actually looks like from your side."</em></p>

<h3>Q1 · Walk us through what your quarterly feedback cycle actually looks like — from the raw data arriving to something landing in front of the board.</h3>
<blockquote>"So we export the FFT responses from the NHS portal — usually around 2,000 comments per quarter. I open them in Excel. I read each one and manually assign it to a theme category. Communication, environment, waiting times, clinical care, dignity and respect. That takes me about two days. Then I build the summary charts, write the narrative, and send it to the Chief Nurse. She has feedback, I revise it, and it goes to the board. Start to finish, about two and a half weeks."</blockquote>
<p><strong>What this validates:</strong> The manual coding process is exactly as painful as assumed. Two days per quarter on a task that AI can do in seconds. The time-to-value case for AI classification is immediate and concrete.</p>

<h3>Q2 · You mentioned you read each comment. Are you reading all of them, or is there some selection happening?</h3>
<blockquote>"I try to read all of them but honestly — if we've had a particularly busy quarter — I'll do a proper read of maybe 60–70% and skim the rest. Sometimes I'll sample by ward rather than reading everything. Which I know is a problem. There have been times I've spotted something in month three of a quarter that was clearly visible in month one if I'd had time to look."</blockquote>
<p><strong>What this validates:</strong> Sampling is a coping mechanism, not a methodology. Real issues are being missed. Processing 100% of comments is not a nice-to-have — it directly addresses a known gap James is already uncomfortable with.</p>

<h3>Q3 · When you look at a dashboard that shows ward-level feedback — what makes it useful versus overwhelming?</h3>
<blockquote>"The tools I've used before show every ward. There might be 30 wards all with slightly different scores and I'm supposed to figure out which one needs my attention. It becomes noise. What I actually want is someone to say — 'these three wards have moved the most in the wrong direction in the last four weeks.' Just those three. I can deal with three."</blockquote>
<p><strong>What this validates:</strong> The top-3 deteriorating wards default is not a design preference — it is a direct articulation of what James needs. Alert fatigue from all-ward views is the primary adoption risk. This is discovery finding F3 confirmed verbatim.</p>

<h3>Q4 · When you identify a theme — say 'communication' is flagging on a ward — what do you actually need to do next?</h3>
<blockquote>"I need to show the ward manager something real. Not just 'communication is down.' I need to be able to say 'three patients this week said they were not told what their medication was for.' That specificity is what makes a ward manager listen. So I end up going back into the raw data and manually pulling out representative quotes. That takes another hour per ward."</blockquote>
<p><strong>What this validates:</strong> The drilldown to verbatim comments is not a feature — it is a prerequisite for the quality manager to do their job. Alert → theme → verbatim in 3 clicks closes a loop that currently takes an hour per ward.</p>

<h3>Q5 · CQC inspections — how much of your time goes into preparing patient experience evidence for those?</h3>
<blockquote>"Last inspection, I spent three weeks pulling together evidence. Printing trend charts, selecting quotes, writing narratives about what we changed and why. It's the most stressful period of my year and most of the work is just assembly — gathering things that already exist. If I could generate that pack in an afternoon I'd cry with relief. Genuinely."</blockquote>
<p><strong>What this validates:</strong> CQC evidence preparation is a significant pain point and a strong commercial hook. The board pack export — even in basic PDF form — has immediate and emotional value for James. This is the Quality Manager's 'killer feature' for the demo.</p>

<hr/>

<h2>Interview 3 — Priya, Ward Manager / Service Line Lead</h2>
<p><strong>Context:</strong> Priya manages a 28-bed surgical ward and has been in her role for four years. She works four long shifts per week and manages a team of 22. We spoke to her at the end of her shift — she had 20 minutes. She was direct, practical, and refreshingly honest about what she will and will not do.</p>
<p><em>"Thanks so much for sparing 20 minutes, Priya — we'll be quick and we genuinely want to hear what would actually work for someone in your position, not what sounds good in a meeting room."</em></p>

<h3>Q1 · How do you currently receive patient feedback about your ward — and when does it arrive?</h3>
<blockquote>"I get a quarterly email from the quality team with a PDF attached. It has a percentage — like '84% of patients on Ward 7 rated their experience as very good or good.' That's it. It arrives about six weeks after the end of the quarter. So I'm reading about what patients thought in January in mid-February. If something went wrong in January, it went wrong. There's nothing I can do about it now."</blockquote>
<p><strong>What this validates:</strong> The 4–6 week feedback lag is confirmed. Aggregated percentage scores are meaningless at ward level. Real-time, theme-level feedback is the minimum viable improvement — not a premium feature.</p>

<h3>Q2 · Have you ever tried logging into a trust system to look at patient feedback data yourself?</h3>
<blockquote>"Once. About two years ago. I couldn't remember my login, IT took three days to reset it, by which point I'd given up. I have 22 staff, bed management calls every morning, and a ward round at eight. I am not going to log into anything that isn't the EPR or the rota system. If something needs a login, it doesn't exist for me."</blockquote>
<p><strong>What this validates:</strong> The no-login constraint is absolute, not a preference. A magic-link email is the only viable delivery mechanism for this persona. A ward-facing web app is correctly deprioritised from MVP. This is discovery finding F4 confirmed directly.</p>

<h3>Q3 · If you received a short email every Monday morning about your ward's patient feedback — what would you actually need to see in it to find it useful?</h3>
<blockquote>"Tell me what patients said. Not a score — what they actually said. The top two things that were good, the top two things that need fixing. And I want at least one actual quote — a real sentence a patient wrote. My team never get to hear the good stuff. It all gets filtered into complaints before it reaches us. If I could read out one positive comment at the Monday huddle, that would change the whole tone of the week."</blockquote>
<p><strong>What this validates:</strong> The digest format — top 2 positives, top 2 concerns, minimum 1 verbatim quote — is exactly right. The positive verbatim is not a nice detail; it is the feature that makes the ward manager read the email every week. Structural, not optional.</p>

<h3>Q4 · Would you share that kind of email with your team? And if so, how?</h3>
<blockquote>"Yes, immediately. I'd forward it to the ward WhatsApp. Or print it and put it on the noticeboard. But only if it was short — if it was two pages long nobody reads it, including me. One screen, done. And it needs to have something positive in it or I'm not putting it in front of my team. I'm not going to depress people on a Monday morning."</blockquote>
<p><strong>What this validates:</strong> The one-tap share link is confirmed as a real behaviour, not an assumption. The digest must be single-screen length. The positive content requirement is again reinforced — this is Priya's baseline for engagement, not a bonus.</p>

<h3>Q5 · If a patient complaint landed on your ward tomorrow that could have been caught earlier from feedback data — what would that feel like?</h3>
<blockquote>"It's happened. A patient raised a formal complaint about how a discharge was handled. When the quality team looked back at the FFT data, there were three comments about discharge confusion on my ward in the two months before. Nobody flagged it. Nobody told me. If I'd known, I would have changed how we brief patients before they leave. That's on me — but only because I didn't have the information. That's the part that stays with you."</blockquote>
<p><strong>What this validates:</strong> The emotional stakes of missing feedback are real and personal for ward managers. The weekly digest — arriving before problems escalate — directly addresses this. This quote is the emotional anchor for the Ward Manager story in the demo.</p>`)
  },
  {
    id: 'artefact-tech-discovery',
    title: 'Technical Discovery Report',
    description: 'MVP-scoped technical findings: stack decisions, NHS infrastructure constraints, IG requirements, architectural patterns, and reusable components identified during discovery.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Purpose of This Report</h2>
<p>This technical discovery report documents the engineering findings, constraints, and architectural decisions identified during the MVP discovery phase. It is scoped strictly to what is needed to build and demonstrate the MVP — AI theme classification, sentiment alerting, ward digest email, and board pack export. It does not attempt to design a production-scale architecture.</p>

<h2>1. MVP Technical Scope</h2>
<p>The following capabilities are in scope for the MVP build. Everything else is explicitly deferred.</p>
<table>
<tr><th>Capability</th><th>In MVP</th><th>Deferred</th></tr>
<tr><td>NHS FFT data ingest (CSV upload)</td><td>✓</td><td></td></tr>
<tr><td>NHS App ratings ingest (API)</td><td>✓</td><td></td></tr>
<tr><td>AI theme classification on free-text</td><td>✓</td><td></td></tr>
<tr><td>Sentiment scoring per comment</td><td>✓</td><td></td></tr>
<tr><td>Top-3 deteriorating wards alert dashboard</td><td>✓</td><td></td></tr>
<tr><td>Drilldown: alert → theme → verbatim</td><td>✓</td><td></td></tr>
<tr><td>Weekly ward digest email (magic link)</td><td>✓</td><td></td></tr>
<tr><td>Board pack PDF export</td><td>✓</td><td></td></tr>
<tr><td>Role-based access (QM + Chief Nurse)</td><td>✓</td><td></td></tr>
<tr><td>PALS / Datix / complaints integrations</td><td></td><td>Next phase</td></tr>
<tr><td>Real-time streaming ingest</td><td></td><td>Next phase</td></tr>
<tr><td>On-premise deployment option</td><td></td><td>Year 2</td></tr>
<tr><td>ICB cross-trust aggregation</td><td></td><td>Year 2</td></tr>
<tr><td>Multi-language support</td><td></td><td>Year 2</td></tr>
</table>

<h2>2. Technical Requirements</h2>
<h3>Data Ingest</h3>
<ul>
<li><strong>FFT CSV:</strong> Accept NHS England FFT export format (Excel + CSV). Column mapping must handle trust naming variations and ward code inconsistencies across providers. A normalisation layer is required before classification.</li>
<li><strong>NHS App API:</strong> Authenticate via NHS Identity / OAuth 2.0. Rate limits apply — ingest should be batched, not streamed. API schema versioning must be tracked as NHS App is actively developing its feedback endpoints.</li>
<li><strong>Deduplication:</strong> Composite key dedup (trustCode + wardCode + responseDate + overallExperience + comment hash) applied at ingest. Required because trusts re-export overlapping date ranges.</li>
</ul>
<h3>AI Classification</h3>
<ul>
<li><strong>Model:</strong> Fine-tuned transformer (BERT-base or ClinicalBERT) on NHS FFT taxonomy. Out-of-the-box accuracy: 89%. Post-taxonomy-fix target: ≥91% overall, ≥88% per theme.</li>
<li><strong>Taxonomy:</strong> 6 themes — Communication, Environment &amp; Facilities, Waiting &amp; Delays, Clinical Care &amp; Treatment, Staffing &amp; Attitudes, Privacy &amp; Dignity (split from original Dignity &amp; Respect per discovery finding F2).</li>
<li><strong>Inference latency:</strong> &lt;2s per comment target. Batch processing for bulk ingest; real-time single-comment classification for live dashboard updates.</li>
<li><strong>Confidence threshold:</strong> Comments below 0.65 confidence are flagged as "unclassified" and surfaced for manual review — never silently discarded.</li>
</ul>
<h3>Alerting Engine</h3>
<ul>
<li>Rolling 4-week sentiment window per ward. Alert triggers when week-on-week change exceeds configurable threshold (default: −8 points).</li>
<li>Top-3 wards by deterioration magnitude surfaced by default. All wards accessible via toggle.</li>
<li>Alert pipeline runs nightly. Near-real-time alerting (sub-1h) is post-MVP.</li>
</ul>
<h3>Email Digest</h3>
<ul>
<li>Sent Monday 08:00 GMT via transactional email provider (SendGrid or AWS SES).</li>
<li>Magic link authentication — JWT signed, 7-day expiry, ward-scoped. No password or account required.</li>
<li>Template must render correctly in Outlook (including desktop client) — the dominant NHS email client.</li>
<li>Plain text fallback required. Never send an empty digest — skip with a logged error if no data.</li>
</ul>
<h3>Board Pack Export</h3>
<ul>
<li>PDF generated server-side (Puppeteer or WeasyPrint). Client-side PDF is unreliable across NHS network proxies.</li>
<li>Contents: trust-wide sentiment trend (12 weeks), top 3 risk alerts, theme breakdown, week-on-week direction indicator.</li>
<li>Must be accessible (WCAG 2.1 AA) — colour is never the sole indicator of alert status.</li>
</ul>

<h2>3. NHS Infrastructure Constraints</h2>
<h3>Network and Connectivity</h3>
<ul>
<li><strong>NHS network proxies:</strong> Many trust networks route outbound HTTPS through Zscaler or similar. API calls from trust-hosted clients may be intercepted. Design for proxy-hostile environments — avoid WebSockets for critical paths; use polling with exponential backoff.</li>
<li><strong>N3 / HSCN:</strong> The Health and Social Care Network carries NHS data traffic. Cloud services must be accessible from HSCN without requiring VPN tunnels per trust.</li>
<li><strong>Bandwidth:</strong> Some ward terminals operate on constrained bandwidth. The dashboard must load in &lt;3s on a 10Mbps connection. No heavy client-side bundles on the critical path.</li>
</ul>
<h3>Device and Browser Environment</h3>
<ul>
<li>NHS trusts standardise on Windows 10 with Internet Explorer 11 still present on clinical desktops — though Chrome/Edge are increasingly deployed. Target: Chrome 90+, Edge 90+. IE11 is explicitly out of scope.</li>
<li>Ward terminals are often shared, locked-down devices. No local storage of patient data. Session tokens must be server-side only.</li>
<li>Email digest must render in Outlook 2016/2019 desktop. Avoid CSS Grid and Flexbox in email — use table-based layouts.</li>
</ul>
<h3>Identity and Access</h3>
<ul>
<li><strong>NHS Login:</strong> Not yet suitable for staff-facing applications at MVP. Use trust-level SSO (Azure AD / ADFS) via SAML 2.0 or OIDC as the authentication mechanism for Quality Manager and Chief Nurse roles.</li>
<li><strong>Role provisioning:</strong> Trust IG leads provision users manually at onboarding. No self-registration. User management UI required for trust admins.</li>
<li><strong>Magic link (Ward Manager):</strong> No NHS Login or trust SSO. JWT signed with ward-scoped claims. Expires 7 days. Treated as a read-only, low-risk access pattern — confirmed acceptable by 3 of 4 IG leads in discovery.</li>
</ul>
<h3>Data Residency and IG</h3>
<ul>
<li>All patient data must be processed and stored within UK (Azure UK South primary, UK West failover). No data transits outside UK — including AI model inference calls.</li>
<li>DTAC assessment is a prerequisite to any trust signing a data processing agreement. Target: DTAC complete in Q1.</li>
<li>DPIA must be completed and signed by trust IG before any patient data is transferred. Template DPIA to be provided at onboarding.</li>
<li>UK GDPR Article 9 (special category data) applies. Feedback data linked to care settings is treated as potentially health-related.</li>
</ul>

<h2>4. Technical Limitations Identified in Discovery</h2>
<table>
<tr><th>Limitation</th><th>Impact</th><th>Mitigation</th></tr>
<tr><td>NHS ward naming is not standardised across trusts</td><td>Matching feedback to organisational structure requires per-trust mapping</td><td>Ward mapping workshop with each trust at onboarding; maintain a normalisation table per trust</td></tr>
<tr><td>FFT data arrives in batches (monthly/quarterly) not in real-time</td><td>Dashboard reflects historic data, not live ward state</td><td>Clearly communicate data freshness in UI; real-time ingest is post-MVP</td></tr>
<tr><td>AI accuracy drops on dignity/respect and multi-theme comments</td><td>Theme breakdown is less reliable for nuanced comments</td><td>Taxonomy split (Privacy &amp; Dignity / Feeling Dismissed) closes gap to 91%+. Low-confidence comments flagged explicitly.</td></tr>
<tr><td>NHS App feedback API is in active development — schema may change</td><td>Ingest connector may break on API updates</td><td>Version-pin API calls; subscribe to NHS App developer changelog; build connector as a replaceable adapter</td></tr>
<tr><td>One trust requires on-premise processing (post-Synnovis risk)</td><td>Cloud-only MVP excludes this trust</td><td>Architecture decision recorded: design for on-premise as a Year 2 deployment option. Containerise processing layer now.</td></tr>
<tr><td>Outlook email client has limited CSS support</td><td>Digest may render poorly on some NHS desktops</td><td>Table-based email layout; test against Litmus Outlook matrix; plain text fallback always included</td></tr>
</table>

<h2>5. Architectural Considerations</h2>
<h3>Proposed MVP Architecture</h3>
<ul>
<li><strong>Frontend:</strong> React SPA (Vite). Hosted on Vercel or Azure Static Web Apps. No server-side rendering required for MVP.</li>
<li><strong>API layer:</strong> Node.js / FastAPI. Handles ingest, classification pipeline orchestration, alert computation, and export generation. Deployed as containerised services (Docker) on Azure Container Apps.</li>
<li><strong>AI classification service:</strong> Python microservice wrapping the fine-tuned transformer. Isolated from the API layer so the model can be swapped without touching the rest of the stack. Communicates via internal HTTP.</li>
<li><strong>Database:</strong> PostgreSQL (Azure Database for PostgreSQL Flexible Server). Stores ingested records, classification results, alert history, and user/ward mappings. Row-level security for trust data isolation.</li>
<li><strong>Queue:</strong> Azure Service Bus. Decouples ingest from classification — large FFT batch uploads enqueue records rather than blocking the API response.</li>
<li><strong>Email:</strong> SendGrid or AWS SES for transactional digest delivery. Templates stored as versioned HTML with plain text alternatives.</li>
<li><strong>PDF export:</strong> Puppeteer running in a headless container, triggered server-side on export request.</li>
</ul>
<h3>Key Architectural Decisions</h3>
<ul>
<li><strong>Classification as an isolated microservice:</strong> The AI model is the component most likely to change (accuracy improvements, model upgrades, NHS-specific fine-tuning). Isolation means model updates don't require redeployment of the full stack.</li>
<li><strong>Adapter pattern for data ingest:</strong> Each data source (FFT CSV, NHS App API, future PALS) has its own adapter that normalises data to a canonical schema before it enters the pipeline. Adding a new source is adding a new adapter — no core pipeline changes.</li>
<li><strong>Containerisation from day one:</strong> Docker containers for all services — enables on-premise deployment in Year 2 without architectural rework. Also simplifies local development and CI/CD.</li>
<li><strong>Trust data isolation at database level:</strong> Row-level security in PostgreSQL ensures no query can accidentally return data from another trust. Enforced at the DB layer, not just the application layer.</li>
</ul>

<h2>6. Reusable Components and Design Patterns</h2>
<h3>Frontend Components (reusable across views)</h3>
<table>
<tr><th>Component</th><th>Reused In</th><th>Description</th></tr>
<tr><td>AlertCard</td><td>Dashboard, Chief Nurse view</td><td>Renders a deteriorating ward with threshold, trend direction, and top theme. Configurable severity colour.</td></tr>
<tr><td>ThemeBar</td><td>Alert drilldown, Board pack</td><td>Horizontal bar showing theme name, comment count, and sentiment direction. Accessible — no colour-only encoding.</td></tr>
<tr><td>VerbatimList</td><td>Drilldown, Digest preview</td><td>Scrollable list of anonymised patient verbatim comments with optional sentiment tag.</td></tr>
<tr><td>TrendSparkline</td><td>Dashboard, Board pack, Ward digest</td><td>Lightweight 12-week sentiment trend line. Renders in email as a static PNG fallback.</td></tr>
<tr><td>RoleGate</td><td>All routes</td><td>Wraps any view in role-based access control. Renders nothing (not a redirect) if role is insufficient — prevents flash of unauthorised content.</td></tr>
<tr><td>DataFreshnessTag</td><td>Dashboard, Digest</td><td>Always-visible indicator of when data was last ingested. Prevents users acting on stale data without realising.</td></tr>
</table>
<h3>Backend Patterns</h3>
<table>
<tr><th>Pattern</th><th>Where Applied</th><th>Why</th></tr>
<tr><td>Ingest Adapter</td><td>FFT CSV, NHS App API, future sources</td><td>Normalises any source to canonical schema. Adding a source = adding an adapter, not changing core pipeline.</td></tr>
<tr><td>Outbox Pattern</td><td>Alert generation, Digest dispatch</td><td>Writes events to DB before sending — ensures no alert or email is lost if the downstream service is temporarily unavailable.</td></tr>
<tr><td>Confidence Threshold Guard</td><td>AI classification service</td><td>Any comment below 0.65 confidence is routed to an "unclassified" bucket rather than being forced into a theme. Prevents misleading theme counts.</td></tr>
<tr><td>Per-Trust Row-Level Security</td><td>All DB queries</td><td>PostgreSQL RLS policy on every patient data table. Trust ID is injected from the authenticated session — not from query parameters.</td></tr>
<tr><td>Magic Link JWT</td><td>Ward digest email</td><td>Signed JWT with ward scope and 7-day expiry. Stateless — no session store required. Revocation via JWT blocklist if needed.</td></tr>
<tr><td>Versioned API Adapter</td><td>NHS App ingest connector</td><td>NHS App API schema is in active development. Version-pinned adapter with an upgrade path isolated from the core ingest pipeline.</td></tr>
</table>`)
  },
  {
    id: 'artefact-business-strategy',
    title: 'Business Strategy Analysis',
    description: 'Converts a previously unanalysable data asset (free-text feedback) into financial and reputational protection. The value is existential, not incremental — trusts face income exposure without it.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Core Value Proposition</h2>
<p>Converts a previously unanalysable data asset (free-text patient feedback) into financial and reputational protection. The value is <strong>existential, not incremental</strong>.</p>
<h2>Why Now</h2>
<ul>
<li>The 10YHP creates direct financial consequences for poor feedback performance — for the first time in NHS history</li>
<li>The MTPF mandates near-real-time ward feedback monitoring from October 2025 — compliance is not optional</li>
<li>NHS App has 10× the data volume of legacy FFT — the data asset exists; the intelligence layer does not</li>
<li>NHS England is actively seeking market input on a 'sustainable and holistic insight system' — political tailwind</li>
</ul>
<h2>Business Model</h2>
<table>
<tr><th>Element</th><th>Detail</th></tr>
<tr><td>Model</td><td>Annual SaaS subscription per trust. Per-ward pricing tiers for smaller trusts.</td></tr>
<tr><td>Entry price</td><td>£30–45k per annum for a mid-size acute trust (validated in discovery pricing interviews)</td></tr>
<tr><td>Procurement route</td><td>G-Cloud direct award (target Q3). Crown Commercial Service framework as fallback.</td></tr>
<tr><td>Budget holder</td><td>Chief Nurse or Director of Quality (quality/safety budget, not IT budget — validated in discovery)</td></tr>
<tr><td>Year 1 target</td><td>£500k ARR. Year 2: £2M ARR. Requires 11–16 live trusts at average £45k.</td></tr>
</table>
<h2>Go-to-Market Sequencing</h2>
<ol>
<li><strong>Land:</strong> 2 pilot trusts on paid contracts before public launch. Use as reference sites and case study authors.</li>
<li><strong>Expand:</strong> G-Cloud listing enables direct award without tender. Target trusts with CQC Well-Led reviews scheduled in next 12 months.</li>
<li><strong>Leverage:</strong> ICB relationships open system-level conversations — one ICB = up to 10 trust conversations.</li>
</ol>
<h2>ROI Frame for Trust Finance Directors</h2>
<ul>
<li><strong>Staff time saved:</strong> Quality Manager coding time: 2–3 days/quarter → 2 hours. At band 7 salary: ~£15k/year saved.</li>
<li><strong>CQC risk:</strong> A single 'Inadequate' rating on Well-Led costs £200k+ in remediation and reputational damage. One prevented inadequate rating pays for 4 years of platform cost.</li>
<li><strong>10YHP compliance:</strong> Non-compliance with near-real-time feedback mandate = regulatory exposure from Q1 2026.</li>
</ul>`)
  },
  {
    id: 'artefact-prototype',
    title: 'Prototype',
    description: 'A high-fidelity interactive prototype of the NHS Patient Feedback Intelligence Platform — AI-classified FFT themes, ward risk signals, persona-specific dashboards, and board-ready exports. Click to explore the version history.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&auto=format',
  },
];
