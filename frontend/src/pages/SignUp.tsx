import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'IBM Plex Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative" as const,
  },
  backLink: {
    position: "absolute" as const,
    top: "24px",
    right: "24px",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 600,
    fontSize: "14px",
  },
  shell: {
    width: "100%",
    maxWidth: "460px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    alignItems: "stretch",
  },
  panel: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
    padding: "32px",
  },
  eyebrow: {
    margin: "0 0 12px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#1b4fd8",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "34px",
    lineHeight: 1.1,
    color: "#0f172a",
    letterSpacing: "-0.03em",
  },
  copy: {
    margin: "0 0 24px",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#475569",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  label: {
    display: "grid",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#0f172a",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  primaryButton: {
    display: "inline-block",
    textAlign: "center" as const,
    textDecoration: "none",
    backgroundColor: "#1b4fd8",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "12px 18px",
    fontWeight: 700,
    border: "1px solid #1b4fd8",
    marginTop: "6px",
    cursor: "pointer",
  },
  secondaryLink: {
    display: "inline-block",
    textDecoration: "none",
    color: "#1b4fd8",
    fontWeight: 600,
    marginTop: "16px",
  },
  note: {
    margin: "18px 0 0",
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#64748b",
  },
  cardTitle: {
    margin: "0 0 14px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
  },
  list: {
    margin: 0,
    paddingLeft: "18px",
    color: "#475569",
    lineHeight: 1.8,
    fontSize: "14px",
  },
  workspaceLink: {
    display: "inline-block",
    marginTop: "22px",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 700,
  },
  errorMessage: {
    color: "#dc2626",
    fontSize: "13px",
    marginTop: "4px",
  },
};

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone || !formData.company_name || !formData.password || !formData.confirmPassword) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Call signup API
      const response = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        company_name: formData.company_name,
      });

      // Use AuthContext login method
      login(response.data.token, response.data.user);

      // Redirect to organizations
      navigate("/organizations");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <Link to="/" style={styles.backLink}>
        ← Back to homepage
      </Link>
      <div style={styles.shell}>
        <section style={styles.panel} aria-labelledby="signup-heading">
          <p style={styles.eyebrow}>LedgerFlow Onboarding</p>
          <h1 id="signup-heading" style={styles.title}>
            Create your LedgerFlow account
          </h1>
          <p style={styles.copy}>
            Join LedgerFlow to manage your accounts and transactions efficiently with our
            intuitive platform.
          </p>

          <form style={styles.form} onSubmit={handleSubmit}>
            <label style={styles.label}>
              Full name
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Aarav Sharma"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            <label style={styles.label}>
              Work email
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="finance@company.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label style={styles.label}>
              Phone
              <input
                style={styles.input}
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </label>

            <label style={styles.label}>
              Company
              <input
                style={styles.input}
                type="text"
                name="company_name"
                placeholder="LedgerFlow Labs"
                autoComplete="organization"
                value={formData.company_name}
                onChange={handleChange}
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <label style={styles.label}>
              Confirm Password
              <input
                style={styles.input}
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button style={styles.primaryButton} type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <Link to="/signin" style={styles.secondaryLink}>
            Already have an account? Sign in
          </Link>
        </section>
      </div>
    </main>
  );
}

