import { useState, useEffect, useRef } from 'react';
import { DRAFTS, LOG_TYPES } from '../data/index.js';

const KNOWN_CONTACTS = (() => {
  const seen = new Map();
  for (const d of DRAFTS) {
    if (d.rec.email === "—") continue;
    seen.set(d.rec.name, { name: d.rec.name, company: d.rec.company });
  }
  return Array.from(seen.values());
})();

const PROMPT = {
  call:    "30-min discovery call. Discussed BQ25895 fast-charge ACK issue. They're open to a follow-up.",
  meeting: "On-site visit at customer office. Toured the lab; saw the prototype.",
  note:    "Quick note. They mentioned an upcoming RFP we should be on.",
  other:   "What happened?",
};

export default function LogSignalModal({ open, onClose, onSubmit }) {
  const [name, setName]       = useState("");
  const [company, setCompany] = useState("");
  const [kind, setKind]       = useState("call");
  const [summary, setSummary] = useState("");
  const [notes, setNotes]     = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setName("");
    setCompany("");
    setKind("call");
    setSummary("");
    setNotes("");
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const pickContact = (c) => {
    setName(c.name);
    setCompany(c.company);
  };

  const canSubmit = name.trim() && company.trim() && summary.trim();

  const submit = () => {
    if (!canSubmit) return;
    const id = "u" + Date.now().toString(36);
    const kindLabel = LOG_TYPES.find(k => k.value === kind)?.label || "Note";
    const signal = {
      id,
      time: nowLabel(),
      ch: "call",
      who: name,
      co: company,
      text: `${kindLabel}: ${summary}`,
      draftId: null,
      weight: "med",
      kind,
      summary,
      notes,
      loggedByUser: true,
    };
    onSubmit(signal);
  };

  if (!open) return null;

  return (
    <div className="hf-modal-backdrop" onClick={onClose}>
      <div className="hf hf-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "var(--r)", background: "var(--ch-call)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4l5 4 5-4M2 4v6h10V4"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Log a signal</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
              Record a call, meeting, or note so it shows up as history for the contact.
            </div>
          </div>
          <button className="btn ghost icon sm" onClick={onClose} title="Close (Esc)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M11 3L3 11M3 3l8 8"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="form-label">Type</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {LOG_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setKind(t.value)}
                  className={"btn xs " + (kind === t.value ? "" : "ghost")}
                  style={kind === t.value ? { borderColor: "var(--ch-call)", color: "var(--ch-call)", background: "var(--ch-call-bg, #fbecd8)" } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Contact</label>
            <input
              ref={inputRef}
              className="form-input"
              type="text"
              placeholder="Marcus Kim"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {KNOWN_CONTACTS.length > 0 && name.length === 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                {KNOWN_CONTACTS.slice(0, 6).map(c => (
                  <button
                    key={c.name}
                    type="button"
                    className="btn xs ghost"
                    onClick={() => pickContact(c)}
                    style={{ borderColor: "var(--line)" }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="form-label">Company</label>
            <input
              className="form-input"
              type="text"
              placeholder="Volthaus Battery"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Summary <span style={{ color: "var(--ink-4)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(one line for the feed)</span></label>
            <input
              className="form-input"
              type="text"
              placeholder={PROMPT[kind]}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Notes / transcript <span style={{ color: "var(--ink-4)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — paste anything you want in the contact's history)</span></label>
            <textarea
              className="form-textarea"
              placeholder="Paste meeting notes or transcript here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", background: "var(--surface-2)", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
            Will appear in the signal feed and on this contact's timeline
          </span>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={submit} disabled={!canSubmit} style={!canSubmit ? { opacity: .5, cursor: "not-allowed" } : {}}>
            Log signal
          </button>
        </div>
      </div>
    </div>
  );
}

function nowLabel() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "p" : "a";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")}${ampm}`;
}
