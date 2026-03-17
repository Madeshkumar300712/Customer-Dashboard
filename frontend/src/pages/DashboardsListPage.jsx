import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboards, createDashboardThunk, deleteDashboardThunk,
  fetchTemplates, duplicateDashboardThunk, renameDashboardThunk,
} from "../store/dashboardSlice";
import { useToast } from "../components/ui/Toast";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import {
  Plus, Settings2, Trash2, Copy, Clock, LayoutDashboard,
  Search, X, ChevronDown, Check, Pencil, BarChart2,
  TrendingUp, PieChart, Table2, Hash, Activity, Filter,
  Users, Gauge, Zap,
} from "lucide-react";

/* ── Template metadata ── */
const TEMPLATE_META = {
  sales:      { color:"#00d4aa", icon:<BarChart2  size={18}/>, gradient:"linear-gradient(135deg,rgba(0,212,170,0.12),rgba(0,212,170,0.04))" },
  revenue:    { color:"#3b82f6", icon:<TrendingUp size={18}/>, gradient:"linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))" },
  operations: { color:"#f59e0b", icon:<Filter     size={18}/>, gradient:"linear-gradient(135deg,rgba(245,158,11,0.12),rgba(245,158,11,0.04))" },
  executive:  { color:"#8b5cf6", icon:<Zap        size={18}/>, gradient:"linear-gradient(135deg,rgba(139,92,246,0.12),rgba(139,92,246,0.04))" },
  product:    { color:"#f97316", icon:<PieChart   size={18}/>, gradient:"linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.04))" },
  customer:   { color:"#ec4899", icon:<Users      size={18}/>, gradient:"linear-gradient(135deg,rgba(236,72,153,0.12),rgba(236,72,153,0.04))" },
};

const WIDGET_ICONS = {
  "Bar Chart"   :<BarChart2  size={11}/>,
  "Line Chart"  :<TrendingUp size={11}/>,
  "Area Chart"  :<Activity   size={11}/>,
  "Pie Chart"   :<PieChart   size={11}/>,
  "Table"       :<Table2     size={11}/>,
  "KPI Value"   :<Hash       size={11}/>,
  "Funnel Chart":<Filter     size={11}/>,
  "Heatmap"     :<BarChart2  size={11}/>,
  "Gauge"       :<Gauge      size={11}/>,
  "AI Insights" :<Zap        size={11}/>,
};

const WIDGET_COLOR = {
  "Bar Chart":"#3b82f6","Line Chart":"#00d4aa","Area Chart":"#10b981",
  "Pie Chart":"#f59e0b","Table":"#64748b","KPI Value":"#8b5cf6",
  "Funnel Chart":"#f59e0b","Heatmap":"#ec4899","Gauge":"#f97316","AI Insights":"#00d4aa",
};

const SORT_OPTIONS = [
  { label:"Newest first",   value:"newest" },
  { label:"Oldest first",   value:"oldest" },
  { label:"Name A–Z",       value:"name_asc" },
  { label:"Name Z–A",       value:"name_desc" },
  { label:"Most widgets",   value:"widgets_desc" },
];

const CATEGORY_COLORS = {
  Sales:"#00d4aa", Finance:"#3b82f6", Operations:"#f59e0b",
  Management:"#8b5cf6", Product:"#f97316", Customers:"#ec4899",
};

