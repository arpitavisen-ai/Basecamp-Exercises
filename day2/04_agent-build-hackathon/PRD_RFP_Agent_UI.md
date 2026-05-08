# Product Requirements Document
## Helios RFP Response Agent — Web UI
**For use with Figma Make**

---

## 1. Product Overview

Build a single-page web application that lets a Helios Security solutions engineer submit an RFP questionnaire to an AI agent, watch it process each question in real time, review the drafted answers with source citations, act on the consistency review report, and export the final response package as JSON.

**Core value proposition:** Cut RFP first-draft time from 8 hours to under 15 minutes by surfacing AI-drafted answers, source evidence, and cross-answer consistency flags in one clean workspace.

---

## 2. Target User

**Helios Security Solutions Engineer**
- Receives 40+ RFPs per quarter
- Currently hunts through Confluence, copy-pastes answers into spreadsheets
- Needs to review, not write, answers — values accuracy and speed over automation

---

## 3. Screen Map

```
App Shell
├── 1. Upload / Input Screen       ← entry point
├── 2. Processing Screen           ← live agent progress
├── 3. Review Workspace            ← main working screen
│   ├── 3a. Answer Cards Panel
│   ├── 3b. Consistency Review Panel
│   └── 3c. Source Evidence Drawer
└── 4. Export Screen               ← final output
```

---

## 4. Screens & Components

---

### Screen 1 — Upload / Input

**Purpose:** Accept the RFP questionnaire before kicking off the agent.

**Layout:** Centred card, max-width 680px, vertically centred on page.

**Components:**

