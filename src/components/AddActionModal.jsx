import { useState, useEffect, useRef } from 'react';
import { DRAFTS } from '../data/index.js';

const ACTION_TYPE_OPTIONS = [
  { value: "email-out", label: "Email · outbound" },
  { value: "call",      label: "Schedule call"    },
  { value: "loop-bu",   label: "Loop in BU"       },
  { value: "intro-fae", label: "Intro FAE"        },
];

// Existing contacts pulled from DRAFTS so the rep can pick from people they've seen
// in the queue. Free-form contact name is also allowed.
const KNOWN_CONTACTS = (() => {
  const seen = new Map();
  for (const d of DRAFTS) {
    if (d.rec.email === "—") continue;
    seen.set(d.rec.name, { name: d.rec.name, company: d.rec.company, role: d.rec.role, email: d.rec.email, initials: d.rec.initials });
  }
  return Array.from(seen.values());
})();

const initialsOf = (name) => name.split(/\s+/).filter(Boolean).map(p => p[0]).slice(0, 2).join("").toUpperCase() || "??";

export default function AddActionModal({ open, prefill, onClose, onSubmit }) {
  const [name, setName]       = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail]     = useState("");
  const [type, setType]       = useState("email-out");
  const [intent, setIntent]   = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setName(prefill?.name || "");
    setCompany(prefill?.company || "");
    setEmail(prefill?.email || "");
    setType(prefill?.type || "email-out");
    setIntent(prefill?.intent || "");
    setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const pickContact = (c) => {
    setName(c.name);
    setCompany(c.company);
    setEmail(c.email);
  };

  const canSubmit = name.trim() && company.trim() && intent.trim();

  const submit = () => {
    if (!canSubmit) return;
    // Simulate AI drafting from the rep's intent.
    const id = "u" + Date.now().toString(36);
    const subject = type === "email-out"
      ? `${intent.charAt(0).toUpperCase() + intent.slice(1)}`
      : intent;
    const body =
      type === "email-out"
        ? `Hi ${name.split(" ")[0]},\n\n${intent}\n\n— Erica`
        : null;
    const action = {
      id,
      rec: {
        initials: initialsOf(name),
        name,
        email: email || "—",
        company,
        role: "Contact",
      },
      ch: type === "email-out" ? "email" : "call",
      why: `Manually added by you · "${intent}"`,
      subject,
      preview: body ? body.split("\n").join(" ").slice(0, 120) : intent,
      attach: [],
      conf: "ok",
      model: "Manual",
      actionType: type,
      createdByUser: true,
      body,
    };
    onSubmit(action);
  };

  if (!open) return null;

  return (
    <div className="hf-modal-backdrop" onClick={onClose}>
      <div className="hf hf-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "var(--r)", background: "var(--surface-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-2)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M7 1v12M1 7h12"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Add to action queue</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
              Pick a contact and a one-line intent — AI will draft the rest.
            </div>
          </div>
          <button className="btn ghost icon sm" onClick={onClose} title="Close (Esc)">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M11 3L3 11M3 3l8 8"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
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
            {!prefill && KNOWN_CONTACTS.length > 0 && name.length === 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                {KNOWN_CONTACTS.slice(0, 6).map(c => (
                  <button
                    key={c.name}
                    type="button"
                    className="btn xs ghost"
                    onClick={() => pickContact(c)}
                    style={{ borderColor: "var(--line)" }}
                  >
                    <span className="av sm" style={{ width: 16, height: 16, fontSize: 8.5 }}>{c.initials}</span>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              <label className="form-label">Email <span style={{ color: "var(--ink-4)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
              <input
                className="form-input"
                type="email"
                placeholder="marcus@volthaus.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Action type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {ACTION_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Intent <span style={{ color: "var(--ink-4)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(one line — what should happen?)</span></label>
            <textarea
              className="form-textarea"
              placeholder="Follow up on the TPS6521905 quote and offer a 20-min walkthrough."
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", background: "var(--surface-2)", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: -1, marginRight: 4 }}>
              <path d="M6 1l1.5 3.5L11 5l-2.5 2 .8 4L6 9l-3.3 2L3.5 7 1 5l3.5-.5L6 1z"/>
            </svg>
            New row will appear at the top of the queue
          </span>
          <div style={{ flex: 1 }} />
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={submit} disabled={!canSubmit} style={!canSubmit ? { opacity: .5, cursor: "not-allowed" } : {}}>
            Generate draft & review
          </button>
        </div>
      </div>
    </div>
  );
}

