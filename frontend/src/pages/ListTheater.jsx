import { useState } from 'react';

const PARTNER_BENEFITS = [
  { icon: '📊', title: 'Real-time Occupancy Analytics', desc: 'Monitor live seat booking velocity, average ticket price realization, and screen performance in real time.' },
  { icon: '⚡', title: 'Zero-Latency Seat Locking', desc: 'Direct integration with our high-concurrency transactional engine prevents double bookings and seat contention.' },
  { icon: '💳', title: 'Instant Daily Payouts', desc: 'Automated direct-to-bank settlements with low transaction fees and automated GST invoicing.' },
  { icon: '🎟️', title: 'Dynamic Pricing & Promo Engine', desc: 'Create custom weekend discounts, happy hour matinee pricing, and snack combo bundles with 1 click.' },
];

export default function ListTheater() {
  const [formData, setFormData] = useState({
    theaterName: '',
    city: '',
    screensCount: '3',
    contactPerson: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={styles.page}>
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Partner With Us</span>
        <h1 style={styles.heroTitle}>List Your Cinema on ApexMovies</h1>
        <p style={styles.heroSub}>
          Connect your screens to over 500,000 active moviegoers across India. Modernize your ticketing with zero upfront hardware costs and sub-second digital check-ins.
        </p>
      </div>

      <div style={styles.layout}>
        {/* Left: Benefits */}
        <div style={styles.benefitsCol}>
          <h2 style={styles.colTitle}>Why Cinema Owners Choose ApexMovies</h2>
          <div style={styles.benefitsList}>
            {PARTNER_BENEFITS.map((b, i) => (
              <div key={i} className="card" style={styles.benefitCard}>
                <div style={styles.benefitIcon}>{b.icon}</div>
                <div>
                  <h4 style={styles.benefitTitle}>{b.title}</h4>
                  <p style={styles.benefitDesc}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Partner Onboarding Form */}
        <div style={styles.formCol}>
          <div className="card" style={styles.formCard}>
            {submitted ? (
              <div style={styles.successBox}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🤝</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Inquiry Submitted!</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                  Thank you for your interest in partnering with ApexMovies. Our Cinema Onboarding team will contact you at <strong>{formData.phone || formData.email}</strong> within 24 hours to initiate system integration.
                </p>
                <button className="btn-ghost" onClick={() => setSubmitted(false)}>
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={styles.formHeader}>Register Your Theater</h3>
                <p style={styles.formSub}>Fill in your venue details for an instant callback.</p>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Cinema / Multiplex Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CineGrand Multiplex"
                    value={formData.theaterName}
                    onChange={(e) => setFormData({ ...formData, theaterName: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bhopal, Indore"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ ...styles.inputGroup, width: 120 }}>
                    <label style={styles.label}>Screens *</label>
                    <select
                      value={formData.screensCount}
                      onChange={(e) => setFormData({ ...formData, screensCount: e.target.value })}
                      style={styles.input}
                    >
                      <option value="1">1 Screen</option>
                      <option value="2">2 Screens</option>
                      <option value="3">3 Screens</option>
                      <option value="4">4 Screens</option>
                      <option value="6">6+ Screens</option>
                    </select>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Joshi (General Manager)"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 91234 567891"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="manager@theater.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Additional Details / Current Ticketing Software</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your screen configurations (IMAX, Dolby Atmos, 4K) or existing ticketing provider..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ ...styles.input, resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={styles.submitBtn}>
                  Submit Partner Application →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 1180, margin: '0 auto' },
  heroCard: {
    padding: '48px 40px', marginBottom: 48,
    background: 'linear-gradient(135deg, rgba(104,245,225,0.12) 0%, rgba(68,85,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(104,245,225,0.25)',
  },
  badge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-cyan)', background: 'rgba(104,245,225,0.12)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 14,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 14, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 700 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'flex-start' },
  benefitsCol: { display: 'flex', flexDirection: 'column' },
  colTitle: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  benefitsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  benefitCard: { padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', background: 'var(--color-bg-surface)' },
  benefitIcon: { fontSize: 26 },
  benefitTitle: { fontSize: 15, fontWeight: 700, marginBottom: 4 },
  benefitDesc: { fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 },
  formCol: {},
  formCard: { padding: 32, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' },
  formHeader: { fontSize: 20, fontWeight: 700, marginBottom: 6 },
  formSub: { fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  row: { display: 'flex', gap: 12 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' },
  input: { padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 13.5 },
  submitBtn: { width: '100%', padding: '13px 0', fontSize: 14, fontWeight: 700, marginTop: 8 },
  successBox: { textAlign: 'center', padding: '24px 12px' },
};
