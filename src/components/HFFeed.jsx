import { useState } from 'react';
import { CHANNELS } from '../data/index.js';

// For cross-highlight purposes a contact is identified by person name,
// except for synth/aggregate signals where there's no individual — use company.
const signalContact = (s) => (s.ch === "synth" ? s.co : s.who);

const matchesSearch = (s, q) => {
  if (!q) return true;
  const t = q.toLowerCase();
  return s.who.toLowerCase().includes(t) || s.co.toLowerCase().includes(t);
};

const matchesPin = (s, pin) => {
  if (!pin) return true;
  return s.who === pin || s.co === pin;
};

const groupSignals = (signals) => [
  { label: "Today · Apr 28",     items: signals.filter(s => !s.time.startsWith("yest") && !s.time.startsWith("Mon")) },
  { label: "Yesterday · Apr 27", items: signals.filter(s =>  s.time.startsWith("yest")) },
  { label: "Mon · Apr 26",       items: signals.filter(s =>  s.time.startsWith("Mon")) },
];

export default function HFFeed({
  signals,
  hoverContact, setHoverContact,
  channelFilter, setChannelFilter,
  onDraftClick, onAddSignal, onTakeAction,
}) {
  const [search, setSearch] = useState("");
  const [pinned, setPinned] = useState(null);

  const togglePin = (contact) => setPinned(p => (p === contact ? null : contact));

  const groups = groupSignals(signals);

  const filtered = (items) => {
    let arr = channelFilter === "all" ? items : items.filter(s => s.ch === channelFilter);
    if (search) arr = arr.filter(s => matchesSearch(s, search));
    if (pinned) arr = arr.filter(s => matchesPin(s, pinned));
    return arr;
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header — controls locked right via margin-auto; gap shrinks with the column,
          then they wrap underneath when there's truly no room. */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--line)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 14px" }}>
        <div style={{ flex: "0 1 auto", minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.1 }}>Signals</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
            <span className="num">{signals.length}</span> events from your accounts
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--ink-3)" }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--ok)", display: "inline-block" }} />
            live
          </div>
          <button className="btn ghost icon sm" title="Refresh">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 8a6 6 0 1 1-1.76-4.24M14 3v3h-3"/>
            </svg>
          </button>
          <button className="btn sm" title="Log a call, meeting, or note" onClick={onAddSignal}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M7 2v10M2 7h10"/>
            </svg>
            Log
          </button>
        </div>
      </div>

      {/* Search row */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--line)", display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <svg
            width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="var(--ink-4)" strokeWidth="1.6" strokeLinecap="round"
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="6" cy="6" r="4"/><path d="M9.2 9.2L12 12"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search by contact or account…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <span
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                cursor: "pointer", color: "var(--ink-4)", fontSize: 14, lineHeight: 1, padding: "2px 4px",
              }}
              title="Clear"
            >×</span>
          )}
        </div>
        {pinned && (
          <span
            className="chip"
            style={{ background: "var(--ink)", color: "#fff", borderColor: "var(--ink)", height: 26, padding: "0 6px 0 10px" }}
          >
            <span style={{ fontSize: 11.5 }}>Pinned: <b style={{ fontWeight: 600 }}>{pinned}</b></span>
            <span
              onClick={() => setPinned(null)}
              style={{ cursor: "pointer", marginLeft: 4, padding: "0 4px", lineHeight: 1, fontSize: 14 }}
              title="Unpin"
            >×</span>
          </span>
        )}
      </div>

      {/* Channel filter row */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <button
          onClick={() => setChannelFilter("all")}
          className={"btn xs " + (channelFilter === "all" ? "primary" : "")}
        >
          All <span className="num" style={{ opacity: .7, marginLeft: 3 }}>{signals.length}</span>
        </button>
        {[
          ["quote", "Quotes",  signals.filter(s => s.ch === "quote").length],
          ["order", "Orders",  signals.filter(s => s.ch === "order").length],
          ["email", "Email",   signals.filter(s => s.ch === "email").length],
          ["web",   "TI.com",  signals.filter(s => s.ch === "web").length],
          ["e2e",   "E2E",     signals.filter(s => s.ch === "e2e").length],
          ["call",  "Logged",  signals.filter(s => s.ch === "call").length],
          ["synth", "Synth",   signals.filter(s => s.ch === "synth").length],
        ].map(([k, label, n]) => (
          <button
            key={k}
            onClick={() => setChannelFilter(k)}
            className={"btn xs " + (channelFilter === k ? "" : "ghost")}
            style={channelFilter === k ? { borderColor: CHANNELS[k].color, color: CHANNELS[k].color, background: CHANNELS[k].bg } : {}}
          >
            <span className={"chc " + CHANNELS[k].code} style={{ width: 14, height: 14, fontSize: 9, marginRight: 3 }}>
              {CHANNELS[k].letter}
            </span>
            {label} <span className="num" style={{ opacity: .65, marginLeft: 2 }}>{n}</span>
          </button>
        ))}
      </div>

      {/* Rolling stream */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {groups.every(g => filtered(g.items).length === 0) && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--ink-4)", fontSize: 13 }}>
            No signals match {search ? `"${search}"` : pinned ? `Pinned: ${pinned}` : "this filter"}.
          </div>
        )}
        {groups.map((g, gi) => {
          const items = filtered(g.items);
          if (!items.length) return null;
          return (
            <div key={gi}>
              <div
                className="micro"
                style={{ padding: "10px 20px 5px", background: "var(--surface)", position: "sticky", top: 0, zIndex: 1, borderBottom: "1px solid var(--line)" }}
              >
                {g.label} <span style={{ color: "var(--ink-5)", marginLeft: 6 }} className="num">· {items.length}</span>
              </div>
              {items.map(s => {
                const ch = CHANNELS[s.ch];
                const contact = signalContact(s);
                const dim = hoverContact && contact !== hoverContact;
                const lit = hoverContact && contact === hoverContact;
                const canTakeAction = !s.draftId && s.ch !== "call" && onTakeAction;
                const isSynth = s.ch === "synth" && (s.title || s.body);

                if (isSynth) {
                  // Richer two-line row: synth/aggregate insights have a headline + summary.
                  return (
                    <div
                      key={s.id}
                      onMouseEnter={() => setHoverContact && setHoverContact(contact)}
                      onMouseLeave={() => setHoverContact && setHoverContact(null)}
                      onClick={() => s.draftId && onDraftClick && onDraftClick(s.draftId)}
                      className={"feed-row ch-rail-" + ch.code + (lit ? " lit" : "") + (dim ? " dim" : "")}
                      style={{ alignItems: "flex-start", whiteSpace: "normal", padding: "10px 14px 11px 11px", background: lit ? undefined : "var(--surface-2)" }}
                    >
                      <span className={"chc " + ch.code} style={{ marginTop: 1 }}>{ch.letter}</span>
                      <span className="num" style={{ width: 56, fontSize: 11.5, color: "var(--ink-4)", flexShrink: 0, marginTop: 2 }}>
                        {s.time}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                          <span
                            className="who-link"
                            style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)" }}
                            onClick={(e) => { e.stopPropagation(); togglePin(s.co); }}
                            title={pinned === s.co ? "Click to unpin" : "Click to pin filter to " + s.co}
                          >
                            {s.co}
                          </span>
                          <span style={{ fontSize: 12.5, color: "var(--ink-4)" }}>—</span>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--warn)" }}>{s.title}</span>
                          <div style={{ flex: 1 }} />
                          {s.sigCount && (
                            <span className="chip outline" style={{ fontSize: 10.5, height: 18, padding: "1px 7px" }}>
                              {s.sigCount} signals
                            </span>
                          )}
                          {s.draftId && (
                            <span title="Connected to a draft in the queue" style={{ color: "var(--ink-5)", display: "inline-flex", alignItems: "center" }}>
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                                <path d="M2 5.5h7M6 2l3.5 3.5L6 9"/>
                              </svg>
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.45 }}>{s.body}</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={s.id}
                    onMouseEnter={() => setHoverContact && setHoverContact(contact)}
                    onMouseLeave={() => setHoverContact && setHoverContact(null)}
                    onClick={() => s.draftId && onDraftClick && onDraftClick(s.draftId)}
                    className={"feed-row ch-rail-" + ch.code + (lit ? " lit" : "") + (dim ? " dim" : "")}
                  >
                    <span className={"chc " + ch.code}>{ch.letter}</span>
                    <span className="num" style={{ width: 56, fontSize: 11.5, color: "var(--ink-4)", flexShrink: 0 }}>
                      {s.time}
                    </span>
                    <span
                      className="who-link"
                      style={{ fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}
                      onClick={(e) => { e.stopPropagation(); togglePin(s.who); }}
                      title={pinned === s.who ? "Click to unpin" : "Click to pin filter to " + s.who}
                    >
                      {s.who}
                    </span>
                    <span
                      className="who-link"
                      style={{ fontSize: 12, color: "var(--ink-4)", flexShrink: 0 }}
                      onClick={(e) => { e.stopPropagation(); togglePin(s.co); }}
                      title={pinned === s.co ? "Click to unpin" : "Click to pin filter to " + s.co}
                    >
                      {s.co}
                    </span>
                    <span style={{ fontSize: 12.5, color: "var(--ink-2)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.text}
                    </span>
                    {s.loggedByUser && <span className="by-you">Logged by you</span>}
                    {s.draftId && (
                      <span
                        title="Connected to a draft in the queue"
                        style={{ color: "var(--ink-5)", display: "inline-flex", alignItems: "center", flexShrink: 0 }}
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                          <path d="M2 5.5h7M6 2l3.5 3.5L6 9"/>
                        </svg>
                      </span>
                    )}
                    {canTakeAction && (
                      <button
                        className="btn xs ghost"
                        onClick={(e) => { e.stopPropagation(); onTakeAction(s); }}
                        title="Add an action for this signal"
                        style={{ padding: "1px 6px", height: 20 }}
                      >
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                          <path d="M6 1.5v9M1.5 6h9"/>
                        </svg>
                        Take action
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
