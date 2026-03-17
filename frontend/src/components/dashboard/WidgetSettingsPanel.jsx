import { useState } from "react";
import { X } from "lucide-react";
import ColorPicker from "../ui/ColorPicker.jsx";

const METRICS = ["Customer ID","Customer name","Email id","Address","Order date","Product","Created by","Status","Total amount","Unit price","Quantity"];
const NUMERIC_METRICS = ["Total amount","Unit price","Quantity"];
const AXIS_OPTIONS = ["Product","Quantity","Unit price","Total amount","Status","Created by","Duration"];
const TABLE_COLS = ["Customer ID","Customer name","Email id","Phone number","Address","Order ID","Order date","Product","Quantity","Unit price","Total amount","Status","Created by"];

export default function WidgetSettingsPanel({ widget, onSave, onClose }) {
  const [form, setForm] = useState({
    title: widget.title || "Untitled",
    description: widget.description || "",
    w: widget.w || 4, h: widget.h || 4,
    config: widget.config || {},
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setConf = (k, v) => setForm(f => ({ ...f, config: { ...f.config, [k]: v } }));

  const renderDataSettings = () => {
    const t = widget.type;
    if (t === "KPI Value") return (
      <>
        <Field label="Select Metric">
          <select value={form.config.metric || ""} onChange={e => setConf("metric", e.target.value)}>
            {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Aggregation">
          <select value={form.config.aggregation || "Sum"}
            onChange={e => setConf("aggregation", e.target.value)}
            disabled={!NUMERIC_METRICS.includes(form.config.metric)}>
            {["Sum","Average","Count"].map(a => <option key={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="Data Format">
          <select value={form.config.dataFormat || "Number"} onChange={e => setConf("dataFormat", e.target.value)}>
            {["Number","Currency"].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Decimal Precision">
          <input type="number" min={0} value={form.config.decimalPrecision ?? 0}
            onChange={e => setConf("decimalPrecision", Math.max(0, parseInt(e.target.value) || 0))} />
        </Field>
      </>
    );

    if (t === "Pie Chart") return (
      <>
        <Field label="Chart Data">
          <select value={form.config.chartData || "Product"} onChange={e => setConf("chartData", e.target.value)}>
            {["Product","Quantity","Unit price","Total amount","Status","Created by"].map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Show Legend">
          <input type="checkbox" checked={!!form.config.showLegend}
            onChange={e => setConf("showLegend", e.target.checked)} />
        </Field>
      </>
    );

    if (t === "Table") return (
      <>
        <Field label="Choose Columns">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TABLE_COLS.map(c => (
              <label key={c} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 15, color: "var(--text)" }}>
                <input type="checkbox"
                  checked={(form.config.columns || []).includes(c)}
                  onChange={e => {
                    const cur = form.config.columns || [];
                    setConf("columns", e.target.checked ? [...cur, c] : cur.filter(x => x !== c));
                  }} />
                {c}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Sort By">
          <select value={form.config.sortBy || ""} onChange={e => setConf("sortBy", e.target.value)}>
            <option value="">None</option>
            {["Ascending","Descending","Order date"].map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Pagination">
          <select value={form.config.pagination || 10} onChange={e => setConf("pagination", parseInt(e.target.value))}>
            {[5,10,15].map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Font Size (12–18)">
          <input type="number" min={12} max={18} value={form.config.fontSize || 14}
            onChange={e => setConf("fontSize", Math.min(18, Math.max(12, parseInt(e.target.value) || 14)))} />
        </Field>
        <Field label="Header Background">
          <ColorPicker value={form.config.headerBg || "#54bd95"} onChange={v => setConf("headerBg", v)} />
        </Field>
      </>
    );

    return (
      <>
        <Field label="X-Axis Data">
          <select value={form.config.xAxis || "Product"} onChange={e => setConf("xAxis", e.target.value)}>
            {AXIS_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Y-Axis Data">
          <select value={form.config.yAxis || "Total amount"} onChange={e => setConf("yAxis", e.target.value)}>
            {AXIS_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Chart Color">
          <ColorPicker value={form.config.chartColor || "#54bd95"} onChange={v => setConf("chartColor", v)} />
        </Field>
        <Field label="Show Data Label">
          <input type="checkbox" checked={!!form.config.showDataLabel}
            onChange={e => setConf("showDataLabel", e.target.checked)} />
        </Field>
      </>
    );
  };

  return (
    <div style={{
      width: 300, background: "var(--surface)", borderLeft: "1px solid var(--border)",
      height: "100%", overflowY: "auto", padding: 20, flexShrink: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h4 style={{ fontFamily: "Syne" }}>Widget Settings</h4>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={18} /></button>
      </div>

      <Field label="Widget Title"><input value={form.title} onChange={e => set("title", e.target.value)} /></Field>
      <Field label="Widget Type"><input readOnly value={widget.type} style={{ opacity: 0.6 }} /></Field>
      <Field label="Description"><textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)} /></Field>

      <p style={{ fontFamily: "Syne", fontSize: 15, color: "var(--accent)", margin: "16px 0 8px" }}>Widget Size</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Width (Cols)">
          <input type="number" min={1} value={form.w} onChange={e => set("w", Math.max(1, parseInt(e.target.value) || 1))} />
        </Field>
        <Field label="Height (Rows)">
          <input type="number" min={1} value={form.h} onChange={e => set("h", Math.max(1, parseInt(e.target.value) || 1))} />
        </Field>
      </div>

      <p style={{ fontFamily: "Syne", fontSize: 15, color: "var(--accent)", margin: "16px 0 8px" }}>Data Settings</p>
      {renderDataSettings()}

      <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }}
        onClick={() => onSave({ ...widget, title: form.title, description: form.description, w: form.w, h: form.h, config: form.config })}>
        Apply
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>{label}</label>
      {children}
    </div>
  );
}