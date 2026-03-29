import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Organizations from "./pages/Organizations";
import Users from "./pages/Users";
import Accounts from "./pages/Accounts";

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#334155",
  },
  nav: {
    display: "flex",
    gap: "8px",
    marginBottom: "36px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "0",
  },
  navLink: {
    padding: "8px 18px",
    borderRadius: "8px 8px 0 0",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    color: "#64748b",
    borderBottom: "2px solid transparent",
    marginBottom: "-1px",
    transition: "color 0.15s, border-color 0.15s",
  },
  navLinkActive: {
    color: "#6366f1",
    borderBottom: "2px solid #6366f1",
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.container}>
        <nav style={styles.nav}>
          {(["organizations", "users", "accounts"] as const).map((page) => (
            <NavLink
              key={page}
              to={`/${page}`}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </NavLink>
          ))}
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/organizations" replace />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/users" element={<Users />} />
          <Route path="/accounts" element={<Accounts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}