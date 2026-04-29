import { useState, useEffect, useRef } from 'react';
import { CHANNELS, THREADS } from '../data/index.js';

const ANNOS = {
  d2: [
    { id: "a1", num: 1, kind: "ok",   text: "MSP430G2553 LaunchPad", note: "Matches sample order — MSP-EXP430G2ET shipped 8 days ago",                               source: "Order #4421-887"      },
    { id: "a2", num: 2, kind: "ok",   text: "SLAA660",               note: "Downloaded twice (Apr 18, Apr 22) — repeat signal",                                      source: "TI.com analytics"     },
    { id: "a3", num: 3, kind: "flag", text: "the RGZ variant",       note: "AI cited the RGZ package, but order shows the PW (TSSOP) variant. Fix before send.",    source: "Order line item"      },
    { id: "a4", num: 4, kind: "ok",   text: "battery-powered industrial sensor", note: "Inferred from TPS6521905 + MSP430 + INA226 viewing pattern",                source: "Inference"            },
  ],
  d3: [
    { id: "a1", num: 1, kind: "ok", text: "three engineers on your team", note: "M. Kapoor, J. Lin, S. Park — all viewed buck regulator pages",           source: "Aggregated activity 30d" },
    { id: "a2", num: 2, kind: "ok", text: "TPS6521905 + LMR33630",        note: "Appeared in viewing history of all 3",                                   source: "TI.com"                  },
    { id: "a3", num: 3, kind: "ok", text: "next platform",                note: "Inferred — parts viewed sit in same power-tree role",                    source: "Inference"               },
  ],
  default: [
    { id: "a1", num: 1, kind: "ok", text: "TPS6521905 quote",  note: "Quote #Q-998312 submitted Apr 25",     source: "Quote system"   },
    { id: "a2", num: 2, kind: "ok", text: "RGE QFN package",   note: "Matches part number on quote",          source: "Quote line item" },
  ],
};

// Plain-text version of each body template, used when the rep enters edit mode
function buildPlainBody(d) {
  if (d.createdByUser && d.body) return d.body;
  if (d.id === "d2") return `Hi Priya,

Hope the MSP430G2553 LaunchPad arrived OK. I noticed you also pulled SLAA660 twice this month, which usually means a team is working through low-power optimization on a battery design.

For the RGZ variant you're sampling, the most common gotcha is bypass cap placement under the exposed pad — happy to send the layout guide we use internally.

Given the parts you've been looking at, my guess is you're putting together a battery-powered industrial sensor. Let me know if a 20-minute call would be useful.

— Erica`;
  if (d.id === "d3") return `Hello,

I noticed three engineers on your team have been looking at our buck family — specifically TPS6521905 + LMR33630 — which usually shows up around the time a team is locking down a power tree.

If your next platform is the right context, I'd love to spend 30 minutes with whoever owns power-stage decisions. We have ref designs covering both single-rail and split-rail topologies for this part pairing.

— Erica`;
  const firstName = d.rec.name.split(" ")[0];
  return `Hi ${firstName},

Saw your TPS6521905 quote come through yesterday. Wanted to flag that the RGE QFN package has a few layout requirements worth knowing about up front — most questions we get from new users center on inductor placement and the FB divider trace.

Happy to walk through it. Also pinging you the PMP40123 reference design which uses this part in the configuration teams usually start from.

— Erica`;
}

