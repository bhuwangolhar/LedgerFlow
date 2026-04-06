import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Organizations from "./pages/Organizations";
import Users from "./pages/Users";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Customers from "./pages/Customers";
import Vendors from "./pages/Vendors";
import Invoices from "./pages/Invoices";
import Bills from "./pages/Bills";
import PaymentsReceived from "./pages/PaymentsReceived";
import PaymentsMade from "./pages/PaymentsMade";
import BankAccounts from "./pages/BankAccounts";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

const styles = {
  shell: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
  },
  sidebar: {
    width: "200px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: "24px 0",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column" as const,
    height: "100vh",
    position: "fixed" as const,
    left: 0,
    top: 0,
    overflowY: "auto" as const,
  },
  sidebarBrand: {
    padding: "0 20px 24px",
    marginBottom: "12px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    alignItems: "center",
  },
  profileAvatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    backgroundColor: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: 800,
    color: "#ffffff",
  },
  brandText: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#0f172a",
    textDecoration: "none",
    display: "block",
    letterSpacing: "-0.02em",
  },
  userNameText: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    margin: 0,
  },
  navSection: {
    padding: "20px",
    flex: 1,
  },
  navLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: "12px",
    paddingLeft: "8px",
  },
  sidebarNavLink: {
    display: "block",
    padding: "10px 12px",
    marginBottom: "6px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    color: "#64748b",
    transition: "all 0.15s",
  },
  sidebarNavLinkActive: {
    color: "#1b4fd8",
    backgroundColor: "#eff6ff",
  },
  dropdownButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    marginBottom: "6px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    textDecoration: "none",
    color: "#64748b",
    transition: "all 0.15s",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left" as const,
  },
  dropdownButtonActive: {
    color: "#1b4fd8",
    backgroundColor: "#eff6ff",
  },
  dropdownMenu: {
    paddingLeft: "20px",
    marginBottom: "6px",
  },
  dropdownItem: {
    display: "block",
    padding: "8px 12px",
    marginBottom: "4px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 400,
    textDecoration: "none",
    color: "#64748b",
    transition: "all 0.15s",
  },
  dropdownItemActive: {
    color: "#1b4fd8",
    backgroundColor: "#f0f8ff",
  },
  sidebarFooter: {
    padding: "20px",
    paddingBottom: "40px",
    borderTop: "1px solid #e2e8f0",
    marginTop: "auto",
  },
  logoutButton: {
    width: "100%",
    color: "#ffffff",
    backgroundColor: "#dc2626",
    fontSize: "13px",
    fontWeight: 600,
    padding: "10px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s",
  },
  mainContent: {
    marginLeft: "200px",
    flex: 1,
    width: "calc(100% - 200px)",
  },
  container: {
    maxWidth: "100%",
    padding: "28px 40px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#334155",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  brand: {
    textDecoration: "none",
    color: "#0f172a",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
};

const NAV_PAGES = ["organizations", "users", "accounts", "transactions"] as const;

function DashboardLayout() {
  const { logout, user } = useAuth();
  const [financeDropdownOpen, setFinanceDropdownOpen] = useState(false);
  
  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logout();
    window.location.href = "/signin";
  };

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar} aria-label="Main navigation">
        <div style={styles.sidebarBrand}>
          <div style={styles.profileAvatar}>
            {getInitials(user?.name || "User")}
          </div>
          <p style={styles.userNameText}>{user?.name || "User"}</p>
        </div>

        <nav style={styles.navSection}>
          {NAV_PAGES.map((page) => (
            <NavLink
              key={page}
              to={`/${page}`}
              style={({ isActive }) => ({
                ...styles.sidebarNavLink,
                ...(isActive ? styles.sidebarNavLinkActive : {}),
              })}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </NavLink>
          ))}
          
          {/* Finance Dropdown */}
          <button
            style={{
              ...styles.dropdownButton,
              ...(financeDropdownOpen ? styles.dropdownButtonActive : {}),
            }}
            onClick={() => setFinanceDropdownOpen(!financeDropdownOpen)}
          >
            Finance
            <span style={{ fontSize: "10px" }}>
              {financeDropdownOpen ? "▼" : "▶"}
            </span>
          </button>
          
          {financeDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <NavLink
                to="/finance/customers"
                style={({ isActive }) => ({
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                })}
              >
                Customers
              </NavLink>
              <NavLink
                to="/finance/vendors"
                style={({ isActive }) => ({
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                })}
              >
                Vendors
              </NavLink>
              <NavLink
                to="/finance/invoices"
                style={({ isActive }) => ({
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                })}
              >
                Invoices
              </NavLink>
              <NavLink
                to="/finance/bills"
                style={({ isActive }) => ({
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                })}
              >
                Bills
              </NavLink>
              <NavLink
                to="/finance/payments-received"
                style={({ isActive }) => ({
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                })}
              >
                Payments Received
              </NavLink>
              <NavLink
                to="/finance/payments-made"
                style={({ isActive }) => ({
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                })}
              >
                Payments Made
              </NavLink>
              <NavLink
                to="/finance/bank-accounts"
                style={({ isActive }) => ({
                  ...styles.dropdownItem,
                  ...(isActive ? styles.dropdownItemActive : {}),
                })}
              >
                Bank Accounts
              </NavLink>
            </div>
          )}
        </nav>

        <div style={styles.sidebarFooter}>
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.mainContent}>
        <div style={styles.container}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/users" element={<Users />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/finance/customers" element={<Customers />} />
          <Route path="/finance/vendors" element={<Vendors />} />
          <Route path="/finance/invoices" element={<Invoices />} />
          <Route path="/finance/bills" element={<Bills />} />
          <Route path="/finance/payments-received" element={<PaymentsReceived />} />
          <Route path="/finance/payments-made" element={<PaymentsMade />} />
          <Route path="/finance/bank-accounts" element={<BankAccounts />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
