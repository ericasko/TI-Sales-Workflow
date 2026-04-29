import { useState, useMemo, useRef, useEffect } from 'react';
import { CHANNELS, ACTION_TYPES } from '../data/index.js';

const CONF_RANK = { ok: 0, warn: 1, bad: 2 };

// Mirror the feed's contact identification — synth/aggregate drafts use the
// company name (since there's no single recipient).
const draftContact = (d) => (d.ch === "synth" ? d.rec.company : d.rec.name);

export default function HFQueue({ actions, drafts, onOpen, openId, hoverContact, setHoverContact, onAddAction, dismissActions, editedBodies }) {
  const [selected, setSelected] = useState({ d1: true, d3: true, d6: true, d8: true });
  const [sort, setSort] = useState("urgency");
  const [digestOpen, setDigestOpen] = useState(false);
  const [accountFilter, setAccountFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Drop selections for rows that no longer exist in the queue (after dismissals)
  useEffect(() => {
    setSelected(prev => {
      const liveIds = new Set(actions.map(a => a.id));
      const next = {};
      for (const [k, v] of Object.entries(prev)) if (v && liveIds.has(k)) next[k] = v;
      return next;
    });
  }, [actions]);

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const greenIds = drafts.filter(d => d.conf === "ok").map(d => d.id);
  const selCount = Object.values(selected).filter(Boolean).length;
  const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);

  const sendOne = (id, e) => {
    e?.stopPropagation();
    const edited = editedBodies && editedBodies[id];
    dismissActions([id], { message: edited ? "Sent — with your edits ✓" : "Sent ✓", kind: "success" });
  };
  const rejectOne = (id, e) => {
    e?.stopPropagation();
    dismissActions([id], { message: "Action rejected", kind: "reject" });
  };
  const sendBulk = () => {
    if (selectedIds.length === 0) return;
    dismissActions(selectedIds, { message: `${selectedIds.length} ${selectedIds.length === 1 ? "action" : "actions"} sent ✓`, kind: "success" });
  };
  const rejectBulk = () => {
    if (selectedIds.length === 0) return;
    dismissActions(selectedIds, { message: `${selectedIds.length} rejected`, kind: "reject" });
  };
  const deferBulk = () => {
    if (selectedIds.length === 0) return;
    dismissActions(selectedIds, { message: `${selectedIds.length} deferred 2 days`, kind: "info" });
  };
  const sendAllGreen = () => {
    if (greenIds.length === 0) return;
    dismissActions(greenIds, { message: `${greenIds.length} green ${greenIds.length === 1 ? "action" : "actions"} sent ✓`, kind: "success" });
  };

  const accountOptions = useMemo(() => {
    const set = new Set(actions.map(a => a.rec.company));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [actions]);

  const visibleActions = useMemo(() => {
    let arr = accountFilter === "all"
      ? [...actions]
      : actions.filter(a => a.rec.company === accountFilter);

    if (sort === "confidence") {
      arr.sort((a, b) => {
        if (a.actionType === "human" && b.actionType !== "human") return 1;
        if (b.actionType === "human" && a.actionType !== "human") return -1;
        return (CONF_RANK[a.conf] ?? 99) - (CONF_RANK[b.conf] ?? 99);
      });
    }
    // urgency: keep curated source order (rep-created actions are at the top via prepending)
    return arr;
  }, [sort, accountFilter, actions]);

  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [filterOpen]);

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header — buttons locked right via margin-auto; gap shrinks with the column,
          then they wrap underneath when there's truly no room. */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--line)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 14px" }}>
        <div style={{ flex: "0 1 auto", minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.1 }}>Action Queue</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
            <span className="num">{visibleActions.length}</span>
            {visibleActions.length !== actions.length && <> of <span className="num">{actions.length}</span></>}
            {" "}actions · what to do &amp; why
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
          <span className="chip ok"><span className="dot ok" /> {greenIds.length} ready to send</span>
          <button className="btn sm" title="Add a new action manually" onClick={onAddAction}>
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M7 2v10M2 7h10"/>
            </svg>
            Add action
          </button>
          <button
            className="btn accent sm"
            disabled={greenIds.length === 0}
            onClick={sendAllGreen}
            style={greenIds.length === 0 ? { opacity: .45, cursor: "not-allowed" } : {}}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6l4 4L11 2"/>
            </svg>
            Send all {greenIds.length} green
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding: "8px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)" }}>
        <span
          className={"cb " + (selCount > 0 ? "checked" : "")}
          onClick={() => setSelected(selCount > 0 ? {} : Object.fromEntries(drafts.map(d => [d.id, true])))}
        />
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
          {selCount > 0
            ? <><span className="num" style={{ fontWeight: 600, color: "var(--ink)" }}>{selCount}</span> selected</>
            : "Select all"}
        </span>
        {selCount > 0 && (
          <>
            <button className="btn xs primary" onClick={sendBulk}>Approve &amp; send</button>
            <button className="btn xs" onClick={rejectBulk}>Reject</button>
            <button className="btn xs ghost" onClick={deferBulk}>Defer 2d</button>
          </>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "var(--ink-4)" }}>Sort:</span>
        {["urgency", "confidence"].map(k => (
          <button key={k} onClick={() => setSort(k)} className={"btn xs " + (sort === k ? "" : "ghost")}>{k}</button>
        ))}
        <span style={{ width: 1, height: 16, background: "var(--line)" }} />
        <div ref={filterRef} style={{ position: "relative" }}>
          <button
            onClick={() => setFilterOpen(o => !o)}
            className={"btn xs " + (accountFilter !== "all" ? "" : "ghost")}
            style={accountFilter !== "all" ? { borderColor: "var(--ink)", color: "var(--ink)" } : {}}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M1 3h10M3 6h6M5 9h2"/>
            </svg>
            {accountFilter === "all" ? "Filter" : `Account: ${accountFilter}`}
            {accountFilter !== "all" && (
              <span
                onClick={(e) => { e.stopPropagation(); setAccountFilter("all"); }}
                style={{ marginLeft: 2, color: "var(--ink-4)", padding: "0 2px", fontSize: 12, lineHeight: 1, cursor: "pointer" }}
              >×</span>
            )}
          </button>
          {filterOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                minWidth: 220,
                maxHeight: 320,
                overflow: "auto",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
                boxShadow: "var(--shadow-lg)",
                padding: 4,
                zIndex: 10,
              }}
            >
              <div className="micro" style={{ padding: "8px 10px 6px" }}>Filter by account</div>
              <button
                onClick={() => { setAccountFilter("all"); setFilterOpen(false); }}
                className="btn xs ghost"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-start",
                  fontWeight: accountFilter === "all" ? 600 : 400,
                  background: accountFilter === "all" ? "var(--surface-3)" : "transparent",
                }}
              >
                All accounts
                <span style={{ marginLeft: "auto", color: "var(--ink-4)" }} className="num">{actions.length}</span>
              </button>
              <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }} />
              {accountOptions.map(co => {
                const n = actions.filter(a => a.rec.company === co).length;
                const active = accountFilter === co;
                return (
                  <button
                    key={co}
                    onClick={() => { setAccountFilter(co); setFilterOpen(false); }}
                    className="btn xs ghost"
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-start",
                      fontWeight: active ? 600 : 400,
                      background: active ? "var(--surface-3)" : "transparent",
                    }}
                  >
                    {co}
                    <span style={{ marginLeft: "auto", color: "var(--ink-4)" }} className="num">{n}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
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
        <span className="col-h">Action · subject</span>
        <span className="col-h">Confidence</span>
        <span className="col-h" style={{ textAlign: "right" }}>Actions</span>
      </div>

      {/* Rows */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {visibleActions.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--ink-3)", fontSize: 13 }}>
            {actions.length === 0 ? (
              <>
                <div style={{ fontSize: 24, marginBottom: 6 }}>✨</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>Inbox zero</div>
                <div style={{ marginTop: 4, color: "var(--ink-4)" }}>Nothing waiting on you. New signals will land here.</div>
              </>
            ) : (
              <>No actions match this filter.</>
            )}
          </div>
        )}
        {visibleActions.map(d => {
          const ch = CHANNELS[d.ch];
          const contact = draftContact(d);
          const dim = hoverContact && contact !== hoverContact;
          const lit = hoverContact && contact === hoverContact;
          const isOpen = openId === d.id;
          return (
            <div
              key={d.id}
              onClick={() => onOpen(d.id)}
              onMouseEnter={() => setHoverContact && setHoverContact(contact)}
              onMouseLeave={() => setHoverContact && setHoverContact(null)}
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
                  {d.createdByUser && <span className="by-you">Created by you</span>}
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
                <button
                  className="btn xs primary"
                  title="Approve & send"
                  onClick={(e) => sendOne(d.id, e)}
                  disabled={d.actionType === "human"}
                  style={d.actionType === "human" ? { opacity: .35, cursor: "not-allowed" } : {}}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 1L5 7"/>
                    <path d="M11 1L7 11L5 7L1 5L11 1Z"/>
                  </svg>
                </button>
                <button
                  className="btn xs ghost icon"
                  title="Reject (don't take this action)"
                  onClick={(e) => rejectOne(d.id, e)}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M11 3L3 11M3 3l8 8"/>
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
