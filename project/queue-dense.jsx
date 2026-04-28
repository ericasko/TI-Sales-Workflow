// Variation A — Dense Linear-style table

const QueueDense = ({ onOpen, openId }) => {
  const [selected, setSelected] = React.useState({ d1: true, d3: true, d6: true, d8: true });
  const toggle = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const greenIds = DRAFTS.filter((d) => d.conf === "ok").map((d) => d.id);
  const greenCount = greenIds.length;

  return (
    <div className="sketch" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--paper)" }}>
      {/* App chrome */}
      <div style={{ borderBottom: "1.5px solid var(--ink)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "Architects Daughter", fontSize: 16, fontWeight: 700 }}>Send Queue</div>
        <div className="hand" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
          <span className="squiggle">9 drafts</span> · <span style={{ color: "var(--ok)" }}>● {greenCount} ready</span>
        </div>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-faint)" }}>last refresh 2m ago</span>
        <button className="btn ghost"><span>↻</span> Refresh</button>
        <div className="av" title="Erica Skoglund">ES</div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--ink-ghost)", flexWrap: "wrap" }}>
        <span className="cb checked" />
        <span className="hand" style={{ fontSize: 12 }}>{Object.values(selected).filter(Boolean).length} selected</span>
        <button className="btn primary">Approve & Send All</button>
        <button className="btn">Reject All</button>
        <span style={{ width: 1, height: 20, background: "var(--ink-ghost)" }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>filter:</span>
        <button className="btn ghost">trigger ▾</button>
        <button className="btn ghost">company size ▾</button>
        <button className="btn ghost">confidence ▾</button>
        <button className="btn ghost">model ▾</button>
        <span style={{ width: 1, height: 20, background: "var(--ink-ghost)" }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>sort:</span>
        <button className="btn ghost">urgency ▾</button>
        <div style={{ flex: 1 }} />
        {/* Speed-mode bar */}
        <div className="sk-border-soft" style={{ padding: "4px 10px", display: "flex", alignItems: "center", gap: 8, background: "var(--ok-bg)" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ok)" strokeWidth="1.5"><path d="M7 1 L9 6 L13 6 L10 9 L11 13 L7 11 L3 13 L4 9 L1 6 L5 6 z" /></svg>
          <span className="hand" style={{ fontSize: 12 }}>1-click batch:</span>
          <button className="btn" style={{ borderColor: "var(--ok)", color: "var(--ok)" }}>send all {greenCount} green ›</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 28 }}></th>
              <th style={{ width: 14 }}></th>
              <th style={{ width: 200 }}>Recipient</th>
              <th style={{ width: 240 }}>Why now?</th>
              <th>Subject · preview</th>
              <th style={{ width: 130 }}>Attach</th>
              <th style={{ width: 70 }}>Model</th>
              <th style={{ width: 130 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {DRAFTS.map((d) => (
              <tr key={d.id}
                className={openId === d.id ? "selected" : ""}
                onClick={() => onOpen(d.id)}
                style={{ cursor: "pointer" }}>
                <td><span className={"cb " + (selected[d.id] ? "checked" : "")} onClick={(e) => { e.stopPropagation(); toggle(d.id); }} /></td>
                <td><span className={"dot " + d.conf} /></td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div className="av">{d.rec.initials}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, fontFamily: "Architects Daughter" }}>{d.rec.name}</div>
                      <div className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.rec.role} · {d.rec.company}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                    <TrigIcon kind={d.trigger} />
                    <span className="hand" style={{ fontSize: 11.5, lineHeight: 1.3 }}>{d.why}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontFamily: "Architects Daughter", fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{d.subject}</div>
                  <div className="hand" style={{ fontSize: 11, color: "var(--ink-soft)", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.preview}</div>
                </td>
                <td>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {d.attach.map((a, i) => <span key={i} className="pill" style={{ fontSize: 10 }}>{a}</span>)}
                  </div>
                </td>
                <td>
                  <span className="hand" style={{ fontSize: 10.5, color: d.model === "Claude" ? "var(--ink)" : "var(--ink-soft)" }}>
                    {d.model === "Claude" ? "◆" : "○"} {d.model}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn primary" style={{ fontSize: 11, padding: "3px 7px" }} title="e">e ✓</button>
                    <button className="btn" style={{ fontSize: 11, padding: "3px 7px" }} title="x">✕</button>
                    <button className="btn ghost" style={{ fontSize: 11, padding: "3px 7px" }}>···</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom — keyboard cheatsheet */}
      <div style={{ borderTop: "1px solid var(--ink-ghost)", padding: "6px 18px", display: "flex", gap: 14, alignItems: "center", fontSize: 11 }}>
        <span className="hand" style={{ color: "var(--ink-soft)" }}>kbd:</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">j</span><span className="kbd">k</span> <span className="hand">nav</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">e</span> <span className="hand">approve+send</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">x</span> <span className="hand">reject</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">.</span> <span className="hand">defer</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">⏎</span> <span className="hand">open drawer</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">⇧</span><span className="kbd">e</span> <span className="hand">approve all green</span></span>
      </div>
    </div>
  );
};

window.QueueDense = QueueDense;
