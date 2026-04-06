import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Organization {
  id: string;
  name: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
}

interface EntryRow {
  account_id: string;
  debit: string;
  credit: string;
}

interface LedgerEntry {
  id: string;
  account_id: string;
  debit: string;
  credit: string;
  account?: { id: string; name: string; type: string };
}

interface Transaction {
  id: string;
  description: string;
  date: string;
  organization_id: string;
  entries: LedgerEntry[];
}

const TYPE_STYLES: Record<string, { bg: string; color: string }> = {
  asset:     { bg: "#dcfce7", color: "#16a34a" },
  liability: { bg: "#fee2e2", color: "#dc2626" },
  income:    { bg: "#dbeafe", color: "#2563eb" },
  expense:   { bg: "#fef9c3", color: "#ca8a04" },
  equity:    { bg: "#f3e8ff", color: "#9333ea" },
};

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
  card: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "32px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "white",
    color: "#334155",
  },
  select: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "white",
    color: "#334155",
    cursor: "pointer",
  },
  row: { display: "flex", gap: "8px", alignItems: "center" },
  entryGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 110px 110px 42px",
    gap: "10px",
    alignItems: "center",
  },
  entryHeaderRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 110px 110px 42px",
    gap: "10px",
    alignItems: "end",
    padding: "0 4px",
  },
  amountInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "white",
    color: "#334155",
  },
  removeBtn: {
    padding: "6px 10px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "14px",
    flexShrink: 0,
  },
  addRowBtn: {
    padding: "8px 16px",
    backgroundColor: "white",
    color: "#6366f1",
    border: "1.5px dashed #a5b4fc",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
  },
  totalsRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "24px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    padding: "4px 0",
  },
  submitBtn: (disabled: boolean) => ({
    padding: "10px 24px",
    backgroundColor: disabled ? "#c7d2fe" : "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    width: "100%",
    fontSize: "15px",
  }),
  errorMsg: {
    fontSize: "13px",
    color: "#dc2626",
    textAlign: "center" as const,
  },
  sectionLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "12px",
  },
  txCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    marginBottom: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  txHeader: {
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #f1f5f9",
  },
  txDesc: { fontWeight: 600, color: "#1e293b", flex: 1, fontSize: "15px" },
  txDate: { fontSize: "12px", color: "#94a3b8", fontFamily: "monospace" },
  txEntryGrid: {
    padding: "10px 16px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 96px 88px 88px",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #f8fafc",
    fontSize: "14px",
  },
  txEntryHeaderGrid: {
    padding: "10px 16px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 96px 88px 88px",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  accountName: {
    minWidth: 0,
    color: "#334155",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  typeBadge: (type: string) => ({
    justifySelf: "start" as const,
    fontSize: "10px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "20px",
    textTransform: "capitalize" as const,
    backgroundColor: TYPE_STYLES[type]?.bg ?? "#f1f5f9",
    color: TYPE_STYLES[type]?.color ?? "#64748b",
  }),
  typePlaceholder: {
    fontSize: "12px",
    color: "#cbd5e1",
  },
  debitAmt: {
    width: "100%",
    textAlign: "right" as const,
    color: "#16a34a",
    fontWeight: 600,
    fontFamily: "monospace",
    fontSize: "13px",
  },
  creditAmt: {
    width: "100%",
    textAlign: "right" as const,
    color: "#dc2626",
    fontWeight: 600,
    fontFamily: "monospace",
    fontSize: "13px",
  },
  colLabel: {
    minWidth: "80px",
    textAlign: "right" as const,
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  txColLabelLeft: {
    width: "100%",
    textAlign: "left" as const,
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  txColLabelRight: {
    width: "100%",
    textAlign: "right" as const,
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  formColLabel: {
    width: "100%",
    textAlign: "left" as const,
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  formAmountColLabel: {
    width: "100%",
    textAlign: "center" as const,
    fontSize: "10px",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  emptyText: { color: "#94a3b8", textAlign: "center" as const },
};

const emptyEntry = (): EntryRow => ({ account_id: "", debit: "", credit: "" });

export default function Transactions() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");

  // Form state
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState<EntryRow[]>([emptyEntry(), emptyEntry()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // ── Data fetching ──────────────────────────────────────────────
  useEffect(() => {
    if (user?.id) {
      api.get("/organizations", { params: { user_id: user.id } }).then((res) => {
        setOrganizations(res.data);
        if (res.data.length > 0) setSelectedOrgId(res.data[0].id);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!selectedOrgId) return;
    api.get("/accounts", { params: { organization_id: selectedOrgId } }).then((res) =>
      setAccounts(res.data)
    );
    api.get("/transactions", { params: { organization_id: selectedOrgId } }).then((res) =>
      setTransactions(res.data)
    );
  }, [selectedOrgId]);

  // ── Entry helpers ──────────────────────────────────────────────
  const updateEntry = (i: number, field: keyof EntryRow, value: string) => {
    setEntries((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const addEntry = () => setEntries((prev) => [...prev, emptyEntry()]);

  const removeEntry = (i: number) =>
    setEntries((prev) => prev.filter((_, idx) => idx !== i));

  // ── Totals ─────────────────────────────────────────────────────
  const totalDebit = entries.reduce((s, e) => s + parseFloat(e.debit || "0"), 0);
  const totalCredit = entries.reduce((s, e) => s + parseFloat(e.credit || "0"), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;
  const hasEnoughEntries = entries.length >= 2;
  const canSubmit =
    isBalanced &&
    hasEnoughEntries &&
    totalDebit > 0 &&
    description.trim() &&
    date &&
    selectedOrgId &&
    entries.every((e) => e.account_id);

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setFormError("");
    if (!canSubmit) {
      if (!isBalanced) setFormError("Total debits must equal total credits.");
      else if (!hasEnoughEntries) setFormError("At least 2 entries are required.");
      else setFormError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/transactions", {
        organization_id: selectedOrgId,
        description,
        date,
        entries: entries.map((e) => ({
          account_id: e.account_id,
          debit: parseFloat(e.debit || "0"),
          credit: parseFloat(e.credit || "0"),
        })),
      });
      // Reset form
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      setEntries([emptyEntry(), emptyEntry()]);
      // Refresh list
      const res = await api.get("/transactions", {
        params: { organization_id: selectedOrgId },
      });
      setTransactions(res.data);
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? "Failed to create transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOrgName = organizations.find((o) => o.id === selectedOrgId)?.name ?? "";

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LEDGERFLOW</p>
        <h1 style={styles.moduleTitle}>Transactions</h1>
      </header>

      {/* ── Form card ── */}
      <div style={styles.card}>
        {/* Org selector */}
        <select
          style={styles.select}
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
        >
          <option value="">Select organization</option>
          {organizations.map((org) => (
            <option key={org.id} value={org.id}>{org.name}</option>
          ))}
        </select>

        {/* Description + Date */}
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            style={{ ...styles.input, flex: "0 0 150px" }}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Column headers */}
        <div style={styles.entryHeaderRow}>
          <div style={styles.formColLabel}>
            Account
          </div>
          <span style={styles.formAmountColLabel}>Debit</span>
          <span style={styles.formAmountColLabel}>Credit</span>
          <div />
        </div>

        {/* Entry rows */}
        {entries.map((entry, i) => (
          <div key={i} style={styles.entryGrid}>
            <select
              style={{ ...styles.select, width: "100%", minWidth: 0 }}
              value={entry.account_id}
              onChange={(e) => updateEntry(i, "account_id", e.target.value)}
            >
              <option value="">Select account...</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.type})
                </option>
              ))}
            </select>
            <input
              style={styles.amountInput}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={entry.debit}
              onChange={(e) => updateEntry(i, "debit", e.target.value)}
            />
            <input
              style={styles.amountInput}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={entry.credit}
              onChange={(e) => updateEntry(i, "credit", e.target.value)}
            />
            <button
              style={{ ...styles.removeBtn, width: "100%", padding: "10px 0" }}
              onClick={() => removeEntry(i)}
              disabled={entries.length <= 2}
              title="Remove entry"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Totals */}
        <div style={styles.totalsRow}>
          <span style={{ color: totalDebit > 0 && isBalanced ? "#16a34a" : "#64748b" }}>
            Debit: {totalDebit.toFixed(2)}
          </span>
          <span style={{ color: totalCredit > 0 && isBalanced ? "#16a34a" : "#64748b" }}>
            Credit: {totalCredit.toFixed(2)}
          </span>
          {totalDebit > 0 && totalCredit > 0 && (
            <span style={{ color: isBalanced ? "#16a34a" : "#dc2626" }}>
              {isBalanced ? "✓ Balanced" : "✗ Unbalanced"}
            </span>
          )}
        </div>

        <button style={styles.addRowBtn} onClick={addEntry}>
          + Add Entry Row
        </button>

        {formError && <p style={styles.errorMsg}>{formError}</p>}

        <button
          style={styles.submitBtn(!canSubmit || isSubmitting)}
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Transaction"}
        </button>
      </div>

      {/* ── Transactions list ── */}
      {selectedOrgName && (
        <p style={styles.sectionLabel}>
          {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} in {selectedOrgName}
        </p>
      )}

      {transactions.length === 0 ? (
        <p style={styles.emptyText}>
          {selectedOrgId ? "No transactions yet." : "Select an organization to view transactions."}
        </p>
      ) : (
        transactions.map((tx) => (
          <div key={tx.id} style={styles.txCard}>
            <div style={styles.txHeader}>
              <span style={styles.txDesc}>{tx.description}</span>
              <span style={styles.txDate}>{tx.date}</span>
            </div>

            {/* Column labels */}
            <div style={styles.txEntryHeaderGrid}>
              <span style={styles.txColLabelLeft}>Account</span>
              <span style={styles.txColLabelLeft}>Type</span>
              <span style={styles.txColLabelRight}>Debit</span>
              <span style={styles.txColLabelRight}>Credit</span>
            </div>

            {tx.entries?.map((entry) => (
              <div key={entry.id} style={styles.txEntryGrid}>
                <span style={styles.accountName}>
                  {entry.account?.name ?? "Unknown"}
                </span>
                {entry.account?.type && (
                  <span style={styles.typeBadge(entry.account.type)}>
                    {entry.account.type}
                  </span>
                )}
                {!entry.account?.type && <span style={styles.typePlaceholder}>-</span>}
                <span style={styles.debitAmt}>
                  {parseFloat(entry.debit) > 0 ? parseFloat(entry.debit).toFixed(2) : "—"}
                </span>
                <span style={styles.creditAmt}>
                  {parseFloat(entry.credit) > 0 ? parseFloat(entry.credit).toFixed(2) : "—"}
                </span>
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );
}
