# Design System

Living reference for the visual language, component patterns, and interaction model used across the Patient Feedback Intelligence Platform. Covers tokens, typography, component anatomy, and the rules for combining them. Refer to DECISIONS.md for the *why* behind design decisions (DD-01 through DD-08).

---

## Colour System

The app is dark-mode-only. All colour tokens are defined in `src/styles/theme.css` as CSS custom properties consumed via Tailwind's `@theme inline` block.

### Base Tokens

| Token | Hex | Usage |
|---|---|---|
| `--background` | `#080F1E` | Page background — deep navy, near-black |
| `--card` | `#0F1A2E` | Card surfaces, sidebars, popover backgrounds |
| `--secondary` / `--muted` | `#172236` | Input backgrounds, hover states, secondary surfaces |
| `--foreground` | `#EEF2FF` | Primary text — slightly blue-tinted white |
| `--secondary-foreground` | `#94A3B8` | Subdued text, labels, placeholder copy |
| `--muted-foreground` | `#64748B` | Disabled states, de-emphasised metadata |
| `--primary` | `#3B82F6` | Interactive blue — buttons, links, focus rings |
| `--accent` | `#0EA5E9` | Sky blue — highlight states, accent elements |
| `--border` | `rgba(255,255,255,0.07)` | All dividers and card outlines — intentionally subtle |
| `--destructive` | `#EF4444` | Delete actions, error states |
| `--radius` | `0.75rem` | Base border-radius for all components |

### Phase Colour Coding

Each PDLC phase has a dedicated colour identity applied to its accent text, background tint, border, tag, and card backface. Never use a phase colour outside its phase — the coding is load-bearing for legibility.

| Phase | Accent | Class pattern | Card backface bg |
|---|---|---|---|
| **01 · Product Strategy** | Blue | `text-blue-400`, `bg-blue-500/10`, `border-blue-500/25` | `#0F1E3A` |
| **02 · Product Discovery** | Emerald | `text-emerald-400`, `bg-emerald-500/10`, `border-emerald-500/25` | `#0F2A22` |
| **03 · Product Delivery** | Purple | `text-purple-400`, `bg-purple-500/10`, `border-purple-500/25` | `#1A0F2E` |

Card front gradients follow the phase accent — e.g. `from-purple-600/20 to-violet-800/10` for delivery cards. The pattern is always `from-[phase-colour]/20 to-[related-shade]/10`.

### Tag Colour Tokens

Tags (pill labels on artefact cards, kanban tasks, PDLC phase chips) follow a consistent three-class pattern:

```
text-[colour]-400 bg-[colour]-500/10 border border-[colour]-500/20
```

The full set in use across the artefact grid: blue, cyan, purple, emerald, amber, rose, indigo. Use these; don't introduce new hues.

### Chart Tokens

| Token | Value | Role |
|---|---|---|
| `--chart-1` | `#3B82F6` | Primary series |
| `--chart-2` | `#22D3EE` | Secondary series |
| `--chart-3` | `#A78BFA` | Tertiary series |
| `--chart-4` | `#34D399` | Quaternary series |
| `--chart-5` | `#F59E0B` | Quinary series |

---

## Typography

Three fonts with strictly separated roles (see DD-04 in DECISIONS.md).

| Font | Weights loaded | Role | Example usage |
|---|---|---|---|
| **Playfair Display** | 400, 500, 600, 700 (+ italic 400) | Headings, phase titles, hero text | App title, phase H2s |
| **DM Sans** | 300, 400, 500, 600 | Body text, UI labels, general content | Card descriptions, button text |
| **JetBrains Mono** | 400, 500 | Metadata, version tags, overline labels, tracking codes | Section labels in PersonaCard, phase number tags |

### Type Scale (via Tailwind)

Base font size: `16px` (set on `html`).

| Element | Size token | Weight | Notes |
|---|---|---|---|
| `h1` | `text-2xl` | medium (500) | Line-height 1.5 |
| `h2` | `text-xl` | medium | Line-height 1.5 |
| `h3` | `text-lg` | medium | Line-height 1.5 |
| `h4` | `text-base` | medium | Line-height 1.5 |
| `label` | `text-base` | medium | Line-height 1.5 |
| `button` | `text-base` | medium | Line-height 1.5 |
| `input` | `text-base` | normal (400) | Line-height 1.5 |

### Overline / Metadata Labels

The canonical metadata label style (used in `PersonaCard` section headers and PDLC phase tags):

```
text-[10px] font-semibold uppercase tracking-[0.15em]
fontFamily: "'JetBrains Mono', monospace"
```

Apply this pattern for any section divider label, category tag, or "step N of M" indicator.

---

## Spacing & Shape

