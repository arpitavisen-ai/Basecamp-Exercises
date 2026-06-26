export const SEED_VERSION = 3;

export const SEED_PROBLEM_STATEMENT = `NHS trusts face growing financial and reputational exposure from patient feedback they cannot analyse at scale. The 10 Year Health Plan (July 2025) directly ties trust income to patient ratings through clinical team payments, patient power payments, and publicly published league tables updated quarterly from summer 2025. Yet most trusts still rely on manual coding, sampled data, and disconnected reporting systems that prevent timely action. There is no NHS-native platform that combines AI-powered theme classification, closed-loop feedback management, and integration with clinical systems — leaving organisations unable to detect emerging risks early or demonstrate improvement to regulators and boards.`;

export const SEED_USER_SEGMENTS = {
  chiefNurse: {
    title: "Chief Nurse / Director of Patient Experience",
    imageUrl: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goals: "Know which wards are deteriorating before board meetings\nDemonstrate feedback-driven improvement to CQC\nProduce board packs in minutes, not days\nEarly warning of income exposure from 10YHP\nAlign patient experience strategy to the 10 Year Health Plan",
    painPoints: "Feedback data arrives too late to act on before inspections\nNo single view across all wards and care settings\nManual board reports take days to compile\nFinding out about ward problems from the press\nUnable to link patient feedback to clinical outcomes or team performance",
    motivators: "Real-time trust-wide visibility of patient sentiment\nAutomated CQC-ready reporting and evidence packs\nEarly warning alerts before issues escalate\nBoard-level dashboards that require no manual preparation\nWalk into the board knowing what's happening, not reacting",
    opportunities: "AI-powered anomaly detection surfacing ward-level risks proactively\nOne-click CQC evidence packs for Well-Led inspections\nPortfolio view linking patient experience to clinical and financial outcomes\nAuto-generated board pack — no manual preparation required"
  },
  qualityManager: {
    title: "Quality Manager / Patient Experience Lead",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goals: "Analyse 100% of comments — not a 10–20% sample\nTheme drilldown from trust level to ward to verbatim comment\nCQC evidence pack in hours, not weeks\nClosed loop: feedback → action → outcome tracking\nTime to do strategic work instead of manual data processing",
    painPoints: "2–3 days per quarter manually coding FFT comments in Excel\nSampling means genuine issues go undetected until too late\nMultiple disconnected tools with no unified analytical layer\nNo way to prove 'You Said, We Did' actions changed anything\nCQC evidence prep as a multi-week annual panic",
    motivators: "AI theme classification reducing manual coding to near zero\nDrill-down from trust level to ward level to verbatim comments\nClosed-loop feedback workflow linking issues to resolved actions\nSelf-serve report builder for clinical governance and board packs",
    opportunities: "Automated theme tagging at 91%+ accuracy validated on real NHS data\nAnomaly alerts when sentiment drops on a ward or specialty\nIntegration with Datix, EPR, NHS App, PALS, and complaints channels\nBenchmarking against FFT and national patient survey datasets"
  },
  wardManager: {
    title: "Ward Manager / Service Line Lead",
    imageUrl: "https://images.unsplash.com/photo-1516841273335-e39b37888115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    goals: "Weekly email digest on Monday — no login required\nSpecific actionable themes, not just a headline score\nPositive comment highlights to share with the ward team\nKnow what patients are saying before problems escalate\nBuild a culture of continuous improvement within the ward",
    painPoints: "Feedback arrives weeks after a patient's stay — too late to respond\nAggregated scores hide which specific issues need addressing\nAnother system to log into during a 12-hour ward shift\nFeeling that feedback is collected but never acted upon\nTeam members never hear the positive comments — only complaints",
    motivators: "One Monday morning email — short, no login, immediately actionable\nTop 2 positive and top 2 concern themes from the previous week\nAlways includes at least one positive verbatim comment for staff morale\nOne-tap 'share with team' link for the full ward",
    opportunities: "Ward-level digest surfacing top themes weekly before the shift starts\nPre-discharge feedback capture before patients leave\nComparison with similar wards to benchmark and share good practice\nClosed-loop action log visible to ward team and quality management"
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
    description: 'What each persona is actually trying to accomplish — the job they hire our product to do. Three canvases: Chief Nurse, Quality Manager, Ward Manager.',
    thumbnail: 'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Chief Nurse — JTBD Canvas</h2>
<blockquote>"I need to know which services are in trouble from a patient experience perspective before I walk into the board meeting — not because the media told me." — Chief Nurse, large acute trust</blockquote>
<table>
<tr><th>Core Job Statement</th><th>Current Workaround (pain)</th></tr>
<tr><td>When I am accountable for patient experience across a large trust, I want to know which services are deteriorating — and why — before they become a serious incident, so I can protect patients and the trust's income.</td><td><ul><li>Manual quarterly sampling of FFT comments by an administrator</li><li>Complaints review in monthly committee — weeks after the fact</li><li>Finding out about ward problems from the press</li><li>Producing CQC evidence by manually collating spreadsheets over 2–3 weeks</li></ul></td></tr>
</table>
<p><strong>Switch trigger:</strong> (a) near-miss where feedback data was available but not seen in time, (b) upcoming CQC inspection where current evidence is thin, or (c) finance director flagging 10YHP payment exposure.</p>
<h2>Quality Manager — JTBD Canvas</h2>
<blockquote>"I spend two days every quarter manually coding FFT comments into a spreadsheet. I know there must be a better way but nobody has built one that actually works with NHS data." — Quality Manager, acute trust</blockquote>
<table>
<tr><th>Core Job Statement</th><th>Current Workaround (pain)</th></tr>
<tr><td>When I am responsible for turning patient feedback into actionable intelligence, I want to automatically process all feedback sources into themed, prioritised insight — so I can spend my time acting on problems, not finding them.</td><td><ul><li>Exports FFT responses to Excel; manually codes themes</li><li>Samples 10–20% of comments — the rest go unread</li><li>Creates CQC evidence pack by copy-pasting into Word — 2–3 weeks of work</li><li>No systematic way to track whether improvements changed feedback</li></ul></td></tr>
</table>
<h2>Ward Manager — JTBD Canvas</h2>
<blockquote>"Send me an email. One. On Monday morning. Short. Tell me what patients said about my ward last week — the good and the bad. I'll read that. I will not log into another system." — Ward Manager, A&amp;E</blockquote>
<table>
<tr><th>Core Job Statement</th><th>Key Design Constraint</th></tr>
<tr><td>When I am running a ward and accountable for patient experience on my patch, I want to know what patients are saying before problems escalate — so I can address issues early and give my staff the feedback they deserve.</td><td>Any tool that adds time to a 12-hour ward shift will be abandoned. Design for the ward manager who has 3 minutes on a Tuesday morning.</td></tr>
</table>
<p><strong>Unexpected insight — Positive feedback is a killer feature:</strong> 'My team never hear the good stuff — only complaints reach us. That alone would change how my staff feel about Monday mornings.' The weekly digest must always include at least one positive verbatim comment. This is structural, not optional.</p>`)
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
    title: 'Discovery Research Plan',
    description: '8-week plan to validate before building. Sequenced to de-risk the biggest unknowns first — IG gate, AI accuracy, and commercial viability must all pass before a line of production code is written.',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop&auto=format',
    richContent: rich(`
<h2>Research Goals — Priority Order</h2>
<table>
<tr><th>Priority</th><th>Goal</th></tr>
<tr><td><strong>Must validate</strong></td><td>Will NHS IG/CISO sign off on a third-party processor for patient feedback data? This is a build/no-build question.</td></tr>
<tr><td><strong>Must validate</strong></td><td>What does a meaningful, actionable alert look like to a Quality Manager? What triggers would cause them to act vs ignore?</td></tr>
<tr><td><strong>Must validate</strong></td><td>Is AI theme classification accurate enough on real NHS free-text without domain-specific fine-tuning? (Technical spike)</td></tr>
<tr><td><strong>Should validate</strong></td><td>What does the Ward Manager digest need to contain to drive action rather than deletion?</td></tr>
<tr><td><strong>Should validate</strong></td><td>What is the right pricing model and budget holder?</td></tr>
</table>
<h2>Phase 1 — Foundational Interviews (Weeks 1–3)</h2>
<p>4× Chief Nurses, 4× Quality Managers, 3× Ward Managers, 2× IG/CISO leads</p>
<ul>
<li>Chief Nurse questions: feedback lag, 10YHP anxiety, and CQC triggers</li>
<li>Quality Manager questions: current process mapping, sampling rates, and alert design preferences</li>
<li>IG/CISO questions: data processing approval conditions, DTAC process, and DPIA requirements</li>
</ul>
<h2>Phase 2 — Technical Spike (Weeks 2–4)</h2>
<p>Engineering + data science + 1 willing Quality Manager (data access)</p>
<ul>
<li>Classify 500 real FFT comments. Validate accuracy against expert coding.</li>
<li>Audit data formats from 3 trusts. Estimate ward naming normalisation effort.</li>
<li>Back-test threshold calibration on historical trust data.</li>
</ul>
<h2>Phase 3 — Prototype Testing (Weeks 5–6)</h2>
<p>3× Quality Managers, 4× Ward Managers, 2× Chief Nurses</p>
<ul>
<li>Alert dashboard: can QMs identify highest-risk ward unprompted in &lt;30 seconds?</li>
<li>Alert trust: would they act on a red alert? What would make them doubt it?</li>
<li>Digest engagement: reading time, what they'd forward, what they'd skip</li>
<li>Drilldown utility: navigation without help; verbatims reached in &lt;3 clicks</li>
</ul>
<h2>Phase 4 — Pricing &amp; Procurement (Weeks 6–7)</h2>
<p>3× Chief Nurses (re-engaged), 2× Finance Directors, 1× NHS procurement lead</p>
<ul>
<li>Van Westendorp pricing: too cheap / acceptable / too expensive thresholds</li>
<li>Budget location: quality/safety vs IT. Co-signatory requirements above £30k</li>
<li>Procurement route: G-Cloud direct award vs tender</li>
</ul>
<h2>Decision Gates</h2>
<table>
<tr><th>Gate</th><th>Pass Criterion</th></tr>
<tr><td>IG / CISO Gate</td><td>At least 2 of 4 IG leads indicate they would approve a DTAC-compliant cloud processor. If 0/4: re-scope to on-premise only.</td></tr>
<tr><td>AI Accuracy Gate</td><td>Spike achieves ≥85% accuracy on real NHS data without fine-tuning. If not: include fine-tuning in scope or narrow taxonomy.</td></tr>
<tr><td>Alert Design Gate</td><td>≥4 of 5 Quality Managers in prototype testing describe a specific action they would take on a red alert.</td></tr>
<tr><td>Commercial Gate</td><td>At least 1 trust willing to sign a paid pilot at ≥£30k before build. If not: extend discovery, not build.</td></tr>
</table>`)
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
];
