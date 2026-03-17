import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { store } from "./store";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import PWAInstallBanner from "./components/ui/PWAInstallBanner";
import DashboardsListPage from "./pages/DashboardsListPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardConfigPage from "./pages/DashboardConfigPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import TeamPage from "./pages/TeamPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import CommandPalette from "./components/ui/CommandPalette";
import { ToastProvider } from "./components/ui/Toast";
import { useSocket } from "./hooks/useSocket";
import "./index.css";

function ThemeWrapper({ children }) {
  const { mode } = useSelector(s => s.theme);
  useEffect(() => { document.documentElement.setAttribute("data-theme", mode); }, [mode]);
  return children;
}

function ProtectedLayout() {
  const { user }             = useSelector(s => s.auth);
  const { sidebarCollapsed } = useSelector(s => s.theme);
  const [showCmd,        setShowCmd]        = useState(false);
  const [showShortcuts,  setShowShortcuts]  = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("hx_onboarded"));

  useSocket();

  const finishOnboarding = () => { setShowOnboarding(false); localStorage.setItem("hx_onboarded","1"); };

  useEffect(() => {
    const h = e => {
      if ((e.metaKey||e.ctrlKey) && e.key==="k") { e.preventDefault(); setShowCmd(c=>!c); }
      if (e.key==="?") setShowShortcuts(c=>!c);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar />
      <div className="main-content" style={{
        marginLeft: sidebarCollapsed ? 68 : 260, flex:1, minHeight:"100vh",
        display:"flex", flexDirection:"column",
        transition:"margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <Navbar />
        <div style={{ flex:1 }}>
          <Routes>
            <Route path="/"              element={<DashboardsListPage />} />
            <Route path="/dashboard/:id" element={<DashboardPage />} />
            <Route path="/orders"        element={<OrdersPage />} />
            <Route path="/analytics"     element={<AnalyticsPage />} />
            <Route path="/reports"       element={<ReportsPage />} />
            <Route path="/team"          element={<TeamPage />} />
            <Route path="/settings"      element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
      <MobileNav />
      <PWAInstallBanner />
      {showCmd        && <CommandPalette    onClose={() => setShowCmd(false)} />}
      {showShortcuts  && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"      element={<AuthPage />} />
        <Route path="/config/:id" element={<DashboardConfigPage />} />
        <Route path="/*"          element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
      <ThemeWrapper>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </ThemeWrapper>
  );
}