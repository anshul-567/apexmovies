import { useState } from 'react';

const OFFICES = [
  { city: 'Mumbai HQ', address: 'Level 14, One BKC, G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051', phone: '+91 22 6123 4567' },
  { city: 'Bengaluru Tech Hub', address: 'Prestige Tech Park, Marathahalli-Sarjapur Outer Ring Road, Bengaluru, Karnataka 560103', phone: '+91 80 4765 4321' },
  { city: 'Indore Operations', address: 'Apex Towers, 5th Floor, Vijay Nagar Square, AB Road, Indore, Madhya Pradesh 452010', phone: '+91 731 298 7654' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', category: 'Booking Support', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={styles.page}>
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Get In Touch</span>
        <h1 style={styles.heroTitle}>Contact ApexMovies Support</h1>
        <p style={styles.heroSub}>
          Have a question about your booking, theater partnerships, or feedback? Our team is available 24/7 to assist you.
        </p>
      </div>

      <div style={styles.layout}>
        {/* Left: Contact Info & Offices */}
        <div style={styles.infoCol}>
          <div className="card" style={styles.contactMethodsCard}>
            <h3 style={styles.infoTitle}>Direct Channels</h3>

            <div style={styles.methodItem}>
              <div style={styles.methodIcon}>🎟️</div>
              <div>
                <div style={styles.methodLabel}>Booking & Ticket Assistance</div>
                <div style={styles.methodValue}>support@apexmovies.in</div>
                <div style={styles.methodSub}>Available 24/7 with under 15 min response time</div>
              </div>
            </div>

            <div style={styles.methodItem}>
              <div style={styles.methodIcon}>🤝</div>
              <div>
                <div style={styles.methodLabel}>Theater Partnerships & Listings</div>
                <div style={styles.methodValue}>partners@apexmovies.in</div>
                <div style={styles.methodSub}>For cinema owners, multiplex chains & distributors</div>
              </div>
            </div>

            <div style={styles.methodItem}>
              <div style={styles.methodIcon}>📞</div>
              <div>
                <div style={styles.methodLabel}>Toll-Free Customer Hotline</div>
                <div style={styles.methodValue}>1800-209-2739</div>
                <div style={styles.methodSub}>Lines open daily 09:00 AM – 11:00 PM IST</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ ...styles.infoTitle, marginBottom: 14 }}>Our Offices</h3>
            <div style={styles.officesList}>
              {OFFICES.map((off, idx) => (
                <div key={idx} className="card" style={styles.officeCard}>
                  <h4 style={styles.officeCity}>📍 {off.city}</h4>
                  <p style={styles.officeAddress}>{off.address}</p>
                  <div style={styles.officePhone}>☎ {off.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div style={styles.formCol}>
          <div className="card" style={styles.formCard}>
            {submitted ? (
              <div style={styles.successState}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>✉️</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message Dispatched!</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.5, marginBottom: 20 }}>
                  Thank you for reaching out, {formData.name}. We've received your query regarding <strong>{formData.category}</strong> and an agent will reply to <strong>{formData.email}</strong> shortly.
                </p>
                <button className="btn-ghost" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={styles.formTitle}>Send Us a Message</h3>
                <p style={styles.formSub}>We typically respond within 1-2 hours.</p>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
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
                    placeholder="ananya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Query Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.input}
                  >
                    <option value="Booking Support">Booking Support & QR Ticket</option>
                    <option value="Refund Request">Refund / Cancellation Query</option>
                    <option value="Offer / Promo Code">Discount Offer & Promo Code</option>
                    <option value="Theater Partnership">Theater Partnership</option>
                    <option value="Feedback / Suggestion">Feedback & Feature Request</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of your issue or request"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Message Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide as much context as possible (including Booking Reference ID if applicable)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ ...styles.input, resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '13px 0', fontSize: 14, fontWeight: 700 }}>
                  Send Message →
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
    background: 'linear-gradient(135deg, rgba(104,245,225,0.12) 0%, rgba(155,108,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(104,245,225,0.25)',
  },
  badge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-cyan)', background: 'rgba(104,245,225,0.12)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 14,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 14, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 680 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'flex-start' },
  infoCol: {},
  contactMethodsCard: { padding: 28, display: 'flex', flexDirection: 'column', gap: 20 },
  infoTitle: { fontSize: 18, fontWeight: 700, margin: 0 },
  methodItem: { display: 'flex', gap: 16, alignItems: 'flex-start' },
  methodIcon: { fontSize: 24 },
  methodLabel: { fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 2 },
  methodValue: { fontSize: 15, fontWeight: 700, color: 'var(--color-cyan)', marginBottom: 2, fontFamily: 'Space Mono, monospace' },
  methodSub: { fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 },
  officesList: { display: 'flex', flexDirection: 'column', gap: 14 },
  officeCard: { padding: 18, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  officeCity: { fontSize: 15, fontWeight: 700, margin: '0 0 6px' },
  officeAddress: { fontSize: 12.5, color: 'var(--color-text-muted)', lineHeight: 1.4, margin: '0 0 6px' },
  officePhone: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' },
  formCol: {},
  formCard: { padding: 32, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' },
  formTitle: { fontSize: 20, fontWeight: 700, marginBottom: 6 },
  formSub: { fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' },
  input: { padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 13.5 },
  successState: { textAlign: 'center', padding: '24px 12px' },
};
