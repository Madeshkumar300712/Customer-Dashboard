import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, LayoutDashboard, ShoppingCart, Plus, Settings2, ArrowRight } from "lucide-react";

const STATIC_COMMANDS = [
  { label: "Go to Dashboard", icon: <LayoutDashboard size={14}/>, path: "/" },
  { label: "Customer Orders", icon: <ShoppingCart size={14}/>, path: "/orders" },
  { label: "Configure Dashboard", icon: <Settings2 size={14}/>, path: "/config" },
];

export default function CommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef();
  const navigate = useNavigate();
  const dashboards = useSelector(s => s.dashboard.list);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50); }, []);

  const dynamicCommands = dashboards.map(d => ({
    label: `Open: ${d.name}`, icon: <LayoutDashboard size={14}/>, path: `/dashboard/${d._id}`,
  }));

  const all = [...STATIC_COMMANDS, ...dynamicCommands];
  const results = query ? all.filter(c => c.label.toLowerCase().includes(query.toLowerCase())) : all;

  const execute = (cmd) => { navigate(cmd.path); onClose(); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "14vh" }}
      onClick={onClose}>
      <div style={{ width: "100%", maxWidth: 520, background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }}/>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search commands, dashboards…"
            style={{ border: "none", background: "transparent", fontSize: 18, outline: "none", color: "var(--text)", flex: 1 }}
            onKeyDown={e => { if (e.key === "Escape") onClose(); if (e.key === "Enter" && results[0]) execute(results[0]); }}/>
          <kbd style={{ fontSize: 14, padding: "2px 6px", background: "var(--surface3)", borderRadius: 4, color: "var(--text-faint)" }}>ESC</kbd>
        </div>
        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {results.length === 0 ? (
            <div style={{ padding: "28px", textAlign: "center", color: "var(--text-muted)", fontSize: 16 }}>No commands found</div>
          ) : results.map((cmd, i) => (
            <button key={i} onClick={() => execute(cmd)}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px",
                background: "none", border: "none", color: "var(--text)", cursor: "pointer",
                borderBottom: "1px solid var(--border)", fontSize: 17, fontFamily: "Outfit",
                transition: "background 0.1s", textAlign: "left",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,212,170,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; }}>
              <span style={{ color: "var(--accent)" }}>{cmd.icon}</span>
              {cmd.label}
              <ArrowRight size={13} style={{ marginLeft: "auto", color: "var(--text-faint)" }}/>
            </button>
          ))}
        </div>
        <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 14 }}>
          {[["↵","Select"], ["↑↓","Navigate"], ["ESC","Close"]].map(([key, label]) => (
            <span key={key} style={{ fontSize: 14, color: "var(--text-faint)", display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ background: "var(--surface3)", padding: "2px 6px", borderRadius: 4 }}>{key}</kbd> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}