import type { CSSProperties } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const colors = {
  bg: "#f7f8fa",
  surface: "#ffffff",
  border: "#e2e6ed",
  borderStrong: "#c8cdd6",
  text: "#0f1623",
  textMid: "#3d4757",
  textMuted: "#7a8394",
  accent: "#1b4fd8",
  accentHover: "#1740b0",
  accentSoft: "#eef2ff",
  accentSoftBorder: "#c7d4fa",
  success: "#1a7f5a",
  successBg: "#edfaf4",
};

const fonts = {
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  sans: "'IBM Plex Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

function useHover() {
  const [isHovered, setIsHovered] = useState(false);

  return [
    isHovered,
    {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
  ] as const;
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: colors.bg,
    color: colors.text,
    fontFamily: fonts.sans,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(247, 248, 250, 0.96)",
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${colors.border}`,
  },
  navInner: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "0 24px",
    minHeight: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "baseline",
    gap: "2px",
    textDecoration: "none",
    userSelect: "none",
  },
  brandLedger: {
    fontFamily: fonts.mono,
    fontWeight: 700,
    fontSize: "17px",
    color: colors.text,
    letterSpacing: "-0.02em",
  },
  brandFlow: {
    fontFamily: fonts.mono,
    fontWeight: 400,
    fontSize: "17px",
    color: colors.accent,
  },
  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  buttonGhost: {
    display: "inline-block",
    textDecoration: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    border: "1px solid transparent",
    color: colors.textMid,
    fontWeight: 600,
    fontSize: "13px",
    transition: "background 0.12s, border-color 0.12s, color 0.12s",
  },
  buttonGhostHover: {
    background: colors.accentSoft,
    borderColor: colors.accentSoftBorder,
    color: colors.accent,
  },
  buttonSolid: {
    display: "inline-block",
    textDecoration: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    border: `1px solid ${colors.accent}`,
    background: colors.accent,
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "13px",
    transition: "background 0.12s, box-shadow 0.12s, transform 0.12s",
  },
  buttonSolidHover: {
    background: colors.accentHover,
    boxShadow: "0 6px 18px rgba(27, 79, 216, 0.22)",
    transform: "translateY(-1px)",
  },
  hero: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "72px 24px 64px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "40px",
    alignItems: "center",
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 10px",
    borderRadius: "999px",
    border: `1px solid ${colors.accentSoftBorder}`,
    background: colors.accentSoft,
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "22px",
  },
  eyebrowDot: {
    width: "6px",
    height: "6px",
    borderRadius: "999px",
    background: colors.accent,
  },
  heroTitle: {
    margin: "0 0 18px",
    fontSize: "clamp(34px, 5vw, 52px)",
    lineHeight: 1.08,
    letterSpacing: "-0.04em",
    fontWeight: 800,
  },
  heroAccent: {
    color: colors.accent,
  },
  heroCopy: {
    margin: "0 0 30px",
    maxWidth: "560px",
    fontSize: "16px",
    lineHeight: 1.7,
    color: colors.textMid,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
  },
  ledgerPanel: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 12px 36px rgba(15, 23, 42, 0.08)",
  },
  ledgerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "12px 18px",
    background: "#f0f2f7",
    borderBottom: `1px solid ${colors.border}`,
    fontFamily: fonts.mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: fonts.mono,
    fontSize: "12px",
  },
  th: {
    padding: "10px 18px",
    borderBottom: `1px solid ${colors.border}`,
    background: "#fafbfc",
    color: colors.textMuted,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textAlign: "left",
  },
  td: {
    padding: "10px 18px",
    borderBottom: "1px solid #f0f2f7",
    color: colors.textMid,
    verticalAlign: "top",
  },
  tdRight: {
    textAlign: "right",
  },
  valueDebit: {
    color: "#c0392b",
    fontWeight: 700,
  },
  valueCredit: {
    color: colors.success,
    fontWeight: 700,
  },
  ledgerFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "12px 18px",
    background: "#fafbfc",
    borderTop: `1px solid ${colors.border}`,
    flexWrap: "wrap",
  },
  footerLabel: {
    fontFamily: fonts.mono,
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: colors.textMuted,
  },
  footerValue: {
    fontFamily: fonts.mono,
    fontSize: "12px",
    fontWeight: 700,
  },
  chip: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #a7e3cc",
    background: colors.successBg,
    color: colors.success,
    fontFamily: fonts.mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  metrics: {
    background: colors.surface,
    borderTop: `1px solid ${colors.border}`,
    borderBottom: `1px solid ${colors.border}`,
  },
  metricsInner: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  },
  metric: {
    padding: "28px 20px",
    borderRight: `1px solid ${colors.border}`,
    textAlign: "center",
  },
  metricValue: {
    marginBottom: "6px",
    fontFamily: fonts.mono,
    fontSize: "28px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  },
  metricLabel: {
    fontSize: "12px",
    color: colors.textMuted,
    letterSpacing: "0.04em",
  },
  section: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "72px 24px",
  },
  sectionLabel: {
    margin: "0 0 12px",
    fontFamily: fonts.mono,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: colors.accent,
  },
  sectionTitle: {
    margin: "0 0 40px",
    fontSize: "28px",
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: "12px",
    padding: "28px",
    transition: "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
  },
  featureCardHover: {
    borderColor: colors.accentSoftBorder,
    boxShadow: "0 12px 28px rgba(27, 79, 216, 0.08)",
    transform: "translateY(-2px)",
  },
  featureTag: {
    display: "inline-block",
    marginBottom: "16px",
    padding: "4px 8px",
    borderRadius: "6px",
    border: `1px solid ${colors.accentSoftBorder}`,
    background: colors.accentSoft,
    color: colors.accent,
    fontFamily: fonts.mono,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  featureRule: {
    width: "32px",
    height: "2px",
    background: colors.accent,
    border: "none",
    borderRadius: "999px",
    margin: "0 0 18px",
  },
  featureTitle: {
    margin: "0 0 10px",
    fontSize: "16px",
    fontWeight: 700,
    color: colors.text,
  },
  featureCopy: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.7,
    color: colors.textMid,
  },
  footer: {
    background: colors.surface,
    borderTop: `1px solid ${colors.border}`,
  },
  footerInner: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "28px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  footerBrand: {
    textDecoration: "none",
    color: colors.textMid,
    fontFamily: fonts.mono,
    fontWeight: 700,
    fontSize: "13px",
  },
  footerMeta: {
    fontFamily: fonts.mono,
    fontSize: "12px",
    color: colors.textMuted,
  },
};

const entries = [
  { date: "2025-06-01", account: "Accounts Receivable", ref: "INV-0041", debit: "12,400.00", credit: "" },
  { date: "2025-06-01", account: "Revenue", ref: "INV-0041", debit: "", credit: "12,400.00" },
  { date: "2025-06-02", account: "Cash", ref: "PMT-0078", debit: "12,400.00", credit: "" },
  { date: "2025-06-02", account: "Accounts Receivable", ref: "PMT-0078", debit: "", credit: "12,400.00" },
];

const metrics = [
  { value: "99.9%", label: "Ledger Accuracy Rate" },
  { value: "$2.4B+", label: "Transactions Processed" },
  { value: "ISO 27001", label: "Security Certified" },
  { value: "SOC 2", label: "Type II Compliant" },
];

const features = [
  {
    tag: "Core Accounting",
    title: "Double-entry ledger engine",
    copy:
      "Every transaction posts a debit and credit pair. LedgerFlow protects journal integrity at write time so unbalanced entries never land in the system.",
  },
  {
    tag: "Reporting",
    title: "Real-time financial visibility",
    copy:
      "Review live balances, transactions, and reconciliation-ready records without waiting for manual exports or period-end consolidation.",
  },
  {
    tag: "Controls",
    title: "Audit-ready operational trail",
    copy:
      "Track reference IDs, posting activity, and role boundaries in one place so finance teams can move faster without losing control.",
  },
];

function NavButton({
  to,
  children,
  solid = false,
}: {
  to: string;
  children: string;
  solid?: boolean;
}) {
  const [isHovered, hoverHandlers] = useHover();

  return (
    <Link
      to={to}
      style={{
        ...(solid ? styles.buttonSolid : styles.buttonGhost),
        ...(isHovered
          ? solid
            ? styles.buttonSolidHover
            : styles.buttonGhostHover
          : {}),
      }}
      {...hoverHandlers}
    >
      {children}
    </Link>
  );
}

function FeatureCard({
  tag,
  title,
  copy,
}: {
  tag: string;
  title: string;
  copy: string;
}) {
  const [isHovered, hoverHandlers] = useHover();

  return (
    <article
      style={{
        ...styles.featureCard,
        ...(isHovered ? styles.featureCardHover : {}),
      }}
      {...hoverHandlers}
    >
      <span style={styles.featureTag}>{tag}</span>
      <hr style={styles.featureRule} />
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureCopy}>{copy}</p>
    </article>
  );
}

export default function Home() {
  return (
    <div style={styles.page}>
      <nav style={styles.nav} aria-label="Primary navigation">
        <div style={styles.navInner}>
          <Link to="/" style={styles.brand} aria-label="LedgerFlow home">
            <span style={styles.brandLedger}>Ledger</span>
            <span style={styles.brandFlow}>Flow</span>
          </Link>

          <div style={styles.navActions}>
            <NavButton to="/signin">Sign In</NavButton>
            <NavButton to="/signup" solid>
              Sign Up
            </NavButton>
          </div>
        </div>
      </nav>

      <section style={styles.hero} aria-labelledby="home-hero-heading">
        <div>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowDot} />
            Double-entry accounting platform
          </div>

          <h1 id="home-hero-heading" style={styles.heroTitle}>
            The <span style={styles.heroAccent}>ledger</span> your finance team can trust.
          </h1>

          <p style={styles.heroCopy}>
            LedgerFlow gives teams a formal, reliable workspace for organizations,
            users, accounts, and transactions, with structure that feels production-ready
            from day one.
          </p>

          <div style={styles.heroActions}>
            <NavButton to="/signup" solid>
              Start Free Trial
            </NavButton>
            <NavButton to="/signin">Sign In to Workspace</NavButton>
          </div>
        </div>

        <div style={styles.ledgerPanel} role="img" aria-label="Sample balanced general ledger">
          <div style={styles.ledgerHeader}>General Ledger | June 2025</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Account / Memo</th>
                <th style={{ ...styles.th, ...styles.tdRight }}>Debit</th>
                <th style={{ ...styles.th, ...styles.tdRight }}>Credit</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={`${entry.date}-${entry.account}-${entry.ref}`}>
                  <td style={styles.td}>{entry.date}</td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 700, color: colors.text }}>{entry.account}</div>
                    <div style={{ fontSize: "10px", color: colors.textMuted }}>{entry.ref}</div>
                  </td>
                  <td style={{ ...styles.td, ...styles.tdRight }}>
                    {entry.debit ? <span style={styles.valueDebit}>{entry.debit}</span> : null}
                  </td>
                  <td style={{ ...styles.td, ...styles.tdRight }}>
                    {entry.credit ? <span style={styles.valueCredit}>{entry.credit}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.ledgerFooter}>
            <div>
              <div style={styles.footerLabel}>Closing Balance</div>
              <div style={styles.footerValue}>$0.00</div>
            </div>
            <span style={styles.chip}>Balanced</span>
          </div>
        </div>
      </section>

      <section style={styles.metrics} aria-label="Key platform metrics">
        <div style={styles.metricsInner}>
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              style={{
                ...styles.metric,
                ...(index === metrics.length - 1 ? { borderRight: "none" } : {}),
              }}
            >
              <div style={styles.metricValue}>{metric.value}</div>
              <div style={styles.metricLabel}>{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section} aria-labelledby="home-features-heading">
        <p style={styles.sectionLabel}>Built for finance teams</p>
        <h2 id="home-features-heading" style={styles.sectionTitle}>
          Accounting-grade workflow, without the visual noise.
        </h2>

        <div style={styles.featureGrid}>
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              tag={feature.tag}
              title={feature.title}
              copy={feature.copy}
            />
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <Link to="/" style={styles.footerBrand}>
            LedgerFlow
          </Link>
          <span style={styles.footerMeta}>
            (c) {new Date().getFullYear()} LedgerFlow Inc. All rights reserved.
          </span>
          <span style={styles.footerMeta}>SOC 2 | ISO 27001 | GDPR</span>
        </div>
      </footer>
    </div>
  );
}
