import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Vendor {
  id: string;
  name: string;
}

interface Bill {
  id: string;
  bill_number: string;
  vendor_id: string;
  bill_date: string;
  due_date: string;
  total_amount: number;
  amount_paid: number;
  status: string;
  Vendor?: Vendor;
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
  statusBadge: (status: string) => ({
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    backgroundColor: status === "paid" ? "#dcfce7" : status === "overdue" ? "#fee2e2" : "#fef3c7",
    color: status === "paid" ? "#166534" : status === "overdue" ? "#991b1b" : "#92400e",
  }),
};

export default function BillsPage() {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [billNumber, setBillNumber] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
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
      fetchBills();
      fetchVendors();
    }
  }, [selectedOrgId]);

  const fetchBills = async () => {
    try {
      const res = await api.get("/finance/bills", { params: { organization_id: selectedOrgId } });
      setBills(res.data);
    } catch (error) {
      console.error("Failed to fetch bills", error);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await api.get("/finance/vendors", { params: { organization_id: selectedOrgId } });
      setVendors(res.data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    }
  };

  const handleCreateBill = async () => {
    setError("");
    if (!vendorId || !billDate || !dueDate || !totalAmount || !selectedOrgId) {
      setError("All fields are required. Please select a vendor from the dropdown.");
      return;
    }

    try {
      await api.post("/finance/bills", {
        vendor_id: vendorId,
        bill_date: billDate,
        due_date: dueDate,
        total_amount: parseFloat(totalAmount),
        subtotal: parseFloat(totalAmount),
        organization_id: selectedOrgId,
      });
      setVendorId("");
      setBillDate("");
      setDueDate("");
      setTotalAmount("");
      fetchBills();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create bill");
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  return (
    <>
      <header style={styles.headerSection}>
        <p style={styles.brand}>LEDGERFLOW</p>
        <h1 style={styles.moduleTitle}>Bills</h1>
      </header>

      <div style={styles.card}>
        {error && <div style={styles.errorBox}>{error}</div>}

        <select style={styles.input} value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}>
          <option value="">Select an organization</option>
          {organizations.map((org) => (<option key={org.id} value={org.id}>{org.name}</option>))}
        </select>

        <select style={styles.input} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
          <option value="">Select a Vendor (Required)</option>
          {vendors.map((vendor) => (<option key={vendor.id} value={vendor.id}>{vendor.name}</option>))}
        </select>
        {vendors.length === 0 && selectedOrgId && (
          <p style={{ fontSize: "12px", color: "#f59e0b", margin: "0 0 10px" }}>⚠️ No vendors found. Please add a vendor first.</p>
        )}

        <div style={styles.inputRow}>
          <input style={{ ...styles.input, marginBottom: 0 }} type="date" placeholder="Bill Date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
          <input style={{ ...styles.input, marginBottom: 0 }} type="date" placeholder="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>

        <input style={styles.input} type="number" placeholder="Total Amount (₹)" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />

        <button style={styles.button} onClick={handleCreateBill} disabled={!vendorId || !selectedOrgId}>
          Add Bill
        </button>
      </div>

      {bills.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Bill #</th>
              <th style={styles.tableHeader}>Vendor</th>
              <th style={styles.tableHeader}>Bill Date</th>
              <th style={styles.tableHeader}>Due Date</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Paid</th>
              <th style={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td style={styles.tableCell}>{bill.bill_number}</td>
                <td style={styles.tableCell}>{bill.Vendor?.name || "N/A"}</td>
                <td style={styles.tableCell}>{new Date(bill.bill_date).toLocaleDateString()}</td>
                <td style={styles.tableCell}>{new Date(bill.due_date).toLocaleDateString()}</td>
                <td style={styles.tableCell}>{formatCurrency(bill.total_amount)}</td>
                <td style={styles.tableCell}>{formatCurrency(bill.amount_paid)}</td>
                <td style={styles.tableCell}><span style={styles.statusBadge(bill.status)}>{bill.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.emptyText}>No bills yet. Create one to get started!</div>
      )}
    </>
  );
}
