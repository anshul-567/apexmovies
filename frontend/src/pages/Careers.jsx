import { useState } from 'react';

const OPEN_ROLES = [
  {
    id: 'fs-eng',
    title: 'Senior Full Stack Engineer',
    team: 'Core Platform & Seat Locking',
    location: 'Bengaluru / Remote (India)',
    type: 'Full-time',
    exp: '3-6 Years',
    desc: 'Architect high-throughput PostgreSQL transaction pipelines, real-time ticket hold engines, and microservices powering millions of concurrent moviegoers.',
  },
  {
    id: 'prod-des',
    title: 'Senior Product Designer (UI/UX)',
    team: 'Consumer Experience',
    location: 'Mumbai / Hybrid',
    type: 'Full-time',
    exp: '3-5 Years',
    desc: 'Shape the next generation of cinema apps. Create world-class interactive seat maps, dark-mode design systems, and rapid checkout flows.',
  },
  {
    id: 'ops-lead',
    title: 'Theater Partner Operations Lead',
    team: 'Venue Growth & Integrations',
    location: 'Delhi NCR / Indore',
    type: 'Full-time',
    exp: '2-4 Years',
    desc: 'Partner with top cinema chains (PVR, INOX, Cinepolis, SPI) to expand screen integrations and ensure flawless showtime metadata sync.',
  },
  {
    id: 'devops-sre',
    title: 'DevOps & Site Reliability Engineer',
    team: 'Infrastructure',
    location: 'Remote (India)',
    type: 'Full-time',
    exp: '4+ Years',
    desc: 'Maintain 99.99% uptime during blockbuster release traffic spikes with scalable Kubernetes clusters, distributed caching, and zero-downtime rollouts.',
  },
];

const PERKS = [
  { icon: '🎟️', title: 'Unlimited Cinema Passes', desc: 'Free movie tickets for you and your family across any partner theater in India.' },
  { icon: '💻', title: 'Top-tier Work Gear', desc: 'Latest Apple M-series MacBook Pro, 4K monitors, and generous home-office setup stipends.' },
  { icon: '🏥', title: 'Comprehensive Health Cover', desc: '₹10 Lakh family health insurance including OPD, dental, and mental wellness benefits.' },
  { icon: '🌴', title: 'Flexible Time Off', desc: 'Generous paid vacation, flexible hybrid work hours, and recharge holidays.' },
];

export default function Careers() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', portfolio: '', resumeNotes: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={styles.page}>
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Join Our Team</span>
        <h1 style={styles.heroTitle}>Build the Future of Entertainment</h1>
        <p style={styles.heroSub}>
          We're a team of passionate engineers, designers, and cinema lovers building the next generation of ticketing infrastructure in India.
        </p>
      </div>

      {/* Perks */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Perks & Benefits</h2>
        <span style={styles.sectionNote}>Built for personal and professional growth</span>
      </div>

      <div style={styles.perksGrid}>
        {PERKS.map((p, i) => (
          <div key={i} className="card" style={styles.perkCard}>
            <div style={styles.perkIcon}>{p.icon}</div>
            <h4 style={styles.perkTitle}>{p.title}</h4>
            <p style={styles.perkDesc}>{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Open Roles */}
      <div style={{ marginTop: 56 }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Open Positions ({OPEN_ROLES.length})</h2>
          <span style={styles.sectionNote}>Find your next adventure</span>
        </div>

        <div style={styles.rolesList}>
          {OPEN_ROLES.map((role) => (
            <div key={role.id} className="card" style={styles.roleCard}>
              <div style={{ flex: 1 }}>
                <div style={styles.roleHeader}>
                  <h3 style={styles.roleTitle}>{role.title}</h3>
                  <span style={styles.teamBadge}>{role.team}</span>
                </div>
                <div style={styles.roleMeta}>
                  <span>📍 {role.location}</span>
                  <span>•</span>
                  <span>💼 {role.type}</span>
                  <span>•</span>
                  <span>⏳ {role.exp}</span>
                </div>
                <p style={styles.roleDesc}>{role.desc}</p>
              </div>

              <button
                className="btn-primary"
                style={styles.applyBtn}
                onClick={() => {
                  setSelectedRole(role);
                  setSubmitted(false);
                }}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {selectedRole && (
        <div style={styles.modalOverlay} onClick={() => setSelectedRole(null)}>
          <div className="card" style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>Apply: {selectedRole.title}</h3>
                <span style={styles.modalSub}>{selectedRole.team} · {selectedRole.location}</span>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelectedRole(null)}>✕</button>
            </div>

            {submitted ? (
              <div style={styles.successState}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Application Received!</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
                  Thanks for applying, {formData.name || 'there'}. Our talent team will review your profile and reach out within 48 hours.
                </p>
                <button className="btn-ghost" style={{ marginTop: 20 }} onClick={() => setSelectedRole(null)}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>LinkedIn / GitHub / Portfolio URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/in/..."
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Why are you excited about ApexMovies?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself and what you love about cinema & engineering..."
                    value={formData.resumeNotes}
                    onChange={(e) => setFormData({ ...formData, resumeNotes: e.target.value })}
                    style={{ ...styles.input, resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px 0', fontWeight: 700 }}>
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 1100, margin: '0 auto' },
  heroCard: {
    padding: '48px 40px', marginBottom: 48,
    background: 'linear-gradient(135deg, rgba(68,85,255,0.15) 0%, rgba(155,108,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(68,85,255,0.3)',
  },
  badge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-blue)', background: 'rgba(68,85,255,0.15)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 14,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 14, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 680 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 700 },
  sectionNote: { fontSize: 13, color: 'var(--color-text-muted)' },
  perksGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
  perkCard: { padding: 22, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  perkIcon: { fontSize: 28, marginBottom: 10 },
  perkTitle: { fontSize: 15, fontWeight: 700, marginBottom: 6 },
  perkDesc: { fontSize: 12.5, color: 'var(--color-text-muted)', lineHeight: 1.5 },
  rolesList: { display: 'flex', flexDirection: 'column', gap: 16 },
  roleCard: { padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  roleHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' },
  roleTitle: { fontSize: 17, fontWeight: 700, margin: 0 },
  teamBadge: { fontSize: 11, fontWeight: 700, background: 'rgba(104,245,225,0.1)', color: 'var(--color-cyan)', padding: '3px 8px', borderRadius: 6 },
  roleMeta: { display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--color-text-muted)', marginBottom: 8, flexWrap: 'wrap' },
  roleDesc: { fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 640 },
  applyBtn: { padding: '10px 22px', fontSize: 13.5, fontWeight: 700, flexShrink: 0 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 },
  modalCard: { maxWidth: 520, width: '100%', padding: 32, position: 'relative', background: '#18181A', border: '1px solid var(--color-border)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 700, margin: '0 0 4px' },
  modalSub: { fontSize: 12.5, color: 'var(--color-text-muted)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 18, cursor: 'pointer', padding: 4 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' },
  input: { padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 13.5 },
  successState: { textAlign: 'center', padding: '24px 12px' },
};