| Component | Spec |
|-----------|------|
| App logo + wordmark | Top-left: "Helios RFP Agent" in bold sans-serif |
| Hero heading | "Draft your RFP response in minutes" — 32px |
| Sub-heading | "Paste questions below or upload a CSV" — 16px muted |
| Tab switcher | Two tabs: **Paste text** / **Upload CSV** |
| Paste textarea | Min 200px tall, placeholder text showing Q1–Q5 example format |
| CSV upload zone | Dashed border, upload icon, "Drop CSV here or click to browse", accepted format hint |
| Question count badge | Live counter: "5 questions detected" — updates as user types |
| Category auto-detect | Small chips below textarea: `technical ×2` `compliance ×1` `pricing ×1` `company-info ×1` |
| Start Agent button | Full-width, primary colour (deep orange #E07A5F), "Run Agent →", disabled until ≥1 question detected |
| Footer note | "Powered by Claude claude-sonnet-4-20250514 · Knowledge base: 7 entries" — muted 12px |

**Question format hint (shown as placeholder text):**
```
Q1 | technical | Describe your platform's approach to real-time threat detection...
Q2 | compliance | List all compliance certifications...
```

---

### Screen 2 — Processing

**Purpose:** Show the agent working — question by question, tool call by tool call.

**Layout:** Two-column, 60/40 split. Left: live log. Right: progress summary.

**Left panel — Live Agent Log**

| Component | Spec |
|-----------|------|
| Log header | "Agent running…" with a pulsing green dot |
| Log stream | Monospace font, 13px, dark background (#1A1A2E). New lines appear as events fire |
| Log line types | `[Q1 technical]  Starting…` (grey), `  → search_kb(query="threat detection...", category=technical)` (blue), `  ← 3 results returned` (green), `  [DONE] Q1 answered in 14s` (orange) |
| Auto-scroll | Log auto-scrolls to latest entry; user can scroll up to freeze |

**Right panel — Progress Summary**

| Component | Spec |
|-----------|------|
| Progress ring | Large circular ring showing N of 5 complete — orange fill |
| Question status list | Each question: icon (pending / spinning / done), ID, category chip, elapsed time when done |
| Estimated time remaining | "~45s remaining" — updates each time a question completes |
| Tool calls counter | "12 KB searches made" — running total |
| Cancel button | Outline button, bottom of panel |

**Status icons:**
- Pending: hollow circle, grey
- In progress: spinner, orange
- Done: filled check, green
- Error: X icon, red

---

### Screen 3 — Review Workspace

**Purpose:** Main working screen. Three-pane layout. This is where the solutions engineer spends most of their time.

**Global layout:** Fixed top bar + three scrollable panels below.

---

**Top Bar**

| Element | Spec |
|---------|------|
| RFP name | Editable inline — "Sample RFP — Agent Engineering Challenge" |
| Stats row | `5 questions` · `24/24 evals passed` · `4 consistency issues` · `~60s total` |
| Action buttons | **Export JSON** (primary), **Re-run Agent** (outline), **Print** (icon) |

---

**Panel 3a — Answer Cards** (left, ~50% width, scrollable)

One card per question. Cards are stacked vertically.

**Answer Card anatomy:**

```
┌─────────────────────────────────────────────────┐
│  Q1  [technical]                    [high] ●●●○  │  ← header row
│  Describe your platform's approach to...         │  ← question text, 2 lines, then truncate
├─────────────────────────────────────────────────┤
│  Helios Sentinel employs a multi-layered...      │  ← answer body
│  detection-to-alert latency of 2.3 seconds for  │
│  signature matches and 18 seconds for...         │
│  [Show more ▾]                                   │
├─────────────────────────────────────────────────┤
│  Sources:                                        │
│  📄 Helios Platform Architecture Doc v4.2        │  ← source pill, clickable
│  📄 Acme Corp RFP Response — March 2024          │
├─────────────────────────────────────────────────┤
│  [Edit answer]  [Regenerate]  [Flag for review]  │  ← action row
└─────────────────────────────────────────────────┘
```

**Confidence indicator:**
- `high` = 3 filled dots, green label
- `medium` = 2 filled dots, amber label
- `low` = 1 filled dot, red label + warning icon

**Flags strip:** If `flags` array is non-empty, show a yellow banner inside the card:
`⚠ Low confidence — knowledge base did not contain sufficient information for this question.`

**Card states:**
- Default: white background, subtle shadow
- Editing: blue left-border, textarea replaces answer body
- Flagged: amber left-border
- Has issues: red dot in top-right corner (linked to Panel 3b)

---

**Panel 3b — Consistency Review** (right-top, ~50% width)

| Component | Spec |
|-----------|------|
| Panel header | "Consistency Review" + status badge: `issues_found` (amber) or `pass` (green) |
| Overall assessment | Grey callout box with Claude's overall_assessment text |
| Issue list | One issue card per item in the `issues` array |

**Issue card anatomy:**

```
┌──────────────────────────────────────────────┐
│  [contradiction]              Q3 · Q4         │
│  Q3 states SIEM as an add-on (+$6/seat/mo)    │
│  but Q4's Meridian Bank reference shows it    │
│  included in EPP+EDR+SIEM bundle.             │
│                                               │
│  Suggested fix: Clarify whether SIEM is       │
│  bundled or add-on for enterprise accounts.   │
│                                               │
│  [Go to Q3]  [Go to Q4]  [Dismiss]           │
└──────────────────────────────────────────────┘
```

**Issue type colour coding:**
- `contradiction` → red chip
- `inconsistency` → amber chip
- `tone_mismatch` → blue chip
- `missing_info` → grey chip

"Go to Q3" button scrolls Panel 3a to that card and highlights it.

---

**Panel 3c — Source Evidence Drawer** (slide-in from right, triggered by clicking a source pill)

| Component | Spec |
|-----------|------|
| Drawer header | Source name + document icon |
| Full content block | The raw KB entry content in a bordered, scrollable box |
| Used by | "Used in: Q1, Q5" — linked |
| Tags | `technical` `detection` `latency` chips |
| Close button | X top-right |

---

### Screen 4 — Export

**Purpose:** Preview and download the final JSON output.

**Layout:** Two-column, 40/60.

**Left — Export Options**

| Component | Spec |
|-----------|------|
| Export format selector | Radio group: **JSON** (selected) / **CSV** / **Markdown** |
| Include fields checklist | Checkboxes: answers, sources, confidence, flags, review report, metadata |
| RFP name field | Editable |
| Download button | Primary, "Download rfp_output.json" |
| Copy to clipboard | Secondary button |

**Right — JSON Preview**

Syntax-highlighted JSON viewer (read-only). Shows the full `final_output` structure:

```json
{
  "rfp_name": "Sample RFP — Agent Engineering Challenge",
  "total_questions": 5,
  "answers": [...],
  "review": {
    "status": "issues_found",
    "issues": [...],
    "overall_assessment": "..."
  },
  "metadata": { ... }
}
```

**Eval summary bar** (above the JSON preview):
```
Evals:  24 passed  ·  0 failed  ·  All assertions green ✓
```

**Back button:** Returns to Review Workspace without losing state.

---

## 5. Global Components

### Navigation / App Shell
- Fixed top bar: logo left, step indicator centre (`Input → Processing → Review → Export`), user avatar right
- Active step highlighted in orange
- Completed steps shown with a check

### Notification Toast
- Appears bottom-right
- Types: success (green), warning (amber), error (red), info (blue)
- Auto-dismisses after 4s

### Empty States
- If no answers: illustration + "Run the agent to generate answers"
- If no consistency issues: green checkmark + "No issues found — all answers are consistent"

### Loading Skeleton
- Answer cards show skeleton loaders while processing

---

## 6. Colour & Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--brand-orange` | `#E07A5F` | Primary buttons, active states, progress |
| `--brand-dark` | `#1A1A2E` | Log background, headings |
| `--success` | `#2D9E6B` | High confidence, pass states |
| `--warning` | `#F0A500` | Medium confidence, issues |
| `--error` | `#D94F3D` | Low confidence, contradictions, errors |
| `--surface` | `#F8F8FA` | Page background |
| `--card` | `#FFFFFF` | Card backgrounds |
| `--muted` | `#6B7280` | Secondary text |

**Type scale:**
- Headings: Inter Bold
- Body: Inter Regular, 15px, 1.6 line-height
- Monospace (log): JetBrains Mono, 13px
- Labels / chips: Inter Medium, 12px, uppercase tracking

---

## 7. Data Shapes (for component binding)

**Answer object:**
```typescript
{
  question_id: string          // "Q1"
  category: string             // "technical"
  answer: string               // full answer text
  sources: string[]            // ["Helios Platform Architecture Doc v4.2"]
  confidence: "high"|"medium"|"low"
  flags: string[]              // [] or ["low confidence — ..."]
  _meta: { tool_calls: number, turns: number }
}
```

**Review object:**
```typescript
{
  status: "pass" | "issues_found"
  issues: {
    type: "contradiction"|"inconsistency"|"tone_mismatch"|"missing_info"
    questions_involved: string[]   // ["Q3","Q4"]
    description: string
    suggested_fix: string
  }[]
  overall_assessment: string
}
```

**Processing event (for live log):**
```typescript
{
  type: "question_start"|"tool_call"|"tool_result"|"question_done"|"error"
  question_id: string
  payload: string    // log line text
  timestamp: number
}
```

---

## 8. User Flows

### Primary Flow — Happy Path
1. User lands on Input screen → pastes 5 questions → sees 5 detected with category chips → clicks **Run Agent**
2. Transitions to Processing screen → watches live log, sees spinner per question, checks animate green as each completes
3. Agent finishes → auto-transitions to Review Workspace
4. User scans answer cards, clicks a source pill → evidence drawer slides in → reviews KB content → closes drawer
5. User reads consistency issues in Panel 3b → clicks **Go to Q3** → Q3 card highlights → user edits the SIEM wording inline → saves
6. User clicks **Export JSON** → Export screen → reviews JSON preview → clicks **Download**

### Secondary Flow — Issue Resolution
1. On Review Workspace, consistency panel shows 4 issues
2. User clicks issue card for Q3/Q4 contradiction → both cards highlighted
3. User edits Q3 answer to clarify SIEM add-on vs bundle distinction
4. Clicks **Re-run consistency review** (button in Panel 3b header)
5. Review re-runs (spinner, then result) → issue dismissed

### Edge Flow — Low Confidence Answer
1. Agent answers a question with `confidence: "low"` and flags it
2. Card shows amber left-border + warning banner
3. User clicks **Flag for review** → card marked with a red dot
4. On Export screen, flagged questions listed in a "Requires human review" section above the JSON

---

## 9. Responsive Behaviour

| Breakpoint | Layout change |
|------------|--------------|
| ≥1280px | Three-panel layout (full Review Workspace) |
| 768–1279px | Two panels: answer cards + review panel; source drawer overlays |
| <768px | Single column; panels become collapsible accordion sections |

---

## 10. Accessibility

- All interactive elements keyboard-navigable
- ARIA labels on confidence indicators and status badges
- Log panel has `role="log"` and `aria-live="polite"`
- Colour is never the only differentiator (icons accompany all colour-coded states)
- Minimum contrast ratio 4.5:1 for all body text

---

## 11. Out of Scope (v1)

- Real-time backend API integration (UI uses mock/hardcoded data for Figma Make prototype)
- User authentication
- Multi-user collaboration
- Version history / undo
- Direct Confluence / SharePoint integration
