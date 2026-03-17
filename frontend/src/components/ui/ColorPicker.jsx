import { useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div onClick={() => setOpen(!open)} style={{
          width: 32, height: 32, borderRadius: 6, background: value,
          border: "2px solid var(--border)", cursor: "pointer",
        }} />
        <input value={value} onChange={e => onChange(e.target.value)} style={{ width: 110 }} />
      </div>
      {open && (
        <div style={{ position: "absolute", zIndex: 999, top: 40 }}>
          <HexColorPicker color={value} onChange={onChange} />
          <button className="btn btn-secondary" style={{ marginTop: 8, width: "100%" }} onClick={() => setOpen(false)}>Done</button>
        </div>
      )}
    </div>
  );
}