| Property | Value | Notes |
|---|---|---|
| Base radius | `0.75rem` (12px) | Applied via `--radius`; `rounded-lg` in Tailwind |
| Radius SM | `calc(0.75rem - 4px)` = 8px | `rounded-md` |
| Radius XL | `calc(0.75rem + 4px)` = 16px | `rounded-xl` |
| Section spacing | `mb-8` between section blocks | Used in PersonaCard `SectionBlock` |
| Label-to-content gap | `mb-4` | Below section header rows |
| Icon-to-label gap | `gap-2.5` | In section header flex rows |
| Card padding | `p-4` to `p-6` | Varies by card size; hero cards use more |

---

## Icon Library

All icons come from **Lucide React** — no other icon library is used. Import directly from `lucide-react`. Do not use SVG files or emoji as icons.

Current icon-to-concept mappings (maintain consistency):

| Icon | Concept |
|---|---|
| `Target` | Goals, OKRs, objectives |
| `AlertTriangle` | Pain points, risks |
| `Zap` | Motivators, quick wins |
| `Lightbulb` | Opportunities, ideation |
| `Search` | Research, user interviews |
| `BarChart2` | Market analysis, metrics |
| `ClipboardList` | Requirements, backlog |
| `Palette` | Design |
| `GitBranch` | Sprint planning |
| `Code2` | Development |
| `ShieldCheck` | Testing & QA |
| `Megaphone` | Launch readiness |
| `Rocket` | Customer rollout |
| `Save` | Save actions |
| `Trash2` | Delete actions |
| `Plus` | Add actions |
| `X` | Close / dismiss |
| `Edit2` / `Pencil` | Edit toggle |
| `Check` | Confirm / done |
| `Video` / `Play` | Video embed |

---

## Component Patterns

### 1 · Flip Card (PDLC activity cards)

Three-state interaction: front face → back face → modal editor. See DD-02.

**Front face:** Icon (Lucide, `w-6 h-6`) + phase tag chip + card title (Playfair Display). Background is a linear gradient using the phase accent pair (`from-[colour]/20 to-[shade]/10`).

**Back face:** Description preview (clamped to ~3 lines) + up to 3 bullet points + "Edit & view all" link. Background is the phase `backBg` hex — a tinted dark surface matching the phase colour family.

**Modal editor (Radix Dialog):** `InlineEdit` for title and subtitle; `RichTextEditor` for HTML description; editable numbered bullet list. Closes on X or overlay click; calls `flushPhases()` to immediately persist.

**CSS mechanics:** `perspective: 1000px` on the wrapper; `transform-style: preserve-3d` on the card; `rotateY(180deg)` on click toggled via state. Back face is `rotateY(180deg)` at rest so both faces occupy the same space.

### 2 · Section Block (PersonaCard panel sections)

Used for Goals, Pain Points, Motivators, Opportunities inside the PersonaCard detail panel.

**Anatomy:**
```
[Icon]  [LABEL — JetBrains Mono overline]         [Edit/Check button]
─────────────────────────────────────────────────────
• item 1
• item 2
• item 3
```

**Edit mode:** Switches the bullet list to a `<textarea>` with `whitespace-pre-wrap`. One newline = one bullet item. On confirm (`Check` icon), splits by `\n`, filters blank lines, calls `onUpdate`.

**Colour per section:**

| Section | Icon colour | Dot colour |
|---|---|---|
| Goals | `text-blue-400` | `text-blue-400` |
| Pain Points | `text-red-400` | `text-red-400` |
| Motivators | `text-amber-400` | `text-amber-400` |
| Opportunities | `text-emerald-400` | `text-emerald-400` |

### 3 · Artefact Grid Layout

Three tiers based on position in the `items` array — see `MarketResearchGrid.tsx`:

| Position | Layout | Component |
|---|---|---|
| Index 0 | Full-width hero card | `HeroCard` — large image, title, description, tag |
| Index 1–8 | 3-column grid | `GridCard` — image, tag, title, description |
| Index 9+ | Single-column list | `ListCard` — compact row, no image |

Phase labels rotate through `PHASE_LABELS` and their colours through `PHASE_COLORS` by index. Do not hardcode labels to specific artefacts — the index-based system means inserting items shifts labels automatically.

### 4 · Inline Edit (InlineEdit component)

`contentEditable` single-line element exported from `RichTextEditor.tsx`. Used for titles and subtitles that should feel native to the content rather than form-like.

**States:** Idle (reads as plain text, no visible input border) → Focused (subtle ring, cursor appears) → Blur (fires `onChange`). No explicit save button — blur commits.

**When to use:** Short single-line strings where a traditional `<input>` would look out of place in context (phase titles, card titles, section headings).

