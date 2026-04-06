import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Vendor {
  id: string;
  vendor_no: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  organization_id: string;
}

const styles = {
  brand: {
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
    color: "#6366f1",
    margin: 0,
  },
  moduleTitle: {
    fontSize: "32px",
    fontWeight: 800,
    color: "#1e293b",
    marginTop: "0px",
    marginBottom: "0",
  },
  headerSection: { marginBottom: "32px" },
  card: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "20px",
    boxSizing: "border-box" as const,
  },
  input: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
    outline: "none" as const,
    marginBottom: "10px",
    boxSizing: "border-box" as const,
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
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "20px",
  },
  tableHeader: {
    backgroundColor: "#f1f5f9",
    padding: "12px",
    textAlign: "left" as const,
    fontWeight: 600,
    color: "#334155",
    borderBottom: "1px solid #e2e8f0",
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
  },
  emptyText: { color: "#94a3b8", textAlign: "center" as const, padding: "20px" },
  errorBox: {
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#fee2e2",
    border: "1px solid #fca5a5",
    borderRadius: "6px",
    color: "#991b1b",
    fontSize: "14px",
  },
};

export default function VendorsPage() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      api.get("/organizations", { params: { user_id: user.id } }).then((res) => {
        setOrganizations(res.data);
        if (res.data.length > 0) setSelectedOrgId(res.data[0].id);
      });
    }
  }, [user]);

  useEffect(() => {
    if (selectedOrgId) {
      fetchVendors();
    }
  }, [selectedOrgId]);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/finance/vendors", {
        params: { organization_id: selectedOrgId },
      });
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    }
  };

  const handleCreateVendor = async () => {
    setError("");
    if (!name || !selectedOrgId) return;

    try {
      const payload = {
        name,
        email,
        phone,
        organization_id: selectedOrgId,
      };

      await api.post("/finance/vendors", payload);
      setName("");
      setEmail("");
      setPhone("");
      fetchVendors();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      setError(`Error: ${errorMessage}`);
    }
  };

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LEDGERFLOW</p>
        <h1 style={styles.moduleTitle}>Vendors</h1>
      </header>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <select
          style={styles.input}
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
        >
          <option value="">Select an organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          placeholder="Vendor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleCreateVendor}
          disabled={!name || !selectedOrgId}
        >
          Add Vendor
        </button>
      </div>

      {vendors.length > 0 ? (
        <table style={{ ...styles.table, tableLayout: "fixed" as const }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ ...styles.tableHeader, width: "25%" }}>Vendor No</th>
              <th style={{ ...styles.tableHeader, width: "25%" }}>Name</th>
              <th style={{ ...styles.tableHeader, width: "25%" }}>Email</th>
              <th style={{ ...styles.tableHeader, width: "25%" }}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td style={styles.tableCell}>{vendor.vendor_no || "N/A"}</td>
                <td style={styles.tableCell}>{vendor.name}</td>
                <td style={styles.tableCell}>{vendor.email || "N/A"}</td>
                <td style={styles.tableCell}>{vendor.phone || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.emptyText}>No vendors yet. Create one to get started!</div>
      )}
    </>
  );
}
