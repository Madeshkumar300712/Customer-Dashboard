import { useState, useRef } from "react";
import { Settings2, Trash2, GripHorizontal } from "lucide-react";
import WidgetRenderer from "./WidgetRenderer";
import WidgetSettingsPanel from "./WidgetSettingsPanel";
import ConfirmDialog from "../ui/ConfirmDialog";

const DEFAULTS = {
  "KPI Value": { w: 2, h: 2 }, "Bar Chart": { w: 5, h: 5 },
  "Line Chart": { w: 5, h: 5 }, "Area Chart": { w: 5, h: 5 },
  "Scatter Plot": { w: 5, h: 5 }, "Pie Chart": { w: 4, h: 4 }, "Table": { w: 6, h: 4 },
};
const COLS = 12, CELL = 120, GAP = 10;

export default function DashboardCanvas({ widgets, setWidgets }) {
  const [settingsWidget, setSettingsWidget] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [hovered, setHovered] = useState(null);
  const canvasRef = useRef();

  const getDropPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const col = Math.max(0, Math.min(Math.floor((e.clientX - rect.left - GAP) / (CELL + GAP)), COLS - 1));
    const row = Math.max(0, Math.floor((e.clientY - rect.top - GAP) / (CELL + GAP)));
    return { col, row };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("widgetType");
    if (!type) return;
    const { col, row } = getDropPos(e);
    const def = DEFAULTS[type] || { w: 4, h: 4 };
    const id = `w_${Date.now()}`;
    setWidgets(prev => [...prev, { id, type, title: type, w: def.w, h: def.h, x: col, y: row, config: {} }]);
    setDragOver(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const { col, row } = getDropPos(e);
    setDragOver({ col, row });
  };

  const updateWidget = (updated) => {
    setWidgets(prev => prev.map(w => w.id === updated.id ? updated : w));
    setSettingsWidget(updated); // keep panel open with updated data
  };

  const closeSettings = () => setSettingsWidget(null);

  const maxRow = widgets.reduce((m, w) => Math.max(m, w.y + w.h), 8);
  const canvasH = Math.max((maxRow + 2) * (CELL + GAP), 600);

  const px = (col) => col * (CELL + GAP) + GAP;
  const py = (row) => row * (CELL + GAP) + GAP;
  const pw = (cols) => cols * (CELL + GAP) - GAP;
  const ph = (rows) => rows * (CELL + GAP) - GAP;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div ref={canvasRef} className="canvas-grid"
        style={{
          flex: 1, position: "relative", minHeight: canvasH,
          backgroundSize: `${CELL + GAP}px ${CELL + GAP}px`,
          overflowY: "auto", overflowX: "hidden",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setDragOver(null)}>

        {/* Drop placeholder */}
        {dragOver && (
          <div style={{
            position: "absolute",
            left: px(dragOver.col), top: py(dragOver.row),
            width: pw(4), height: ph(3),
            border: "2px dashed var(--accent)",
            borderRadius: "var(--radius)",
            background: "rgba(0,212,170,0.06)",
            pointerEvents: "none", zIndex: 0,
            transition: "all 0.1s",
          }}>
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "var(--accent)", fontSize: 15, fontWeight: 600, gap: 6,
            }}>
              <GripHorizontal size={14} /> Drop here
            </div>
          </div>
        )}

        {/* Empty state */}
        {widgets.length === 0 && !dragOver && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "var(--text-faint)", gap: 12,
          }}>
            <div style={{ fontSize: 50, animation: "float 3s ease-in-out infinite" }}>📊</div>
            <p style={{ fontSize: 17, fontWeight: 500, color: "var(--text-muted)" }}>Canvas is empty</p>
            <p style={{ fontSize: 15 }}>Drag widgets from the left panel to get started</p>
          </div>
        )}

        {/* Widgets */}
        {widgets.map(w => (
          <div key={w.id} className="widget-card"
            style={{ left: px(w.x), top: py(w.y), width: pw(w.w), height: ph(w.h) }}
            onMouseEnter={() => setHovered(w.id)}
            onMouseLeave={() => setHovered(null)}>

            {/* Widget header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px 6px", borderBottom: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.01em", truncate: true, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                {w.title || w.type}
              </span>
              <div style={{
                display: "flex", gap: 4,
                opacity: hovered === w.id ? 1 : 0,
                transition: "opacity 0.2s",
              }}>
                <button className="btn-icon" style={{ width: 26, height: 26, borderRadius: 6, padding: 0 }}
                  onClick={() => setSettingsWidget(w)}>
                  <Settings2 size={12} />
                </button>
                <button className="btn-icon" style={{ width: 26, height: 26, borderRadius: 6, padding: 0, color: "var(--danger)" }}
                  onClick={() => setConfirmId(w.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Widget body */}
            <div style={{ padding: "8px 12px 10px", height: "calc(100% - 42px)", overflow: "hidden" }}>
              <WidgetRenderer widget={w} />
            </div>
          </div>
        ))}
      </div>

      {/* Settings panel */}
      {settingsWidget && (
        <WidgetSettingsPanel
          widget={settingsWidget}
          onSave={updateWidget}
          onClose={closeSettings}
        />
      )}

      {confirmId && (
        <ConfirmDialog message="Remove this widget from the dashboard?"
          onConfirm={() => { setWidgets(prev => prev.filter(w => w.id !== confirmId)); setConfirmId(null); }}
          onCancel={() => setConfirmId(null)} />
      )}
    </div>
  );
}