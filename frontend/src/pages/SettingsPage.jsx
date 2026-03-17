import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toggleTheme, setTheme } from "../store/themeSlice";
import { logout } from "../store/authSlice";
import { useToast } from "../components/ui/Toast";
import { Sun, Moon, LogOut, Bell, Shield, Palette, User } from "lucide-react";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const toast    = useToast();
  const { user } = useSelector(s => s.auth);
  const { mode } = useSelector(s => s.theme);
  const [notifs, setNotifs] = useState({ orderCreated:true, orderUpdated:true, orderDeleted:false });
  const [saved,  setSaved]  = useState(false);

  const save = () => {
    setSaved(true);
    toast("Settings saved!");
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ icon, title, children }) => (
    <div className="card" style={{ marginBottom:16, padding:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, paddingBottom:14, borderBottom:"1px solid var(--border)" }}>
        <span style={{ color:"var(--accent)" }}>{icon}</span>
        <h3 style={{ fontSize:15, fontWeight:700 }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ label, desc, value, onChange }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
      <div>
        <p style={{ fontSize:14, fontWeight:500 }}>{label}</p>
        {desc && <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
        background: value ? "var(--accent)" : "var(--surface3)",
        position:"relative", transition:"background 0.2s", flexShrink:0,
      }}>
        <span style={{
          position:"absolute", top:2, left: value ? 22 : 2,
          width:20, height:20, borderRadius:"50%", background:"#fff",
          transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)",
        }}/>
      </button>
    </div>
  );

  return (
    <div style={{ padding:"28px 32px", maxWidth:680 }}>
      <div className="fade-up" style={{ marginBottom:24 }}>
        <p style={{ fontSize:12, color:"var(--text-faint)", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>Preferences</p>
        <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.03em" }}>Settings</h1>
      </div>

      {/* Profile */}
      <Section icon={<User size={18}/>} title="Profile">
        <div style={{ display:"flex", gap:16, alignItems:"center", marginBottom:16 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:"linear-gradient(135deg,var(--accent),#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:800, color:"#fff" }}>
            {user?.name?.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}
          </div>
          <div>
            <p style={{ fontSize:16, fontWeight:700 }}>{user?.name}</p>
            <p style={{ fontSize:13, color:"var(--text-muted)" }}>{user?.email}</p>
            <span style={{ fontSize:11, padding:"2px 9px", borderRadius:10, background:"var(--accent-dim)", color:"var(--accent)", fontWeight:700, textTransform:"uppercase", marginTop:4, display:"inline-block" }}>
              {user?.role}
            </span>
          </div>
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={<Palette size={18}/>} title="Appearance">
        <div style={{ display:"flex", gap:10, marginBottom:4 }}>
          {["dark","light"].map(m => (
            <button key={m} onClick={() => dispatch(setTheme(m))} style={{
              flex:1, padding:"12px", borderRadius:10, cursor:"pointer", fontFamily:"Outfit",
              border:`2px solid ${mode===m?"var(--accent)":"var(--border)"}`,
              background: mode===m ? "var(--accent-dim)" : "var(--surface2)",
              color: mode===m ? "var(--accent)" : "var(--text-muted)",
              fontSize:14, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              transition:"all 0.15s",
            }}>
              {m==="dark" ? <Moon size={16}/> : <Sun size={16}/>}
              {m.charAt(0).toUpperCase()+m.slice(1)} Mode
            </button>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={<Bell size={18}/>} title="Notifications">
        <Toggle label="Order Created"  desc="Alert when a new order is placed"      value={notifs.orderCreated}  onChange={v => setNotifs(n=>({...n,orderCreated:v}))} />
        <Toggle label="Order Updated"  desc="Alert when an order status changes"     value={notifs.orderUpdated}  onChange={v => setNotifs(n=>({...n,orderUpdated:v}))} />
        <Toggle label="Order Deleted"  desc="Alert when an order is removed"         value={notifs.orderDeleted}  onChange={v => setNotifs(n=>({...n,orderDeleted:v}))} />
      </Section>

      {/* Security */}
      <Section icon={<Shield size={18}/>} title="Security">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0" }}>
          <div>
            <p style={{ fontSize:14, fontWeight:500 }}>Sign Out</p>
            <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>Sign out of your account on this device</p>
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => dispatch(logout())}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>
      </Section>

      <button className="btn btn-primary" onClick={save} style={{ minWidth:140 }}>
        {saved ? "✓ Saved!" : "Save Settings"}
      </button>
    </div>
  );
}