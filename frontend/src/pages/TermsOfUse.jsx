export default function TermsOfUse() {
  return (
    <div style={styles.page}>
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Legal Agreement</span>
        <h1 style={styles.heroTitle}>Terms of Use</h1>
        <p style={styles.heroSub}>Last updated: August 2026. Please read these terms carefully before booking tickets on ApexMovies.</p>
      </div>

      <div style={styles.content}>
        <div className="card" style={styles.sectionCard}>
          <h2 style={styles.sectionHeading}>1. Acceptance of Terms</h2>
          <p style={styles.p}>
            By accessing or using the ApexMovies website, mobile applications, or ticket booking APIs, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 style={styles.sectionHeading}>2. Seat Locking & Booking Confirmation</h2>
          <p style={styles.p}>
            When initiating a ticket purchase, selected seats are held for a maximum of 5 minutes under a temporary database lock. If payment confirmation is not received within the lock window, the seats will automatically return to the open availability pool. A booking is legally confirmed only upon issuance of a unique ApexMovies Booking Reference ID (e.g. APX-XXXXXX).
          </p>

          <h2 style={styles.sectionHeading}>3. Age Ratings & Cinema Entry</h2>
          <p style={styles.p}>
            Admission to cinema auditoriums is governed by the Central Board of Film Certification (CBFC) ratings in India:
          </p>
          <ul style={styles.ul}>
            <li><strong>'U' / 'UA' Rated Movies:</strong> Unrestricted public exhibition / parental guidance for children under 12.</li>
            <li><strong>'A' Rated Movies:</strong> Strictly restricted to adults aged 18 and above. Cinema staff reserve the right to verify government-issued photo ID (Aadhaar / Driving License / Passport) at the venue gates.</li>
          </ul>

          <h2 style={styles.sectionHeading}>4. Ticket Resale & Misuse</h2>
          <p style={styles.p}>
            Tickets purchased on ApexMovies are for personal, non-commercial entertainment only. Reselling tickets above face value (scalping), reverse-engineering ticketing endpoints, or automated bot scraping is strictly prohibited and will result in immediate account termination.
          </p>

          <h2 style={styles.sectionHeading}>5. Governing Law & Jurisdiction</h2>
          <p style={styles.p}>
            These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 960, margin: '0 auto' },
  heroCard: {
    padding: '40px', marginBottom: 40,
    background: 'linear-gradient(135deg, rgba(68,85,255,0.12) 0%, rgba(155,108,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(68,85,255,0.25)',
  },
  badge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-blue)', background: 'rgba(68,85,255,0.15)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 12,
  },
  heroTitle: { fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 640 },
  content: { display: 'flex', flexDirection: 'column', gap: 24 },
  sectionCard: { padding: 36, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  sectionHeading: { fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 10, color: 'var(--color-text-primary)' },
  p: { fontSize: 14.5, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 14 },
  ul: { paddingLeft: 22, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 14 },
};
