# CLAUDE.md — TI Sales Workbench

Memory file for Claude Code. Read first when picking up this repo.

## What this is

A clickable hi-fi prototype of a sales workbench for TI (Texas Instruments) reps. AI watches customer signals, drafts outreach actions, and routes them through a queue for human review. Originally exported from Claude Design as static JSX prototypes; rebuilt here as a real Vite + React app deployed to Vercel.

**Live repo:** https://github.com/ericasko/TI-Sales-Workflow
**Vercel:** auto-deploys on push to `main`

## Stack

- Vite + React 18 (no router, no state lib — single-page app)
- Plain CSS with design tokens in `:root` (no Tailwind, no CSS-in-JS lib)
- Inline styles in components for one-off layout
- Inter (UI) + JetBrains Mono (numerics/code)
- No backend — all data is mocked in `src/data/index.js`

## File map

```
src/
  main.jsx                      // React entry; imports global CSS
  App.jsx                       // renders <HFWorkbench />
  data/index.js                 // CHANNELS, DRAFTS, ACTIONS, SIGNALS, THREADS, SYNTH_INSIGHTS, LOG_TYPES
  styles/hf.css                 // design tokens + component styles (.hf scope)
  components/
    HFWorkbench.jsx             // top-level shell: nav + greeting + 2-col layout, owns drawer + modals + lifted state
    HFFeed.jsx                  // left column: signals + synth insights + search/pin/channel filters + Log button + take-action
    HFQueue.jsx                 // right column: action queue + sort/filter + auto-sent digest + Add action button
    HFDrawer.jsx                // slide-over right panel: email + rationale rail + intel tabs
    AddActionModal.jsx          // modal: rep composes new outreach (contact + intent) → AI-drafted action
    LogSignalModal.jsx          // modal: rep logs a call/meeting/note as historical context
project/                        // ORIGINAL Claude Design prototype files - reference only, do not edit
chats/chat1.md                  // design conversation that produced the prototype
```

## Design system (cheat sheet)

All component classes are scoped under `.hf`. Tokens in `:root`:

- **Surfaces:** `--bg`, `--surface`, `--surface-2` (recessed), `--surface-3` (hover)
- **Ink:** `--ink` → `--ink-5` (primary → quaternary text)
- **Accent:** `--accent` (TI red `#cc0000`) — used very sparingly, never for content
- **Status:** `--ok` / `--warn` / `--bad` for confidence states
- **Channels:** `--ch-quote` / `--ch-order` / `--ch-email` / `--ch-web` / `--ch-e2e`
- **Radii:** `--r-sm` 4 / `--r` 6 / `--r-lg` 10 / `--r-xl` 14

Reusable component classes: `.btn` (+ `.sm`/`.xs`/`.primary`/`.accent`/`.ghost`/`.icon`), `.chip`, `.dot`, `.chc` (channel chip), `.av` (avatar), `.cb` (checkbox), `.kbd`, `.anno` (inline annotation), `.feed-row`, `.queue-row`, `.col-h`, `.micro`, `.search-input`, `.who-link`, `.lit` / `.dim` (cross-highlight states).

## Data model

**Channels (7):** `quote` (Q, red), `order` (O, green), `email` (@, teal), `web` (T, blue, label "TI.com"), `e2e` (E, purple), `call` (✎, amber, label "Logged" — rep-logged calls/meetings/notes), `synth` (↯, gold gradient — synthesized AI insight, not a raw signal).

**DRAFTS** — 9 mock drafts, each with `{id, rec, ch, why, subject, preview, attach, conf, model, flag?, multi?}`. `conf` ∈ `ok` | `warn` | `bad`.

**ACTIONS** — DRAFTS with an `actionType` tag: `email-out` | `email-reply` | `call` | `loop-pm` | `intro-fae` | `human`. Drives the small chip + density variation in the queue. `human` rows show "Human-led — no draft. What do you want to do?" instead of a subject.

