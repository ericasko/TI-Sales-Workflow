// Variation B — Split view (always-on right preview)

const QueueSplit = ({ onOpen, openId }) => {
  const [sel, setSel] = React.useState(openId || "d2");
  const cur = DRAFTS.find((d) => d.id === sel) || DRAFTS[0];

  return (
    <div className="sketch" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
      {/* Chrome */}
      <div style={{ borderBottom: "1.5px solid var(--ink)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "Architects Daughter", fontSize: 16, fontWeight: 700 }}>Send Queue</div>
        <span className="hand" style={{ fontSize: 12, color: "var(--ink-soft)" }}>9 drafts</span>
        <div style={{ flex: 1 }} />
        <div className="sk-border-soft" style={{ padding: "3px 9px", display: "flex", alignItems: "center", gap: 6, background: "var(--ok-bg)" }}>
          <span className="hand" style={{ fontSize: 11.5 }}>5 green ready —</span>
          <button className="btn" style={{ borderColor: "var(--ok)", color: "var(--ok)", padding: "2px 8px" }}>send all ›</button>
        </div>
        <button className="btn ghost">filters ▾</button>
        <div className="av">ES</div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "360px 1fr", minHeight: 0 }}>
        {/* List rail */}
        <div style={{ borderRight: "1px solid var(--ink-ghost)", overflow: "auto" }}>
          {DRAFTS.map((d) => (
            <div key={d.id} onClick={() => setSel(d.id)}
              className={d.id === sel ? "row-hl" : ""}
              style={{ padding: "10px 14px", borderBottom: "1px solid var(--ink-ghost)", cursor: "pointer", display: "flex", gap: 9 }}>
              <span className={"dot " + d.conf} style={{ marginTop: 6 }} />
              <div className="av">{d.rec.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "Architects Daughter", fontSize: 12.5, fontWeight: 600, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.rec.name}</span>
                  <span className="hand" style={{ fontSize: 10, color: "var(--ink-faint)" }}>{d.model === "Claude" ? "◆" : "○"}</span>
                </div>
                <div className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.rec.company} · {d.rec.role}</div>
                <div style={{ display: "flex", gap: 5, alignItems: "flex-start", marginTop: 4 }}>
                  <TrigIcon kind={d.trigger} />
                  <span className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)", lineHeight: 1.25 }}>{d.why}</span>
                </div>
                <div style={{ fontFamily: "Architects Daughter", fontSize: 11.5, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.subject}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview pane */}
        <div style={{ overflow: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--ink-ghost)", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="av" style={{ width: 34, height: 34, fontSize: 13 }}>{cur.rec.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Architects Daughter", fontSize: 14, fontWeight: 700 }}>{cur.rec.name}</div>
              <div className="hand" style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{cur.rec.email} · {cur.rec.role} @ {cur.rec.company}</div>
            </div>
            <span className="hand" style={{ fontSize: 11.5 }}><span className={"dot " + cur.conf} /> {cur.conf === "ok" ? "high" : cur.conf === "warn" ? "medium — review" : "low"}</span>
            <button className="btn" onClick={() => onOpen(cur.id)}>open full ↗</button>
          </div>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--ink-ghost)" }}>
            <div className="hand" style={{ fontSize: 10.5, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Subject</div>
            <div style={{ fontFamily: "Architects Daughter", fontSize: 16, fontWeight: 700 }}>{cur.subject}</div>
          </div>
          <div style={{ padding: "18px 22px", flex: 1 }}>
            <div className="hand" style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ink)" }}>
              Hi {cur.rec.name.split(" ")[0]} —
              <br /><br />
              {cur.preview}<span className="anno">{cur.id === "d2" ? " — though I want to double check the part variant " : "..."}</span>
              <br /><br />
              <span className="hand">Happy to set up a 20-min call if useful.</span>
              <br /><br />
              <span className="hand">— Erica</span>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 5, flexWrap: "wrap" }}>
              {cur.attach.map((a, i) => <span key={i} className="pill">📎 {a}</span>)}
            </div>
          </div>
          <div style={{ padding: "10px 22px", borderTop: "1.5px solid var(--ink)", display: "flex", gap: 8 }}>
            <button className="btn primary"><span className="kbd" style={{ background: "rgba(255,255,255,0.15)", color: "inherit", borderColor: "rgba(255,255,255,0.4)" }}>e</span> Approve & Send</button>
            <button className="btn">Edit</button>
            <button className="btn">Reject</button>
            <button className="btn">Defer 2d</button>
            <div style={{ flex: 1 }} />
            <span className="hand" style={{ fontSize: 11, color: "var(--ink-faint)", alignSelf: "center" }}>{cur.model === "Claude" ? "◆ Claude" : "○ TI Internal"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

window.QueueSplit = QueueSplit;
