import { useState } from 'react';
import { CHANNELS, DRAFTS, ACTIONS, ACTION_TYPES } from '../data/index.js';

export default function HFQueue({ onOpen, openId, hoverSignalDraft, setHoverDraft }) {
  const [selected, setSelected] = useState({ d1: true, d3: true, d6: true, d8: true });
  const [sort, setSort] = useState("urgency");
  const [digestOpen, setDigestOpen] = useState(false);

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const greenIds = DRAFTS.filter(d => d.conf === "ok").map(d => d.id);
  const selCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.1 }}>Action Queue</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
            <span className="num">{ACTIONS.length}</span> actions · what to do &amp; why
          </div>
        </div>
        <span className="chip ok"><span className="dot ok" /> {greenIds.length} ready to send</span>
        <button className="btn accent sm">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 6l4 4L11 2"/>
          </svg>
          Send all {greenIds.length} green
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "8px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)" }}>
        <span
          className={"cb " + (selCount > 0 ? "checked" : "")}
          onClick={() => setSelected(selCount > 0 ? {} : Object.fromEntries(DRAFTS.map(d => [d.id, true])))}
        />
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
          {selCount > 0
            ? <><span className="num" style={{ fontWeight: 600, color: "var(--ink)" }}>{selCount}</span> selected</>
            : "Select all"}
        </span>
        {selCount > 0 && (
          <>
            <button className="btn xs primary">Approve &amp; send</button>
            <button className="btn xs">Reject</button>
            <button className="btn xs ghost">Defer 2d</button>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "var(--ink-4)" }}>Sort:</span>
        {["urgency", "confidence", "account"].map(k => (
          <button key={k} onClick={() => setSort(k)} className={"btn xs " + (sort === k ? "" : "ghost")}>{k}</button>
        ))}
        <span style={{ width: 1, height: 16, background: "var(--line)" }} />
        <button className="btn xs ghost">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M1 3h10M3 6h6M5 9h2"/>
          </svg>
          Filter
        </button>
      </div>

      {/* Auto-sent digest */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-2)" }}>
        <div
          onClick={() => setDigestOpen(o => !o)}
          style={{ padding: "8px 20px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="var(--ok)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 6l4 4L11 2"/>
          </svg>
          <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
            <span className="num" style={{ fontWeight: 600 }}>12</span> auto-sent today (≥95% confidence)
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{digestOpen ? "hide" : "review"}</span>
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="var(--ink-4)" strokeWidth="1.6" strokeLinecap="round"
            style={{ transform: digestOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}
          >
            <path d="M2 4l3 3 3-3"/>
          </svg>
        </div>
        {digestOpen && (
          <div style={{ padding: "0 20px 10px", fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.55 }}>
            • 8:14a — Datasheet follow-up to <b>K. Nakamura</b> (Drift EV)<br />
            • 7:52a — Sample shipped note to <b>L. Duarte</b> (Meridian)<br />
            • 7:31a — App-note share to <b>E. Vargas</b> (Volthaus) · 9 more
          </div>
        )}
      </div>

      {/* Table header */}
      <div
        className="queue-row"
        style={{
          gridTemplateColumns: "16px 12px 1.4fr 1.6fr 2.2fr 0.7fr 90px",
          padding: "10px 18px",
          borderBottom: "1px solid var(--line)",
          background: "var(--surface)",
          cursor: "default",
        }}
      >
        <span></span>
        <span className="col-h"></span>
        <span className="col-h">Recipient</span>
        <span className="col-h">Why now</span>
        <span className="col-h">Subject · preview</span>
        <span className="col-h">Confidence</span>
        <span className="col-h" style={{ textAlign: "right" }}>Actions</span>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {ACTIONS.map(d => {
          const ch = CHANNELS[d.ch];
          const dim = hoverSignalDraft && hoverSignalDraft !== d.id;
          const lit = hoverSignalDraft && hoverSignalDraft === d.id;
          const isOpen = openId === d.id;
          return (
            <div
              key={d.id}
              onClick={() => onOpen(d.id)}
              onMouseEnter={() => setHoverDraft && setHoverDraft(d.id)}
              onMouseLeave={() => setHoverDraft && setHoverDraft(null)}
              className={"queue-row" + (isOpen ? " active" : "") + (lit ? " lit" : "") + (dim ? " dim" : "")}
              style={{ gridTemplateColumns: "16px 12px 1.4fr 1.6fr 2.2fr 0.7fr 90px" }}
            >
              <span
                className={"cb " + (selected[d.id] ? "checked" : "")}
                onClick={e => { e.stopPropagation(); toggle(d.id); }}
              />
              <span className={"chc " + ch.code} title={ch.name}>{ch.letter}</span>

              {/* Recipient */}
              <div style={{ display: "flex", gap: 9, alignItems: "center", minWidth: 0 }}>
                <div className="av sm">{d.rec.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {d.rec.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {d.rec.role} · {d.rec.company}
                  </div>
                </div>
              </div>

              {/* Why */}
              <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.4, minWidth: 0 }}>
                {d.why}
                {d.flag && (
                  <span className="chip bad" style={{ marginLeft: 6, fontSize: 10.5, height: 18, padding: "1px 7px" }}>review</span>
                )}
              </div>

              {/* Subject + action type + density */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span className="chip outline" style={{ fontSize: 10, padding: "1px 6px", height: 16, color: "var(--ink-3)" }}>
                    {ACTION_TYPES[d.actionType]?.short || "Email"}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>
                    {d.actionType === "human"
                      ? <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>Human-led — no draft. What do you want to do?</span>
                      : d.subject}
                  </span>
                </div>
                {d.conf !== "ok" && d.actionType !== "human" && (
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {d.preview}
                  </div>
                )}
              </div>

              {/* Confidence */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span className={"dot " + d.conf} />
                <span style={{ color: "var(--ink-2)" }}>
                  {d.conf === "ok" ? "High" : d.conf === "warn" ? "Medium" : "Low"}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                <button className="btn xs primary" title="Approve & send (e)">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 6l4 4L11 2"/>
                  </svg>
                </button>
                <button className="btn xs ghost icon" title="More">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="11" cy="7" r="1.2"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer keyboard hints */}
      <div style={{ padding: "8px 20px", borderTop: "1px solid var(--line)", background: "var(--surface-2)", display: "flex", gap: 16, alignItems: "center", fontSize: 11.5, color: "var(--ink-3)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span className="kbd">j</span><span className="kbd">k</span> nav</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span className="kbd">e</span> approve</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span className="kbd">x</span> reject</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span className="kbd">⏎</span> open</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span className="kbd">⇧</span><span className="kbd">e</span> approve all green</span>
        <div style={{ flex: 1 }} />
        <span>Auto-refresh 5m</span>
      </div>
    </div>
  );
}
