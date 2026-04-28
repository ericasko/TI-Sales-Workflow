// Drawer — slide-over with inline-annotation rationale.
// 3 stacked sections: Email · Why this email · Contact intelligence.

const Drawer = ({ draftId, onClose }) => {
  const d = DRAFTS.find((x) => x.id === draftId);
  const [active, setActive] = React.useState(null);
  const [tab, setTab] = React.useState("activity");
  if (!d) return null;

  // Annotations specific to the open draft. Keyed by anchor id.
  // Each: { id, num, kind, text, source }
  const annos = d.id === "d2" ? [
    { id: "a1", num: 1, kind: "ok", text: "MSP430G2553 LaunchPad", note: "matches sample order — MSP-EXP430G2ET shipped 8 days ago", source: "Order #4421-887" },
    { id: "a2", num: 2, kind: "ok", text: "SLAA660", note: "downloaded twice (Apr 18, Apr 22)", source: "TI.com analytics" },
    { id: "a3", num: 3, kind: "flag", text: "the RGZ variant", note: "⚠ AI cited the RGZ package — order shows the PW (TSSOP) variant. Reviewer should fix before send.", source: "Order line item" },
    { id: "a4", num: 4, kind: "ok", text: "battery-powered industrial sensor", note: "inferred from TPS6521905 + MSP430 + INA226 view pattern", source: "Inference" },
  ] : d.id === "d3" ? [
    { id: "a1", num: 1, kind: "ok", text: "three engineers on your team", note: "M. Kapoor, J. Lin, S. Park — all viewed buck regulator pages", source: "Aggregated activity 30d" },
    { id: "a2", num: 2, kind: "ok", text: "TPS6521905 + LMR33630", note: "appeared in viewing history of all 3", source: "TI.com" },
    { id: "a3", num: 3, kind: "ok", text: "next platform", note: "inferred: parts viewed sit in same power-tree role", source: "Inference" },
  ] : [
    { id: "a1", num: 1, kind: "ok", text: "TPS6521905 quote", note: "Quote #Q-998312 submitted Apr 25", source: "Quote system" },
    { id: "a2", num: 2, kind: "ok", text: "RGE QFN package", note: "matches part number on quote", source: "Quote line item" },
  ];

  // Render body with annotations applied to known phrases
  const buildBody = () => {
    if (d.id === "d2") return (
      <div className="hand" style={{ fontSize: 13.5, lineHeight: 1.65 }}>
        Hi Priya —<br /><br />
        Hope the <span className={"anno" + (active === "a1" ? " active" : "")} onClick={() => setActive("a1")}>MSP430G2553 LaunchPad<span className="anno-num">1</span></span> arrived OK.
        I noticed you also pulled <span className={"anno" + (active === "a2" ? " active" : "")} onClick={() => setActive("a2")}>SLAA660<span className="anno-num">2</span></span> twice this month, which usually means
        someone's working through low-power optimization on a battery design.
        <br /><br />
        For <span className={"anno flag" + (active === "a3" ? " active" : "")} onClick={() => setActive("a3")}>the RGZ variant<span className="anno-num">3</span></span> you're sampling, the most common gotcha is
        the bypass cap placement under the exposed pad — happy to send you the layout guide we use internally.
        <br /><br />
        Given the pattern of parts you've been looking at, my guess is you're putting together
        a <span className={"anno" + (active === "a4" ? " active" : "")} onClick={() => setActive("a4")}>battery-powered industrial sensor<span className="anno-num">4</span></span>. Let me know if a 20-min
        call to walk through power-tree options would be useful.
        <br /><br />— Erica
      </div>
    );
    if (d.id === "d3") return (
      <div className="hand" style={{ fontSize: 13.5, lineHeight: 1.65 }}>
        Hi —<br /><br />
        I noticed <span className={"anno" + (active === "a1" ? " active" : "")} onClick={() => setActive("a1")}>three engineers on your team<span className="anno-num">1</span></span> have been
        looking at our buck family — specifically <span className={"anno" + (active === "a2" ? " active" : "")} onClick={() => setActive("a2")}>TPS6521905 + LMR33630<span className="anno-num">2</span></span> —
        which usually shows up around the time a team is locking down a power tree.
        <br /><br />
        If your <span className={"anno" + (active === "a3" ? " active" : "")} onClick={() => setActive("a3")}>next platform<span className="anno-num">3</span></span> is the right context,
        I'd love to spend 30 min with whoever owns the power-stage decisions. We have ref designs that
        cover both single-rail and split-rail topologies for this part pairing.
        <br /><br />— Erica
      </div>
    );
    return (
      <div className="hand" style={{ fontSize: 13.5, lineHeight: 1.65 }}>
        Hi {d.rec.name.split(" ")[0]} —<br /><br />
        Saw your <span className={"anno" + (active === "a1" ? " active" : "")} onClick={() => setActive("a1")}>TPS6521905 quote<span className="anno-num">1</span></span> come through yesterday.
        Wanted to flag that the <span className={"anno" + (active === "a2" ? " active" : "")} onClick={() => setActive("a2")}>RGE QFN package<span className="anno-num">2</span></span> has
        a few layout requirements worth knowing about up front — most of the questions we get from new users
        center on the inductor placement and the FB divider trace.
        <br /><br />
        Happy to walk through it. Also pinging you the PMP40123 reference design which uses this part in
        the exact configuration teams usually start from.
        <br /><br />— Erica
      </div>
    );
  };

  return (
    <div className="drawer sketch" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "60%", display: "flex", flexDirection: "column", zIndex: 20 }}>
      {/* Drawer header */}
      <div style={{ padding: "12px 18px", borderBottom: "1.5px solid var(--ink)", display: "flex", alignItems: "center", gap: 10, background: "var(--paper-warm)" }}>
        <button className="btn ghost" onClick={onClose}>← back</button>
        <div className="av">{d.rec.initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "Architects Daughter", fontSize: 14, fontWeight: 700 }}>{d.rec.name}</div>
          <div className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{d.rec.email} · {d.rec.role} @ {d.rec.company}</div>
        </div>
        <span className={"pill"}><span className={"dot " + d.conf} /> {d.conf === "ok" ? "high conf" : d.conf === "warn" ? "review" : "low"}</span>
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-faint)" }}>{d.model === "Claude" ? "◆ Claude" : "○ TI Internal"}</span>
      </div>

      {/* Scrollable */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* SECTION 1 — Email */}
        <div style={{ padding: "18px 0" }}>
          <div style={{ padding: "0 22px 8px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div className="hand" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)" }}>① The email</div>
            <div className="hand" style={{ fontSize: 10.5, color: "var(--ink-faint)" }}>numbered phrases ↔ rationale notes</div>
          </div>
          <div style={{ padding: "0 22px", display: "grid", gridTemplateColumns: "1fr 220px", gap: 18 }}>
            {/* Email body */}
            <div>
              <div style={{ display: "flex", gap: 10, fontSize: 11.5, marginBottom: 10, color: "var(--ink-soft)" }}>
                <div style={{ flex: 1 }}>
                  <div className="hand"><b>To</b> {d.rec.email}</div>
                  <div className="hand"><b>From</b> Erica Skoglund &lt;erica@ti.com&gt;</div>
                </div>
              </div>
              <div className="sk-border" style={{ padding: "12px 14px", marginBottom: 8 }}>
                <div className="hand" style={{ fontSize: 10.5, color: "var(--ink-faint)", marginBottom: 3 }}>SUBJECT (editable)</div>
                <div style={{ fontFamily: "Architects Daughter", fontSize: 15, fontWeight: 700 }}>{d.subject}</div>
              </div>
              <div className="sk-border" style={{ padding: "16px 18px" }}>
                {buildBody()}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--ink-ghost)", display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                  <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>📎</span>
                  {d.attach.map((a, i) => <span key={i} className="pill">{a} <span style={{ color: "var(--ink-faint)" }}>×</span></span>)}
                  <button className="btn ghost" style={{ padding: "2px 7px", fontSize: 11 }}>+ add</button>
                </div>
              </div>
            </div>

            {/* Rationale rail (numbered notes) */}
            <div className="anno-rail" style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 60 }}>
              {annos.map((a) => (
                <div key={a.id}
                  onMouseEnter={() => setActive(a.id)}
                  onMouseLeave={() => setActive(null)}
                  className="anno-note"
                  style={{ background: active === a.id ? (a.kind === "flag" ? "var(--bad-bg)" : "#fff8d4") : "transparent",
                    padding: "6px 6px 6px 26px", borderRadius: 4, transition: "background .12s" }}>
                  <span className="anno-num" style={a.kind === "flag" ? { borderColor: "var(--bad)", background: "var(--bad-bg)" } : {}}>{a.num}</span>
                  <div style={{ fontFamily: "Architects Daughter", fontSize: 11.5, fontWeight: 600, marginBottom: 2, color: a.kind === "flag" ? "var(--bad)" : "var(--ink)" }}>
                    "{a.text}"
                  </div>
                  <div>{a.note}</div>
                  <div style={{ fontFamily: "JetBrains Mono", fontSize: 9.5, color: "var(--ink-faint)", marginTop: 3 }}>↳ {a.source}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-scribble" style={{ margin: "12px 22px" }} />

        {/* SECTION 2 — Why this email (rationale summary) */}
        <div style={{ padding: "12px 22px 18px" }}>
          <div className="hand" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)", marginBottom: 8 }}>② Why this email</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="sk-border-soft" style={{ padding: "12px 14px" }}>
              <div className="hand" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>signals that triggered the draft</div>
              <ul className="hand" style={{ fontSize: 12, lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                <li>{d.why}</li>
                <li>2 colleagues at {d.rec.company} active on related parts last 14d</li>
                <li>No prior contact with this engineer · cold-but-warm</li>
              </ul>
            </div>
            <div className="sk-border-soft" style={{ padding: "12px 14px" }}>
              <div className="hand" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>cited sources <span className="hand" style={{ fontWeight: 400, color: "var(--ink-faint)" }}>(click to verify)</span></div>
              <ul className="hand" style={{ fontSize: 12, lineHeight: 1.6, paddingLeft: 18, margin: 0 }}>
                <li><a href="#" style={{ color: "var(--ink)" }} className="squiggle">TPS6521905 datasheet · §7.3</a></li>
                <li><a href="#" style={{ color: "var(--ink)" }} className="squiggle">PMP40123 reference design</a></li>
                <li><a href="#" style={{ color: "var(--ink)" }} className="squiggle">Forum thread #88421</a></li>
                <li><a href="#" style={{ color: "var(--ink)" }} className="squiggle">Quote system #Q-998312</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="divider-scribble" style={{ margin: "12px 22px" }} />

        {/* SECTION 3 — Contact intelligence */}
        <div style={{ padding: "12px 22px 22px" }}>
          <div className="hand" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-faint)", marginBottom: 8 }}>③ Contact intelligence</div>
          <div style={{ display: "flex", borderBottom: "1.5px solid var(--ink)", marginBottom: 12 }}>
            <div className={"tab " + (tab === "activity" ? "on" : "")} onClick={() => setTab("activity")}>Activity timeline</div>
            <div className={"tab " + (tab === "convo" ? "on" : "")} onClick={() => setTab("convo")}>Conversation history</div>
            <div className={"tab " + (tab === "company" ? "on" : "")} onClick={() => setTab("company")}>Company context</div>
          </div>
          {tab === "activity" && (
            <div style={{ position: "relative", paddingLeft: 22 }}>
              <div style={{ position: "absolute", left: 7, top: 4, bottom: 4, width: 1.5, background: "var(--ink-ghost)" }} />
              {[
                ["yesterday", "Submitted quote for TPS6521905", "quote"],
                ["3d ago", "Downloaded SLAA660 (low-power app note) · 2nd time", "appnote"],
                ["8d ago", "Ordered MSP430G2553 LaunchPad EVM", "evm"],
                ["12d ago", "Viewed INA226 datasheet", "datasheet"],
                ["18d ago", "Requested TPS6521905 samples (5pc)", "sample"],
                ["31d ago", "First TI.com session — TPS6521905 page", "datasheet"],
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", alignItems: "flex-start" }}>
                  <div style={{ position: "absolute", left: 0, marginTop: 4 }}>
                    <span style={{ width: 14, height: 14, border: "1.5px solid var(--ink)", borderRadius: 7, background: "var(--paper)", display: "inline-block" }} />
                  </div>
                  <span className="hand" style={{ width: 80, fontSize: 11, color: "var(--ink-soft)" }}>{row[0]}</span>
                  <TrigIcon kind={row[2]} />
                  <span className="hand" style={{ fontSize: 12 }}>{row[1]}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "convo" && (
            <div className="hand" style={{ fontSize: 12, color: "var(--ink-soft)", padding: "20px 0", textAlign: "center" }}>
              <div className="hatch sk-border-soft" style={{ padding: "30px", color: "var(--ink-faint)" }}>
                no prior emails · this is the first reach-out
              </div>
            </div>
          )}
          {tab === "company" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="sk-border-soft" style={{ padding: "12px 14px" }}>
                <div className="hand" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>company</div>
                <div style={{ fontFamily: "Architects Daughter", fontSize: 14, fontWeight: 700 }}>{d.rec.company}</div>
                <div className="hand" style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 4 }}>
                  ~85 employees · industrial sensors<br />
                  HQ Boulder, CO · series B
                </div>
              </div>
              <div className="sk-border-soft" style={{ padding: "12px 14px" }}>
                <div className="hand" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>other engineers we've touched</div>
                {[
                  ["M. Kapoor", "Engaged"],
                  ["J. Lin", "Introduced"],
                  ["S. Park", "In Eval"],
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0" }}>
                    <span className="hand" style={{ fontSize: 12 }}>{p[0]}</span>
                    <span className="pill" style={{ fontSize: 10 }}>{p[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky action bar */}
      <div style={{ borderTop: "1.5px solid var(--ink)", padding: "10px 18px", background: "var(--paper-warm)", display: "flex", gap: 8, alignItems: "center" }}>
        <button className="btn primary"><span className="kbd" style={{ background: "rgba(255,255,255,0.15)", color: "inherit", borderColor: "rgba(255,255,255,0.4)" }}>e</span> Approve & Send</button>
        <button className="btn">Save Draft</button>
        <button className="btn">Reject ▾<span className="hand" style={{ fontSize: 10, marginLeft: 4, color: "var(--ink-faint)" }}>(reason)</span></button>
        <button className="btn">Defer 2d</button>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-faint)" }}>Esc to close · ↓↑ next/prev</span>
      </div>
    </div>
  );
};

window.Drawer = Drawer;