**SIGNALS** — 17 events across the 6 channels with `{id, time, ch, who, co, text, draftId, weight}`. `draftId` may be null (e.g. "thanks!" replies that don't need an action).

**THREADS** — keyed by draftId; array of `{from: "us"|"them", date, body}`. Only present for drafts where the contact has prior email history (currently d1, d2, d4). Renders in the drawer's Conversation history tab, newest first.

**SYNTH_INSIGHTS** — 2 pinned cards at the top of the feed; aggregate patterns across multiple signals.

## Key UX decisions (from design conversation)

1. **Two-sided workbench:** left = world (signals), right = response (action queue). Cross-highlight links them.
2. **Cross-highlight is contact-based, not draft-based.** Hovering any row lights up everything tied to that contact (person, or company for synth/aggregate). State = `hoverContact` lifted to HFWorkbench.
3. **Action Queue, not Send Queue.** Most actions are emails but the queue also holds calls, loop-in-PM, intro-FAE, human-led. AI-confidence drives row density: high-conf rows are tight, lower-conf rows show preview text, human-led rows have no draft.
4. **Auto-sent digest** at top of queue collapses the AI's autonomous sends so reps trust the system without losing visibility.
5. **Drawer slides over the queue** when a row is opened (not the whole page) — feed stays visible. Drawer width is `min(980px, 68vw)`.
6. **Inline annotations** in the email body link to a rationale rail on the right. Flagged annotations (e.g. "AI cited wrong variant") use `--bad` color and a different highlight.
7. **Conversation history tab** in the drawer shows the prior email thread when there's been a customer reply. Tab label gets a teal count badge when history exists.
8. **Email channel** for incoming customer emails — replies that need a response link to a reply draft; one-line "thanks" replies stay as signal-only with no action queued.
9. **Sort vs filter:** Action Queue's sort = urgency / confidence (urgency keeps curated source order; confidence reorders ok→warn→bad with human-led pinned at bottom). Account-based filtering lives in a Filter dropdown, not a sort.
10. **Signals filtering:** channel filter buttons + search input + click-to-pin (clicking a name or company in any row pins the filter; chip with × clears it).
11. **Manual entry points** for when AI didn't auto-generate something:
    - **"+ Add action"** button in the Action Queue header → opens `AddActionModal`. Rep picks contact + one-line intent; AI simulates a draft, drawer opens for review. Created action is prepended to the queue and tagged "Created by you" (`createdByUser: true`).
    - **"+ Log"** button in the Signal panel header → opens `LogSignalModal`. Rep records a call / meeting / note (with optional notes/transcript). Logged signal lands in the feed (channel `call`) tagged "Logged by you" (`loggedByUser: true`).
    - **"Take action"** affordance on any feed signal without a draftId → opens `AddActionModal` pre-filled with the signal's contact and a suggested intent.
    - State for rep-created items is lifted to `HFWorkbench` (`extraSignals`, `extraActions`) and prepended to the originals before passing to children.

## Dev workflow

```bash
npm install        # first time
npm run dev        # local dev server on :5173
npm run build      # production build into dist/
```

## Git workflow — IMPORTANT CAVEATS

**Commits must use `--no-gpg-sign`.** The Anthropic signing service in this sandbox returns HTTP 400 "missing source" on every request — it's a backend bug, not transient. Don't waste cycles retrying. The user has approved skipping signing for this repo.

**Push uses `$GITHUB_TOKEN` from user settings.** The token is persisted in `~/.claude/settings.json` under `env.GITHUB_TOKEN` so it's available across sessions. It's a fine-scoped PAT (Contents: read+write, TI-Sales-Workflow only). Use the URL form:

```bash
git push "https://x-access-token:$GITHUB_TOKEN@github.com/ericasko/TI-Sales-Workflow.git" main:main
```

Never store the token in `git remote set-url` — keep it inline so it doesn't end up in the repo's git config. Always pipe push output through `sed 's/github_pat_[A-Za-z0-9_]*/<TOKEN>/g'` so the token value doesn't leak into transcripts.

If the token has been revoked or `$GITHUB_TOKEN` is empty, ask the user for a fresh fine-grained PAT and update it via `update-config` (env var `GITHUB_TOKEN` in `~/.claude/settings.json`).

**Commit message convention:** Conventional, imperative mood. End every commit body with the Claude Code session URL: `https://claude.ai/code/session_01StKbM5ur4VLtrZFdEw7BYc`. Don't squash — small focused commits per change.

**Don't pre-emptively run `git push` after committing.** User-initiated pushes only, unless the user has clearly delegated push authority for the current task.

## Things that are NOT in scope yet

- Rules tab (auto-send threshold, VIP overrides, account-level rules)
- Accounts page, Sent log, Team tab — nav tabs exist but pages don't
- Mobile / responsive layout
- Real auth, real backend, real keyboard navigation past `j`/`k`/`Esc`
- Polymorphic drawers for non-email actions (call, loop-pm) — scaffolded in data, not in UI

When the user asks for any of these, scope them with them first; don't quietly build adjacent features.

## When iterating

- For broad layout/structure changes or new screens, the user may go to Claude Design first to explore variants, then bring the result back here for the production build.
- For everything else (refining what's built, real behavior, content), iterate here directly.
- The `project/` directory holds the original prototype files — they're frozen reference. Edit `src/`, not `project/`.
