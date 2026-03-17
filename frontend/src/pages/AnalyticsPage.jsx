import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../store/orderSlice";
import { filterOrdersByDate } from "../utils/dataAggregator";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react";

const COLORS = ["#00d4aa","#3b82f6","#f59e0b","#ef4444","#8b5cf6"];

export default function AnalyticsPage() {
  const dispatch   = useDispatch();
  const orders     = useSelector(s => s.orders.items);
  useEffect(() => { dispatch(fetchOrders()); }, []);

  // Revenue by product
  const byProduct = {};
  orders.forEach(o => { byProduct[o.product] = (byProduct[o.product]||0) + (o.totalAmount||0); });
  const productData = Object.entries(byProduct).map(([name, value]) => ({ name: name.split(" ").slice(0,2).join(" "), value: Math.round(value) }));

  // Orders by status
  const byStatus = { Pending:0, "In progress":0, Completed:0 };
  orders.forEach(o => byStatus[o.status]++);
  const statusData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));

  // Orders by creator
  const byCreator = {};
  orders.forEach(o => { byCreator[o.createdBy] = (byCreator[o.createdBy]||0) + 1; });
  const creatorData = Object.entries(byCreator).map(([name, value]) => ({ name: name.split(" ").slice(1).join(" "), value }));

  // Revenue over time (last 10 orders grouped)
  const sorted   = [...orders].sort((a,b) => new Date(a.createdAt)-new Date(b.createdAt));
  const timeData = sorted.slice(-10).map((o, i) => ({
    name: `#${i+1}`,
    revenue: o.totalAmount || 0,
    qty: o.quantity || 0,
  }));

  const totalRev  = orders.reduce((s,o) => s+(o.totalAmount||0), 0);
  const avgOrder  = orders.length ? totalRev / orders.length : 0;
  const completed = orders.filter(o => o.status==="Completed").length;
  const convRate  = orders.length ? ((completed/orders.length)*100).toFixed(1) : 0;

  const stats = [
    { label:"Total Revenue",  value:`$${totalRev.toLocaleString("en",{maximumFractionDigits:0})}`, icon:<DollarSign size={18}/>, color:"#00d4aa" },
    { label:"Total Orders",   value: orders.length,      icon:<ShoppingBag size={18}/>, color:"#3b82f6" },
    { label:"Avg Order Value",value:`$${avgOrder.toFixed(2)}`,                           icon:<TrendingUp  size={18}/>, color:"#f59e0b" },
    { label:"Completion Rate",value:`${convRate}%`,       icon:<Users       size={18}/>, color:"#10b981" },
  ];

  const CHART_STYLE = { background:"#161921", border:"1px solid #2a3040", borderRadius:8, fontSize:12 };

  return (
    <div style={{ padding:"28px 32px" }}>
      <div className="fade-up" style={{ marginBottom:24 }}>
        <p style={{ fontSize:12, color:"var(--text-faint)", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Overview</p>
        <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.03em" }}>Analytics</h1>
      </div>

      {/* Stats */}
      <div className="fade-up-2" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
        {stats.map((s,i) => (
          <div key={i} className="card" style={{ display:"flex", alignItems:"center", gap:14, padding:"18px 20px" }}>
            <div style={{ width:42, height:42, borderRadius:11, background:s.color+"18", display:"flex", alignItems:"center", justifyContent:"center", color:s.color, flexShrink:0 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:3, fontWeight:500 }}>{s.label}</p>
              <p style={{ fontSize:22, fontWeight:800, letterSpacing:"-0.02em", lineHeight:1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="fade-up-3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        {/* Revenue by product */}
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Revenue by Product</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={productData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill:"var(--text-muted)", fontSize:11 }} />
              <YAxis tick={{ fill:"var(--text-muted)", fontSize:11 }} />
              <Tooltip contentStyle={CHART_STYLE} formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="value" fill="#00d4aa" radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Order Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {statusData.map((_,i) => <Cell key={i} fill={["#f59e0b","#3b82f6","#10b981"][i]} />)}
              </Pie>
              <Tooltip contentStyle={CHART_STYLE} />
              <Legend wrapperStyle={{ fontSize:12, color:"var(--text-muted)" }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:18 }}>
        {/* Revenue trend */}
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Revenue Trend (Last 10 Orders)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill:"var(--text-muted)", fontSize:11 }} />
              <YAxis tick={{ fill:"var(--text-muted)", fontSize:11 }} />
              <Tooltip contentStyle={CHART_STYLE} />
              <Line type="monotone" dataKey="revenue" stroke="#00d4aa" strokeWidth={2.5} dot={{ fill:"#00d4aa" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By creator */}
        <div className="card">
          <h3 style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Orders by Creator</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {creatorData.sort((a,b) => b.value-a.value).map((c,i) => {
              const max = Math.max(...creatorData.map(x=>x.value),1);
              return (
                <div key={i}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, color:"var(--text-muted)" }}>{c.name}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:COLORS[i%COLORS.length] }}>{c.value}</span>
                  </div>
                  <div style={{ background:"var(--surface2)", borderRadius:4, height:6, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${(c.value/max)*100}%`, background:COLORS[i%COLORS.length], borderRadius:4, transition:"width 0.8s ease" }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}