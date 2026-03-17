import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDashboard, saveDashboardThunk } from "../store/dashboardSlice";
import { fetchOrders } from "../store/orderSlice";
import WidgetPanel from "../components/dashboard/WidgetPanel";
import DashboardCanvas from "../components/dashboard/DashboardCanvas";
import { useToast } from "../components/ui/Toast";
import { Save, ArrowLeft, ChevronDown } from "lucide-react";

const DATE_FILTERS = ["All time","Today","Last 7 Days","Last 30 Days","Last 90 Days"];

export default function DashboardConfigPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { widgets, dateFilter, current } = useSelector(s => s.dashboard);
  const [localWidgets, setLocalWidgets] = useState([]);
  const [localFilter, setLocalFilter] = useState("All time");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (id) dispatch(fetchDashboard(id)); dispatch(fetchOrders()); }, [id]);
  useEffect(() => { setLocalWidgets(widgets); }, [widgets]);
  useEffect(() => { setLocalFilter(dateFilter); }, [dateFilter]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(saveDashboardThunk({ id, data: { widgets: localWidgets, dateFilter: localFilter } }));
      toast("Dashboard saved!", "success");
      setTimeout(() => navigate(`/dashboard/${id}`), 500);
    } catch { toast("Save failed", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 20px", height: 54, background: "var(--surface)",
        borderBottom: "1px solid var(--border)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}><ArrowLeft size={13}/> Back</button>
          <div style={{ width: 1, height: 18, background: "var(--border)" }}/>
          <p style={{ fontSize: 18, fontWeight: 700 }}>Configure: <span style={{ color: "var(--accent)" }}>{current?.name}</span></p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <select value={localFilter} onChange={e => setLocalFilter(e.target.value)}
              style={{ fontSize: 16, width: "auto", paddingRight: 28, appearance: "none" }}>
              {DATE_FILTERS.map(f => <option key={f}>{f}</option>)}
            </select>
            <ChevronDown size={11} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}/>
          </div>
          <span style={{ fontSize: 15, color: "var(--text-faint)" }}>{localWidgets.length} widgets</span>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            <Save size={13}/> {saving ? "Saving…" : "Save Configuration"}
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <WidgetPanel />
        <DashboardCanvas widgets={localWidgets} setWidgets={setLocalWidgets} />
      </div>
    </div>
  );
}