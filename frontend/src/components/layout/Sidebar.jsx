import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, ShoppingCart, Zap, ChevronLeft, ChevronRight,
  Sun, Moon, Plus, TrendingUp, DollarSign, Package, Pin,
  BarChart2, Settings, Users, FileBarChart, Activity,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { toggleSidebar, toggleTheme } from "../../store/themeSlice";

export default function Sidebar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { sidebarCollapsed, mode } = useSelector(s => s.theme);
  const orders     = useSelector(s => s.orders.items);
  const dashboards = useSelector(s => s.dashboard.list);
  const [showActivity, setShowActivity]   = useState(true);
  const [showPinned,   setShowPinned]     = useState(true);
  const [showQuick,    setShowQuick]      = useState(true);

  const W = sidebarCollapsed ? 68 : 260;

  // Quick stats from orders
  const totalRev   = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pending    = orders.filter(o => o.status === "Pending").length;
  const today      = orders.filter(o => {
    const d = new Date(o.createdAt);
    const n = new Date();
    return d.getDate() === n.getDate() && d.getMonth() === n.getMonth();
  }).length;

  // Recent activity from orders (last 5)
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  // Pinned = first 3 dashboards
  const pinned = dashboards.slice(0, 3);

  const COLORS = ["#00d4aa","#3b82f6","#f59e0b","#ef4444","#8b5cf6"];
  const avatarColor = name => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];
  const initials    = o => `${o.firstName?.[0]||""}${o.lastName?.[0]||""}`.toUpperCase();

  const statusDot = { Pending:"#f59e0b", "In progress":"#3b82f6", Completed:"#10b981" };

  return (
    <aside style={{
      width: W,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      position: "fixed",
      left: 0, top: 0, zIndex: 100,
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      overflow: "hidden",
    }}>

      {/* ── Logo ── */}
      <div style={{
        padding: sidebarCollapsed ? "20px 0" : "22px 18px 18px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        justifyContent: sidebarCollapsed ? "center" : "flex-start",
        gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg, var(--accent), #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,212,170,0.3)",
        }}>
          <Zap size={17} color="#fff" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <span style={{ fontFamily:"Outfit", fontSize:21, fontWeight:800, letterSpacing:"-0.03em", color:"var(--text)", whiteSpace:"nowrap" }}>
            Madd<span style={{ color:"var(--accent)" }}>y</span>
          </span>
        )}
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding: sidebarCollapsed ? "10px 8px" : "10px 10px" }}>

        {/* ── Main nav ── */}
        {!sidebarCollapsed && (
          <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-faint)", padding:"6px 8px 8px" }}>
            Main
          </p>
        )}
        <SideLink to="/"          icon={<LayoutDashboard size={17}/>} label="Dashboard"       collapsed={sidebarCollapsed} />
        <SideLink to="/orders"    icon={<ShoppingCart    size={17}/>} label="Customer Orders" collapsed={sidebarCollapsed} badge={pending > 0 ? pending : null} badgeColor="#f59e0b" />
        <SideLink to="/analytics" icon={<BarChart2       size={17}/>} label="Analytics"       collapsed={sidebarCollapsed} />
        <SideLink to="/reports"   icon={<FileBarChart    size={17}/>} label="Reports"         collapsed={sidebarCollapsed} />
        <SideLink to="/team"      icon={<Users           size={17}/>} label="Team"            collapsed={sidebarCollapsed} />
        <SideLink to="/settings"  icon={<Settings        size={17}/>} label="Settings"        collapsed={sidebarCollapsed} />

        {/* ── Quick Stats ── */}
        {!sidebarCollapsed && (
          <>
            <SectionHeader label="Quick Stats" open={showQuick} onToggle={() => setShowQuick(v => !v)} />
            {showQuick && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, margin:"6px 0 10px" }}>
                {[
                  { label:"Orders",  value: orders.length, color:"#3b82f6", icon:<Package size={12}/> },
                  { label:"Revenue", value:`$${totalRev >= 1000 ? (totalRev/1000).toFixed(1)+"k" : totalRev.toFixed(0)}`, color:"#00d4aa", icon:<DollarSign size={12}/> },
                  { label:"Today",   value: today,         color:"#f59e0b", icon:<TrendingUp size={12}/> },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background:"var(--surface2)", borderRadius:10,
                    padding:"8px 6px", textAlign:"center",
                    border:"1px solid var(--border)", transition:"all 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = stat.color+"60"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                    <div style={{ color:stat.color, display:"flex", justifyContent:"center", marginBottom:3 }}>{stat.icon}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:"var(--text)", lineHeight:1 }}>{stat.value}</div>
                    <div style={{ fontSize:10, color:"var(--text-faint)", marginTop:2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Quick Actions ── */}
        {!sidebarCollapsed && (
          <>
            <SectionHeader label="Quick Actions" open={true} />
            <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
              <QuickAction
                label="New Order"
                icon={<Plus size={13}/>}
                color="#00d4aa"
                onClick={() => navigate("/orders?new=1")}
              />
              <QuickAction
                label="New Dashboard"
                icon={<LayoutDashboard size={13}/>}
                color="#3b82f6"
                onClick={() => navigate("/?new=1")}
              />
            </div>
          </>
        )}

        {/* ── Pinned Dashboards ── */}
        {!sidebarCollapsed && pinned.length > 0 && (
          <>
            <SectionHeader label="Pinned" open={showPinned} onToggle={() => setShowPinned(v => !v)} />
            {showPinned && (
              <div style={{ display:"flex", flexDirection:"column", gap:3, marginBottom:10 }}>
                {pinned.map(d => (
                  <button key={d._id} onClick={() => navigate(`/dashboard/${d._id}`)}
                    style={{
                      display:"flex", alignItems:"center", gap:8, width:"100%",
                      padding:"8px 10px", borderRadius:8, background:"none",
                      border:"1px solid transparent", cursor:"pointer",
                      fontFamily:"Outfit", fontSize:13, color:"var(--text-muted)",
                      textAlign:"left", transition:"all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background="var(--surface2)"; e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.color="var(--text-muted)"; }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)", flexShrink:0 }}/>
                    <span style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.name}</span>
                    <span style={{ fontSize:10, color:"var(--text-faint)" }}>{d.widgets?.length || 0}w</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Recent Activity ── */}
        {!sidebarCollapsed && recent.length > 0 && (
          <>
            <SectionHeader label="Recent Orders" open={showActivity} onToggle={() => setShowActivity(v => !v)} />
            {showActivity && (
              <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:10 }}>
                {recent.map(o => (
                  <div key={o._id} style={{
                    display:"flex", alignItems:"center", gap:8,
                    padding:"7px 8px", borderRadius:8,
                    transition:"background 0.15s", cursor:"pointer",
                  }}
                    onClick={() => navigate("/orders")}
                    onMouseEnter={e => e.currentTarget.style.background="var(--surface2)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <div style={{
                      width:26, height:26, borderRadius:"50%", flexShrink:0,
                      background:avatarColor(o.firstName)+"22",
                      color:avatarColor(o.firstName),
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:9, fontWeight:700,
                    }}>
                      {initials(o)}
                    </div>
                    <div style={{ flex:1, overflow:"hidden" }}>
                      <p style={{ fontSize:12, fontWeight:500, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:1 }}>
                        {o.firstName} {o.lastName}
                      </p>
                      <p style={{ fontSize:10, color:"var(--text-faint)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {o.product?.split(" ").slice(0,3).join(" ")}
                      </p>
                    </div>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:statusDot[o.status]||"#64748b", flexShrink:0 }}/>
                  </div>
                ))}
                <button onClick={() => navigate("/orders")} style={{
                  width:"100%", padding:"6px", background:"none",
                  border:"1px dashed var(--border)", borderRadius:8,
                  color:"var(--text-faint)", fontSize:11, cursor:"pointer",
                  fontFamily:"Outfit", transition:"all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-faint)"; }}>
                  View all orders →
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* ── Footer ── */}
      <div style={{ padding: sidebarCollapsed ? "8px" : "10px 10px 16px", borderTop:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:6 }}>

        {/* Theme toggle */}
        <button onClick={() => dispatch(toggleTheme())}
          title={mode==="dark" ? "Switch to Light" : "Switch to Dark"}
          style={{
            display:"flex", alignItems:"center",
            gap: sidebarCollapsed ? 0 : 9,
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
            width:"100%", padding: sidebarCollapsed ? "10px" : "9px 12px",
            background:"var(--surface2)", border:"1px solid var(--border)",
            borderRadius:9, cursor:"pointer", color:"var(--text-muted)",
            fontSize:13, fontFamily:"Outfit", transition:"all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background="var(--surface3)"; e.currentTarget.style.color="var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="var(--surface2)"; e.currentTarget.style.color="var(--text-muted)"; }}>
          {mode === "dark"
            ? <Sun  size={15} style={{ color:"#f59e0b", flexShrink:0 }} />
            : <Moon size={15} style={{ color:"#3b82f6", flexShrink:0 }} />}
          {!sidebarCollapsed && (mode === "dark" ? "Light Mode" : "Dark Mode")}
        </button>

        {/* Collapse toggle */}
        <button onClick={() => dispatch(toggleSidebar())}
          title={sidebarCollapsed ? "Expand" : "Collapse"}
          style={{
            display:"flex", alignItems:"center",
            gap: sidebarCollapsed ? 0 : 9,
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
            width:"100%", padding: sidebarCollapsed ? "10px" : "9px 12px",
            background:"none", border:"1px solid var(--border)",
            borderRadius:9, cursor:"pointer", color:"var(--text-muted)",
            fontSize:13, fontFamily:"Outfit", transition:"all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background="var(--surface2)"; e.currentTarget.style.color="var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color="var(--text-muted)"; }}>
          {sidebarCollapsed ? <ChevronRight size={15}/> : <><ChevronLeft size={15}/> Collapse</>}
        </button>

        {/* Footer card */}
        {!sidebarCollapsed && (
          <div style={{
            background:"linear-gradient(135deg, var(--accent-dim), var(--accent2-dim))",
            border:"1px solid rgba(0,212,170,0.2)", borderRadius:11, padding:"12px 14px",
          }}>
            <p style={{ fontSize:11, color:"var(--accent)", fontWeight:700, marginBottom:2 }}>Dashboard Builder</p>
            <p style={{ fontSize:11, color:"var(--text-muted)" }}>Challenge II · 2026</p>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ── Sub-components ── */

function SideLink({ to, icon, label, collapsed, badge, badgeColor }) {
  return (
    <NavLink to={to} end title={collapsed ? label : undefined}
      style={({ isActive }) => ({
        display:"flex", alignItems:"center",
        gap: collapsed ? 0 : 10,
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? "10px" : "9px 12px",
        borderRadius:9, textDecoration:"none",
        fontSize:14, fontWeight:500,
        color: isActive ? "#fff" : "var(--text-muted)",
        background: isActive ? "linear-gradient(135deg, var(--accent), #00b896)" : "transparent",
        transition:"all 0.18s", marginBottom:2,
        boxShadow: isActive ? "0 4px 14px rgba(0,212,170,0.25)" : "none",
        position:"relative", whiteSpace:"nowrap", overflow:"hidden",
      })}>
      <span style={{ flexShrink:0 }}>{icon}</span>
      {!collapsed && <span style={{ flex:1 }}>{label}</span>}
      {!collapsed && badge && (
        <span style={{
          background: badgeColor || "var(--danger)",
          color:"#fff", borderRadius:10,
          padding:"1px 7px", fontSize:10, fontWeight:700,
        }}>{badge}</span>
      )}
      {collapsed && badge && (
        <span style={{
          position:"absolute", top:4, right:4,
          width:14, height:14, borderRadius:"50%",
          background: badgeColor || "var(--danger)",
          color:"#fff", fontSize:8, fontWeight:700,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>{badge}</span>
      )}
    </NavLink>
  );
}

function SectionHeader({ label, open, onToggle }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"10px 8px 5px", cursor: onToggle ? "pointer" : "default",
    }} onClick={onToggle}>
      <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-faint)" }}>
        {label}
      </span>
      {onToggle && (
        <span style={{ color:"var(--text-faint)" }}>
          {open ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
        </span>
      )}
    </div>
  );
}

function QuickAction({ label, icon, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      display:"flex", alignItems:"center", gap:8, width:"100%",
      padding:"8px 12px", borderRadius:8, cursor:"pointer",
      background: color + "10", border:`1px solid ${color}25`,
      color, fontSize:13, fontFamily:"Outfit", fontWeight:500,
      transition:"all 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = color+"20"; e.currentTarget.style.borderColor = color+"50"; }}
      onMouseLeave={e => { e.currentTarget.style.background = color+"10"; e.currentTarget.style.borderColor = color+"25"; }}>
      {icon} {label}
    </button>
  );
}