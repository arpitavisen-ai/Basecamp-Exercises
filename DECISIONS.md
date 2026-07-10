# Project Decision Log

Living document tracking architectural, design, and coding decisions made across this project.
Updated automatically as decisions are made, changed, or removed.

---

## Architectural Decisions

### AD-01 · Firebase Realtime Database as the persistence layer
**Status:** Active  
**Date:** Project inception  
**Decision:** Use Firebase Realtime Database (not Firestore) for all app state persistence.  
**Rationale:** Realtime sync out of the box with `onValue` listeners; no backend needed; simple flat key-value structure suits the app's data shape. Firestore would add query flexibility we don't need.  
**Trade-off:** All data lives under a single project node — no per-user isolation. Acceptable for a shared collaborative tool where all users work on the same product document.

---

### AD-02 · Store all Firebase values as JSON strings
**Status:** Active  
**Date:** Project inception  
**Decision:** Every value written to Firebase is serialised with `JSON.stringify` before write, and deserialised with `JSON.parse` on read.  
**Rationale:** Firebase's Realtime Database silently strips array holes and converts arrays with numeric keys to objects. Storing as a JSON string guarantees exact round-trips for nested arrays, typed fields, and all complex structures without Firebase conversion surprises.  
**Where:** `useFirebaseSync.ts` — all reads parse, all writes stringify.

---

### AD-03 · Versioned seed data pattern — seed-if-empty, never overwrite
**Status:** Active  
**Date:** Project inception  
**Last updated:** 2026-07-03 — fixed overwrite bug  
**Decision:** All default content is defined in `src/app/data/seedData.ts` as `SEED_*` constants alongside a `SEED_VERSION` integer. On app mount, if the stored `dataVersion` is lower than `SEED_VERSION`, each path is seeded **only if it does not already exist in Firebase**. Existing user data is never overwritten.  
**Rationale:** The original implementation used unconditional `set()` calls — every `SEED_VERSION` bump overwrote user edits in Firebase, reverting all in-app changes. The fix uses `seedIfEmpty()`: check the path first, write only if absent. `SEED_VERSION` now signals "check for new empty paths" not "reset everything."  
**When to bump SEED_VERSION:** Only when adding a brand-new Firebase path that needs a default value for first-time users. Never bump it to push content updates to existing users — edit Firebase directly or accept that existing users keep their data.  
**Merge strategy for artefact arrays:** `marketResearch` is merged by artefact `id` — new seed items are appended only if their ID is not already present in Firebase. This allows new artefacts to appear for existing users without touching their edits or the existing items.  
**Current version:** `SEED_VERSION = 7`

---

### AD-04 · Debounced write strategy in `useFirebaseSync`
**Status:** Active  
**Date:** Project inception  
**Decision:** Local state updates are immediate; Firebase writes are debounced by 800ms. A `localPendingRef` flag suppresses incoming Firebase `onValue` events while a local write is in flight.  
**Rationale:** Prevents every keystroke in an editable field from triggering a Firebase write. The pending flag prevents the remote echo from the previous write overwriting the user's in-progress input mid-edit.  
**`flush()` method:** Exposed from the hook so parent components can force an immediate write (e.g. on tab change or explicit Save button).

---

### AD-05 · No user authentication
**Status:** Active  
**Decision:** The app has no login. All users share the same Firebase database with full read/write access.  
**Rationale:** This is a single-team internal discovery tool. Auth would add friction and complexity with no benefit at current scale.  
**Risk:** Anyone with the URL can edit all content. Acceptable for current use; revisit if the tool is opened to broader audiences.

---

### AD-06 · All secrets stored in GitHub Secrets — never committed to the repository
**Status:** Active  
**Date:** 2026-07-02  
**Decision:** No API tokens, credentials, or secrets are committed to the repository. All secrets required by CI/CD are stored in GitHub Actions Secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `ATLASSIAN_TOKEN`). Tokens needed locally only (Figma MCP) go in local config files that are never tracked by git.  
**Rationale:** GitHub's secret scanning blocks pushes containing known token patterns — this was encountered in practice when a Figma token was accidentally committed to README.md and blocked the push entirely. Beyond the CI gate, committed tokens are permanent in git history even after deletion, and are visible to anyone with repo access.  
**Incident:** Figma token (`figd_...`) and Atlassian token were committed to `README.md` in early commits. Both were removed, tokens revoked, and the push was unblocked via GitHub's secret scanning allow-list. The allow-list unblock should only ever be used for already-revoked tokens.  
**Where to add secrets:** GitHub → repo → Settings → Secrets and variables → Actions. For local-only tokens, use a `.env` file covered by `.gitignore` or the tool's own local config (e.g. MCP config for Figma).

---

