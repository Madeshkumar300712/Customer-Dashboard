import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, LogOut, User, ChevronDown, Check, X } from "lucide-react";
import { logout } from "../../store/authSlice";
import { fetchNotifications, markAllReadThunk } from "../../store/notificationSlice";

const TYPE_COLOR = {
  order_created: "#00d4aa", order_updated: "#3b82f6",
  order_deleted: "#ef4444", system: "#f59e0b",
};

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { items: notifs, unread } = useSelector(s => s.notifications);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notifRef = useRef(); const userRef = useRef();

  useEffect(() => { dispatch(fetchNotifications()); }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setShowUser(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
  <header style={{
    height: 60,
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    display: "flex", alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 28px", gap: 12,
    position: "sticky", top: 0, zIndex: 90,
  }}>
    {/* Notification bell */}
    <div ref={notifRef} style={{ position: "relative" }}>
      <button className="btn-icon"
        onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
        style={{ position: "relative", width: 40, height: 40 }}>
        <Bell size={18} />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -3, right: -3,
            width: 18, height: 18, borderRadius: "50%",
            background: "#ef4444", fontSize: 13,
            fontWeight: 700, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {showNotif && (
        <div style={{
          position: "absolute", right: 0, top: 48,
          width: 360, background: "var(--surface2)",
          border: "1px solid var(--border2)", borderRadius: 14,
          boxShadow: "var(--shadow)", zIndex: 200, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "16px 18px 12px",
            borderBottom: "1px solid var(--border)",
          }}>
            <span style={{ fontWeight: 700, fontSize: 18 }}>Notifications</span>
            {unread > 0 && (
              <button onClick={() => dispatch(markAllReadThunk())} style={{
                background: "none", border: "none",
                color: "var(--accent)", fontSize: 16,
                cursor: "pointer", fontFamily: "Outfit",
              }}>Mark all read</button>
            )}
          </div>
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: 17 }}>
                No notifications
              </div>
            ) : notifs.slice(0, 20).map(n => (
              <div key={n._id} style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--border)",
                background: n.read ? "transparent" : "rgba(0,212,170,0.04)",
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 9, height: 9, borderRadius: "50%",
                    background: TYPE_COLOR[n.type] || "#7a8299",
                    marginTop: 5, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 17, fontWeight: n.read ? 400 : 600, marginBottom: 3 }}>
                      {n.title}
                    </p>
                    <p style={{ fontSize: 16, color: "var(--text-muted)" }}>{n.message}</p>
                    <p style={{ fontSize: 15, color: "var(--text-faint)", marginTop: 4 }}>
                      {new Date(n.createdAt).toLocaleString("en", {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "var(--accent)", flexShrink: 0, marginTop: 6,
                    }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* User menu */}
    <div ref={userRef} style={{ position: "relative" }}>
      <button
        onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "8px 14px",
          cursor: "pointer", transition: "all 0.15s",
        }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "linear-gradient(135deg, #00d4aa, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, color: "#080b11",
        }}>
          {initials}
        </div>
        <span style={{ fontSize: 17, fontWeight: 500, color: "var(--text)" }}>
          {user?.name?.split(" ")[0]}
        </span>
        <span style={{
          fontSize: 14, padding: "3px 9px", borderRadius: 10,
          background: user?.role === "admin"
            ? "rgba(0,212,170,0.15)"
            : "var(--surface3)",
          color: user?.role === "admin" ? "var(--accent)" : "var(--text-muted)",
          fontWeight: 600, textTransform: "uppercase",
        }}>
          {user?.role}
        </span>
        <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
      </button>

      {showUser && (
        <div style={{
          position: "absolute", right: 0, top: 48, width: 220,
          background: "var(--surface2)", border: "1px solid var(--border2)",
          borderRadius: 12, boxShadow: "var(--shadow)", zIndex: 200, overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 17, fontWeight: 600 }}>{user?.name}</p>
            <p style={{ fontSize: 16, color: "var(--text-muted)", marginTop: 3 }}>{user?.email}</p>
          </div>
          <button onClick={() => dispatch(logout())} style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "13px 16px", background: "none", border: "none",
            color: "var(--danger)", cursor: "pointer",
            fontSize: 17, fontFamily: "Outfit",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}
    </div>
  </header>
);
}