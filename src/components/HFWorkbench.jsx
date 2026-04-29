import { useState, useEffect } from 'react';
import { SIGNALS, DRAFTS } from '../data/index.js';
import HFFeed from './HFFeed.jsx';
import HFQueue from './HFQueue.jsx';
import HFDrawer from './HFDrawer.jsx';

const DRAFT_IDS = DRAFTS.map(d => d.id);

export default function HFWorkbench() {
  const [openId, setOpenId] = useState(null);
  const [hoverSignal, setHoverSignal] = useState(null);
  const [hoverDraft, setHoverDraft] = useState(null);
  const [channelFilter, setChannelFilter] = useState("all");

  const sig = SIGNALS.find(s => s.id === hoverSignal);
  const hoverSignalDraft = sig ? sig.draftId : null;
  const effectiveHoverDraft = hoverSignalDraft || hoverDraft;
  const effectiveHover = hoverSignal || (hoverDraft ? (SIGNALS.find(s => s.draftId === hoverDraft) || {}).id : null);

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape" && openId) {
        setOpenId(null);
        return;
      }
      if (openId) {
        const idx = DRAFT_IDS.indexOf(openId);
        if (e.key === "ArrowUp" || e.key === "k") {
          e.preventDefault();
          if (idx > 0) setOpenId(DRAFT_IDS[idx - 1]);
        }
        if (e.key === "ArrowDown" || e.key === "j") {
          e.preventDefault();
          if (idx < DRAFT_IDS.length - 1) setOpenId(DRAFT_IDS[idx + 1]);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  const handleDrawerNav = (newId) => {
    if (newId) setOpenId(newId);
    else setOpenId(null);
  };

  return (
    <div className="hf" style={{ height: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* App nav */}
      <div style={{ padding: "0 28px", borderBottom: "1px solid var(--line)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 18, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 0" }}>
          <div style={{ width: 26, height: 26, borderRadius: 5, background: "var(--accent)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, letterSpacing: -0.5 }}>
            TI
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: -0.1 }}>Sales</span>
        </div>
        <div style={{ display: "flex", gap: 0, alignSelf: "stretch" }}>
          <span className="nav-tab on">Workbench</span>
          <span className="nav-tab">Accounts</span>
          <span className="nav-tab">Sent log</span>
          <span className="nav-tab" title="Auto-send threshold, VIP overrides, account-level rules">Rules</span>
          <span className="nav-tab">Team</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span>Book of biz:</span>
          <button className="btn sm">
            Power IC · West
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 4l3 3 3-3"/>
            </svg>
          </button>
        </div>
        <button className="btn sm ghost icon" title="Search">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="6" cy="6" r="4"/><path d="M9 9l3 3"/>
          </svg>
        </button>
        <button className="btn sm ghost icon" title="Notifications">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6a4 4 0 0 1 8 0v3l1 2H2l1-2V6zM5 12a2 2 0 0 0 4 0"/>
          </svg>
        </button>
        <div className="av sm" style={{ marginLeft: 4 }}>ES</div>
      </div>

      {/* Sub-header */}
      <div style={{ padding: "16px 28px 14px", background: "var(--bg)", display: "flex", alignItems: "baseline", gap: 14, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3 }}>Good morning, Erica</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
            <span className="num">{SIGNALS.length}</span> signals fired since yesterday → produced{" "}
            <span className="num">{DRAFTS.length}</span> drafts ·{" "}
            <span style={{ color: "var(--ok)" }}>
              <span className="num">{DRAFTS.filter(d => d.conf === "ok").length}</span> ready to send
            </span>{" "}
            · est. 14 min to clear
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn sm ghost">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="2" y="3" width="10" height="9" rx="1"/><path d="M2 6h10M5 1v3M9 1v3"/>
          </svg>
          Last 7 days
        </button>
      </div>

      {/* Two-column body */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)", gap: 20, padding: "0 28px 24px", minHeight: 0 }}>
        <HFFeed
          hover={effectiveHover}
          setHover={setHoverSignal}
          hoverDraft={effectiveHoverDraft}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          onDraftClick={setOpenId}
        />
        <HFQueue
          onOpen={id => setOpenId(openId === id ? null : id)}
          openId={openId}
          hoverSignalDraft={hoverSignalDraft}
          setHoverDraft={setHoverDraft}
        />
      </div>

      {/* Drawer */}
      {openId && (
        <HFDrawer
          draftId={openId}
          onClose={handleDrawerNav}
          allIds={DRAFT_IDS}
        />
      )}
    </div>
  );
}
