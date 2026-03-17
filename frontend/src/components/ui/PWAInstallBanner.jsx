import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow]     = useState(false);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("pwa_dismissed") === "1"
  );

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      if (!dismissed) setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [dismissed]);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("pwa_dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="pwa-banner">
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, var(--accent), #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Smartphone size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Install Halleyx</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
            Add to your home screen for faster access and offline support.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={install}>
              <Download size={13} /> Install App
            </button>
            <button className="btn btn-ghost btn-sm" onClick={dismiss}>Not now</button>
          </div>
        </div>
        <button onClick={dismiss}
          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 2 }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}