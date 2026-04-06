import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Organization {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  organization_id: string;
}

const styles = {
  welcomeText: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#1e293b",
    margin: "0 0 16px",
  },
  brand: {
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    color: "#6366f1",
    margin: 0,
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: 800,
    color: "#1e293b",
    marginTop: "4px",
    marginBottom: "0",
  },
  moduleTitle: {
    fontSize: "32px",
    fontWeight: 800,
    color: "#1e293b",
    marginTop: "0px",
    marginBottom: "0",
  },
  headerSection: { marginBottom: "32px" },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginBottom: "32px",
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  inputRow: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "white",
  },
  select: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "white",
    color: "#334155",
    cursor: "pointer",
  },
  button: {
    padding: "10px 24px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    alignSelf: "flex-end" as const,
    width: "100%",
  },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "10px",
    marginBottom: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#e0e7ff",
    color: "#6366f1",
    fontWeight: 700,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userInfo: { display: "flex", flexDirection: "column" as const, gap: "2px" },
  userName: { fontWeight: 600, color: "#1e293b", fontSize: "15px" },
  userEmail: { fontSize: "13px", color: "#64748b" },
  idBadge: {
    fontSize: "10px",
    color: "#94a3b8",
    marginLeft: "auto",
    fontFamily: "monospace",
  },
  emptyText: { color: "#94a3b8", textAlign: "center" as const },
  sectionLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
};

export default function Users() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrganizations = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get("/organizations", { params: { user_id: user.id } });
      setOrganizations(res.data);
      if (res.data.length > 0) {
        setSelectedOrgId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    }
  };

  const fetchUsers = async (orgId: string) => {
    try {
      const res = await api.get("/users", {
        params: { organization_id: orgId },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const createUser = async () => {
    if (!name.trim() || !email.trim() || !selectedOrgId) return;
    setIsSubmitting(true);
    try {
      await api.post("/users", {
        name,
        email,
        organization_id: selectedOrgId,
      });
      setName("");
      setEmail("");
      fetchUsers(selectedOrgId);
    } catch (err) {
      console.error("Failed to create user", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [user]);

  useEffect(() => {
    if (selectedOrgId) fetchUsers(selectedOrgId);
  }, [selectedOrgId]);

  const selectedOrgName =
    organizations.find((o) => o.id === selectedOrgId)?.name ?? "";

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LEDGERFLOW</p>
        <h1 style={styles.moduleTitle}>Users</h1>
      </header>

      <div style={styles.inputGroup}>
        {/* Org selector */}
        <select
          style={styles.select}
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
        >
          <option value="">Select organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        {/* Name + Email row */}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Full name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createUser()}
          />
          <input
            style={styles.input}
            placeholder="Email address..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createUser()}
          />
        </div>

        <button
          onClick={createUser}
          disabled={isSubmitting || !selectedOrgId}
          style={{
            ...styles.button,
            opacity: isSubmitting || !selectedOrgId ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </div>

      {selectedOrgName && (
        <p style={styles.sectionLabel}>
          {users.length} user{users.length !== 1 ? "s" : ""} in{" "}
          {selectedOrgName}
        </p>
      )}

      <ul style={styles.list}>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id} style={styles.listItem}>
              <div style={styles.avatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userEmail}>{user.email}</span>
              </div>
              <span style={styles.idBadge}>ID: {user.id.slice(0, 8)}</span>
            </li>
          ))
        ) : (
          <p style={styles.emptyText}>
            {selectedOrgId
              ? "No users in this organization."
              : "Select an organization to view users."}
          </p>
        )}
      </ul>
    </>
  );
}