# Email Queue Review

_Started 2026-04-26 14:52 UTC_

---

## User



## Assistant

I'll create wireframes exploring different approaches to this AI email review dashboard. Since the user is at gmail.com (not ti.com), I'll create an original design — using "TI" as a generic placeholder reference for a fictional company, with no branded UI elements.

Let me ask a few quick questions to focus the exploration, then dive in.

_[tool: questions_v2]_

## User

Questions answered:
- scope: Queue + Drawer (both surfaces, depth)
- variations: 3 directions
- queue_layout: Dense table (Linear-style rows), Split view (list left, preview right, always), Inbox-style (gmail-like)
- drawer_style: Slide-over (queue stays visible on left)
- rationale_emphasis: Inline annotations — highlight phrases in the email tied to sources
- speed_affordance: Confidence-sorted — green ones batch-approvable in one click, Keyboard-first (j/k navigate, e approve, x reject)
- confidence_viz: Colored dot
- trigger_viz: Icon + text (icon represents trigger type)
- tone: B&w + muted color for status only
- tweaks: Toggle sketchy ↔ cleaner lines

## Assistant

I've got the answers. Let me plan and build.

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: snip]_

Now let me build out the wireframes. I'll create a sketchy aesthetic using Caveat (handwritten) + Architects Daughter for accents, with muted color only for status.

_[tool: write_file]_

Now the shared icon/data file and the three queue variations:

_[tool: write_file]_

Now the three queue variations and the drawer:

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

## Assistant

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: done]_

_[tool: get_webview_logs]_

_[tool: read_file]_

The hook returns `{tweaks, setTweak}` — let me confirm and fix.

_[tool: grep]_

