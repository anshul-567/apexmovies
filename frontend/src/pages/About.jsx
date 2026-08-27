import { useNavigate } from 'react-router-dom';

const TECH_PILLARS = [
  {
    icon: '⚡',
    title: 'Atomic Multi-Seat Locking',
    desc: 'Powered by PostgreSQL ACID transactions with sub-second SELECT FOR UPDATE row-level locking, ensuring zero double bookings even under heavy blockbuster release traffic.',
  },
  {
    icon: '🎬',
    title: '4K Laser & IMAX Integration',
    desc: 'Direct venue projection sync across 57 partner theaters and 234 cinema screens throughout India for premium Dolby Atmos & IMAX experiences.',
  },
  {
    icon: '🎟️',
    title: 'Instant QR Gate Passes',
    desc: 'Paperless digital entry with dynamic encrypted QR codes, live ticket downloads in high-resolution PDF format, and real-time validation.',
  },
  {
    icon: '🛡️',
    title: 'Zero-Latency Checkout',
    desc: 'Seamless UPI, RuPay, and card processing with intelligent promo calculations, automated wallet refunds, and tokenized payments.',
  },
];

const STATS = [
  { label: 'Indian Cities', value: '47+' },
  { label: 'Cinema Screens', value: '230+' },
  { label: 'Active Shows Daily', value: '3,700+' },
  { label: 'Happy Cinephiles', value: '500,000+' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Our Vision</span>
        <h1 style={styles.heroTitle}>Revolutionizing the Indian Cinema Experience</h1>
        <p style={styles.heroSub}>
          ApexMovies is India's most advanced movie discovery and ticket booking platform. Built with cutting-edge engineering, real-time venue synchronization, and an obsessive focus on user experience.
        </p>
      </div>

      {/* Stats Counter */}
      <div style={styles.statsGrid}>
        {STATS.map((s, i) => (
          <div key={i} className="card" style={styles.statCard}>
            <div className="text-gradient" style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tech Pillars */}
      <div style={{ marginTop: 56 }}>
        <h2 style={styles.sectionTitle}>Engineered for Scale & Speed</h2>
        <p style={styles.sectionSub}>How our platform delivers instantaneous seat holds, seamless checkout, and unified theater management.</p>

        <div style={styles.techGrid}>
          {TECH_PILLARS.map((t, idx) => (
            <div key={idx} className="card" style={styles.techCard}>
              <div style={styles.techIcon}>{t.icon}</div>
              <h3 style={styles.techTitle}>{t.title}</h3>
              <p style={styles.techDesc}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission statement */}
      <div className="card" style={styles.missionCard}>
        <h3 style={styles.missionTitle}>Our Commitment to Cinephiles</h3>
        <p style={styles.missionText}>
          Whether you're booking first-day-first-show tickets in Mumbai, catching an IMAX screening in Bengaluru, or discovering indie cinema in Indore, ApexMovies makes the journey from trailer to theater seat effortless, transparent, and exhilarating.
        </p>
        <button className="btn-primary" style={styles.exploreBtn} onClick={() => navigate('/')}>
          Explore Current Releases →
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 1100, margin: '0 auto' },
  heroCard: {
    padding: '48px 40px', marginBottom: 40,
    background: 'linear-gradient(135deg, rgba(104,245,225,0.12) 0%, rgba(155,108,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(104,245,225,0.25)',
  },
  badge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-cyan)', background: 'rgba(104,245,225,0.12)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 14,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 14, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.65, maxWidth: 740 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginBottom: 48 },
  statCard: { padding: 24, textAlign: 'center', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  statValue: { fontSize: 32, fontWeight: 800, marginBottom: 6, fontFamily: 'Sora, sans-serif' },
  statLabel: { fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 24, fontWeight: 700, marginBottom: 8 },
  sectionSub: { fontSize: 14.5, color: 'var(--color-text-secondary)', marginBottom: 28, maxWidth: 640 },
  techGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 },
  techCard: { padding: 24, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  techIcon: { fontSize: 30, marginBottom: 14 },
  techTitle: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
  techDesc: { fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 },
  missionCard: { marginTop: 48, padding: 36, textAlign: 'center', background: 'var(--color-bg-elevated)' },
  missionTitle: { fontSize: 22, fontWeight: 700, marginBottom: 12 },
  missionText: { fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 700, margin: '0 auto 24px' },
  exploreBtn: { padding: '12px 28px', fontSize: 14, fontWeight: 700 },
};
