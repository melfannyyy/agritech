import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const FARMER_NAV = [
  { to: "/dashboard",   label: "Dashboard",   icon: "⊞" },
  { to: "/farms",       label: "Farms",        icon: "🏡" },
  { to: "/crops",       label: "Crops",        icon: "🌾" },
  { to: "/crop-info",   label: "Crop Info",    icon: "📋" },
  { to: "/weather",     label: "Weather",      icon: "🌤️" },
  { to: "/products",    label: "Products",     icon: "🛒" },
  { to: "/pest-alerts", label: "Pest Alerts",  icon: "🐛" },
  { to: "/my-orders",   label: "My Orders",    icon: "📦" },
  { to: "/forum",       label: "Forum",        icon: "💬" },
];

const ADMIN_NAV = [
  { to: "/admin",           label: "Dashboard", icon: "⊞" },
  { to: "/admin/users",     label: "Users",     icon: "👥" },
  { to: "/admin/farms",     label: "Farms",     icon: "🏡" },
  { to: "/admin/products",  label: "Products",  icon: "🛒" },
  { to: "/admin/bookings",  label: "Orders",    icon: "📦" },
];

function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const navItems   = isAdmin ? ADMIN_NAV : FARMER_NAV;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className={"navbar" + (scrolled ? " navbar--scrolled" : "")}>
        <div className="container navbar__inner">

          {/* Logo */}
          <Link
            to={user ? (isAdmin ? "/admin" : "/dashboard") : "/"}
            className="navbar__brand"
          >
            <span className="navbar__logo-icon" aria-hidden="true">🌿</span>
            <span className="navbar__brand-text">
              Agri<span className="navbar__brand-accent">Tech</span>
            </span>
            {isAdmin && <span className="navbar__admin-badge">Admin</span>}
          </Link>

          {/* Desktop nav links — scrollable row */}
          {user && (
            <nav className="navbar__links-wrap" aria-label="Main navigation">
              <ul className="navbar__links">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/admin" || item.to === "/dashboard"}
                      className={({ isActive }) =>
                        "navbar__link" + (isActive ? " navbar__link--active" : "")
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Right side */}
          <div className="navbar__right">
            {user ? (
              <>
                <div className="navbar__user">
                  <span className="navbar__user-avatar">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <span className="navbar__user-name">{user.name?.split(" ")[0]}</span>
                </div>
                <button className="btn btn-outline btn-sm navbar__logout" onClick={handleLogout}>
                  Keluar
                </button>
              </>
            ) : !isAuthPage && (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Masuk
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Daftar Gratis
                </Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className={"navbar__burger" + (open ? " navbar__burger--open" : "")}
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="navbar__overlay" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile drawer */}
      <div className={"navbar__drawer" + (open ? " navbar__drawer--open" : "")} role="dialog" aria-label="Navigation menu">
        <div className="navbar__drawer-head">
          <span className="navbar__drawer-brand">
            <span>🌿</span> Agri<span className="navbar__brand-accent">Tech</span>
          </span>
          {user && (
            <div className="navbar__drawer-user">
              <span className="navbar__user-avatar navbar__user-avatar--lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
              <div>
                <div className="navbar__drawer-user-name">{user.name}</div>
                <div className="navbar__drawer-user-role">{isAdmin ? "⚙️ Admin" : "🌾 Farmer"}</div>
              </div>
            </div>
          )}
        </div>

        <ul className="navbar__drawer-links">
          {user && navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/admin" || item.to === "/dashboard"}
                className={({ isActive }) =>
                  "navbar__drawer-link" + (isActive ? " navbar__drawer-link--active" : "")
                }
              >
                <span className="navbar__drawer-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
          {!user && !isAuthPage && (
            <>
              <li>
                <Link to="/login" className="navbar__drawer-link">
                  <span className="navbar__drawer-icon">🔑</span> Masuk
                </Link>
              </li>
              <li>
                <Link to="/register" className="navbar__drawer-link navbar__drawer-link--register">
                  <span className="navbar__drawer-icon">✨</span> Daftar Gratis
                </Link>
              </li>
            </>
          )}
        </ul>

        {user && (
          <div className="navbar__drawer-footer">
            <button className="navbar__drawer-logout" onClick={handleLogout}>
              🚪 Keluar dari Akun
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Navbar;