**When not to use:** Multi-line content (use `RichTextEditor`) or form fields inside dialogs (use a styled `<input>`).

### 5 · Video Embed Widget

Supports two URL formats, resolved by `toEmbedUrl()`:
- YouTube watch / short URLs → `<iframe>` embed
- Direct `.mp4` / `.webm` / `.ogg` URLs → `<video>` element

Display flow: if `videoUrl` is set → show embed or `<video>`. If not set → show "Add video" prompt. Edit button reveals a URL input. No validation beyond format matching — invalid URLs silently show nothing.

---

## Interaction Design

### Edit Model

The app uses **in-place editing** throughout — no separate "edit mode" at the page level. Every editable element reveals its edit affordance on hover or focus. This keeps the viewing and editing experience unified, which is appropriate for a single-team collaborative tool.

| Pattern | When to use |
|---|---|
| `InlineEdit` (contentEditable) | Short titles and labels in context |
| `SectionBlock` edit toggle | Bullet-list fields (goals, pain points) |
| `RichTextEditor` in modal | Long-form HTML content (PDLC card descriptions) |
| Explicit `<textarea>` | Multi-line plain text outside a rich editor context |

### Save Model

Two save paths exist in parallel — components must use both:

1. **Auto-save (debounced):** Every state change is debounced 800ms by `useFirebaseSync`. This handles normal typing without requiring user action.
2. **Explicit flush:** `flush()` is called on modal close, tab change, and explicit "Save" button press. This ensures data is written before any navigation that might destroy the component's state.

Never rely solely on the debounce for important transitions (modal close, tab switch). Always call `flush()`.

### Progressive Disclosure

Information is revealed in layers — never shown all at once:

```
Stat tile (count)  →  Tab (overview)  →  Card (summary)  →  Modal (full detail + edit)
```

Each layer is complete enough to be useful without going deeper. The modal is the only place where editing happens — never expose editing directly on overview cards (except `InlineEdit` for titles).

### Toast Notifications

All save confirmations use **Sonner** (`import { toast } from 'sonner'`). Toast is the only feedback mechanism for async operations.

- Save success: `toast.success('Changes saved')` or equivalent short message
- No toast for auto-save (debounced) — only for explicit user-triggered saves
- Destructive actions: no toast — use a confirmation dialog (`Dialog.Root`) before the action

---

## Layout

### Page Structure

```
[PasswordGate wrapper]
  └── [App root — full viewport, dark bg]
        ├── Hero area: title + problem statement + 4 stat tiles
        └── Radix Tabs
              ├── users   → 3-column PersonaCard grid
              ├── research → MarketResearchGrid (hero + 3-col + list)
              ├── pdlc    → PDLCSection (pipeline + 3 phase sections)
              └── tasks   → ProgressTracker + KanbanBoard
```

### Responsive Grid

| Context | Grid | Notes |
|---|---|---|
| Persona cards | `grid-cols-1 md:grid-cols-3` | 3-up on desktop |
| Artefact grid | `grid-cols-1 md:grid-cols-3` | Items 1–8 |
| PDLC cards — Strategy | `grid-cols-2 lg:grid-cols-4` | 4 cards |
| PDLC cards — Discovery | `grid-cols-2 lg:grid-cols-5` | 5 cards |
| PDLC cards — Delivery | `grid-cols-2 lg:grid-cols-4` | 7 cards wraps to 2 rows |
| Kanban columns | `grid-cols-1 md:grid-cols-4` | 4 columns |

### Z-Index Layering

Radix UI manages z-index for its primitives (Dialog, Tooltip, etc.) via portals. Do not set manual `z-index` on overlay components — let Radix handle stacking. Use `z-index` only for app-level layers (e.g. sticky headers, floating toolbars).

---

## Adding New Components

Checklist before shipping a new component:

- [ ] Uses only tokens from `theme.css` (no hardcoded hex values except the phase backface hex constants in `PHASE_CONFIG`, which are intentionally static)
- [ ] Icons from Lucide only
- [ ] Text using one of the three font families, with the correct role
- [ ] Edit state uses one of the four established edit patterns (InlineEdit / SectionBlock / RichTextEditor / textarea)
- [ ] Firebase writes go through `useFirebaseSync` — no direct Firebase calls
- [ ] Save path calls `flush()` at appropriate points (modal close, tab change, explicit save)
- [ ] If a new design or architectural decision was made, add it to DECISIONS.md before merging (CI will block the build otherwise)

---

*Last updated: 2026-07-03*
*Update this file when new tokens, patterns, or layout rules are introduced. Pair with DECISIONS.md entries (DD-XX) for the rationale behind any design decision.*
