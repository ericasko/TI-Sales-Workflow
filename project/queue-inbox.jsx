// Variation C — Inbox / Gmail-style stack

const QueueInbox = ({ onOpen, openId }) => {
  const [sel, setSel] = React.useState({});
  const toggle = (id) => setSel((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className="sketch" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
      {/* Chrome */}
      <div style={{ borderBottom: "1.5px solid var(--ink)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "Architects Daughter", fontSize: 16, fontWeight: 700 }}>Outbox · pending review</div>
        <div style={{ flex: 1 }} />
        <input className="hand sk-border-soft" placeholder="search drafts…" style={{ padding: "5px 10px", fontSize: 12, width: 220, background: "var(--paper)", outline: "none" }} />
        <div className="av">ES</div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "8px 18px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--ink-ghost)" }}>
        <span className="cb" />
        <button className="btn ghost" style={{ padding: "3px 8px" }}>↻</button>
        <button className="btn ghost" style={{ padding: "3px 8px" }}>···</button>
        <span style={{ width: 1, height: 18, background: "var(--ink-ghost)" }} />
        <button className="btn ghost">all</button>
        <button className="btn">trigger ▾</button>
        <button className="btn">confidence ▾</button>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>1–9 of 9</span>
      </div>

      {/* Triage banner — speed mode */}
      <div style={{ background: "var(--ok-bg)", padding: "8px 18px", borderBottom: "1px solid var(--ink-ghost)", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ok)" strokeWidth="1.5"><path d="M7 1 L9 6 L13 6 L10 9 L11 13 L7 11 L3 13 L4 9 L1 6 L5 6 z" /></svg>
        <span className="hand" style={{ fontSize: 12 }}>5 high-confidence drafts ready — clear them in one click:</span>
        <button className="btn" style={{ borderColor: "var(--ok)" }}>send all 5 ›</button>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>4 need your eyes</span>
      </div>

      {/* Inbox rows */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {DRAFTS.map((d, i) => (
          <div key={d.id} onClick={() => onOpen(d.id)}
            className={openId === d.id ? "row-hl" : ""}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px",
              borderBottom: "1px solid var(--ink-ghost)", cursor: "pointer",
              background: i % 2 ? "rgba(0,0,0,0.015)" : "transparent" }}>
            <span className={"cb " + (sel[d.id] ? "checked" : "")} onClick={(e) => { e.stopPropagation(); toggle(d.id); }} />
            <span className={"dot " + d.conf} />
            <span className="hand" style={{ width: 14, color: "var(--ink-faint)", fontSize: 11 }}>★</span>
            <div className="av" style={{ width: 24, height: 24, fontSize: 10 }}>{d.rec.initials}</div>
            <div style={{ width: 150, fontFamily: "Architects Daughter", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {d.rec.name}
              <div className="hand" style={{ fontWeight: 400, fontSize: 10, color: "var(--ink-soft)" }}>{d.rec.company}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, width: 22 }}>
              <TrigIcon kind={d.trigger} />
            </div>
            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "Architects Daughter", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>{d.subject}</span>
              <span className="hand" style={{ fontSize: 11.5, color: "var(--ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>— {d.preview}</span>
            </div>
            <span className="hand" style={{ fontSize: 10, color: "var(--ink-faint)" }}>{d.model === "Claude" ? "◆" : "○"}</span>
            <span className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)", width: 60, textAlign: "right" }}>2:{15 + i}p</span>
          </div>
        ))}
      </div>

      {/* Footer kbd */}
      <div style={{ borderTop: "1px solid var(--ink-ghost)", padding: "6px 18px", display: "flex", gap: 14, alignItems: "center", fontSize: 11 }}>
        <span className="hand" style={{ color: "var(--ink-soft)" }}>kbd:</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">j</span><span className="kbd">k</span> <span className="hand">nav</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">e</span> <span className="hand">send</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">x</span> <span className="hand">reject</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">⏎</span> <span className="hand">open</span></span>
      </div>
    </div>
  );
};

window.QueueInbox = QueueInbox;
