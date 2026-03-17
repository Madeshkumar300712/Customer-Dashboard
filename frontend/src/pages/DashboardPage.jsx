import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDashboard, setDateFilter } from "../store/dashboardSlice";
import { fetchOrders } from "../store/orderSlice";
import { filterOrdersByDate } from "../utils/dataAggregator";
import WidgetRenderer from "../components/dashboard/WidgetRenderer";
import { Settings2, TrendingUp, ShoppingBag, DollarSign, Users, ChevronDown, ArrowLeft } from "lucide-react";

const CELL = 120, GAP = 10;
const DATE_FILTERS = ["All time","Today","Last 7 Days","Last 30 Days","Last 90 Days"];

export default function DashboardPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { widgets, dateFilter, current } = useSelector(s => s.dashboard);
  const orders = useSelector(s => s.orders.items);

  useEffect(() => { if (id) dispatch(fetchDashboard(id)); dispatch(fetchOrders()); }, [id]);

  const filtered = filterOrdersByDate(orders, dateFilter);
  const totalRev  = filtered.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pending   = filtered.filter(o => o.status === "Pending").length;
  const completed = filtered.filter(o => o.status === "Completed").length;

  const stats = [
    { label: "Total Orders", value: filtered.length,     icon: <ShoppingBag size={16}/>, color: "#3b82f6" },
    { label: "Revenue",      value: `$${totalRev.toLocaleString("en",{maximumFractionDigits:0})}`, icon: <DollarSign size={16}/>, color: "#00d4aa" },
    { label: "Pending",      value: pending,             icon: <TrendingUp size={16}/>,  color: "#f59e0b" },
    { label: "Completed",    value: completed,           icon: <Users size={16}/>,       color: "#10b981" },
  ];

  const maxRow = widgets.reduce((m, w) => Math.max(m, w.y + w.h), 4);

  return (
    <div style={{ padding: "28px 32px" }}>
      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/")}><ArrowLeft size={13}/></button>
          <div>
            <p style={{ fontSize: 15, color: "var(--text-faint)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Dashboard</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>{current?.name || "Dashboard"}</h1>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 16, color: "var(--text-muted)" }}>Show data for</span>
          <div style={{ position: "relative" }}>
            <select value={dateFilter} onChange={e => dispatch(setDateFilter(e.target.value))}
              style={{ width: "auto", paddingRight: 28, appearance: "none", fontSize: 16 }}>
              {DATE_FILTERS.map(f => <option key={f}>{f}</option>)}
            </select>
            <ChevronDown size={11} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }}/>
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/config/${id}`)}>
            <Settings2 size={15}/> Configure
          </button>
        </div>
      </div>

      <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color+"18", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 3, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {widgets.length === 0 ? (
        <div className="fade-up-3 card" style={{ textAlign: "center", padding: "80px 40px", border: "1px dashed var(--border2)" }}>
          <div style={{ fontSize: 58, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>📊</div>
          <h3 style={{ fontSize: 22, marginBottom: 8 }}>No widgets configured</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 17 }}>Click Configure to start building your dashboard.</p>
          <button className="btn btn-primary" onClick={() => navigate(`/config/${id}`)}><Settings2 size={15}/> Configure Dashboard</button>
        </div>
      ) : (
        <div className="fade-up-3" style={{ position: "relative", minHeight: (maxRow + 1) * (CELL + GAP) }}>
          {widgets.map(w => (
            <div key={w.id} className="widget-card" style={{
              left: w.x * (CELL+GAP), top: w.y * (CELL+GAP),
              width: w.w * (CELL+GAP) - GAP, height: w.h * (CELL+GAP) - GAP,
            }}>
              <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-muted)" }}>{w.title}</span>
              </div>
              <div style={{ padding: "8px 14px 10px", height: "calc(100% - 40px)", overflow: "hidden" }}>
                <WidgetRenderer widget={w}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}