export default function DashboardsListPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const toast      = useToast();
  const { list, templates } = useSelector(s => s.dashboard);

  const [showNew,      setShowNew]      = useState(false);
  const [newName,      setNewName]      = useState("");
  const [confirmId,    setConfirmId]    = useState(null);
  const [editingId,    setEditingId]    = useState(null);
  const [editName,     setEditName]     = useState("");
  const [search,       setSearch]       = useState("");
  const [sortBy,       setSortBy]       = useState("newest");
  const [showSort,     setShowSort]     = useState(false);
  const [filterCat,    setFilterCat]    = useState("All");
  const [menuId,       setMenuId]       = useState(null);

  useEffect(() => {
    dispatch(fetchDashboards());
    dispatch(fetchTemplates());
  }, []);

  /* ── Sorted + filtered list ── */
  const processed = useMemo(() => {
    let result = [...list];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "newest":       result.sort((a,b) => new Date(b.updatedAt)-new Date(a.updatedAt)); break;
      case "oldest":       result.sort((a,b) => new Date(a.updatedAt)-new Date(b.updatedAt)); break;
      case "name_asc":     result.sort((a,b) => a.name.localeCompare(b.name)); break;
      case "name_desc":    result.sort((a,b) => b.name.localeCompare(a.name)); break;
      case "widgets_desc": result.sort((a,b) => (b.widgets?.length||0)-(a.widgets?.length||0)); break;
    }
    return result;
  }, [list, search, sortBy]);

  /* ── Actions ── */
  const createBlank = async () => {
    if (!newName.trim()) return;
    const res = await dispatch(createDashboardThunk({ name:newName, widgets:[], dateFilter:"All time" }));
    toast("Dashboard created!");
    setShowNew(false); setNewName("");
    navigate(`/config/${res.payload._id}`);
  };

  const createFromTemplate = async (tpl) => {
    const res = await dispatch(createDashboardThunk({ name:tpl.name, widgets:tpl.widgets, dateFilter:"All time" }));
    toast(`"${tpl.name}" applied!`);
    navigate(`/dashboard/${res.payload._id}`);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteDashboardThunk(id));
    setConfirmId(null); toast("Dashboard deleted","error");
  };

  const handleDuplicate = async (id) => {
    await dispatch(duplicateDashboardThunk(id));
    setMenuId(null); toast("Dashboard duplicated!");
  };

  const startRename = (d) => {
    setEditingId(d._id); setEditName(d.name); setMenuId(null);
  };

  const confirmRename = async (id) => {
    if (!editName.trim()) return;
    await dispatch(renameDashboardThunk({ id, name:editName }));
    setEditingId(null); toast("Renamed!");
  };

  /* ── Relative time ── */
  const relTime = (dt) => {
    const diff = (Date.now() - new Date(dt)) / 1000;
    if (diff < 60)    return "just now";
    if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    if (diff < 604800)return `${Math.floor(diff/86400)}d ago`;
    return new Date(dt).toLocaleDateString("en",{month:"short",day:"numeric"});
  };

  /* ── Unique widget types for a dashboard ── */
  const widgetTypes = (d) => [...new Set((d.widgets||[]).map(w=>w.type))];

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy);

  return (
    <div style={{ padding:"28px 32px" }}>

      {/* ── Page header ── */}
      <div className="fade-up" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 }}>
        <div>
          <p style={{ fontSize:12, color:"var(--text-faint)", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Analytics</p>
          <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.03em" }}>My Dashboards</h1>
          <p style={{ color:"var(--text-muted)", fontSize:14, marginTop:5 }}>
            {list.length} dashboard{list.length!==1?"s":""} · Press <kbd style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:5, padding:"1px 6px", fontSize:11, fontFamily:"monospace" }}>Cmd+K</kbd> to navigate
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>
          <Plus size={16}/> New Dashboard
        </button>
      </div>

      {/* ── Starter Templates ── */}
      <div className="fade-up-2" style={{ marginBottom:36 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <h2 style={{ fontSize:16, fontWeight:700 }}>Starter Templates</h2>
          <span style={{ fontSize:12, padding:"2px 9px", borderRadius:20, background:"var(--accent-dim)", color:"var(--accent)", fontWeight:700 }}>
            {templates.length}
          </span>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
          {templates.map(t => {
            const meta = TEMPLATE_META[t.templateName] || { color:"#64748b", icon:<LayoutDashboard size={18}/>, gradient:"" };
            const catColor = CATEGORY_COLORS[t.category] || "#64748b";
            const types = [...new Set((t.widgets||[]).map(w=>w.type))];
            return (
              <div key={t.templateName}
                onClick={() => createFromTemplate(t)}
                style={{
                  background: meta.gradient || "var(--surface)",
                  border:`1px solid ${meta.color}28`,
                  borderRadius:14, padding:20, cursor:"pointer",
                  transition:"all 0.2s",
                }}>

                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:14 }}>
                  <div style={{ width:42, height:42, borderRadius:11, background:meta.color+"22", display:"flex", alignItems:"center", justifyContent:"center", color:meta.color, flexShrink:0 }}>
                    {meta.icon}
                  </div>
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                      <p style={{ fontWeight:700, fontSize:15 }}>{t.name}</p>
                      <span style={{ fontSize:10, padding:"2px 7px", borderRadius:8, background:catColor+"18", color:catColor, fontWeight:700 }}>{t.category}</span>
                    </div>
                    <p style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.5 }}>{t.description}</p>
                  </div>
                </div>

                {/* Widget type pills */}
                <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                  {types.map(type => (
                    <span key={type} style={{
                      display:"inline-flex", alignItems:"center", gap:4,
                      fontSize:11, padding:"3px 8px", borderRadius:6,
                      background:WIDGET_COLOR[type]+"18",
                      color:WIDGET_COLOR[type], fontWeight:500,
                    }}>
                      {WIDGET_ICONS[type]} {type}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:12, color:"var(--text-faint)" }}>{t.widgets?.length||0} widgets</span>
                  <span style={{ fontSize:12, color:meta.color, fontWeight:700 }}>Use template →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Your dashboards header + toolbar ── */}
      <div className="fade-up-3">
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <h2 style={{ fontSize:16, fontWeight:700 }}>Your Dashboards</h2>
            {list.length > 0 && (
              <span style={{ fontSize:12, padding:"2px 9px", borderRadius:20, background:"var(--surface2)", color:"var(--text-muted)", fontWeight:700 }}>
                {processed.length}{search ? ` of ${list.length}` : ""}
              </span>
            )}
          </div>

          {list.length > 0 && (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {/* Search */}
              <div style={{ position:"relative" }}>
                <Search size={13} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-faint)" }}/>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search dashboards…"
                  style={{ paddingLeft:30, fontSize:13, width:200, padding:"8px 8px 8px 30px" }}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--text-faint)", cursor:"pointer" }}>
                    <X size={12}/>
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div style={{ position:"relative" }}>
                <button className="btn btn-secondary btn-sm"
                  onClick={() => setShowSort(!showSort)}
                  style={{ gap:6 }}>
                  {currentSort?.label} <ChevronDown size={12}/>
                </button>
                {showSort && (
                  <>
                    <div style={{ position:"fixed", inset:0, zIndex:49 }} onClick={() => setShowSort(false)}/>
                    <div style={{ position:"absolute", right:0, top:38, background:"var(--surface2)", border:"1px solid var(--border2)", borderRadius:11, zIndex:50, minWidth:170, boxShadow:"var(--shadow)", overflow:"hidden" }}>
                      {SORT_OPTIONS.map(o => (
                        <button key={o.value} onClick={() => { setSortBy(o.value); setShowSort(false); }}
                          style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 14px", background:"none", border:"none", color: sortBy===o.value?"var(--accent)":"var(--text)", cursor:"pointer", fontSize:13, fontFamily:"Outfit" }}
                          onMouseEnter={e => e.currentTarget.style.background="var(--surface3)"}
                          onMouseLeave={e => e.currentTarget.style.background="none"}>
                          {o.label}
                          {sortBy===o.value && <Check size={13}/>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Empty state ── */}
        {list.length === 0 ? (
          <div className="card" style={{ textAlign:"center", padding:"72px 40px", border:"1px dashed var(--border2)" }}>
            <div style={{ width:72, height:72, borderRadius:20, background:"var(--accent-dim)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", animation:"float 3s ease-in-out infinite" }}>
              <LayoutDashboard size={32} style={{ color:"var(--accent)" }}/>
            </div>
            <h3 style={{ fontSize:20, marginBottom:8 }}>No dashboards yet</h3>
            <p style={{ color:"var(--text-muted)", fontSize:14, marginBottom:24, lineHeight:1.6 }}>
              Create a blank dashboard or click any template above<br/>to get started instantly.
            </p>
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>
              <Plus size={14}/> Create Dashboard
            </button>
          </div>
        ) : processed.length === 0 ? (
          <div className="card" style={{ textAlign:"center", padding:48 }}>
            <Search size={28} style={{ color:"var(--text-faint)", marginBottom:12 }}/>
            <p style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>No results for "{search}"</p>
            <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:16 }}>Try a different name</p>
            <button className="btn btn-secondary btn-sm" onClick={() => setSearch("")}><X size={12}/> Clear search</button>
          </div>
        ) : (
          /* ── Dashboard grid ── */
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:16 }}>
            {processed.map(d => {
              const types = widgetTypes(d);
              const isEditing = editingId === d._id;

              return (
                <div key={d._id} className="card" style={{ padding:22, transition:"all 0.2s", position:"relative" }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="var(--shadow)"; e.currentTarget.style.borderColor="var(--border2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="var(--border)"; }}>

                  {/* Card header */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:11, flex:1, minWidth:0 }}>
                      <div style={{ width:40, height:40, borderRadius:11, background:"var(--accent-dim)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--accent)", flexShrink:0 }}>
                        <LayoutDashboard size={17}/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        {/* Inline rename */}
                        {isEditing ? (
                          <input
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            autoFocus
                            style={{ fontSize:15, fontWeight:700, padding:"3px 8px", marginBottom:2 }}
                            onKeyDown={e => {
                              if (e.key === "Enter") confirmRename(d._id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            onBlur={() => confirmRename(d._id)}
                            onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <p style={{ fontWeight:700, fontSize:15, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {d.name}
                          </p>
                        )}
                        <p style={{ fontSize:12, color:"var(--text-muted)" }}>
                          {d.widgets?.length||0} widget{(d.widgets?.length||0)!==1?"s":""}
                        </p>
                      </div>
                    </div>

                    {/* Action menu */}
                    <div style={{ position:"relative", flexShrink:0 }}>
                      <div style={{ display:"flex", gap:4 }}>
                        <button className="btn-icon" style={{ width:30, height:30 }}
                          title="Configure" onClick={e => { e.stopPropagation(); navigate(`/config/${d._id}`); }}>
                          <Settings2 size={13}/>
                        </button>
                        <button className="btn-icon" style={{ width:30, height:30 }}
                          onClick={e => { e.stopPropagation(); setMenuId(menuId===d._id?null:d._id); }}>
                          <ChevronDown size={13}/>
                        </button>
                      </div>

                      {menuId===d._id && (
                        <>
                          <div style={{ position:"fixed", inset:0, zIndex:49 }} onClick={() => setMenuId(null)}/>
                          <div style={{ position:"absolute", right:0, top:34, background:"var(--surface2)", border:"1px solid var(--border2)", borderRadius:11, zIndex:50, minWidth:160, boxShadow:"var(--shadow)", overflow:"hidden" }}>
                            {[
                              { icon:<Pencil   size={13}/>, label:"Rename",    action:() => startRename(d) },
                              { icon:<Copy     size={13}/>, label:"Duplicate", action:() => handleDuplicate(d._id) },
                              { icon:<Settings2 size={13}/>,label:"Configure", action:() => { navigate(`/config/${d._id}`); setMenuId(null); } },
                              { icon:<Trash2   size={13}/>, label:"Delete",    action:() => { setConfirmId(d._id); setMenuId(null); }, danger:true },
                            ].map(item => (
                              <button key={item.label} onClick={e => { e.stopPropagation(); item.action(); }}
                                style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"10px 14px", background:"none", border:"none", color:item.danger?"var(--danger)":"var(--text)", cursor:"pointer", fontSize:13, fontFamily:"Outfit" }}
                                onMouseEnter={e => e.currentTarget.style.background=item.danger?"rgba(239,68,68,0.06)":"rgba(255,255,255,0.04)"}
                                onMouseLeave={e => e.currentTarget.style.background="none"}>
                                {item.icon} {item.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Widget type badges */}
                  {types.length > 0 && (
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                      {types.slice(0,5).map(type => (
                        <span key={type} style={{
                          display:"inline-flex", alignItems:"center", gap:4,
                          fontSize:10, padding:"3px 7px", borderRadius:6,
                          background:WIDGET_COLOR[type]+"18",
                          color:WIDGET_COLOR[type], fontWeight:500,
                        }}>
                          {WIDGET_ICONS[type]} {type}
                        </span>
                      ))}
                      {types.length > 5 && (
                        <span style={{ fontSize:10, color:"var(--text-faint)", padding:"3px 0" }}>+{types.length-5}</span>
                      )}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:16 }}>
                    <Clock size={11} style={{ color:"var(--text-faint)" }}/>
                    <span style={{ fontSize:11, color:"var(--text-faint)" }}>Updated {relTime(d.updatedAt)}</span>
                  </div>

                  {/* Open button */}
                  <button className="btn btn-secondary"
                    style={{ width:"100%", justifyContent:"center", fontSize:14 }}
                    onClick={() => navigate(`/dashboard/${d._id}`)}>
                    Open Dashboard
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
 

      {/* ── New dashboard modal ── */}
      {showNew && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}
          onClick={() => setShowNew(false)}>
          <div className="card fade-up" style={{ width:420, padding:32 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize:20, marginBottom:6 }}>New Dashboard</h3>
            <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:22, lineHeight:1.5 }}>
              Give your dashboard a descriptive name. You can always rename it later.
            </p>
            <label>Dashboard Name</label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Q4 Sales Overview"
              autoFocus
              onKeyDown={e => e.key==="Enter" && createBlank()}
            />
            <div style={{ display:"flex", gap:10, marginTop:22, justifyContent:"flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn btn-primary"   onClick={createBlank} disabled={!newName.trim()}>
                Create Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <ConfirmDialog
          message="Delete this dashboard and all its widgets permanently?"
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
