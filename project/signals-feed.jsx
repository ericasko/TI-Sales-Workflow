// Signals feed (left side) — chronological stream of events that triggered drafts.
// Each event has a draftId so hovering it can cross-highlight the right column.

const SIGNALS = [
  { id: "s1", time: "9:42a", kind: "quote",     who: "Marcus Kim",        co: "Volthaus Battery",  text: "Submitted quote — TPS6521905 (5kpc, RGE QFN)", draftId: "d1", weight: "strong" },
  { id: "s2", time: "9:31a", kind: "datasheet", who: "Theo Falk",         co: "LumenStack",        text: "First-time TPS6521905 datasheet view + sample req", draftId: "d9", weight: "med" },
  { id: "s3", time: "9:18a", kind: "appnote",   who: "Priya Ramaswamy",   co: "Northfield Sense",  text: "Downloaded SLAA660 (2nd time this month)", draftId: "d2", weight: "med" },
  { id: "s4", time: "8:55a", kind: "agg",       who: "3 engineers",       co: "Acme Robotics",     text: "Pattern: 3 eng converging on buck regulators (TPS6521905, LMR33630)", draftId: "d3", weight: "strong", synth: true },
  { id: "s5", time: "8:40a", kind: "datasheet", who: "Jen Tobias",        co: "Helio Charge",      text: "BQ25895 datasheet · 3rd view this week", draftId: "d4", weight: "med" },
  { id: "s6", time: "yest 6p", kind: "evm",     who: "Sofia Halberg",     co: "Drift EV",          text: "Ordered TMS320F28379D EVM", draftId: "d8", weight: "strong" },
  { id: "s7", time: "yest 4p", kind: "sample",  who: "Raj Singh",         co: "SensorGrid",        text: "Ordered INA226 samples (10pc) + viewed iso ref design", draftId: "d5", weight: "strong" },
  { id: "s8", time: "yest 3p", kind: "appnote", who: "Lena Duarte",       co: "Meridian MotorCtrl",text: "Downloaded SPRUH18 (InstaSPIN tuning)", draftId: "d6", weight: "med" },
  { id: "s9", time: "yest 2p", kind: "evm",     who: "Priya Ramaswamy",   co: "Northfield Sense",  text: "MSP430G2553 LaunchPad shipped (8d ago) — delivered today", draftId: "d2", weight: "weak" },
  { id: "s10", time: "yest 11a", kind: "quote", who: "Owen Brandt",       co: "CinderLabs",        text: "Quote LMR33630 — sample order pending 6d", draftId: "d7", weight: "strong" },
  { id: "s11", time: "Mon 4p", kind: "datasheet", who: "Elena Vargas",    co: "Volthaus Battery",  text: "TPS6521905 layout guide · viewed", draftId: null, weight: "weak" },
  { id: "s12", time: "Mon 2p", kind: "appnote", who: "Kai Nakamura",      co: "Drift EV",          text: "Downloaded SPRUI98 (C2000 ref design)", draftId: "d8", weight: "weak" },
  { id: "s13", time: "Mon 11a", kind: "datasheet", who: "Theo Falk",      co: "LumenStack",        text: "TPS6521905 ds · viewed", draftId: "d9", weight: "weak" },
];

// Channel = the upstream data stream the event came from.
// kind -> {channel name, swatch color, single-letter glyph}
const CHANNELS = {
  quote:     { ch: "Quote system",  color: "#b85a4a", letter: "Q" },
  evm:       { ch: "EVM orders",    color: "#6a8e5a", letter: "E" },
  sample:    { ch: "Samples",       color: "#3d7a8c", letter: "S" },
  datasheet: { ch: "TI.com web",    color: "#7a5a9c", letter: "D" },
  appnote:   { ch: "TI.com web",    color: "#7a5a9c", letter: "A" },
  agg:       { ch: "Synth pattern", color: "#c89a3a", letter: "↯" },
};

const SignalRow = ({ s, hover, setHover, hoverDraft }) => {
  const dim = hoverDraft && s.draftId !== hoverDraft;
  const lit = hoverDraft && s.draftId === hoverDraft;
  const isHov = hover === s.id;
  const ch = CHANNELS[s.kind] || CHANNELS.datasheet;
  return (
    <div
      onMouseEnter={() => setHover(s.id)}
      onMouseLeave={() => setHover(null)}
      style={{
        display: "flex", gap: 8, padding: "5px 12px 5px 8px",
        borderBottom: "1px solid var(--ink-ghost)",
        opacity: dim ? 0.32 : 1,
        background: lit ? "#fffbe8" : (isHov ? "rgba(0,0,0,0.025)" : "transparent"),
        transition: "background .1s, opacity .12s",
        cursor: s.draftId ? "pointer" : "default",
        alignItems: "center",
        whiteSpace: "nowrap",
        position: "relative",
        borderLeft: `3px solid ${ch.color}`,
      }}
      title={ch.ch}>
      {/* channel chip */}
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 18, height: 18, flexShrink: 0,
        background: ch.color, color: "#fff",
        fontFamily: "Architects Daughter", fontSize: 11, fontWeight: 700,
        borderRadius: 3, lineHeight: 1,
      }}>{ch.letter}</span>
      {/* time */}
      <span className="hand" style={{ width: 56, fontSize: 10.5, color: "var(--ink-faint)", flexShrink: 0 }}>{s.time}</span>
      {/* who · co */}
      <span style={{ fontFamily: "Architects Daughter", fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>{s.who}</span>
      <span className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)", flexShrink: 0 }}>· {s.co}</span>
      {/* event text — takes remaining space + ellipses */}
      <span className="hand" style={{
        fontSize: 11.5, color: "var(--ink)",
        flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
        marginLeft: 2,
      }}>— {s.text}</span>
      {/* draft link badge */}
      {s.draftId ? (
        <span className="hand" style={{ fontSize: 10, color: "var(--ink-faint)", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 3 }}>
          <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M2 5.5 L9 5.5 M6 2 L9.5 5.5 L6 9" /></svg>
          {s.draftId}
        </span>
      ) : (
        <span className="hand" style={{ fontSize: 10, color: "var(--ink-ghost)", flexShrink: 0 }}>—</span>
      )}
    </div>
  );
};