### AD-07 · Local-first review workflow: develop → main promotion gate
**Status:** Active  
**Last updated:** 2026-07-03  
**Decision:** All development work happens on the `develop` branch. Pushes to `develop` trigger a Vercel **preview** deploy and tests — never production. Production is updated only by running `npm run promote`, which: builds locally, asks for confirmation after local review at `localhost:5173`, then merges `develop → main` and pushes — triggering the CI pipeline that deploys to Vercel production.  
**Rationale:** Prevents untested changes from going directly to production. Local review at `localhost:5173` catches visual and UX issues that Playwright tests may miss. The promote script enforces the sequence: build passes → local review confirmed → merge → deploy.  
**Workflow summary:**
```
npm run dev          ← review at localhost:5173
npm run promote      ← when happy: merges develop→main, pushes, triggers production deploy
```
**Two remotes in use:** `origin` → `github.com/arpvisen/...` (personal); `upstream` → `github.com/arpitavisen-ai/...` (work/AI account). `npm run promote` pushes to `upstream`.

---

## Design Decisions

### DD-01 · Static config / editable data split in PDLCSection
**Status:** Active  
**Date:** Early build  
**Decision:** PDLC cards are split into two layers: `PHASE_CONFIG` (icons, colours, accent gradients — never persisted) and `EditablePhase` / `EditableCard` (titles, descriptions, bullets — persisted in Firebase via `useFirebaseSync`).  
**Rationale:** Icons are React nodes and can't be serialised to Firebase. Colours and gradients are design constants that shouldn't be user-editable. Separating concerns keeps Firebase data clean and portable while allowing rich visual presentation.  
**Where:** `PDLCSection.tsx` — `PHASE_CONFIG` is the static lookup; `DEFAULT_PHASES` provides the editable defaults.

---

### DD-02 · Flip card interaction for PDLC activities
**Status:** Active  
**Decision:** Each PDLC activity card has a front face (title + tag) and a back face (description preview + bullets). Clicking the card flips it; the back face has an "Edit & view all" link that opens a full modal editor.  
**Rationale:** Keeps the grid scannable and compact while giving access to full detail on demand. The progressive disclosure (card → back → modal) avoids cluttering the default view.

---

### DD-03 · Discovery phase card order reflects MVP discovery sequence
**Status:** Active  
**Date:** After MVP discovery plan update  
**Decision:** The 5 Product Discovery cards are ordered to mirror the actual MVP discovery workflow: User Interviews → Feedback Analysis → Tech Discovery → Ideation & Hypotheses → Design Prototypes.  
**Rationale:** The PDLC section is used as a presentation artefact as well as documentation. Ordering cards in execution sequence makes it immediately readable as a plan, not just a list of activities.

---

### DD-04 · Typography system: three fonts with distinct roles
**Status:** Active  
**Decision:** Three Google Fonts are used with strictly separated roles:
- **Playfair Display** (serif) — headings, phase titles, hero text. Conveys authority and trust.
- **DM Sans** (sans-serif) — body text, UI labels, general content.
- **JetBrains Mono** (monospace) — metadata labels, version tags, tracking codes, uppercase overline text.  
**Rationale:** Each font occupies a distinct visual register. Mixing them without rules would feel chaotic; the role separation creates hierarchy without needing font-weight variation alone.

---

### DD-05 · Artefacts tab as the single source of truth for discovery outputs
**Status:** Active  
**Decision:** All discovery artefacts (market research, personas analysis, OKRs, roadmap, research plan, findings) are stored as `marketResearch` items in Firebase and rendered in the Artefacts tab via `MarketResearchGrid`.  
**Rationale:** A single data structure and rendering path for all artefact types. Rich content is stored as HTML strings in a `richContent` field, rendered in an expanded card modal. Thumbnails are Unsplash URLs for visual variety without asset hosting.

---

### DD-06 · Ingest tab removed — out of MVP demo scope
**Status:** Active  
**Date:** 2026-07-03  
**Decision:** The NHS FFT Data Ingest tab, `NHSFFTUpload` component, `fftParser` utility, `fftRecords` Firebase state, and the related acceptance test (`09-nhs-fft-upload.spec.ts`) were removed entirely. The default tab is now User Analysis.  
**Rationale:** The Ingest tab was a data-loading utility for internal use during discovery. It is not part of the MVP demo narrative — the demo focuses on personas, discovery artefacts, PDLC, and the delivery backlog. Including it added complexity without adding value to the demo audience.  
**Files removed:** `src/app/components/NHSFFTUpload.tsx`, `src/app/utils/fftParser.ts`, `src/imports/sample_nhs_fft_data.csv`, `tests/acceptance/09-nhs-fft-upload.spec.ts`.

---

