import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, clearError } from "../store/authSlice";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "editor" });
  const [showPwd, setShowPwd] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);

  useEffect(() => { if (user) navigate("/"); }, [user]);
  useEffect(() => { dispatch(clearError()); }, [mode]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (mode === "login") dispatch(loginUser({ email: form.email, password: form.password }));
    else dispatch(registerUser(form));
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)",
    }}>
      {/* BG glow */}
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(0,212,170,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="fade-up" style={{ width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, margin: "0 auto 14px",
            background: "linear-gradient(135deg, #00d4aa, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0,212,170,0.35)",
          }}>
            <Zap size={24} color="#080b11" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Halle<span style={{ color: "var(--accent)" }}>yx</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 17, marginTop: 4 }}>Dashboard Builder Platform</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {/* Tab switcher */}
          <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 8, padding: 3, marginBottom: 28 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "8px", border: "none", borderRadius: 6,
                background: mode === m ? "var(--surface3)" : "transparent",
                color: mode === m ? "var(--text)" : "var(--text-muted)",
                fontFamily: "Outfit", fontWeight: mode === m ? 600 : 400,
                fontSize: 17, cursor: "pointer", transition: "all 0.2s",
                textTransform: "capitalize",
              }}>{m === "login" ? "Sign In" : "Register"}</button>
            ))}
          </div>

          {error && (
            <div style={{ background: "var(--danger-dim)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 18, fontSize: 16, color: "#ef4444" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <div>
                <label>Full Name</label>
                <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Doe" />
              </div>
            )}
            <div>
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPwd ? "text" : "password"} value={form.password}
                  onChange={e => set("password", e.target.value)} placeholder="••••••••"
                  style={{ paddingRight: 40 }} />
                <button onClick={() => setShowPwd(!showPwd)} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
                }}>{showPwd ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </div>
            {mode === "register" && (
              <div>
                <label>Role</label>
                <select value={form.role} onChange={e => set("role", e.target.value)}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            )}
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "11px", marginTop: 4 }}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </div>

          {mode === "login" && (
            <div style={{ marginTop: 20, padding: "14px", background: "var(--surface2)", borderRadius: 8, fontSize: 15 }}>
              <p style={{ color: "var(--text-muted)", marginBottom: 6, fontWeight: 500 }}>Demo accounts:</p>
              <p style={{ color: "var(--text-faint)" }}>admin@halleyx.com / admin123</p>
              <p style={{ color: "var(--text-faint)" }}>editor@halleyx.com / editor123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}