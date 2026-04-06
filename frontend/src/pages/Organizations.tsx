import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Organization {
  id: string;
  name: string;
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
  inputGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "32px",
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  input: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "10px 24px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
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
  },
  idBadge: {
    fontSize: "10px",
    color: "#94a3b8",
    marginLeft: "auto",
    fontFamily: "monospace",
  },
  headerSection: { marginBottom: "32px" },
  emptyText: { color: "#94a3b8", textAlign: "center" as const },
};

export default function Organizations() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get("/organizations");
      setOrganizations(res.data);
    } catch (err) {
      // Error handled silently in production
    }
  };

  const createOrganization = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post("/organizations", { name });
      setName("");
      fetchOrganizations();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LEDGERFLOW</p>
        <h1 style={styles.moduleTitle}>Organizations</h1>
      </header>

      <div style={styles.inputGroup}>
        <input
          style={styles.input}
          placeholder="New organization name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createOrganization()}
        />
        <button
          onClick={createOrganization}
          disabled={isSubmitting}
          style={{
            ...styles.button,
            opacity: isSubmitting ? 0.7 : 1,
            transform: isSubmitting ? "scale(0.98)" : "scale(1)",
          }}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>

      <ul style={styles.list}>
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <li key={org.id} style={styles.listItem}>
              <span style={{ fontWeight: 500 }}>{org.name}</span>
              <span style={styles.idBadge}>ID: {org.id.slice(0, 8)}</span>
            </li>
          ))
        ) : (
          <p style={styles.emptyText}>No organizations found.</p>
        )}
      </ul>
    </>
  );
}