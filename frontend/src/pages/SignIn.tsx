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

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      // Call signin API
      const response = await api.post("/auth/signin", {
        email: formData.email,
        password: formData.password,
      });

      // Use AuthContext login method
      login(response.data.token, response.data.user);

      // Redirect to organizations
      navigate("/organizations");
    } catch (err: any) {
      setError("Invalid credentials, try again");
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
        <section style={styles.panel} aria-labelledby="signin-heading">
          <p style={styles.eyebrow}>LedgerFlow Access</p>
          <h1 id="signin-heading" style={styles.title}>
            Sign in to your workspace
          </h1>
          <p style={styles.copy}>
            Welcome back! Sign in with your email and password to access your financial
            management dashboard.
          </p>

          <form 
            style={styles.form} 
            onSubmit={handleSubmit}
            onReset={(e) => e.preventDefault()}
          >
            <label style={styles.label}>
              Work email
              <input
                style={styles.input}
                type="text"
                name="email"
                placeholder="finance@company.com"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            {error && <div style={styles.errorMessage}>{error}</div>}

            <button style={styles.primaryButton} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <Link to="/signup" style={styles.secondaryLink}>
            Need an account? Create one
          </Link>
        </section>
      </div>
    </main>
  );
}

