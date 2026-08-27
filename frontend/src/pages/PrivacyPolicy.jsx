export default function PrivacyPolicy() {
  return (
    <div style={styles.page}>
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Privacy & Trust</span>
        <h1 style={styles.heroTitle}>Privacy Policy</h1>
        <p style={styles.heroSub}>Last updated: August 2026. Learn how ApexMovies protects and secures your personal information.</p>
      </div>

      <div style={styles.content}>
        <div className="card" style={styles.sectionCard}>
          <h2 style={styles.sectionHeading}>1. Information We Collect</h2>
          <p style={styles.p}>
            When you create an account or book tickets on ApexMovies, we collect the necessary details to fulfill your cinema reservation:
          </p>
          <ul style={styles.ul}>
            <li><strong>Account Information:</strong> Your name, email address, and encrypted authentication credentials.</li>
            <li><strong>Booking & Transaction History:</strong> Movie titles, theater locations, seats booked, payment reference IDs, and applied promo codes.</li>
            <li><strong>Device & Location Data:</strong> IP address, browser type, and selected city preference (used to surface local theater showtimes).</li>
          </ul>

          <h2 style={styles.sectionHeading}>2. How We Protect Your Financial Data</h2>
          <p style={styles.p}>
            ApexMovies never stores raw credit card numbers, CVVs, or UPI PINs on our servers. All financial transactions are processed through RBI-authorized payment gateways using 256-bit TLS encryption and PCI-DSS Level 1 compliant tokenization.
          </p>

          <h2 style={styles.sectionHeading}>3. How We Use Your Information</h2>
          <p style={styles.p}>
            Your data is used solely to:
          </p>
          <ul style={styles.ul}>
            <li>Issue encrypted QR tickets and verify admission at cinema turnstiles.</li>
            <li>Send critical transactional alerts (booking confirmation, showtime reminders, cancellation notices).</li>
            <li>Detect and prevent fraudulent scalping and bot abuse.</li>
          </ul>

          <h2 style={styles.sectionHeading}>4. Data Sharing & Third Parties</h2>
          <p style={styles.p}>
            We do not sell, rent, or trade your personal information to marketing brokers. We share your booking reference and seat numbers solely with the specific cinema venue hosting your screening to facilitate admission.
          </p>

          <h2 style={styles.sectionHeading}>5. Data Protection Officer (DPO) Contact</h2>
          <p style={styles.p}>
            If you have questions regarding data access, account deletion, or our compliance with India's Digital Personal Data Protection (DPDP) Act, you can contact our Data Protection Officer at:
          </p>
          <div style={styles.dpoBox}>
            <div><strong>Data Protection Officer</strong> — ApexMovies India Pvt. Ltd.</div>
            <div style={{ color: 'var(--color-cyan)', marginTop: 4 }}>privacy@apexmovies.in</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 4 }}>One BKC, G Block, Bandra Kurla Complex, Mumbai, MH 400051</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 960, margin: '0 auto' },
  heroCard: {
    padding: '40px', marginBottom: 40,
    background: 'linear-gradient(135deg, rgba(104,245,225,0.12) 0%, rgba(68,85,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(104,245,225,0.25)',
  },
  badge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-cyan)', background: 'rgba(104,245,225,0.12)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 12,
  },
  heroTitle: { fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 15.5, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 640 },
  content: { display: 'flex', flexDirection: 'column', gap: 24 },
  sectionCard: { padding: 36, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  sectionHeading: { fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10, color: 'var(--color-text-primary)' },
  p: { fontSize: 14.5, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 14 },
  ul: { paddingLeft: 22, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 14 },
  dpoBox: {
    marginTop: 12, padding: 18, background: 'rgba(255,255,255,0.03)',
    borderRadius: 10, border: '1px solid var(--color-border)', fontSize: 14,
  },
};
