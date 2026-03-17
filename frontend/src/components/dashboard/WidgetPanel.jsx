import { useState } from "react";
import { ChevronDown, ChevronRight, Search, BarChart2, TrendingUp, PieChart, Activity, ScatterChart, Table2, Hash } from "lucide-react";

const ICONS = {
  "Bar Chart": <BarChart2 size={13} />, "Line Chart": <TrendingUp size={13} />,
  "Pie Chart": <PieChart size={13} />, "Area Chart": <Activity size={13} />,
  "Scatter Plot": <ScatterChart size={13} />, "Table": <Table2 size={13} />,
  "KPI Value": <Hash size={13} />,
};

const WIDGET_GROUPS = [
  { label: "Charts", items: ["Bar Chart","Line Chart","Pie Chart","Area Chart","Scatter Plot"] },
  { label: "Tables", items: ["Table"] },
  { label: "KPIs", items: ["KPI Value"] },
];

export default function WidgetPanel() {
  const [open, setOpen] = useState({ Charts: true, Tables: true, KPIs: true });
  const [search, setSearch] = useState("");

  const filtered = WIDGET_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(i => i.toLowerCase().includes(search.toLowerCase())),
  })).filter(g => g.items.length > 0);

  return (
    <div style={{
      width: 210, background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      flexShrink: 0, overflowY: "auto",
    }}>
      <div style={{ padding: "14px 12px 8px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: 10 }}>WIDGETS</p>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..." style={{ paddingLeft: 28, fontSize: 15, padding: "7px 7px 7px 28px" }} />
        </div>
      </div>

      <div style={{ padding: "4px 8px 16px", flex: 1 }}>
        {filtered.map(g => (
          <div key={g.label} style={{ marginBottom: 4 }}>
            <button onClick={() => setOpen(o => ({ ...o, [g.label]: !o[g.label] }))}
              style={{
                display: "flex", alignItems: "center", gap: 6, width: "100%",
                background: "none", border: "none", color: "var(--text-muted)",
                cursor: "pointer", padding: "7px 6px", fontSize: 15, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
              {open[g.label] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              {g.label}
            </button>
            {open[g.label] && g.items.map(item => (
              <div key={item} className="widget-item" draggable
                onDragStart={e => e.dataTransfer.setData("widgetType", item)}>
                <span style={{ color: "var(--accent)", opacity: 0.8 }}>{ICONS[item]}</span>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 14, color: "var(--text-faint)", lineHeight: 1.5 }}>
          Drag widgets onto the canvas to add them
        </p>
      </div>
    </div>
  );
}