[Reading the docstring shows it's array-style destructuring]

_[tool: read_file]_

[Hook returns array tuple, not object. Fix destructuring.]

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

Three sketchy directions for the queue + the drawer with inline-annotation rationale, all on a pan/zoom canvas. Pink underline = AI hallucination caught (the d2 part-variant flag). Tweaks panel toggles sketchy ↔ clean lines, hides annotations, and swaps which draft the drawer demo opens.

## User

Okay, this is a good start. Should I pick the version I like best, or should I describe to you how I envision this fitting into the broader interface?

## Assistant

_[tool: snip]_

Describe how you envision it fitting into the broader interface — that's much more useful at this stage. Picking a winner now would lock in a layout before we know what it has to coexist with (nav, other inboxes, contact pages, settings, mobile, the manager view, etc.). Tell me:

- What sits around the queue (left nav? other tabs? a manager dashboard?)
- Where reps land when they log in
- What other surfaces matter (contact detail page, sent log, settings for trigger rules, team analytics?)
- Any flows that cross the queue (e.g. "snooze until X happens", reply handling, escalation to manager)

Once I know the shape of the broader app, I can pick or hybridize the queue layout based on what fits — and sketch the surrounding surfaces in the same direction.

## User

This is a good view for the workflow once you have the data drafted. What I've been working on in my earlier mockups is a two-sided page.

On the left side, we could have the data inputs and the relevant data feed of things that happened chronologically. Then we could have that filter to something like the Send Queue on the right, which is who we should reach out to and why, with the draft that you can then click into. What do you think?

## Assistant

[Snipping settled iterations]

_[tool: snip]_

[thinking about the two-sided layout]

_[tool: snip]_

Yes — I think this is the right framing, and it actually makes the product *legible* in a way most "AI does sales for you" tools aren't. A few reactions:

**Why it works**
- It makes the AI's reasoning visible at the system level, not just per-draft. Reps can *see* the evidence flowing in and watch it crystallize into actions. That's the "trust" affordance, scaled up.
- It mirrors the rep's actual mental model: "what's happening with my accounts → who do I reach out to." Left = world, right = response.
- Triggers become tangible. A rep can scrub the feed during a slow morning and feel like they're staying on top of things, not just clearing a queue.
- It's a great escape hatch when the queue is wrong. If a draft feels off, you can glance left and see what fed it.

**Things to figure out together**
1. **The link between sides.** Is it tight (clicking a feed event highlights the draft it produced, and vice versa) or loose (two parallel streams)? I'd push for tight — that's the magic.
2. **What lives in the feed.** Just raw signals (quote submitted, datasheet downloaded, EVM ordered)? Or also synthesized ones ("3 engineers @ Acme converging on buck regulators")? I'd argue for both, visually distinct — raw events as small dots, synthesized insights as cards.
3. **Filtering.** Does the feed filter the queue? ("Show me only drafts triggered by EVM orders this week.") That'd be powerful.
4. **What goes *above* the two columns.** A header? Account/segment selector? Time range? Manager-vs-rep mode toggle?
5. **Empty / quiet states.** What does this look like at 7am Monday vs 3pm Thursday?
6. **Does the drawer still slide over the right side, or does it take over the whole page** when you click into a draft? With two columns already busy, I'd lean toward drawer taking the right column only (left feed stays visible — you can keep watching the world while you review).

**Want me to sketch it?** I'd propose:
- One main artboard of the two-sided page, populated
- 2–3 variations of the *left side* specifically (chronological feed vs. grouped-by-account vs. timeline-with-synthesized-insights), since the right side we just built
- A state showing the tight cross-highlight interaction (hover a feed event → its draft glows on the right)
- Drawer-open state, drawer occupying right column only

Should I go build that, or do you want to share your earlier mockups first so I can match their visual language and structure?

## User

Take your best guess and draw up a mock, and then we can iterate from there. In parallel, I'll draw something on paper, and we can just refine as we go.

## Assistant

_[tool: snip]_

_[tool: update_todos]_

[Building the two-sided page now. Left = chronological signal feed, right = condensed Send Queue, with cross-highlight on hover.]

_[tool: write_file]_

_[tool: write_file]_

[Continuing — building the two-sided composition page]

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

[Snipping settled phases]

_[tool: snip]_

_[tool: done]_

[Snipping older settled work]

_[tool: snip]_

_[tool: fork_verifier_agent]_

[Two-sided workbench is on the canvas — main artboard plus a cross-highlight demo and a drawer-in-column state. The earlier queue/drawer explorations are kept in lower sections for reference.](Sales Workflow Wireframes.html)

Three things I'd want your take on:
1. **Synthesized insights vs. raw events** — I split them into two zones in the feed. Right call, or should they be interleaved chronologically?
2. **Cross-highlight model** — hover a signal, its draft glows + others dim. Strong enough, or should clicking a signal *filter* the queue instead of just highlighting?
3. **Drawer takes the right column** — feed stays visible while you review. Feels right but means the drawer is narrower than before. Worth it?

## User

Could we make the inputs maybe a single line, and we could separate them or note them with an icon or by color so we'd be able to see which data stream it came in from? I like having the synthesized insights at the top. We could just have a rolling box on the left, and then on the right we could see the dense table of who we should reach out to based off of that. If you click on it, then a slider should pop over from the right. Does that make sense?

## Assistant

[Got it: one-line signal rows with channel icon/color, synthesized insights stay pinned at top, dense queue table on the right, drawer slides over from the right when clicked.]

_[tool: snip]_

_[tool: str_replace_edit]_

[continuing — updating filter row to show channel legend, swapping queue column for the dense table, and switching drawer to slide-over.]

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

[Now updating the dense table to be more compact for the right column, and updating the artboards.]

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

[Snipping older settled work to free context]

_[tool: snip]_

[Verifying the updated layout]

_[tool: fork_verifier_agent]_

[Done — feed is now one-line rows with channel chip + letter color-coded by data stream, dense queue is on the right, drawer slides over from the right when you click a row. Synthesized insights stay pinned at top of the feed.](Sales Workflow Wireframes.html)

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

_[tool: snip]_

Three updates ready on the canvas — one-line signal rows with color/letter channel codes, dense queue on the right, drawer slides over from the right on click. Synthesized insights pinned at top of the feed. Let me know what to iterate on next.

## User

the channels can be quotes, orders (includes samples, EVMs, etc), TI.com activity (which includes datasheets, product folders, app notes, etc), E2E (online support forum)

Can we now make this high fidelity?I'm liking the direction. Also, for the left side do we want the feed to take up the whole half page, or would it look better in a box that allowed some whitespace around the edges?

## Assistant

[Consolidating channels to 4: Quotes, Orders, TI.com, E2E. Going hi-fi.]

_[tool: snip]_

[Going hi-fi. Plan: collapse channels to 4 (Quotes, Orders, TI.com, E2E), build a real visual system — proper typography, color palette, materials, density. Put the feed in a card with breathing room. New file so the wireframes are preserved.]

_[tool: snip]_

_[tool: set_project_title]_

_[tool: update_todos]_

_[tool: write_file]_

## Assistant

## Assistant

[Snipping older settled iterations]

_[tool: snip]_

[Going hi-fi. Whitespace around the feed = yes; gives the data room to breathe and signals it's a focused workspace, not a chat log. New polished design system.]

_[tool: list_files]_

_[tool: snip]_

_[tool: set_project_title]_

_[tool: write_file]_

[Aggressively snipping older work]

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

[Snipping older settled work to free room]

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: done]_

[I realize I wrote the workbench but I never actually wrote `hf-styles.css`, `hf-data.jsx`, or `hf-feed.jsx` — those are missing. Let me snip and create them.]

_[tool: snip]_

_[tool: update_todos]_

_[tool: list_files]_

_[tool: snip]_

_[tool: list_files]_

[The hi-fi files all exist. Let me check that the workbench HTML is set up and verify what's there.]

_[tool: grep]_

_[tool: read_file]_

[Files exist. Let me verify the page renders cleanly.]

_[tool: snip]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: snip]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

_[tool: snip]_

The hi-fi workbench is on the canvas alongside the wireframe versions. Let me know what to refine next.

## User

Save this design as a PDF: Sales Workflow Wireframes.html

## Assistant

[Snipping older settled work, then preparing the print version]

_[tool: snip]_

_[tool: read_file]_

[Building a paged print version showing each artboard on its own landscape page]

_[tool: snip]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: snip]_

