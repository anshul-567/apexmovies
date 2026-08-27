import { useNavigate } from 'react-router-dom';

const REFUND_TIMELINES = [
  { method: 'UPI (GPay / PhonePe / Paytm)', timeline: 'Instant to 2 Hours', note: 'Directly credited back to linked bank account' },
  { method: 'Credit / Debit Card (RuPay / Visa / Mastercard)', timeline: '2 to 5 Business Days', note: 'Depending on issuing bank settlement cycle' },
  { method: 'Net Banking', timeline: '2 to 4 Business Days', note: 'Credited directly to source account' },
  { method: 'Apex Wallet / Credits', timeline: 'Instantaneous (Within 1 min)', note: 'Available immediately for next booking' },
];

export default function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Customer Protection</span>
        <h1 style={styles.heroTitle}>Refund & Cancellation Policy</h1>
        <p style={styles.heroSub}>
          Transparent, hassle-free cancellations and prompt automated refunds for every movie ticket booked on ApexMovies.
        </p>
      </div>

      <div style={styles.content}>
        {/* Section 1: Cancellation Window */}
        <div className="card" style={styles.sectionCard}>
          <h2 style={styles.sectionHeading}>1. Ticket Cancellation Windows</h2>
          <p style={styles.p}>
            We understand plans change. You can cancel your movie tickets anytime up to <strong>2 hours prior to the scheduled showtime</strong> directly from your <a href="/bookings" style={{ color: 'var(--color-cyan)', textDecoration: 'underline' }}>My Bookings</a> dashboard.
          </p>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cancellation Timing</th>
                  <th style={styles.th}>Ticket Refund %</th>
                  <th style={styles.th}>Convenience Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>More than 2 hours before showtime</td>
                  <td style={{ ...styles.td, color: 'var(--color-cyan)', fontWeight: 700 }}>100% Base Ticket Refund</td>
                  <td style={styles.td}>Non-refundable gateway charge</td>
                </tr>
                <tr>
                  <td style={styles.td}>Less than 2 hours before showtime</td>
                  <td style={{ ...styles.td, color: 'var(--color-danger)' }}>Non-refundable (Seats locked for show)</td>
                  <td style={styles.td}>Non-refundable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Refund Turnaround Timelines */}
        <div className="card" style={styles.sectionCard}>
          <h2 style={styles.sectionHeading}>2. Refund Processing Timelines</h2>
          <p style={styles.p}>
            All refunds are initiated instantaneously by our payment engine. Depending on your original payment method, the funds will reflect in your account according to the following schedule:
          </p>
          <div style={styles.timelineGrid}>
            {REFUND_TIMELINES.map((t, idx) => (
              <div key={idx} style={styles.timelineItem}>
                <div style={styles.methodName}>{t.method}</div>
                <div style={styles.methodTime}>⚡ {t.timeline}</div>
                <div style={styles.methodNote}>{t.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Cinema Venue Cancellations */}
        <div className="card" style={styles.sectionCard}>
          <h2 style={styles.sectionHeading}>3. Theater Show Cancellations & Technical Glitches</h2>
          <p style={styles.p}>
            In the event that a cinema partner cancels a screening due to projector failure, technical disruption, or regional advisories:
          </p>
          <ul style={styles.ul}>
            <li>A <strong>100% full refund (including all convenience and booking fees)</strong> is automatically triggered to your original payment method.</li>
            <li>You will receive an automated SMS & Email confirmation with your refund transaction tracking ID.</li>
            <li>A complimentary <strong>20% discount coupon</strong> will be added to your account for your next booking.</li>
          </ul>
        </div>

        {/* Section 4: Assistance */}
        <div className="card" style={styles.helpBox}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>Need assistance with a refund?</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: 13.5 }}>
              Provide your Booking Reference ID to our dedicated 24/7 disputes resolution desk.
            </p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/contact')}>
            Contact Disputes Desk →
          </button>
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
  sectionCard: { padding: 32, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  sectionHeading: { fontSize: 20, fontWeight: 700, marginBottom: 12 },
  p: { fontSize: 14.5, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 16 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13.5, marginTop: 8 },
  th: { textAlign: 'left', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--color-border)', fontWeight: 700 },
  td: { padding: '12px 16px', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' },
  timelineGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginTop: 14 },
  timelineItem: { padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--color-border)' },
  methodName: { fontSize: 13.5, fontWeight: 700, marginBottom: 4 },
  methodTime: { fontSize: 13, color: 'var(--color-cyan)', fontWeight: 700, marginBottom: 4 },
  methodNote: { fontSize: 11.5, color: 'var(--color-text-muted)', lineHeight: 1.4 },
  ul: { paddingLeft: 20, color: 'var(--color-text-secondary)', fontSize: 14, lineHeight: 1.7 },
  helpBox: {
    padding: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'var(--color-bg-elevated)', flexWrap: 'wrap', gap: 16,
  },
};