function buildBody(d, active, setActive) {
  // Rep-created drafts render the user-typed body verbatim — no fake annotations
  if (d.createdByUser && d.body) {
    return <span style={{ whiteSpace: "pre-wrap" }}>{d.body}</span>;
  }
  if (d.id === "d2") return (
    <>
      Hi Priya,<br /><br />
      Hope the <Anno id="a1" active={active} setActive={setActive}>MSP430G2553 LaunchPad</Anno> arrived OK.
      I noticed you also pulled <Anno id="a2" active={active} setActive={setActive}>SLAA660</Anno> twice this month, which usually means a team is working through low-power optimization on a battery design.
      <br /><br />
      For <Anno id="a3" kind="flag" active={active} setActive={setActive}>the RGZ variant</Anno> you&apos;re sampling, the most common gotcha is bypass cap placement under the exposed pad — happy to send the layout guide we use internally.
      <br /><br />
      Given the parts you&apos;ve been looking at, my guess is you&apos;re putting together a <Anno id="a4" active={active} setActive={setActive}>battery-powered industrial sensor</Anno>. Let me know if a 20-minute call would be useful.
      <br /><br />— Erica
    </>
  );
  if (d.id === "d3") return (
    <>
      Hello,<br /><br />
      I noticed <Anno id="a1" active={active} setActive={setActive}>three engineers on your team</Anno> have been looking at our buck family — specifically <Anno id="a2" active={active} setActive={setActive}>TPS6521905 + LMR33630</Anno> — which usually shows up around the time a team is locking down a power tree.
      <br /><br />
      If your <Anno id="a3" active={active} setActive={setActive}>next platform</Anno> is the right context, I&apos;d love to spend 30 minutes with whoever owns power-stage decisions. We have ref designs covering both single-rail and split-rail topologies for this part pairing.
      <br /><br />— Erica
    </>
  );
  const firstName = d.rec.name.split(" ")[0];
  return (
    <>
      Hi {firstName},<br /><br />
      Saw your <Anno id="a1" active={active} setActive={setActive}>TPS6521905 quote</Anno> come through yesterday. Wanted to flag that the <Anno id="a2" active={active} setActive={setActive}>RGE QFN package</Anno> has a few layout requirements worth knowing about up front — most questions we get from new users center on inductor placement and the FB divider trace.
      <br /><br />
      Happy to walk through it. Also pinging you the PMP40123 reference design which uses this part in the configuration teams usually start from.
      <br /><br />— Erica
    </>
  );
}

function Anno({ id, kind, active, setActive, children }) {
  const isFlag = kind === "flag";
  return (
    <span
      className={"anno" + (isFlag ? " flag" : "") + (active === id ? " active" : "")}
      onClick={() => setActive(active === id ? null : id)}
    >
      {children}<span className="anno-num">{id.replace("a", "")}</span>
    </span>
  );
}

