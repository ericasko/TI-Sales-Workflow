// Compact send-queue column (right side of the two-sided page).
// Each row supports cross-highlight: dim if hoverSignal points at a different draft.

const QueueColumn = ({ onOpen, openId, hoverSignalDraft, hoverDraft, setHoverDraft }) => {
  const greenIds = DRAFTS.filter((d) => d.conf === "ok").map((d) => d.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ padding: "10px 14px", borderBottom: "1.5px solid var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: "Architects Daughter", fontSize: 14, fontWeight: 700 }}>Send Queue</div>
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>9 drafts · who to reach out to</span>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ok)" }}>● {greenIds.length} ready</span>
      </div>

      {/* speed-mode banner */}
      <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--ink-ghost)", background: "var(--ok-bg)", display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="var(--ok)" strokeWidth="1.5"><path d="M7 1 L9 6 L13 6 L10 9 L11 13 L7 11 L3 13 L4 9 L1 6 L5 6 z" /></svg>
        <span className="hand" style={{ fontSize: 11.5 }}>{greenIds.length} green ready — clear in 1 click</span>
        <div style={{ flex: 1 }} />
        <button className="btn" style={{ fontSize: 11, padding: "2px 8px", borderColor: "var(--ok)", color: "var(--ok)" }}>send all ›</button>
      </div>

      {/* mini toolbar */}
      <div style={{ padding: "6px 14px", borderBottom: "1px solid var(--ink-ghost)", display: "flex", gap: 6, alignItems: "center" }}>
        <span className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>sort:</span>
        <button className="btn" style={{ fontSize: 10.5, padding: "2px 7px" }}>urgency</button>
        <button className="btn ghost" style={{ fontSize: 10.5, padding: "2px 7px" }}>confidence</button>
        <button className="btn ghost" style={{ fontSize: 10.5, padding: "2px 7px" }}>account</button>
        <div style={{ flex: 1 }} />
        <button className="btn ghost" style={{ fontSize: 10.5, padding: "2px 7px" }}>filter ▾</button>
      </div>

      {/* draft cards */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {DRAFTS.map((d) => {
          const dim = hoverSignalDraft && hoverSignalDraft !== d.id;
          const lit = hoverSignalDraft && hoverSignalDraft === d.id;
          const isOpen = openId === d.id;
          return (
            <div key={d.id}
              onClick={() => onOpen(d.id)}
              onMouseEnter={() => setHoverDraft && setHoverDraft(d.id)}
              onMouseLeave={() => setHoverDraft && setHoverDraft(null)}
              style={{
                padding: "11px 14px", borderBottom: "1px solid var(--ink-ghost)",
                cursor: "pointer", position: "relative",
                opacity: dim ? 0.32 : 1,
                background: lit ? "#fffbe8" : (isOpen ? "var(--paper-warm)" : "transparent"),
                transition: "opacity .12s, background .1s",
                borderLeft: lit ? "3px solid var(--warn)" : "3px solid transparent",
                paddingLeft: lit ? 11 : 14,
              }}>
              {/* top row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span className={"dot " + d.conf} />
                <div className="av" style={{ width: 22, height: 22, fontSize: 9.5 }}>{d.rec.initials}</div>
                <span style={{ fontFamily: "Architects Daughter", fontSize: 12.5, fontWeight: 600, flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.rec.name}</span>
                <span className="hand" style={{ fontSize: 9.5, color: "var(--ink-faint)" }}>{d.model === "Claude" ? "◆" : "○"}</span>
              </div>
              <div className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)", marginBottom: 5, paddingLeft: 32 }}>
                {d.rec.role} · {d.rec.company}
              </div>
              {/* trigger glyph + why */}
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start", paddingLeft: 32, marginBottom: 5 }}>
                <TrigIcon kind={d.trigger} />
                <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.3 }}>{d.why}</span>
              </div>
              {/* subject */}
              <div style={{ paddingLeft: 32, fontFamily: "Architects Daughter", fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{d.subject}</div>
              <div className="hand" style={{ paddingLeft: 32, fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {d.preview}
              </div>
              {/* inline action row (visible on the open one or all when small) */}
              <div style={{ paddingLeft: 32, marginTop: 7, display: "flex", gap: 5 }} onClick={(e) => e.stopPropagation()}>
                <button className="btn primary" style={{ fontSize: 10.5, padding: "2px 7px" }}>send</button>
                <button className="btn" style={{ fontSize: 10.5, padding: "2px 7px" }}>edit</button>
                <button className="btn ghost" style={{ fontSize: 10.5, padding: "2px 7px" }}>reject</button>
                <button className="btn ghost" style={{ fontSize: 10.5, padding: "2px 7px" }}>defer</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

window.QueueColumn = QueueColumn;
