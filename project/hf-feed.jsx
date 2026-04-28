// Hi-fi feed — rolling, one-line rows, channel-coded
// Synthesized insights pinned at top.

const HFFeed = ({ hover, setHover, hoverDraft, channelFilter, setChannelFilter }) => {
  const groups = [
    { label: "Today · Apr 28", items: SIGNALS.filter((s) => !s.time.startsWith("yest") && !s.time.startsWith("Mon")) },
    { label: "Yesterday · Apr 27", items: SIGNALS.filter((s) => s.time.startsWith("yest")) },
    { label: "Mon · Apr 26", items: SIGNALS.filter((s) => s.time.startsWith("Mon")) },
  ];

  const filtered = (items) => channelFilter === "all" ? items : items.filter((s) => s.ch === channelFilter);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.1 }}>Signals</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
            <span className="num">{SIGNALS.length}</span> events from your accounts
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--ink-3)" }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--ok)", display: "inline-block" }} />
          live
        </div>
        <button className="btn ghost icon sm" title="Refresh">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8a6 6 0 1 1-1.76-4.24M14 3v3h-3"/></svg>
        </button>
      </div>

      {/* Channel filter row */}
      <div style={{ padding: "10px 20px", borderBottom: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <button onClick={() => setChannelFilter("all")} className={"btn xs " + (channelFilter === "all" ? "primary" : "")}>All <span className="num" style={{ opacity: .7, marginLeft: 3 }}>{SIGNALS.length}</span></button>
        {[
          ["quote", "Quotes",  SIGNALS.filter(s => s.ch === "quote").length],
          ["order", "Orders",  SIGNALS.filter(s => s.ch === "order").length],
          ["web",   "TI.com",  SIGNALS.filter(s => s.ch === "web").length],
          ["e2e",   "E2E",     SIGNALS.filter(s => s.ch === "e2e").length],
          ["synth", "Synth",   SIGNALS.filter(s => s.ch === "synth").length],
        ].map(([k, label, n]) => (
          <button key={k} onClick={() => setChannelFilter(k)}
            className={"btn xs " + (channelFilter === k ? "" : "ghost")}
            style={channelFilter === k ? { borderColor: CHANNELS[k].color, color: CHANNELS[k].color, background: CHANNELS[k].bg } : {}}>
            <span className={"chc " + CHANNELS[k].code} style={{ width: 14, height: 14, fontSize: 9, marginRight: 3 }}>{CHANNELS[k].letter}</span>
            {label} <span className="num" style={{ opacity: .65, marginLeft: 2 }}>{n}</span>
          </button>
        ))}
      </div>

      {/* Synthesized insights — pinned card stack */}
      <div style={{ padding: "12px 20px 14px", borderBottom: "1px solid var(--line)", background: "var(--surface-2)" }}>
        <div className="micro" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--warn)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 1l1.5 3.5L11 5l-2.5 2 .8 4L6 9l-3.3 2L3.5 7 1 5l3.5-.5L6 1z"/></svg>
          <span style={{ color: "var(--warn)" }}>Synthesized insights</span>
          <span style={{ color: "var(--ink-4)" }}>· {SYNTH_INSIGHTS.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SYNTH_INSIGHTS.map((ins) => (
            <div key={ins.id}
              onMouseEnter={() => setHover && setHover("s4")}
              onMouseLeave={() => setHover && setHover(null)}
              style={{
                background: "var(--surface)", border: "1px solid var(--line)",
                borderRadius: "var(--r)", padding: "10px 12px", cursor: "pointer",
                transition: "border-color .12s, transform .12s",
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--warn)"}
              onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--line)"}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className="chc s">{CHANNELS.synth.letter}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{ins.title}</span>
                <div style={{ flex: 1 }} />
                <span className="chip outline" style={{ fontSize: 10.5, height: 18, padding: "1px 7px" }}>{ins.sigCount} signals</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.45 }}>{ins.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rolling stream */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {groups.map((g, gi) => {
          const items = filtered(g.items);
          if (!items.length) return null;
          return (
            <div key={gi}>
              <div className="micro" style={{
                padding: "10px 20px 5px", background: "var(--surface)",
                position: "sticky", top: 0, zIndex: 1, borderBottom: "1px solid var(--line)",
              }}>
                {g.label} <span style={{ color: "var(--ink-5)", marginLeft: 6 }} className="num">· {items.length}</span>
              </div>
              {items.map((s) => {
                const ch = CHANNELS[s.ch];
                const dim = hoverDraft && s.draftId !== hoverDraft;
                const lit = hoverDraft && s.draftId === hoverDraft;
                const isHov = hover === s.id;
                return (
                  <div key={s.id}
                    onMouseEnter={() => setHover(s.id)}
                    onMouseLeave={() => setHover(null)}
                    className={"feed-row ch-rail-" + ch.code + (lit ? " lit" : "") + (dim ? " dim" : "")}
                    style={{ background: isHov && !lit ? "var(--surface-2)" : undefined }}>
                    <span className={"chc " + ch.code}>{ch.letter}</span>
                    <span className="num" style={{ width: 56, fontSize: 11.5, color: "var(--ink-4)", flexShrink: 0 }}>{s.time}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}>{s.who}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-4)", flexShrink: 0 }}>{s.co}</span>
                    <span style={{ fontSize: 12.5, color: "var(--ink-2)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.text}</span>
                    {s.draftId ? (
                      <span style={{ fontSize: 11, color: "var(--ink-4)", display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 5.5h7M6 2l3.5 3.5L6 9"/></svg>
                        <span className="mono" style={{ fontSize: 10.5 }}>{s.draftId}</span>
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "var(--ink-5)", flexShrink: 0 }}>—</span>
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
};

window.HFFeed = HFFeed;
