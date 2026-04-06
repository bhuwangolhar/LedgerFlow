import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  branch_address: string;
  city: string;
  state: string;
  balance: number;
  is_active: boolean;
  organization_id: string;
}

interface IFSCData {
  BANK: string;
  BRANCH: string;
  ADDRESS: string;
  CITY: string;
  STATE: string;
  IFSC: string;
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
  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
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
  fetchButton: {
    padding: "10px 16px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
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
  balanceCell: {
    padding: "12px",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: 600,
  },
  emptyText: { color: "#94a3b8", textAlign: "center" as const, padding: "20px" },
  bankInfo: {
    backgroundColor: "#dbeafe",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "14px",
  },
  errorBox: {
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#fee2e2",
    border: "1px solid #fca5a5",
    borderRadius: "6px",
    color: "#991b1b",
    fontSize: "14px",
  },
  successBox: {
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: "6px",
    color: "#166534",
    fontSize: "14px",
  },
};

export default function BankAccountsPage() {
  const { user } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [securityPin, setSecurityPin] = useState("");
  const [bankInfo, setBankInfo] = useState<IFSCData | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [pinDialogAccountId, setPinDialogAccountId] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [modalBalance, setModalBalance] = useState<number | null>(null);

  const handleViewBalance = async () => {
    if (!pinDialogAccountId || !enteredPin) return;
    
    try {
      const res = await api.post(`/finance/bank-accounts/${pinDialogAccountId}/verify-pin`, {
        security_pin: enteredPin
      });
      setModalBalance(res.data.balance);
      setEnteredPin("");
      setPinError("");
    } catch (error: any) {
      setPinError(error.response?.data?.message || "Invalid PIN");
    }
  };

  const closeBalanceModal = () => {
    setPinDialogAccountId(null);
    setEnteredPin("");
    setPinError("");
    setModalBalance(null);
  };

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
      fetchBankAccounts();
    }
  }, [selectedOrgId]);

  const fetchBankAccounts = async () => {
    try {
      const res = await api.get("/finance/bank-accounts", {
        params: { organization_id: selectedOrgId },
      });
      setBankAccounts(res.data);
    } catch (error) {
      console.error("Failed to fetch bank accounts", error);
    }
  };

  const fetchIFSCDetails = async () => {
    if (!ifscCode || ifscCode.length !== 11) {
      setError("Please enter a valid 11-character IFSC code");
      return;
    }

    setLoading(true);
    setError("");
    setBankInfo(null);

    try {
      // Using Razorpay's public IFSC API (free and no auth required)
      const response = await fetch(`https://ifsc.razorpay.com/${ifscCode.toUpperCase()}`);
      
      if (!response.ok) {
        throw new Error("Invalid IFSC code or bank not found");
      }

      const data = await response.json();
      setBankInfo(data);
      setSuccess("Bank details fetched successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError("Invalid IFSC code or unable to fetch bank details. Please verify the IFSC code.");
      setBankInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBankAccount = async () => {
    setError("");
    setSuccess("");

    if (!accountName || !accountNumber || !ifscCode || !selectedOrgId) {
      setError("Account name, account number, and IFSC code are required");
      return;
    }

    if (!securityPin || !/^\d{5}$/.test(securityPin)) {
      setError("Security PIN must be exactly 5 digits");
      return;
    }

    try {
      const payload = {
        account_name: accountName,
        account_number: accountNumber,
        ifsc_code: ifscCode.toUpperCase(),
        bank_name: bankInfo?.BANK || "",
        branch_name: bankInfo?.BRANCH || "",
        branch_address: bankInfo?.ADDRESS || "",
        city: bankInfo?.CITY || "",
        state: bankInfo?.STATE || "",
        balance: parseFloat(initialBalance) || 0,
        organization_id: selectedOrgId,
        security_pin: securityPin,
      };

      await api.post("/finance/bank-accounts", payload);

      setAccountName("");
      setAccountNumber("");
      setIfscCode("");
      setInitialBalance("");
      setSecurityPin("");
      setBankInfo(null);
      setSuccess("Bank account added successfully!");
      fetchBankAccounts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      setError(`Error: ${errorMessage}`);
    }
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(balance);
  };

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LEDGERFLOW</p>
        <h1 style={styles.moduleTitle}>Bank Accounts</h1>
      </header>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

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
          placeholder="Account Name (e.g., Main Business Account)"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <div style={styles.inputRow}>
          <input
            style={{ ...styles.input, marginBottom: 0, flex: 1 }}
            placeholder="IFSC Code (e.g., SBIN0001234)"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
            maxLength={11}
          />
          <button
            style={styles.fetchButton}
            onClick={fetchIFSCDetails}
            disabled={loading || ifscCode.length !== 11}
          >
            {loading ? "Fetching..." : "Fetch Bank Info"}
          </button>
        </div>

        {bankInfo && (
          <div style={styles.bankInfo}>
            <strong>🏦 {bankInfo.BANK}</strong>
            <br />
            <span>Branch: {bankInfo.BRANCH}</span>
            <br />
            <span>
              {bankInfo.CITY}, {bankInfo.STATE}
            </span>
            <br />
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {bankInfo.ADDRESS}
            </span>
          </div>
        )}

        <input
          style={styles.input}
          placeholder="Initial Balance (₹) - Default: 0"
          type="number"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Security PIN (5 digits) - Required for viewing balance"
          type="password"
          maxLength={5}
          value={securityPin}
          onChange={(e) => setSecurityPin(e.target.value.replace(/\D/g, ""))}
        />
        <p style={{ fontSize: "12px", color: "#f59e0b", margin: "-8px 0 10px" }}>
          ⚠️ Remember this PIN! It cannot be reset or recovered.
        </p>

        <button
          style={styles.button}
          onClick={handleCreateBankAccount}
          disabled={!accountName || !accountNumber || !ifscCode || !selectedOrgId || !/^\d{5}$/.test(securityPin)}
        >
          Add Bank Account
        </button>
      </div>

      {/* PIN Entry Dialog */}
      {pinDialogAccountId && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            minWidth: "320px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}>
            {modalBalance !== null ? (
              <>
                <h3 style={{ margin: "0 0 16px", color: "#1e293b" }}>💰 Account Balance</h3>
                <div style={{
                  padding: "20px",
                  backgroundColor: "#f0fdf4",
                  borderRadius: "8px",
                  textAlign: "center",
                  marginBottom: "16px",
                }}>
                  <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>Current Balance</p>
                  <p style={{
                    margin: "8px 0 0",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: modalBalance >= 0 ? "#16a34a" : "#dc2626",
                  }}>
                    {formatBalance(modalBalance)}
                  </p>
                </div>
                <button
                  style={{ ...styles.button, width: "100%" }}
                  onClick={closeBalanceModal}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h3 style={{ margin: "0 0 16px", color: "#1e293b" }}>🔐 Enter Security PIN</h3>
                {pinError && <div style={styles.errorBox}>{pinError}</div>}
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter 5-digit PIN"
                  maxLength={5}
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  <button
                    style={{ ...styles.button, flex: 1 }}
                    onClick={handleViewBalance}
                    disabled={enteredPin.length !== 5}
                  >
                    View Balance
                  </button>
                  <button
                    style={{ ...styles.button, flex: 1, backgroundColor: "#94a3b8" }}
                    onClick={closeBalanceModal}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {bankAccounts.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={styles.tableHeader}>Account Name</th>
              <th style={styles.tableHeader}>Account Number</th>
              <th style={styles.tableHeader}>Bank</th>
              <th style={styles.tableHeader}>Branch</th>
              <th style={styles.tableHeader}>IFSC</th>
              <th style={styles.tableHeader}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {bankAccounts.map((account) => (
              <tr key={account.id}>
                <td style={styles.tableCell}>{account.account_name}</td>
                <td style={styles.tableCell}>********{account.account_number.slice(-4)}</td>
                <td style={styles.tableCell}>{account.bank_name || "N/A"}</td>
                <td style={styles.tableCell}>{account.branch_name || "N/A"}</td>
                <td style={styles.tableCell}>{account.ifsc_code}</td>
                <td style={styles.tableCell}>
                  <button
                    onClick={() => setPinDialogAccountId(account.id)}
                    style={{
                      background: "none",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    title="View Balance"
                  >
                    🔐 View Balance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.emptyText}>
          No bank accounts yet. Add one to get started!
        </div>
      )}
    </>
  );
}
