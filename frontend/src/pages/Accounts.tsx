import { useEffect, useState } from "react";
import api from "../api/axios";

interface Organization {
  id: string;
  name: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
  organization_id: string;
}

const ACCOUNT_TYPES = ["asset", "liability", "income", "expense", "equity"];

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  asset:     { bg: "#dcfce7", color: "#16a34a" },
  liability: { bg: "#fee2e2", color: "#dc2626" },
  income:    { bg: "#dbeafe", color: "#2563eb" },
  expense:   { bg: "#fef9c3", color: "#ca8a04" },
  equity:    { bg: "#f3e8ff", color: "#9333ea" },
};

const styles = {
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
    color: "#334155",
  },
  select: {
    flex: 1,
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
  typeBadge: (type: string) => ({
    fontSize: "11px",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "20px",
    textTransform: "capitalize" as const,
    letterSpacing: "0.03em",
    backgroundColor: TYPE_STYLES[type]?.bg ?? "#f1f5f9",
    color: TYPE_STYLES[type]?.color ?? "#64748b",
  }),
  accountName: { fontWeight: 500, color: "#1e293b", flex: 1 },
  idBadge: {
    fontSize: "10px",
    color: "#94a3b8",
    marginLeft: "auto",
    fontFamily: "monospace",
  },
  sectionLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
  emptyText: { color: "#94a3b8", textAlign: "center" as const },
};

export default function Accounts() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("asset");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get("/organizations");
      setOrganizations(res.data);
      if (res.data.length > 0) setSelectedOrgId(res.data[0].id);
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    }
  };

  const fetchAccounts = async (orgId: string) => {
    try {
      const res = await api.get("/accounts", {
        params: { organization_id: orgId },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    }
  };

  const createAccount = async () => {
    if (!name.trim() || !selectedOrgId) return;
    setIsSubmitting(true);
    try {
      await api.post("/accounts", {
        name,
        type,
        organization_id: selectedOrgId,
      });
      setName("");
      setType("asset");
      fetchAccounts(selectedOrgId);
    } catch (err) {
      console.error("Failed to create account", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrgId) fetchAccounts(selectedOrgId);
  }, [selectedOrgId]);

  const selectedOrgName = organizations.find((o) => o.id === selectedOrgId)?.name ?? "";

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LedgerFlow</p>
        <h1 style={styles.pageTitle}>Accounts</h1>
      </header>

      <div style={styles.inputGroup}>
        {/* Organization selector */}
        <select
          style={styles.select}
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
        >
          {organizations.length === 0 && (
            <option value="">No organizations found</option>
          )}
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        {/* Name + Type row */}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Account name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createAccount()}
          />
          <select
            style={{ ...styles.select, flex: "0 0 160px" }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {ACCOUNT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={createAccount}
          disabled={isSubmitting || !selectedOrgId}
          style={{
            ...styles.button,
            opacity: isSubmitting || !selectedOrgId ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </div>

      {selectedOrgName && (
        <p style={styles.sectionLabel}>
          {accounts.length} account{accounts.length !== 1 ? "s" : ""} in {selectedOrgName}
        </p>
      )}

      <ul style={styles.list}>
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <li key={account.id} style={styles.listItem}>
              <span style={styles.accountName}>{account.name}</span>
              <span style={styles.typeBadge(account.type)}>{account.type}</span>
              <span style={styles.idBadge}>ID: {account.id.slice(0, 8)}</span>
            </li>
          ))
        ) : (
          <p style={styles.emptyText}>
            {selectedOrgId ? "No accounts in this organization." : "Select an organization to view accounts."}
          </p>
        )}
      </ul>
    </>
  );
}