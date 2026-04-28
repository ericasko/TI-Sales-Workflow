// Two-sided page: Signals feed (left) + Send Queue (right).
// Cross-highlights on hover via shared hover state.

const TwoSided = ({ openId, setOpenId, drawerMode }) => {
  const [hoverSignal, setHoverSignal] = React.useState(null);   // signal id being hovered
  const [hoverDraft, setHoverDraft] = React.useState(null);     // draft id being hovered (right side)

  // map signal id -> draftId for cross-highlighting
  const sig = SIGNALS.find((s) => s.id === hoverSignal);
  const hoverSignalDraft = sig ? sig.draftId : null;

  // signals that point to the currently-hovered draft (light up on right→left highlight)
  const highlightSignals = hoverDraft ? new Set(SIGNALS.filter((s) => s.draftId === hoverDraft).map((s) => s.id)) : null;

  // when right→left highlight is active, treat the highlight set as "matching draft"
  const effectiveHover = hoverSignal || (highlightSignals && highlightSignals.size ? [...highlightSignals][0] : null);
  const effectiveHoverDraft = hoverSignalDraft || hoverDraft;

  return (
    <div className="sketch" style={{ height: "100%", background: "var(--paper)", display: "flex", flexDirection: "column" }}>
      {/* App chrome */}
      <div style={{ borderBottom: "1.5px solid var(--ink)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "Architects Daughter", fontSize: 16, fontWeight: 700 }}>TI Sales · Daily</div>
        <div style={{ display: "flex", gap: 4, marginLeft: 14 }}>
          <span className="tab on">Workbench</span>
          <span className="tab">Accounts</span>
          <span className="tab">Sent log</span>
          <span className="tab">Rules</span>
          <span className="tab">Team</span>
        </div>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>book of biz: <b>Power IC · West</b></span>
        <button className="btn ghost" style={{ fontSize: 11 }}>last 7d ▾</button>
        <div className="av">ES</div>
      </div>

      {/* Sub-header — narrative band */}
      <div style={{ padding: "8px 18px", borderBottom: "1px solid var(--ink-ghost)", background: "var(--paper-warm)", display: "flex", alignItems: "center", gap: 14 }}>
        <span className="hand" style={{ fontSize: 12.5 }}>
          <b>Good morning, Erica.</b> 13 signals fired since yesterday — they produced 9 drafts. 5 are ready to send.
        </span>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ fontSize: 11, color: "var(--ink-soft)" }}>est. 14 min to clear</span>
      </div>

      {/* TWO COLUMNS — left rolling feed, right dense table */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)", minHeight: 0, position: "relative" }}>
        {/* Left: rolling signals feed */}
        <div style={{ borderRight: "1.5px dashed var(--ink-ghost)", minWidth: 0, position: "relative" }}>
          <SignalsFeed hover={effectiveHover} setHover={setHoverSignal} hoverDraft={effectiveHoverDraft} />
        </div>

        {/* Right: dense queue table */}
        <div style={{ minWidth: 0, position: "relative" }}>
          <QueueDense onOpen={setOpenId} openId={openId} />
        </div>

        {/* Drawer slides over from the right (over the table) */}
        {drawerMode && openId && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}>
            <Drawer draftId={openId} onClose={() => setOpenId(null)} />
          </div>
        )}

        {/* the cross-highlight "thread" — a faint line drawn between feed item and draft when something is active */}
        {effectiveHoverDraft && !drawerMode && (
          <div className="hand" style={{
            position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
            background: "var(--ink)", color: "var(--paper)",
            padding: "2px 8px", fontSize: 10.5, borderRadius: 8,
            pointerEvents: "none", zIndex: 5,
          }}>
            ↔ linked to draft {effectiveHoverDraft}
          </div>
        )}
      </div>

      {/* Footer — kbd cheats */}
      <div style={{ borderTop: "1px solid var(--ink-ghost)", padding: "6px 18px", display: "flex", gap: 14, alignItems: "center", fontSize: 11 }}>
        <span className="hand" style={{ color: "var(--ink-soft)" }}>kbd:</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">j</span><span className="kbd">k</span> <span className="hand">drafts</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">e</span> <span className="hand">send</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">x</span> <span className="hand">reject</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">⏎</span> <span className="hand">open</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span className="kbd">/</span> <span className="hand">filter feed</span></span>
        <div style={{ flex: 1 }} />
        <span className="hand" style={{ color: "var(--ink-faint)" }}>auto-refresh every 5 min</span>
      </div>
    </div>
  );
};

window.TwoSided = TwoSided;
