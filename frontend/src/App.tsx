import { useEffect, useState } from "react";
import api from "./api/axios";

interface Organization {
  id: string;
  name: string;
}

function App() {
  const [name, setName] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get("/organizations");
      setOrganizations(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
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

  // Simple inline styles for demonstration
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: "#334155",
    },
    headerSection: {
      marginBottom: "32px",
    },
    brand: {
      fontSize: "14px",
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase" as const,
      color: "#6366f1", // Modern indigo
      margin: 0,
    },
    pageTitle: {
      fontSize: "32px",
      fontWeight: 800,
      color: "#1e293b",
      marginTop: "4px",
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
      transition: "border-color 0.2s",
    },
    button: {
      padding: "10px 24px",
      backgroundColor: "#6366f1",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.2s, transform 0.1s",
    },
    list: {
      listStyle: "none",
      padding: 0,
    },
    listItem: {
      padding: "16px",
      backgroundColor: "white",
      borderRadius: "10px",
      marginBottom: "12px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      transition: "transform 0.2s ease",
    },
    idBadge: {
      fontSize: "10px",
      color: "#94a3b8",
      marginLeft: "auto",
      fontFamily: "monospace",
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Hierarchy */}
      <header style={styles.headerSection}>
        <h2 style={styles.brand}>LedgerFlow</h2>
        <h1 style={styles.pageTitle}>Organizations</h1>
      </header>

      {/* Dynamic Input Area */}
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
            transform: isSubmitting ? "scale(0.98)" : "scale(1)"
          }}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </div>

      {/* List Display */}
      <ul style={styles.list}>
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <li key={org.id} style={styles.listItem}>
              <span style={{ fontWeight: 500 }}>{org.name}</span>
              <span style={styles.idBadge}>ID: {org.id.slice(0, 8)}</span>
            </li>
          ))
        ) : (
          <p style={{ color: "#94a3b8", textAlign: "center" }}>No organizations found.</p>
        )}
      </ul>
    </div>
  );
}

export default App;