export default function HFDrawer({ draftId, drafts, onClose, allIds, editedBody, setEditedBody, dismissActions }) {
  const d = drafts.find(x => x.id === draftId);
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("activity");
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState("");
  const textareaRef = useRef(null);

  const startEditing = () => {
    if (!d) return;
    setDraftText(editedBody != null ? editedBody : buildPlainBody(d));
    setIsEditing(true);
    setTimeout(() => textareaRef.current && textareaRef.current.focus(), 50);
  };

  const finishEditing = () => {
    if (!d) return;
    const trimmed = draftText.trim();
    const original = buildPlainBody(d).trim();
    setEditedBody(draftId, trimmed === original ? null : draftText);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const revertEdits = () => {
    setEditedBody(draftId, null);
  };

  const approveAndSend = () => {
    const msg = editedBody ? "Sent — with your edits ✓" : "Sent ✓";
    dismissActions([draftId], { message: msg, kind: "success" });
    onClose();
  };
  const reject = () => {
    dismissActions([draftId], { message: "Action rejected", kind: "reject" });
    onClose();
  };
  const defer = () => {
    dismissActions([draftId], { message: "Deferred 2 days", kind: "info" });
    onClose();
  };
  const saveAsDraft = () => {
    onClose();
  };

  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setActive(null);
    setTab("activity");
    setIsEditing(false);
  }, [draftId]);

  if (!d) return null;

  // Rep-created drafts get a one-line rationale explaining the intent rather than
  // a fabricated set of "AI cited..." annotations.
  const annos = d.createdByUser
    ? [{ id: "a1", num: 1, kind: "ok", text: "Your intent", note: d.why?.replace(/^Manually added by you · "/, "").replace(/"$/, "") || "Manually queued by you", source: "Created by you" }]
    : (ANNOS[d.id] || ANNOS.default);
  const currentIdx = allIds ? allIds.indexOf(draftId) : -1;

  return (
    <>
      {/* Backdrop (subtle) */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 29, background: "rgba(14,17,22,0.12)" }}
      />

      {/* Drawer panel */}
      <div
        className="drawer hf"
        style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          width: "min(980px, 68vw)",
          display: "flex",
          flexDirection: "column",
          zIndex: 30,
          background: "var(--surface)",
          boxShadow: "-12px 0 48px rgba(0,0,0,0.18), -1px 0 0 var(--line)",
          animation: "drawerIn 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        <style>{`
          @keyframes drawerIn {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer header */}
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button className="btn ghost icon sm" onClick={onClose} title="Close (Esc)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M11 3L3 11M3 3l8 8"/>
            </svg>
          </button>
          <div className="av md">{d.rec.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{d.rec.name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
              {d.rec.email !== "—" && <>{d.rec.email} · </>}{d.rec.role} · {d.rec.company}
            </div>
          </div>
          <span className={"chip " + (d.conf === "ok" ? "ok" : d.conf === "warn" ? "warn" : "bad")}>
            <span className={"dot " + d.conf} />
            {d.conf === "ok" ? "High confidence" : d.conf === "warn" ? "Medium · review" : "Low confidence"}
          </span>
          {allIds && (
            <>
              <button
                className="btn ghost icon sm"
                title="Previous"
                disabled={currentIdx <= 0}
                onClick={() => allIds[currentIdx - 1] && onClose(allIds[currentIdx - 1])}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M9 2L4 7l5 5"/>
                </svg>
              </button>
              <button
                className="btn ghost icon sm"
                title="Next"
                disabled={currentIdx >= allIds.length - 1}
                onClick={() => allIds[currentIdx + 1] && onClose(allIds[currentIdx + 1])}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 2l5 5-5 5"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {/* Email + rationale rail */}
          <div style={{ padding: "20px 22px 18px", display: "grid", gridTemplateColumns: "1fr 260px", gap: 22 }}>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 12, rowGap: 4, fontSize: 12, color: "var(--ink-3)", marginBottom: 12 }}>
                <span>To</span>
                <span style={{ color: "var(--ink-2)" }}>{d.rec.email}</span>
                <span>From</span>
                <span style={{ color: "var(--ink-2)" }}>Erica Skoglund &lt;erica.skoglund@ti.com&gt;</span>
              </div>

              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--surface)" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", background: "var(--surface-2)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="micro" style={{ marginBottom: 3 }}>Subject</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600 }}>{d.subject}</div>
                  </div>
                  {editedBody != null && !isEditing && (
                    <>
                      <span className="edited-tag">
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 10l1.5-3.5L9 1.5l1.5 1.5L5 8.5L2 10z"/>
                        </svg>
                        Edited
                      </span>
                      <button
                        className="btn xs ghost"
                        onClick={revertEdits}
                        title="Discard edits and restore the AI version"
                      >
                        Revert
                      </button>
                    </>
                  )}
                  {!isEditing ? (
                    <button className="btn xs" onClick={startEditing} title="Edit the email body">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 10l1.5-3.5L9 1.5l1.5 1.5L5 8.5L2 10z"/>
                      </svg>
                      Edit
                    </button>
                  ) : (
                    <>
                      <button className="btn xs ghost" onClick={cancelEditing}>Cancel</button>
                      <button className="btn xs primary" onClick={finishEditing}>Done</button>
                    </>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    spellCheck
                    style={{
                      width: "100%",
                      minHeight: 240,
                      padding: "16px 18px",
                      border: "none",
                      outline: "none",
                      resize: "vertical",
                      background: "var(--surface)",
                      color: "var(--ink-2)",
                      font: "400 13.5px/1.65 Inter, sans-serif",
                      whiteSpace: "pre-wrap",
                    }}
                  />
                ) : (
                  <div style={{ padding: "16px 18px", fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-2)", whiteSpace: editedBody != null ? "pre-wrap" : "normal" }}>
                    {editedBody != null ? editedBody : buildBody(d, active, setActive)}
                  </div>
                )}

                <div style={{ padding: "10px 16px", borderTop: "1px solid var(--line)", display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", background: "var(--surface-2)" }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 6L6.5 10.5a2.5 2.5 0 0 1-3.5-3.5L8 2a1.7 1.7 0 0 1 2.4 2.4L5 9.5"/>
                  </svg>
                  {d.attach.map((a, i) => (
                    <span key={i} className="chip outline">
                      {a} <span style={{ color: "var(--ink-4)", marginLeft: 4 }}>×</span>
                    </span>
                  ))}
                  <button className="btn xs ghost">+ add</button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 11.5, color: "var(--ink-4)" }}>
                <span>Generated by</span>
                <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{d.model}</span>
                <span>·</span>
                <span>2 min ago</span>
                {editedBody != null && (
                  <>
                    <span>·</span>
                    <span style={{ color: "var(--ink-2)" }}>edited by you</span>
                  </>
                )}
              </div>
            </div>

            {/* Rationale rail */}
            <div className="anno-rail" style={{ paddingTop: 38, display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="micro" style={{ marginBottom: 2 }}>Rationale</div>
              {annos.map(a => (
                <div
                  key={a.id}
                  onMouseEnter={() => setActive(a.id)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid " + (a.kind === "flag" ? "var(--bad)" : "var(--line)"),
                    borderRadius: "var(--r)",
                    background: active === a.id
                      ? (a.kind === "flag" ? "var(--bad-bg)" : "#fff8df")
                      : (a.kind === "flag" ? "var(--bad-bg)" : "var(--surface)"),
                    transition: "background .12s",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <span className="anno-num" style={a.kind === "flag" ? { background: "var(--bad)" } : {}}>{a.num}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: a.kind === "flag" ? "var(--bad)" : "var(--ink-2)" }}>
                      &ldquo;{a.text}&rdquo;
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.45 }}>{a.note}</div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 5, fontFamily: '"JetBrains Mono", monospace' }}>↳ {a.source}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hr" style={{ margin: "0 22px" }} />

          {/* Why this email */}
          <div style={{ padding: "18px 22px" }}>
            <div className="micro" style={{ marginBottom: 10 }}>Why this email</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Triggering signals</div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.7 }}>
                  <li>{d.why}</li>
                  <li>2 colleagues at {d.rec.company} active on related parts last 14d</li>
                  <li>No prior contact · cold-but-warm</li>
                </ul>
              </div>
              <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  Cited sources <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>· click to verify</span>
                </div>
                <ul style={{ paddingLeft: 18, margin: 0, fontSize: 12, lineHeight: 1.7 }}>
                  <li><a href="#" style={{ color: "var(--ink-2)" }}>TPS6521905 datasheet · §7.3</a></li>
                  <li><a href="#" style={{ color: "var(--ink-2)" }}>PMP40123 reference design</a></li>
                  <li><a href="#" style={{ color: "var(--ink-2)" }}>E2E thread #88421</a></li>
                  <li><a href="#" style={{ color: "var(--ink-2)" }}>Quote #Q-998312</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="hr" style={{ margin: "0 22px" }} />

          {/* Contact intelligence */}
          <div style={{ padding: "18px 22px 26px" }}>
            <div className="micro" style={{ marginBottom: 10 }}>Contact intelligence</div>
            <div style={{ borderBottom: "1px solid var(--line)", marginBottom: 14 }}>
              <div style={{ display: "flex" }}>
                {(() => {
                  const threadCount = (THREADS[d.id] || []).length;
                  return [
                    ["activity", "Activity timeline", null],
                    ["convo",    "Conversation history", threadCount > 0 ? threadCount : null],
                    ["company",  "Company context", null],
                  ].map(([k, label, count]) => (
                    <div
                      key={k}
                      className={"nav-tab" + (tab === k ? " on" : "")}
                      onClick={() => setTab(k)}
                      style={{ padding: "9px 0", marginRight: 22, display: "inline-flex", alignItems: "center", gap: 7 }}
                    >
                      {label}
                      {count != null && (
                        <span
                          className="num"
                          style={{
                            background: "var(--ch-email)",
                            color: "#fff",
                            borderRadius: 9,
                            padding: "1px 6px",
                            fontSize: 10.5,
                            fontWeight: 600,
                            lineHeight: 1.3,
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>

            {tab === "activity" && (
              <div style={{ position: "relative", paddingLeft: 24 }}>
                <div style={{ position: "absolute", left: 8, top: 6, bottom: 6, width: 1, background: "var(--line)" }} />
                {[
                  ["yesterday", "Submitted quote for TPS6521905",              "quote"],
                  ["3d ago",    "Downloaded SLAA660 (low-power app note) · 2nd time", "web"],
                  ["8d ago",    "Ordered MSP430G2553 LaunchPad EVM",           "order"],
                  ["12d ago",   "Viewed INA226 datasheet",                     "web"],
                  ["18d ago",   "Requested TPS6521905 samples (5pc)",          "order"],
                  ["31d ago",   "First TI.com session — TPS6521905 page",      "web"],
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", alignItems: "center", position: "relative" }}>
                    <span style={{ position: "absolute", left: -20, width: 9, height: 9, borderRadius: "50%", background: "var(--surface)", border: "2px solid " + CHANNELS[row[2]].color }} />
                    <span className="num" style={{ width: 80, fontSize: 11.5, color: "var(--ink-4)" }}>{row[0]}</span>
                    <span className={"chc " + CHANNELS[row[2]].code}>{CHANNELS[row[2]].letter}</span>
                    <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{row[1]}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === "convo" && (() => {
              const thread = THREADS[d.id];
              if (!thread || thread.length === 0) {
                return (
                  <div style={{ padding: "32px 0", textAlign: "center", color: "var(--ink-4)", fontSize: 13, border: "1px dashed var(--line)", borderRadius: "var(--r)" }}>
                    No prior emails — this is the first reach-out.
                  </div>
                );
              }
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginBottom: 2 }}>
                    <span className="num">{thread.length}</span> message{thread.length === 1 ? "" : "s"} · most recent first
                  </div>
                  {thread.map((m, i) => {
                    const fromThem = m.from === "them";
                    const senderName = fromThem ? d.rec.name : "Erica Skoglund";
                    const initials = fromThem ? d.rec.initials : "ES";
                    const recipientLabel = fromThem ? "→ you" : "→ " + d.rec.name.split(" ")[0];
                    return (
                      <div
                        key={i}
                        style={{
                          border: "1px solid var(--line)",
                          borderRadius: "var(--r-lg)",
                          overflow: "hidden",
                          background: "var(--surface)",
                          borderLeft: fromThem ? "3px solid var(--ch-email)" : "1px solid var(--line)",
                        }}
                      >
                        <div style={{
                          padding: "10px 14px",
                          background: fromThem ? "var(--surface-2)" : "var(--surface)",
                          borderBottom: "1px solid var(--line)",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}>
                          <div className="av sm">{initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                              {senderName}
                              <span style={{ fontWeight: 400, color: "var(--ink-4)", marginLeft: 6 }}>
                                {recipientLabel}
                              </span>
                            </div>
                          </div>
                          {fromThem && (
                            <span className="chip" style={{ background: "var(--ch-email)", color: "#fff", fontSize: 10.5, height: 18, padding: "1px 7px" }}>
                              Reply
                            </span>
                          )}
                          <span className="num" style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{m.date}</span>
                        </div>
                        <div style={{ padding: "12px 14px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                          {m.body}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {tab === "company" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Company</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.rec.company}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>~85 employees · industrial sensors<br />HQ Boulder, CO · Series B</div>
                </div>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: "12px 14px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Other engineers we&apos;ve touched</div>
                  {[["M. Kapoor", "Engaged", "ok"], ["J. Lin", "Introduced", "warn"], ["S. Park", "In Eval", "warn"]].map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                      <span style={{ fontSize: 12.5 }}>{p[0]}</span>
                      <span className="chip" style={{ fontSize: 10.5 }}>{p[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div style={{ padding: "12px 22px", borderTop: "1px solid var(--line)", background: "var(--surface-2)", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <button className="btn accent" onClick={approveAndSend}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6l4 4L11 2"/>
            </svg>
            Approve &amp; Send
            <span className="kbd" style={{ marginLeft: 4, background: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>e</span>
          </button>
          <button className="btn" onClick={saveAsDraft}>Save draft</button>
          <button className="btn" onClick={reject}>Reject</button>
          <button className="btn ghost" onClick={defer}>Defer 2d</button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
            <span className="kbd">Esc</span> close · <span className="kbd">↑</span><span className="kbd">↓</span> next/prev
          </span>
        </div>
      </div>
    </>
  );
}