const SignalsFeed = ({ hover, setHover, hoverDraft }) => {
  const groups = [
    { label: "Today · Apr 28", items: SIGNALS.filter((s) => !s.time.startsWith("yest") && !s.time.startsWith("Mon")) },
    { label: "Yesterday · Apr 27", items: SIGNALS.filter((s) => s.time.startsWith("yest")) },
    { label: "Mon · Apr 26", items: SIGNALS.filter((s) => s.time.startsWith("Mon")) },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* feed header */}
      <div style={{ padding: "10px 14px", borderBottom: "1.5px solid var(--ink)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: "Architects Daughter", fontSize: 14, fontWeight: 700 }}>Signals</div>
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>events from your accounts</span>
        <div style={{ flex: 1 }} />
        <button className="btn ghost" style={{ fontSize: 10.5, padding: "2px 7px" }}>live ●</button>
      </div>

      {/* channel legend */}
      <div style={{ padding: "6px 14px", borderBottom: "1px solid var(--ink-ghost)", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>channels:</span>
        {[
          ["Q", "Quote system", "#b85a4a", 2],
          ["E", "EVM orders",   "#6a8e5a", 2],
          ["S", "Samples",      "#3d7a8c", 1],
          ["D", "Datasheets",   "#7a5a9c", 4],
          ["A", "App notes",    "#7a5a9c", 3],
          ["↯", "Synth",         "#c89a3a", 1],
        ].map(([l, name, c, n], i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, background: c, color: "#fff", fontFamily: "Architects Daughter", fontSize: 9, fontWeight: 700, borderRadius: 2.5 }}>{l}</span>
            <span className="hand" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>{name} {n}</span>
          </span>
        ))}
      </div>

      {/* synthesized insights row */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--ink-ghost)", background: "var(--paper-warm)" }}>
        <div className="hand" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-faint)", marginBottom: 6 }}>↯ synthesized insights</div>
        <div className="sk-border-soft" style={{ padding: "8px 11px", marginBottom: 5, background: "var(--paper)" }}
             onMouseEnter={() => setHover("s4")} onMouseLeave={() => setHover(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TrigIcon kind="agg" />
            <span style={{ fontFamily: "Architects Daughter", fontSize: 12, fontWeight: 600 }}>Acme Robotics — buck convergence</span>
            <span className="hand" style={{ fontSize: 10, color: "var(--ink-faint)", marginLeft: "auto" }}>30d</span>
          </div>
          <div className="hand" style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.35 }}>
            3 engineers viewed TPS6521905 + LMR33630 within 30 days · likely platform decision in flight
          </div>
        </div>
        <div className="sk-border-soft" style={{ padding: "8px 11px", background: "var(--paper)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--ink)" strokeWidth="1.5"><path d="M2 11 l3 -4 l2 2 l5 -6" /><path d="M9 3 h3 v3" /></svg>
            <span style={{ fontFamily: "Architects Daughter", fontSize: 12, fontWeight: 600 }}>Northfield Sense — sustained engagement</span>
            <span className="hand" style={{ fontSize: 10, color: "var(--ink-faint)", marginLeft: "auto" }}>14d</span>
          </div>
          <div className="hand" style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.35 }}>
            Priya: EVM ordered → 2× app-note pulls → datasheet revisits · momentum building
          </div>
        </div>
      </div>

      {/* chronological list */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {groups.map((g, gi) => (
          <div key={gi}>
            <div className="hand" style={{ padding: "7px 14px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-faint)", background: "var(--paper)", position: "sticky", top: 0 }}>
              {g.label} <span style={{ marginLeft: 6, color: "var(--ink-ghost)" }}>· {g.items.length}</span>
            </div>
            {g.items.map((s) => (
              <SignalRow key={s.id} s={s} hover={hover} setHover={setHover} hoverDraft={hoverDraft} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

window.SignalsFeed = SignalsFeed;
window.SIGNALS = SIGNALS;