_[tool: open_for_print]_

_[tool: snip]_

A new tab should have opened — use Cmd/Ctrl+P to save as PDF. If popups were blocked, [open it here](https://019dca47-5111-74bb-8b98-9559084faa21.claudeusercontent.com/v1/design/projects/019dca47-5111-74bb-8b98-9559084faa21/serve/Sales%20Workflow%20Wireframes-print.html?t=663ba8610b3fcbc037c76dd6ad8f25746e47757686bb30b77a9ef55f903ccbcd.5cea40b4-485f-4f96-ac67-f3536ce33635.03f7bbd1-c948-401d-8368-59db1c025df8.1777413664).

## User

how should we incorporate integrating the normal email workflow. In addition to this, we could be receiving email from contacts that we need to respond to

## Assistant

[Snipping older settled work to free space]

_[tool: snip]_

_[tool: snip]_

Good question — incoming emails are the other half of the rep's day, and the workbench needs to accommodate both without losing focus. Here's how I'd think about it:

**Three options to consider**

1. **Unified queue, two row types** — incoming replies and AI-drafted outbound sit in the same right column, distinguished by an icon (↩ reply needed vs ✉ AI-drafted). Sorted by urgency together. *Simplest mental model — "this is everything that wants my attention today."*

2. **Tabs at the top of the queue** — "Drafts (9) | Replies (4) | All (13)". Same column, rep flips between. *Cleanest visual separation; lets reps batch one type at a time.*

3. **Three-column workbench** — Signals (left) → AI drafts (middle) → Inbox / replies (right). *Most explicit, but the page gets crowded at 1480 wide.*

**Things to figure out**
- When a contact replies to an AI-drafted email, does that reply pull the original draft's context (signals, rationale, prior thread) into the drawer automatically? *I'd say yes — that's the whole point.*
- Does the AI also draft *replies* to incoming emails, or do reps write those by hand? If AI drafts replies, both row types are essentially "drafts pending review" and the unified queue (option 1) becomes very natural.
- Threading: does an AI outbound + the customer's reply + your follow-up all show as a single thread row that expands?
- Where do already-sent emails awaiting response live? Same view (status: "awaiting reply") or separate?

**My instinct:** option 1 (unified) with a status column distinguishing reply / draft / awaiting-response — but only if AI drafts replies too. If reps reply manually, option 2 (tabs) is cleaner.

Want me to mock one (or two for comparison)?

## User

Yes, I agree that it should be the unified approach. I'm not sure why we just necessarily need to differentiate reply versus outreach, because both are things in the queue that need to go out. What we do need is a way to show the priority, I think. If there's an email someone's waiting on a reply from, maybe there's a filter at the top where we can say "waiting for reply" versus "not". For those replies, it could look like an email where you see the email history in line, and then maybe on the right side we have any extra context that's needed. Let's keep talking through it before designing something.

## Assistant

[Continuing the discussion — agreeing with unified approach, thinking through priority filters and inline thread context]

_[tool: snip]_

_[tool: snip]_

Good — let me push on a few questions before we sketch.

**On priority/sorting:** "Waiting for reply" feels like a *filter*, but the more interesting design question is: what's the natural sort order for a unified queue? My instinct:

1. **Hot replies** — customer replied, ball is in our court (esp. if >24h old)
2. **Outbound drafts ready to send** — fresh signals, high confidence
3. **Awaiting their reply** — sent, no response yet (mostly hidden by default; available via filter)
4. **Snoozed / deferred** — out of the way

The thing reps will dread is a customer reply sitting unanswered for 3 days because it got buried under fresh AI drafts. So replies probably want to *float to the top by default* — not because they're labeled differently, but because urgency naturally puts them there.

**On inline thread context:** love this. For a reply row, the drawer (or expanded row) shows the email thread top-to-bottom — their latest message at the top, then your prior outbound, then the original. Right side stays the rationale rail, but it shifts: instead of "why we drafted this," it becomes "**what they're asking for + what you've told them before + relevant context to include in the reply.**"

**A few open questions:**

1. **Does AI draft the reply itself?** If a customer replies "yes I'm interested, can you send specs for the RGZ variant?" — does the AI auto-draft "Sure, attaching SLAA660 and PMP40123, also you might want…"? I'd argue yes — same trust model as outbound, same rationale rail showing why it picked those attachments.

2. **What about replies that don't need an AI draft at all?** A one-liner "thanks!" from a customer. Does it just disappear from the queue? Get auto-acknowledged? Marked done?

3. **How do reps see *prior* email history** when reviewing an outbound draft? If we're proposing a cold outreach to Marcus and there's already a thread with him from 6 months ago — that needs to be visible, otherwise the AI's draft might step on prior context.

4. **What signals does an incoming reply generate on the left?** When a customer replies, does that show up in the signals feed as an event? ("Marcus replied to your email about TPS6521905") That'd preserve the "left = world, right = response" model nicely.

5. **What about emails that need a *human* not the AI?** A negotiation, a complaint, an exec intro. Should the queue mark those "draft yourself" with no AI suggestion, or should the AI take a swing and let the rep heavily edit?

Which of these matter most to nail down before sketching?

## User

1. Yes, the goal is to have an AI draft of a response. Now you will need to learn where it is high enough in confidence that we can send it on its own versus what types of responses need a human to review because they are not accurate enough yet. 
2. That's a good question. If someone is working from here, I think the assumption is that they should not need to open up their Outlook email and have that as well. Maybe we could have it on the left side as a signal of whether we should have an email signal. We have this person replied as a signal on the left, and then if there's no response needed, it just never makes it into the send queue?
3. I will have email access to a person's email and to certain domains or email addresses. If Marcus is a contact that I have access to, then whenever we look to draft something to Marcus, we should be able to pull all of the history for him (whether it is email or browsing activity, etc.) and use that to draft the upcoming email. 
4. Yes, this is what I was saying earlier. I like that approach. That way if it's something that requires a reply, then we Yes, this is what I was saying earlier. I like that approach. That way, if it's something that requires a reply, then we have a reply drafted in the queue, and if it doesn't, then people can at least see that it came in.
5. this raises a good point. The Send Queue should actually be an Action cue...because what we want is to queue up actions, where most of them are email but not all of them will be. We want to learn where a human-in-the loop is important. There should be certain scenarios that are always human led, and some controls where the user can select how they want this to function. Actions could be 'set up a call', 'set up a call with the product line', or you could have a VIP contact that you want to manage personally.

## Assistant

[aggressive snip]

_[tool: snip]_

This is a really important reframe — "Send Queue" → "Action Queue" changes the product. Let me reflect back what I'm hearing and push on a few things:

**What this means structurally**

- The right column is no longer just emails. It's a heterogeneous list of *actions to take* — most will be emails (outbound drafts + reply drafts), but also "schedule a call," "loop in product line," "intro to FAE," "do nothing — just FYI."
- Each action has a **confidence level** that determines who handles it. High confidence = AI sends autonomously (and it shows up in a "Sent automatically" log, not the queue). Medium = AI drafts, human reviews. Low / sensitive = human drafts from scratch, AI just flags the trigger.
- Some categories are **always human** by policy: VIP contacts, complaints, negotiations, anything involving pricing or legal language.

**The signals feed becomes richer too**

- Customer replies show up there as events ("Marcus replied · re: TPS6521905 quote")
- If the reply needs a response → an action lands in the right column
- If the reply doesn't need one ("thanks!") → it stays as a signal only, no action queued
- Email history for any contact you have access to feeds into both the rationale ("based on your March thread with Marcus, he's already seen the SLAA660 — don't re-send") and the drawer's context panel

**Design implications I want your take on:**

1. **Action types need visual differentiation.** Email-reply, email-outbound, schedule-call, loop-in-PM, intro-FAE — should each have an icon/label, or stay visually unified with just a small type tag? I lean toward small type tag so the queue still feels like one list.

2. **Confidence affects UI density.** A high-confidence email draft can be a one-line row ("Send to Marcus re: quote · ✓"). A medium-confidence one needs to show preview text. A "human-led" action needs to show the trigger and ask "what do you want to do?" with no draft. Three densities in one queue?

3. **Auto-sent shouldn't disappear silently.** Reps need to trust the system, which means a visible "auto-sent today (12)" line at the top of the queue, collapsible — like a digest of what the AI did on their behalf.

4. **Controls live where?** "Always human-led for VIPs" and "auto-send threshold = 95%" are settings. Per-rep? Per-account? Global with overrides? I'd argue: account-level rules (set on the contact/company) + global defaults in a Rules tab.

5. **The drawer becomes polymorphic.** Email drawer = annotations + thread. Schedule-call drawer = calendar picker + suggested slots + meeting prep notes. Loop-in-PM drawer = picks the right PM from product taxonomy + drafts the internal handoff message. Same shell, different content based on action type.

Should I sketch this — Action Queue with mixed action types, confidence-driven row densities, and an "auto-sent" digest? Or keep talking through the model first?

## User

1. Agreed
2. Sure, let's try this
3. Agreed
4. Would this be the rules tab at the top?
5. Agreed, but let's not draft those screens yet, let's save that for later. 

Right now the right slider is too narrow and doesn't give enough space for the content. can we move it over to expand the space? My goal is to make the updates to this main page and have a clickable page that I can share to Claude Code and get on Vercel

## Assistant

_[tool: snip]_

_[tool: list_files]_

_[tool: snip]_

_[tool: read_file]_

[Reading the relevant files to fix drawer width and queue/feed updates]

_[tool: snip]_

_[tool: grep]_

[snipping aggressively before continuing]

_[tool: snip]_

_[tool: str_replace_edit]_

[Continuing — need to also handle the Action Queue update + Rules tab note. Let me check the queue file and the workbench.]

_[tool: snip]_

_[tool: read_file]_

[Aggressively snipping resolved iterations and large tool outputs]

_[tool: snip]_

[Now updating the queue to be Action Queue with row densities + auto-sent digest, and noting Rules tab.]

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: snip]_

_[tool: update_todos]_

[Action Queue is live — heterogeneous action types with small type tags (Email/Reply/Call/Loop PM/Human), confidence-driven row density (high-conf rows are tight, lower-conf show preview text, human-led shows "what do you want to do?" instead of a draft), and an "auto-sent today (12)" digest pinned at the top.](Sales Workflow Wireframes.html)