### DD-07 · Technical Discovery Report as a seeded artefact
**Status:** Active  
**Date:** 2026-07-03  
**Decision:** The Technical Discovery Report is stored as a seed artefact (`artefact-tech-discovery`) in `SEED_MARKET_RESEARCH`. It covers: MVP technical scope, tech requirements, NHS infrastructure constraints (network proxies, HSCN, N3, device environment, identity/access, data residency/IG), technical limitations found in discovery, proposed MVP architecture, reusable frontend components, and backend patterns.  
**Rationale:** Technical discovery findings must be discoverable alongside all other artefacts in the Artefacts tab. Storing it as a seed artefact means it appears automatically for all users (new and existing, via the merge-by-ID strategy) without requiring manual Firebase edits.  
**Where:** `src/app/data/seedData.ts` — `artefact-tech-discovery` entry in `SEED_MARKET_RESEARCH`.

---

### DD-08 · Discovery Research Plan as a structured 5-stage artefact
**Status:** Active  
**Date:** After MVP discovery plan update  
**Decision:** The Discovery Research Plan artefact is structured around 5 sequential stages (User Interviews → Feedback Analysis → Tech Discovery → Ideation & Hypotheses → Design Prototypes) scoped strictly to MVP demo requirements.  
**Rationale:** Scoping discovery to MVP prevents over-investigation before the first demo. Each stage has a clear purpose, participant list, and output — making it executable, not aspirational.

---

### DD-09 · Prototype artefact opens an in-tab detail view via state switch
**Status:** Active  
**Date:** 2026-07-08  
**Decision:** Clicking the Prototype card in the Artefacts tab replaces the `MarketResearchGrid` with a `PrototypeDetailView` component, controlled by `artefactDetailId` state in `App.tsx`. A back button returns to the grid. The Prototype card does not open the standard `ItemModal`; `MarketResearchGrid` intercepts its click via an `onOpenDetail` callback and the modal is skipped by filtering `artefact-prototype` from the modals render.  
**Rationale:** The app has no router. An in-tab state switch is the established pattern (matches how the app handles all "navigation") and requires no new dependencies. The same `onOpenDetail` callback is available for future artefacts that need their own detail views.  
**Trade-off:** The back button does not update the URL, so deep-linking is not possible. Acceptable for a demo tool; if URL-based navigation is added later, this state can be promoted to a query param.

---

## Coding Decisions / Best Practices

### CD-01 · Custom `useFirebaseSync` hook as the single data access pattern
**Status:** Active  
**Decision:** All Firebase reads and writes go through `useFirebaseSync<T>(path, initialValue)`. No component calls Firebase directly.  
**Rationale:** Centralises debouncing, pending-state management, JSON serialisation, and initial seeding logic. Components get a `[value, update, flush]` tuple that behaves like `useState` with automatic persistence.  
**Signature:** Returns `[value, update, flush] as const` — `flush` forces an immediate write, bypassing the debounce (used on save buttons and tab changes).

---

### CD-02 · `localPendingRef` pattern to prevent Firebase echo
**Status:** Active  
**Decision:** When a local edit is written to Firebase, `localPendingRef.current = true` is set immediately. The `onValue` listener skips updates while this flag is true. It clears when the Firebase write promise resolves.  
**Rationale:** Without this, Firebase echoes the write back to all listeners including the originating client. Without the guard, the echo would overwrite in-progress user edits during the debounce window.

---

### CD-03 · Seed data separated into its own module
**Status:** Active  
**Decision:** All seed content lives in `src/app/data/seedData.ts`, exported as named constants. `App.tsx` imports only what it needs; `PDLCSection.tsx` defines its own `DEFAULT_PHASES` separately (not seeded via the version mechanism — seeded by `useFirebaseSync` on first write when the path is empty).  
**Rationale:** Keeps `App.tsx` from becoming a data file. Seed constants are independently readable and testable. `SEED_VERSION` is a single number to bump — no other change needed to trigger a re-seed.

---

### CD-04 · `DEFAULT_PHASES` in PDLCSection is a fallback, not a forced seed
**Status:** Active  
**Decision:** `DEFAULT_PHASES` is passed as the `initialValue` to `useFirebaseSync('pdlcPhases', DEFAULT_PHASES)`. It is only written to Firebase if the `pdlcPhases` key does not yet exist — not on every version bump.  
**Rationale:** PDLC content is expected to be heavily edited live. Forcing a re-seed on every `SEED_VERSION` bump would destroy user edits. The version-gated mechanism in `App.tsx` only covers `problemStatement`, `userSegments`, and `marketResearch`.  
**Implication:** To push a PDLC default update to existing users, the `pdlcPhases` key in Firebase must be manually cleared, or a separate migration mechanism must be added.

---

