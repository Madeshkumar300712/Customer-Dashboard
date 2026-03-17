import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, editOrder, removeOrder } from "../../store/orderSlice";
import OrderForm from "./OrderForm";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useToast } from "../ui/Toast";
import { Plus, MoreVertical, Pencil, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";

const STATUS_CLASSES = { Pending: "badge-pending", "In progress": "badge-progress", Completed: "badge-done" };
const STATUS_DOT = { Pending: "#f59e0b", "In progress": "#3b82f6", Completed: "#10b981" };

export default function OrderTable() {
  const dispatch = useDispatch();
  const toast = useToast();
  const orders = useSelector(s => s.orders.items);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const handleSubmit = async (data) => {
    if (editItem) { await dispatch(editOrder({ id: editItem._id, data })); toast("Order updated successfully"); }
    else { await dispatch(addOrder(data)); toast("Order created successfully"); }
    setShowForm(false); setEditItem(null);
  };

  const handleDelete = async (id) => {
    await dispatch(removeOrder(id));
    setConfirmId(null);
    toast("Order deleted", "error");
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return `${o.firstName || o.customerName || ""} ${o.lastName || ""} ${o.email || ""} ${o.product || ""} ${o.status || ""}`.toLowerCase().includes(q);
  }).sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (typeof av === "string") av = av.toLowerCase(), bv = bv?.toLowerCase();
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }) => sortField === field
    ? (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : <ChevronDown size={12} style={{ opacity: 0.3 }} />;

  const initials = (o) => `${o.firstName?.[0] || ""}${o.lastName?.[0] || ""}`.toUpperCase();
  const colors = ["#00d4aa","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899"];
  const avatarColor = (o) => colors[(o.firstName?.charCodeAt(0) || 0) % colors.length];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <p style={{ fontSize: 15, color: "var(--text-faint)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Management</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em" }}>Customer Orders</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={15} /> Create Order
        </button>
      </div>

      {/* Search + stats */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..." style={{ paddingLeft: 34, fontSize: 16 }} />
        </div>
        <span style={{ fontSize: 16, color: "var(--text-muted)" }}>
          {filtered.length} of {orders.length} orders
        </span>
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 72, border: "1px dashed var(--border2)" }}>
          <div style={{ fontSize: 50, marginBottom: 16 }}>📦</div>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>No orders yet</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 22, fontSize: 17 }}>Create your first customer order to get started.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14} /> Create Order</button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                {[["#",""], ["Customer","firstName"], ["Email","email"], ["Product","product"], ["Qty","quantity"], ["Total","totalAmount"], ["Status","status"], ["Created By","createdBy"], ["Date","createdAt"], ["",""]].map(([label, field]) => (
                  <th key={label} onClick={() => field && toggleSort(field)}
                    style={{ cursor: field ? "pointer" : "default", userSelect: "none" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {label} {field && <SortIcon field={field} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o._id}>
                  <td style={{ color: "var(--text-faint)", fontFamily: "JetBrains Mono, monospace", fontSize: 15 }}>
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: avatarColor(o) + "22", color: avatarColor(o),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, flexShrink: 0,
                      }}>{o.firstName ? initials(o) : (o.customerName?.[0] || "?").toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 16 }}>{o.firstName ? `${o.firstName} ${o.lastName || ""}` : (o.customerName || "Unknown")}</div>
                        <div style={{ fontSize: 14, color: "var(--text-faint)" }}>{o.phone || "No phone"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: 16 }}>{o.email || "No email"}</td>
                  <td style={{ maxWidth: 160 }}>
                    <span style={{
                      fontSize: 15, padding: "3px 9px", borderRadius: 6,
                      background: "var(--surface2)", color: "var(--text)", fontWeight: 500,
                      display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150,
                    }}>{o.product || "Unknown"}</span>
                  </td>
                  <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 16 }}>{o.quantity || 1}</td>
                  <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 16, color: "var(--accent)", fontWeight: 600 }}>
                    ${(o.totalAmount ?? (o.price ? o.price * (o.quantity || 1) : 0)).toFixed(2)}
                  </td>
                  <td>
                    <span style={{ textTransform: "capitalize" }} className={`badge ${STATUS_CLASSES[o.status] || STATUS_CLASSES[o.status?.charAt(0).toUpperCase() + o.status?.slice(1)] || "badge-pending"}`}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_DOT[o.status] || STATUS_DOT[o.status?.charAt(0).toUpperCase() + o.status?.slice(1)] || "#f59e0b", flexShrink: 0 }} />
                      {o.status || "Pending"}
                    </span>
                  </td>
                  <td style={{ fontSize: 16, color: "var(--text-muted)" }}>{o.createdBy ? o.createdBy.split(" ").slice(1).join(" ") : "System"}</td>
                  <td style={{ fontSize: 15, color: "var(--text-faint)", fontFamily: "JetBrains Mono, monospace" }}>
                    {new Date(o.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "2-digit" })}
                  </td>
                  <td style={{ position: "relative" }}>
                    <button className="btn-icon" style={{ width: 28, height: 28 }}
                      onClick={() => setMenuId(menuId === o._id ? null : o._id)}>
                      <MoreVertical size={14} />
                    </button>
                    {menuId === o._id && (
                      <>
                        <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setMenuId(null)} />
                        <div style={{
                          position: "absolute", right: 6, top: 36,
                          background: "var(--surface2)", border: "1px solid var(--border2)",
                          borderRadius: 10, zIndex: 50, minWidth: 140,
                          boxShadow: "var(--shadow)", overflow: "hidden",
                        }}>
                          {[
                            { icon: <Pencil size={13} />, label: "Edit", action: () => { setEditItem(o); setShowForm(true); setMenuId(null); } },
                            { icon: <Trash2 size={13} />, label: "Delete", action: () => { setConfirmId(o._id); setMenuId(null); }, danger: true },
                          ].map(item => (
                            <button key={item.label} onClick={item.action} style={{
                              display: "flex", alignItems: "center", gap: 9, width: "100%",
                              padding: "10px 14px", background: "none", border: "none",
                              color: item.danger ? "var(--danger)" : "var(--text)",
                              cursor: "pointer", fontSize: 16, fontFamily: "Outfit, sans-serif",
                              transition: "background 0.12s",
                            }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                              onMouseLeave={e => e.currentTarget.style.background = "none"}>
                              {item.icon} {item.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <OrderForm initial={editItem} onClose={() => { setShowForm(false); setEditItem(null); }} onSubmit={handleSubmit} />}
      {confirmId && <ConfirmDialog message="This will permanently delete the order. Are you sure?"
        onConfirm={() => handleDelete(confirmId)} onCancel={() => setConfirmId(null)} />}
    </div>
  );
}