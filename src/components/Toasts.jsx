import { useEffect } from 'react';

// Single toast — auto-dismisses on its own timer
function Toast({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3200);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, onDismiss]);

  const kind = toast.kind || "default";
  const icon = kind === "success" ? (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7.5l3.2 3L12 3.5"/>
    </svg>
  ) : kind === "info" ? (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="7" cy="7" r="5.5"/><path d="M7 6.2v4M7 4.2v.1"/>
    </svg>
  ) : kind === "reject" ? (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M3 3l8 8M11 3L3 11"/>
    </svg>
  ) : null;

  return (
    <div className={"hf-toast hf-toast-" + kind} role="status" aria-live="polite">
      {icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        title="Dismiss"
        style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.55)", cursor: "pointer", padding: "0 2px", lineHeight: 1, fontSize: 14 }}
      >
        ×
      </button>
    </div>
  );
}

export default function Toasts({ toasts, onDismiss }) {
  return (
    <div className="hf-toast-stack">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
