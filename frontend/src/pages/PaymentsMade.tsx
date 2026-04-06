import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Bill {
  id: string;
  bill_number: string;
  vendor_id: string;
  total_amount: number;
  amount_paid: number;
  Vendor?: { id: string; name: string };
}

interface BankAccount {
  id: string;
  account_name: string;
  bank_name: string;
  balance: number;
}

interface PaymentMade {
  id: string;
  bill_id: string;
  vendor_id: string;
  bank_account_id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference_number: string;
  Bill?: { id: string; bill_number: string; total_amount: number };
  BankAccount?: { id: string; account_name: string; bank_name: string };
}

const styles = {
  brand: { fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const, color: "#6366f1", margin: 0 },
  moduleTitle: { fontSize: "32px", fontWeight: 800, color: "#1e293b", marginTop: "0px", marginBottom: "0" },
  headerSection: { marginBottom: "32px" },
  card: { background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "20px", boxSizing: "border-box" as const },
  input: { width: "100%", padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "16px", outline: "none" as const, marginBottom: "10px", boxSizing: "border-box" as const },
  inputRow: { display: "flex", gap: "10px", marginBottom: "10px" },
  button: { padding: "10px 24px", backgroundColor: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" as const, marginTop: "20px" },
  tableHeader: { backgroundColor: "#f1f5f9", padding: "12px", textAlign: "left" as const, fontWeight: 600, color: "#334155", borderBottom: "1px solid #e2e8f0" },
  tableCell: { padding: "12px", borderBottom: "1px solid #e2e8f0", color: "#475569" },
  emptyText: { color: "#94a3b8", textAlign: "center" as const, padding: "20px" },
  errorBox: { padding: "12px", marginBottom: "12px", backgroundColor: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "6px", color: "#991b1b", fontSize: "14px" },
  successBox: { padding: "12px", marginBottom: "12px", backgroundColor: "#dcfce7", border: "1px solid #86efac", borderRadius: "6px", color: "#166534", fontSize: "14px" },
  infoBox: { padding: "12px", marginBottom: "12px", backgroundColor: "#dbeafe", borderRadius: "6px", color: "#1e40af", fontSize: "14px" },
};

const PAYMENT_METHODS = ["cash", "check", "credit_card", "bank_transfer", "other"];

export default function PaymentsMadePage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentMade[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [billId, setBillId] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      fetchPayments();
      fetchBills();
      fetchBankAccounts();
    }
  }, [selectedOrgId]);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/finance/payments-made", { params: { organization_id: selectedOrgId } });
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await api.get("/finance/bills", { params: { organization_id: selectedOrgId } });
      // Filter bills that are not fully paid
      setBills(res.data.filter((bill: Bill) => parseFloat(String(bill.amount_paid)) < parseFloat(String(bill.total_amount))));
    } catch (error) {
      console.error("Failed to fetch bills", error);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const res = await api.get("/finance/bank-accounts", { params: { organization_id: selectedOrgId } });
      setBankAccounts(res.data);
    } catch (error) {
      console.error("Failed to fetch bank accounts", error);
    }
  };

  const selectedBill = bills.find(b => b.id === billId);
  const selectedBankAccount = bankAccounts.find(ba => ba.id === bankAccountId);
  const remainingAmount = selectedBill ? parseFloat(String(selectedBill.total_amount)) - parseFloat(String(selectedBill.amount_paid)) : 0;

  const handleCreatePayment = async () => {
    setError("");
    setSuccess("");

    if (!billId || !bankAccountId || !paymentDate || !amount || !paymentMethod || !selectedOrgId) {
      setError("All fields are required. Please select a bill and bank account.");
      return;
    }

    if (parseFloat(amount) > remainingAmount) {
      setError(`Payment amount (₹${amount}) exceeds remaining bill amount (₹${remainingAmount.toFixed(2)})`);
      return;
    }

    try {
      await api.post("/finance/payments-made", {
        bill_id: billId,
        vendor_id: selectedBill?.vendor_id,
        bank_account_id: bankAccountId,
        payment_date: paymentDate,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        reference_number: referenceNumber,
        organization_id: selectedOrgId,
      });
      setBillId("");
      setBankAccountId("");
      setPaymentDate("");
      setAmount("");
      setReferenceNumber("");
      setSuccess("Payment recorded successfully! Bank account balance updated.");
      fetchPayments();
      fetchBills();
      fetchBankAccounts();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create payment");
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LEDGERFLOW</p>
        <h1 style={styles.moduleTitle}>Payments Made</h1>
      </header>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <select style={styles.input} value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}>
          <option value="">Select an organization</option>
          {organizations.map((org) => (<option key={org.id} value={org.id}>{org.name}</option>))}
        </select>

        <select style={styles.input} value={billId} onChange={(e) => setBillId(e.target.value)}>
          <option value="">Select a Bill (Required)</option>
          {bills.map((bill) => (
            <option key={bill.id} value={bill.id}>
              {bill.bill_number} | {bill.Vendor?.name || "Unknown Vendor"} | {formatCurrency(parseFloat(String(bill.total_amount)) - parseFloat(String(bill.amount_paid)))}
            </option>
          ))}
        </select>
        {bills.length === 0 && selectedOrgId && (
          <p style={{ fontSize: "12px", color: "#f59e0b", margin: "0 0 10px" }}>⚠️ No unpaid bills found. Please create a bill first.</p>
        )}

        <select style={styles.input} value={bankAccountId} onChange={(e) => setBankAccountId(e.target.value)}>
          <option value="">Select Bank Account (Required)</option>
          {bankAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.account_name} - {account.bank_name || "Bank"}
            </option>
          ))}
        </select>
        {bankAccounts.length === 0 && selectedOrgId && (
          <p style={{ fontSize: "12px", color: "#f59e0b", margin: "0 0 10px" }}>⚠️ No bank accounts found. Please add a bank account first.</p>
        )}

        {selectedBill && selectedBankAccount && (
          <div style={styles.infoBox}>
            <strong>Payment Summary:</strong><br />
            Bill: {selectedBill.bill_number} | Remaining: {formatCurrency(remainingAmount)}<br />
            Bank: {selectedBankAccount.account_name} | <a href="/finance/bank-accounts" style={{ color: "#6366f1", textDecoration: "none" }}>View Balance</a>
          </div>
        )}

        <input style={styles.input} type="date" placeholder="Payment Date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
        
        <div style={styles.inputRow}>
          <input style={{ ...styles.input, marginBottom: 0 }} type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select style={{ ...styles.input, marginBottom: 0 }} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map((method) => (<option key={method} value={method}>{method.replace("_", " ").toUpperCase()}</option>))}
          </select>
        </div>

        <input style={styles.input} placeholder="Reference Number (Optional)" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />

        <button style={styles.button} onClick={handleCreatePayment} disabled={!billId || !bankAccountId || !amount || !selectedOrgId}>
          Record Payment
        </button>
      </div>

      {payments.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Bill #</th>
              <th style={styles.tableHeader}>Bank Account</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Method</th>
              <th style={styles.tableHeader}>Reference</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td style={styles.tableCell}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td style={styles.tableCell}>{payment.Bill?.bill_number || "N/A"}</td>
                <td style={styles.tableCell}>{payment.BankAccount?.account_name || "N/A"}</td>
                <td style={{ ...styles.tableCell, color: "#dc2626", fontWeight: 600 }}>-{formatCurrency(payment.amount)}</td>
                <td style={styles.tableCell}>{payment.payment_method.replace("_", " ").toUpperCase()}</td>
                <td style={styles.tableCell}>{payment.reference_number || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.emptyText}>No payments made yet.</div>
      )}
    </>
  );
}
