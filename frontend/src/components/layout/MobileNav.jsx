import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart } from "lucide-react";

export default function MobileNav() {
  const linkStyle = ({ isActive }) => ({
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 4, flex: 1, padding: "8px 4px",
    textDecoration: "none", fontSize: 11, fontWeight: 500,
    color: isActive ? "var(--accent)" : "var(--text-muted)",
    transition: "color 0.15s",
  });

  return (
    <nav className="mobile-nav" style={{ justifyContent: "space-around" }}>
      <NavLink to="/"       style={linkStyle}><LayoutDashboard size={22} /><span>Dashboard</span></NavLink>
      <NavLink to="/orders" style={linkStyle}><ShoppingCart    size={22} /><span>Orders</span></NavLink>
    </nav>
  );
}