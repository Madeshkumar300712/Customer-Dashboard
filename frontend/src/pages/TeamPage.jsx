import { useSelector } from "react-redux";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

const TEAM = [
  { name:"Mr. Jeyanth", role:"Senior Sales Manager",  email:"[EMAIL_ADDRESS]", dept:"Sales" },
  { name:"Mr. Sulthan",    role:"Account Executive",     email:"[EMAIL_ADDRESS]",    dept:"Sales" },
  { name:"Ms. Narmadha",  role:"Customer Success Lead", email:"[EMAIL_ADDRESS]",  dept:"Support" },
  { name:"Mr. Santhosh",   role:"Business Developer",    email:"[EMAIL_ADDRESS]",   dept:"BD" },
];
const COLORS = ["#00d4aa","#3b82f6","#f59e0b","#8b5cf6"];
const DEPT_C  = { Sales:"#3b82f6", Support:"#10b981", BD:"#f59e0b" };

export default function TeamPage() {
  const orders = useSelector(s => s.orders.items);

  const memberStats = TEAM.map((m, i) => {
    const myOrders = orders.filter(o => o.createdBy === m.name);
    const revenue  = myOrders.reduce((s,o) => s+(o.totalAmount||0), 0);
    const done     = myOrders.filter(o => o.status==="Completed").length;
    return { ...m, orders: myOrders.length, revenue, done, color: COLORS[i] };
  });

  const initials = name => name.split(" ").slice(1).map(w=>w[0]).join("").toUpperCase();

  return (
    <div style={{ padding:"28px 32px" }}>
      <div className="fade-up" style={{ marginBottom:24 }}>
        <p style={{ fontSize:12, color:"var(--text-faint)", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>People</p>
        <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.03em" }}>Team</h1>
        <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:4 }}>Order performance per team member</p>
      </div>

      <div className="fade-up-2" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
        {memberStats.map((m, i) => (
          <div key={i} className="card" style={{ padding:24, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 10px 30px ${m.color}15`; e.currentTarget.style.borderColor=m.color+"30"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="var(--border)"; }}>

            {/* Header */}
            <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:20 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:m.color+"22", color:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, flexShrink:0 }}>
                {initials(m.name)}
              </div>
              <div>
                <p style={{ fontWeight:700, fontSize:15 }}>{m.name}</p>
                <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{m.role}</p>
                <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:DEPT_C[m.dept]+"18", color:DEPT_C[m.dept], fontWeight:600, marginTop:5, display:"inline-block" }}>
                  {m.dept}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { label:"Orders",    value:m.orders,  icon:<ShoppingBag size={13}/>, color:m.color },
                { label:"Revenue",   value:`$${m.revenue>=1000?(m.revenue/1000).toFixed(1)+"k":m.revenue.toFixed(0)}`, icon:<DollarSign size={13}/>, color:"#10b981" },
                { label:"Completed", value:m.done,    icon:<TrendingUp  size={13}/>, color:"#3b82f6" },
              ].map((s,j) => (
                <div key={j} style={{ background:"var(--surface2)", borderRadius:9, padding:"10px 8px", textAlign:"center" }}>
                  <div style={{ color:s.color, display:"flex", justifyContent:"center", marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:"var(--text)" }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"var(--text-faint)", marginTop:1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            {m.orders > 0 && (
              <div style={{ marginTop:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:11, color:"var(--text-muted)" }}>Completion rate</span>
                  <span style={{ fontSize:11, fontWeight:700, color:m.color }}>{((m.done/m.orders)*100).toFixed(0)}%</span>
                </div>
                <div style={{ background:"var(--surface2)", borderRadius:4, height:5, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(m.done/m.orders)*100}%`, background:m.color, borderRadius:4, transition:"width 1s ease" }}/>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}