import { X } from "lucide-react";

export default function Modal({ title, onClose, children, width = 560 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, width, maxWidth: "95vw", maxHeight: "90vh",
        overflow: "auto", padding: 28,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "Syne", fontSize: 20 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}