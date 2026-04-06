import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  total_amount: number;
  amount_paid: number;
  Customer?: { id: string; name: string };
}

interface BankAccount {
  id: string;
  account_name: string;
  bank_name: string;
  balance: number;
}

interface PaymentReceived {
  id: string;
  invoice_id: string;
  customer_id: string;
  bank_account_id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference_number: string;
  Invoice?: { id: string; invoice_number: string; total_amount: number };
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
  infoBox: { padding: "12px", marginBottom: "12px", backgroundColor: "#dcfce7", borderRadius: "6px", color: "#166534", fontSize: "14px" },
};

const PAYMENT_METHODS = ["cash", "check", "credit_card", "bank_transfer", "other"];

export default function PaymentsReceivedPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentReceived[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
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
      fetchInvoices();
      fetchBankAccounts();
    }
  }, [selectedOrgId]);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/finance/payments-received", { params: { organization_id: selectedOrgId } });
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/finance/invoices", { params: { organization_id: selectedOrgId } });
      // Filter invoices that are not fully paid
      setInvoices(res.data.filter((inv: Invoice) => parseFloat(String(inv.amount_paid)) < parseFloat(String(inv.total_amount))));
    } catch (error) {
      console.error("Failed to fetch invoices", error);
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

  const selectedInvoice = invoices.find(inv => inv.id === invoiceId);
  const selectedBankAccount = bankAccounts.find(ba => ba.id === bankAccountId);
  const remainingAmount = selectedInvoice ? parseFloat(String(selectedInvoice.total_amount)) - parseFloat(String(selectedInvoice.amount_paid)) : 0;

  const handleCreatePayment = async () => {
    setError("");
    setSuccess("");

    if (!invoiceId || !bankAccountId || !paymentDate || !amount || !paymentMethod || !selectedOrgId) {
      setError("All fields are required. Please select an invoice and bank account.");
      return;
    }

    if (parseFloat(amount) > remainingAmount) {
      setError(`Payment amount (₹${amount}) exceeds remaining invoice amount (₹${remainingAmount.toFixed(2)})`);
      return;
    }

    try {
      await api.post("/finance/payments-received", {
        invoice_id: invoiceId,
        customer_id: selectedInvoice?.customer_id,
        bank_account_id: bankAccountId,
        payment_date: paymentDate,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        reference_number: referenceNumber,
        organization_id: selectedOrgId,
      });
      setInvoiceId("");
      setBankAccountId("");
      setPaymentDate("");
      setAmount("");
      setReferenceNumber("");
      setSuccess("Payment received successfully! Bank account balance updated.");
      fetchPayments();
      fetchInvoices();
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
        <h1 style={styles.moduleTitle}>Payments Received</h1>
      </header>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}

        <select style={styles.input} value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}>
          <option value="">Select an organization</option>
          {organizations.map((org) => (<option key={org.id} value={org.id}>{org.name}</option>))}
        </select>

        <select style={styles.input} value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
          <option value="">Select an Invoice (Required)</option>
          {invoices.map((invoice) => (
            <option key={invoice.id} value={invoice.id}>
              {invoice.invoice_number} | {invoice.Customer?.name || "Unknown Customer"} | {formatCurrency(parseFloat(String(invoice.total_amount)) - parseFloat(String(invoice.amount_paid)))}
            </option>
          ))}
        </select>
        {invoices.length === 0 && selectedOrgId && (
          <p style={{ fontSize: "12px", color: "#f59e0b", margin: "0 0 10px" }}>⚠️ No unpaid invoices found. Please create an invoice first.</p>
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

        {selectedInvoice && selectedBankAccount && (
          <div style={styles.infoBox}>
            <strong>Payment Summary:</strong><br />
            Invoice: {selectedInvoice.invoice_number} | Remaining: {formatCurrency(remainingAmount)}<br />
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

        <button style={styles.button} onClick={handleCreatePayment} disabled={!invoiceId || !bankAccountId || !amount || !selectedOrgId}>
          Record Payment
        </button>
      </div>

      {payments.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Invoice #</th>
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
                <td style={styles.tableCell}>{payment.Invoice?.invoice_number || "N/A"}</td>
                <td style={styles.tableCell}>{payment.BankAccount?.account_name || "N/A"}</td>
                <td style={{ ...styles.tableCell, color: "#16a34a", fontWeight: 600 }}>+{formatCurrency(payment.amount)}</td>
                <td style={styles.tableCell}>{payment.payment_method.replace("_", " ").toUpperCase()}</td>
                <td style={styles.tableCell}>{payment.reference_number || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.emptyText}>No payments received yet.</div>
      )}
    </>
  );
}
