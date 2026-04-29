import { useState, useEffect, useRef } from 'react';
import { SIGNALS, DRAFTS, ACTIONS } from '../data/index.js';
import HFFeed from './HFFeed.jsx';
import HFQueue from './HFQueue.jsx';
import HFDrawer from './HFDrawer.jsx';
import AddActionModal from './AddActionModal.jsx';
import LogSignalModal from './LogSignalModal.jsx';

const PILOT_NUMS = [1, 2, 3];

export default function HFWorkbench() {
  // Lifted state — rep-created signals and actions are appended to the originals.
  const [extraSignals, setExtraSignals] = useState([]);
  const [extraActions, setExtraActions] = useState([]);
  const allSignals = [...extraSignals, ...SIGNALS];
  const allActions = [...extraActions, ...ACTIONS];
  const allDrafts  = [...extraActions, ...DRAFTS];

  const [openId, setOpenId] = useState(null);
  // hoverContact = a contact identifier (person name, or company for synth/aggregate
  // signals) used to cross-highlight rows on both sides of the workbench.
  const [hoverContact, setHoverContact] = useState(null);
  const [channelFilter, setChannelFilter] = useState("all");
  const [pilots, setPilots] = useState({ 1: true, 2: false, 3: false });
  const [pilotsOpen, setPilotsOpen] = useState(false);
  const pilotsRef = useRef(null);

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [addPrefill, setAddPrefill] = useState(null);
  const [logOpen, setLogOpen] = useState(false);

  const togglePilot = (n) => setPilots(p => ({ ...p, [n]: !p[n] }));
  const selectedPilots = PILOT_NUMS.filter(n => pilots[n]);
  const pilotLabel =
    selectedPilots.length === 0 ? "Select pilot…" :
    selectedPilots.length === 1 ? `OMM Pilot ${selectedPilots[0]}` :
    selectedPilots.length === PILOT_NUMS.length ? `All ${PILOT_NUMS.length} pilots` :
    `OMM Pilots ${selectedPilots.join(", ")}`;

  useEffect(() => {
    if (!pilotsOpen) return;
    const onDown = (e) => {
      if (pilotsRef.current && !pilotsRef.current.contains(e.target)) setPilotsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pilotsOpen]);

  const draftIds = allDrafts.map(d => d.id);

  // Keyboard navigation (no-op when a modal is open)
  useEffect(() => {
    const onKey = e => {
      if (addOpen || logOpen) return;
      if (e.key === "Escape" && openId) {
        setOpenId(null);
        return;
      }
      if (openId) {
        const idx = draftIds.indexOf(openId);
        if (e.key === "ArrowUp" || e.key === "k") {
          e.preventDefault();
          if (idx > 0) setOpenId(draftIds[idx - 1]);
        }
        if (e.key === "ArrowDown" || e.key === "j") {
          e.preventDefault();
          if (idx < draftIds.length - 1) setOpenId(draftIds[idx + 1]);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId, addOpen, logOpen, draftIds.join("|")]);

  const handleDrawerNav = (newId) => {
    if (newId) setOpenId(newId);
    else setOpenId(null);
  };

  const handleAddAction = (action) => {
    setExtraActions(prev => [action, ...prev]);
    setAddOpen(false);
    setAddPrefill(null);
    // Open the new action in the drawer for review
    setOpenId(action.id);
  };

  const handleLogSignal = (signal) => {
    setExtraSignals(prev => [signal, ...prev]);
    setLogOpen(false);
  };

  // "Take action" on a feed signal that didn't auto-generate one
  const handleTakeAction = (signal) => {
    setAddPrefill({
      name: signal.who,
      company: signal.co,
      email: "",
      type: "email-out",
      intent: signal.text ? `Follow up: ${signal.text}` : "",
    });
    setAddOpen(true);
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
        <div ref={pilotsRef} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-3)" }}>
          <span>Book of biz:</span>
          <button className="btn sm" onClick={() => setPilotsOpen(o => !o)}>
            {pilotLabel}
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ transform: pilotsOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
              <path d="M2 4l3 3 3-3"/>
            </svg>
          </button>
          {pilotsOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                minWidth: 200,
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r)",
                boxShadow: "var(--shadow-lg)",
                padding: 4,
                zIndex: 20,
              }}
            >
              <div className="micro" style={{ padding: "8px 10px 6px" }}>Book of business</div>
              {PILOT_NUMS.map(n => (
                <div
                  key={n}
                  onClick={() => togglePilot(n)}
                  style={{
                    padding: "7px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    borderRadius: "var(--r-sm)",
                    transition: "background .1s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-3)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span className={"cb " + (pilots[n] ? "checked" : "")} />
                  <span style={{ fontSize: 12.5, color: "var(--ink)" }}>OMM Pilot {n}</span>
                </div>
              ))}
              <div style={{ height: 1, background: "var(--line)", margin: "4px 0" }} />
              <div style={{ display: "flex", gap: 4, padding: "2px 4px 4px" }}>
                <button
                  className="btn xs ghost"
                  onClick={() => setPilots({ 1: true, 2: true, 3: true })}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Select all
                </button>
                <button
                  className="btn xs ghost"
                  onClick={() => setPilots({ 1: false, 2: false, 3: false })}
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
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
            <span className="num">{allSignals.length}</span> signals fired since yesterday → produced{" "}
            <span className="num">{allDrafts.length}</span> drafts ·{" "}
            <span style={{ color: "var(--ok)" }}>
              <span className="num">{allDrafts.filter(d => d.conf === "ok").length}</span> ready to send
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
          signals={allSignals}
          hoverContact={hoverContact}
          setHoverContact={setHoverContact}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          onDraftClick={setOpenId}
          onAddSignal={() => setLogOpen(true)}
          onTakeAction={handleTakeAction}
        />
        <HFQueue
          actions={allActions}
          drafts={allDrafts}
          onOpen={id => setOpenId(openId === id ? null : id)}
          openId={openId}
          hoverContact={hoverContact}
          setHoverContact={setHoverContact}
          onAddAction={() => { setAddPrefill(null); setAddOpen(true); }}
        />
      </div>

      {/* Drawer */}
      {openId && (
        <HFDrawer
          draftId={openId}
          drafts={allDrafts}
          onClose={handleDrawerNav}
          allIds={draftIds}
        />
      )}

      <AddActionModal
        open={addOpen}
        prefill={addPrefill}
        onClose={() => { setAddOpen(false); setAddPrefill(null); }}
        onSubmit={handleAddAction}
      />
      <LogSignalModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSubmit={handleLogSignal}
      />
    </div>
  );
}
