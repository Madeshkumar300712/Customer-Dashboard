import { useSelector } from "react-redux";
import { downloadCSV, generateInvoicePDF } from "../utils/exportUtils";
import { useToast } from "../components/ui/Toast";
import { Download, FileText, BarChart2, Table2, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const orders = useSelector(s => s.orders.items);
  const toast  = useToast();

  const reports = [
    { title:"Full Orders Export",      desc:"All orders with every field as CSV",                icon:<Table2     size={20}/>, color:"#00d4aa", action:() => { downloadCSV(orders); toast("CSV downloaded!"); } },
    { title:"Revenue Summary",         desc:"Revenue totals grouped by product",                 icon:<BarChart2  size={20}/>, color:"#3b82f6", action:() => toast("Coming soon — build analytics first") },
    { title:"Status Report",           desc:"Order counts by status with percentages",           icon:<TrendingUp size={20}/>, color:"#f59e0b", action:() => toast("Coming soon") },
    { title:"Invoice (Latest Order)",  desc:"PDF invoice for the most recent order",             icon:<FileText   size={20}/>, color:"#ef4444", action:() => { if(orders[0]) generateInvoicePDF(orders[0]); else toast("No orders yet","error"); } },
  ];

  // Summary stats
  const totalRev = orders.reduce((s,o) => s+(o.totalAmount||0), 0);
  const byStatus = { Pending:0, "In progress":0, Completed:0 };
  orders.forEach(o => byStatus[o.status]++);
  const byProduct = {};
  orders.forEach(o => { byProduct[o.product] = (byProduct[o.product]||0) + (o.totalAmount||0); });
  const topProduct = Object.entries(byProduct).sort((a,b)=>b[1]-a[1])[0];

  return (
    <div style={{ padding:"28px 32px" }}>
      <div className="fade-up" style={{ marginBottom:24 }}>
        <p style={{ fontSize:12, color:"var(--text-faint)", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Export & Reports</p>
        <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.03em" }}>Reports</h1>
      </div>

      {/* Summary card */}
      <div className="fade-up-2 card" style={{ marginBottom:24, padding:"20px 24px", background:"linear-gradient(135deg, var(--surface), rgba(0,212,170,0.03))", border:"1px solid rgba(0,212,170,0.15)" }}>
        <p style={{ fontSize:12, fontWeight:700, color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:14 }}>Period Summary</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
          {[
            { label:"Total Orders",   value: orders.length },
            { label:"Total Revenue",  value:`$${totalRev.toLocaleString("en",{maximumFractionDigits:0})}` },
            { label:"Pending",        value: byStatus.Pending },
            { label:"Top Product",    value: topProduct ? topProduct[0].split(" ").slice(0,2).join(" ") : "—" },
          ].map((s,i) => (
            <div key={i}>
              <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:4 }}>{s.label}</p>
              <p style={{ fontSize:20, fontWeight:800, letterSpacing:"-0.02em" }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Report cards */}
      <div className="fade-up-3" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
        {reports.map((r,i) => (
          <div key={i} className="card" style={{ display:"flex", gap:16, alignItems:"flex-start", padding:"20px 22px", cursor:"pointer", transition:"all 0.2s" }}
            onClick={r.action}
            onMouseEnter={e => { e.currentTarget.style.borderColor=r.color+"40"; e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 24px ${r.color}15`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
            <div style={{ width:44, height:44, borderRadius:12, background:r.color+"18", display:"flex", alignItems:"center", justifyContent:"center", color:r.color, flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{r.title}</p>
              <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:14 }}>{r.desc}</p>
              <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); r.action(); }}
                style={{ pointerEvents:"none" }}>
                <Download size={13}/> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}