### CD-05 · Drag-and-drop via `react-dnd` with HTML5Backend
**Status:** Active  
**Decision:** The Kanban board uses `react-dnd` with `HTML5Backend` for drag-and-drop task reordering. The `DndProvider` wraps the entire app in `App.tsx`.  
**Rationale:** `react-dnd` provides a declarative `useDrag` / `useDrop` hook API that separates drag logic from render logic. HTML5Backend uses native browser drag events — no additional dependencies.  
**Note:** `DndProvider` must be at the root level (not inside a tab) because drag state is shared across the tree.

---

### CD-06 · NHS FFT data parsed client-side via `xlsx`
**Status:** Active  
**Decision:** NHS FFT upload files (`.xlsx`, `.csv`) are parsed in the browser using the `xlsx` library. Parsed records are deduplicated by composite key (`trustCode|wardCode|responseDate|overallExperience|comments`) before being merged into Firebase.  
**Rationale:** No server required for file processing. Deduplication on the client prevents accidental double-imports from re-uploading the same file.  
**Where:** `src/app/utils/fftParser.ts` (parsing) + `App.tsx` `handleFFTImport` (dedup + merge).

---

### CD-10 · Prototype version HTML stored as raw strings in Firebase RTDB
**Status:** Active  
**Date:** 2026-07-08  
**Decision:** Each uploaded `.html` prototype file is read client-side with `FileReader.readAsText()` and stored as a raw HTML string inside the `PrototypeVersion` object. The full array is persisted to Firebase at the `prototypeVersions` path, serialised as a JSON string per AD-02. To open a version, the HTML string is wrapped in a `Blob` and opened via `URL.createObjectURL` in a new browser tab — never injected into the host DOM.  
**Rationale:** Firebase Storage is not configured for this project (the `storageBucket` field in `firebase.ts` is auto-generated but `getStorage` is never called). Storing HTML as a string in RTDB is consistent with how the existing `report` field works for artefact PDFs — no new infra needed. Prototype files are typically 50–150 KB; five versions totals under 1 MB, well within RTDB's 10 MB node limit.  
**Trade-off:** Large or numerous prototype HTML files could bloat the DB. If storage grows beyond ~2 MB, migrate `htmlContent` to Firebase Storage URLs (the field name stays the same; only the write/read path changes).  
**Security:** The HTML is opened as an isolated standalone document via Blob URL, never via `innerHTML` or `dangerouslySetInnerHTML` into the host app. This prevents uploaded prototype code from touching the host's DOM.  
**Where:** `src/app/components/PrototypeDetailView.tsx` — `handleAdd` (write), `openHtmlInNewTab` (read).

---

### CD-07 · Rich text stored as HTML strings
**Status:** Active  
**Decision:** The `description` field on PDLC cards and the `richContent` field on artefacts store raw HTML strings. These are rendered with `dangerouslySetInnerHTML` inside controlled components.  
**Rationale:** The `RichTextEditor` component produces HTML. Storing HTML directly avoids a serialisation layer (e.g. converting to/from a custom AST). The content is user-generated within the app — not from external sources — so XSS risk is contained.

---

### CD-08 · Acceptance tests run against a deployed preview URL, not localhost
**Status:** Active  
**Decision:** Playwright tests in CI run against the Vercel preview deployment (`BASE_URL` env var), not a locally-started dev server.  
**Rationale:** Tests exercise the production build (Vite bundled, environment variables injected by Vercel) rather than the dev server. Catches build-time issues that wouldn't surface in a `vite dev` environment.

---

### CD-09 · DECISIONS.md is a release gate — checked automatically on every CI run
**Status:** Active  
**Date:** 2026-07-02  
**Decision:** Two enforcement mechanisms ensure DECISIONS.md stays current:
1. **CI step** (`ci.yml`) — runs before Playwright tests; fails the build if: the file is missing, any of the three required sections are absent, the `Last updated` date line is missing, or architectural source files changed without DECISIONS.md also changing.
2. **Playwright static test** (`10-decisions-doc.spec.ts`) — no browser required; validates structure (all sections present, min entry counts), field completeness (every entry has Status / Decision / Rationale), date freshness (≤ 90 days old), and the git-diff drift check.  
**Rationale:** Documentation that isn't enforced becomes stale within weeks. Tying it to the release gate means it either gets updated or the build breaks — the friction is intentional.  
**Architectural files watched:** `useFirebaseSync.ts`, `firebase.ts`, `seedData.ts`, `App.tsx`, `PDLCSection.tsx`, `ci.yml`.

---

*Last updated: 2026-07-08 (added DD-09 prototype in-tab detail view; added CD-10 prototype version HTML storage; added artefact-prototype to SEED_MARKET_RESEARCH; SEED_VERSION bumped to 8)*  
*Update this file whenever a significant architectural, design, or coding decision is made, changed, or reversed.*
