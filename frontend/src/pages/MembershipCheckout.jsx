import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';

const TIER_DETAILS = {
  standard: {
    id: 'standard',
    name: 'Standard Premiere Pass',
    price: 499,
    cycle: 'Monthly Plan (Auto-Renews)',
    badge: 'Most Popular',
    freeTickets: 2,
    desc: '2 free movie tickets monthly across all 47 cities + ₹0 booking convenience fees.',
    perks: [
      '🎟️ 2 Free Movie Tickets every month (Up to ₹700 value)',
      '⚡ ₹0 Convenience Fees on all bookings across India',
      '🍿 10% Instant Discount on F&B Cinema Concessions',
      '👑 Priority Seat Selection 2 hours before general release',
      '2X ApexCoins Reward Points on all purchases',
    ],
    gradient: 'linear-gradient(135deg, rgba(104, 245, 225, 0.12) 0%, rgba(20, 20, 20, 0.9) 100%)',
    borderColor: 'var(--color-cyan)',
  },
  gold: {
    id: 'gold',
    name: 'Gold VIP Pass',
    price: 899,
    cycle: 'Monthly Plan (Auto-Renews)',
    badge: 'Ultimate Luxury',
    freeTickets: 4,
    desc: '4 free tickets monthly + free popcorn & beverage combo on every visit + VIP Lounge admission.',
    perks: [
      '🎟️ 4 Free Movie Tickets every month (Up to ₹1,400 value)',
      '⚡ ₹0 Convenience Fees on all bookings nationwide',
      '🍿 Free Popcorn & Beverage Combo with every theater visit',
      '🛋️ Exclusive VIP Director\'s Cut & Gold Class Lounge Entry',
      '🛡️ Free 100% Cancellation up to 1 hr before showtime',
      '3X ApexCoins Reward Points on all purchases',
    ],
    gradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(20, 20, 20, 0.9) 100%)',
    borderColor: '#FFD700',
  },
};

export default function MembershipCheckout() {
  const { tier: tierParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const tierKey = (tierParam || 'standard').toLowerCase();
  const tier = TIER_DETAILS[tierKey] || TIER_DETAILS.standard;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');

  // GST Calculation (18% included)
  const basePrice = Math.round((tier.price / 1.18) * 100) / 100;
  const gstAmount = Math.round((tier.price - basePrice) * 100) / 100;
  const totalAmount = tier.price;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const res = await api.post('/memberships/subscribe', { tier: tier.id });
      setConfirmation(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please check payment credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div style={styles.page}>
        <div className="card" style={styles.confirmCard}>
          <div style={styles.checkGlow}>✓</div>
          <span style={styles.badge}>MEMBERSHIP ACTIVATED</span>
          <h1 style={styles.confirmTitle}>{tier.name}</h1>
          <p style={styles.confirmSub}>Welcome to the Apex Premiere Club!</p>

          <div style={styles.confirmDetailsBox}>
            <div style={styles.detailRow}>
              <span>Plan Type:</span>
              <strong>{tier.name}</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Amount Charged:</span>
              <strong>₹{totalAmount.toFixed(2)} / month</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Monthly Free Tickets:</span>
              <strong style={{ color: 'var(--color-cyan)' }}>{tier.freeTickets} Tickets Ready</strong>
            </div>
            <div style={styles.detailRow}>
              <span>Next Renewal:</span>
              <strong>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
            </div>
          </div>

          <div style={styles.confirmActions}>
            <button className="btn-primary" style={styles.confirmBtn} onClick={() => navigate('/')}>
              🎟 Browse Movies & Redeem Free Ticket
            </button>
            <button className="btn-ghost" style={styles.confirmBtn} onClick={() => navigate('/premiere-club')}>
              View Membership Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button className="btn-ghost" onClick={() => navigate('/premiere-club')} style={styles.backBtn}>
          ← Back to Premiere Club
        </button>
        <h1 style={styles.title}>Complete Membership Purchase</h1>
      </div>

      {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

      <div style={styles.layout}>
        {/* Left: Selected Plan Summary */}
        <div style={styles.planCol}>
          <div
            className="card"
            style={{
              ...styles.planCard,
              background: tier.gradient,
              borderColor: tier.borderColor,
            }}
          >
            <span style={{ ...styles.badge, borderColor: tier.borderColor, color: tier.borderColor }}>
              {tier.badge}
            </span>
            <h2 style={styles.planTitle}>{tier.name}</h2>
            <p style={styles.planDesc}>{tier.desc}</p>

            <div style={styles.priceRow}>
              <span style={styles.priceNumber}>₹{tier.price}</span>
              <span style={styles.priceCycle}>/ month (inclusive of all taxes)</span>
            </div>

            <div style={styles.perksList}>
              <div style={styles.perksTitle}>Your Benefits from Today:</div>
              {tier.perks.map((p, idx) => (
                <div key={idx} style={styles.perkItem}>• {p}</div>
              ))}
            </div>

            <div style={styles.guaranteeNote}>
              🛡️ 100% Risk-Free. Cancel anytime with 1-click from your account.
            </div>
          </div>
        </div>

        {/* Right: Payment Method & Order Summary */}
        <div style={styles.paymentCol}>
          <div className="card" style={styles.paymentCard}>
            <h3 style={styles.paymentHeading}>Select Payment Method</h3>

            {/* Payment Method Selector */}
            <div style={styles.methodSelector}>
              <button
                type="button"
                className={paymentMethod === 'upi' ? 'btn-primary' : 'btn-ghost'}
                style={styles.methodBtn}
                onClick={() => setPaymentMethod('upi')}
              >
                ⚡ UPI / QR
              </button>
              <button
                type="button"
                className={paymentMethod === 'card' ? 'btn-primary' : 'btn-ghost'}
                style={styles.methodBtn}
                onClick={() => setPaymentMethod('card')}
              >
                💳 Credit / Debit Card
              </button>
            </div>

            <form onSubmit={handleSubscribe} style={{ marginTop: 20 }}>
              {paymentMethod === 'upi' ? (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>UPI ID (VPA) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@oksbi or 987654321@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={styles.input}
                  />
                  <span style={styles.inputNote}>Supports Google Pay, PhonePe, Paytm, Cred & BHIM</span>
                </div>
              ) : (
                <div style={styles.cardFields}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Card Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                      <label style={styles.label}>Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        required
                        placeholder="08/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={{ ...styles.inputGroup, width: 100 }}>
                      <label style={styles.label}>CVV *</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div style={styles.breakdownBox}>
                <div style={styles.breakdownRow}>
                  <span>Membership Subtotal</span>
                  <span>₹{basePrice.toFixed(2)}</span>
                </div>
                <div style={styles.breakdownRow}>
                  <span>GST (18% Included)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Total Payable Today</span>
                  <span style={styles.totalNumber}>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={styles.payBtn}
                disabled={submitting}
              >
                {submitting ? 'Processing Payment…' : `Pay ₹${totalAmount.toFixed(2)} & Activate Pass →`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 48px', maxWidth: 1100, margin: '0 auto' },
  header: { marginBottom: 32 },
  backBtn: { padding: '6px 14px', fontSize: 13, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 800, margin: 0, fontFamily: 'Sora, sans-serif' },
  errorBanner: { padding: '14px 18px', borderRadius: 10, background: 'rgba(255,92,122,0.15)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', marginBottom: 24, fontSize: 14, fontWeight: 600 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'flex-start' },
  planCol: {},
  planCard: { padding: 32, borderRadius: 16, border: '1px solid' },
  badge: { fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, border: '1px solid', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 12 },
  planTitle: { fontSize: 22, fontWeight: 800, marginBottom: 8 },
  planDesc: { fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 20 },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 24 },
  priceNumber: { fontSize: 34, fontWeight: 800, color: '#fff', fontFamily: 'Sora, sans-serif' },
  priceCycle: { fontSize: 12.5, color: 'var(--color-text-muted)' },
  perksList: { borderTop: '1px solid var(--color-border)', paddingTop: 18, marginBottom: 20 },
  perksTitle: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text-muted)', marginBottom: 10 },
  perkItem: { fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 },
  guaranteeNote: { fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 },
  paymentCol: {},
  paymentCard: { padding: 32, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' },
  paymentHeading: { fontSize: 18, fontWeight: 700, margin: '0 0 16px' },
  methodSelector: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 },
  methodBtn: { padding: '10px 0', fontSize: 13, fontWeight: 700 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  cardFields: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' },
  input: { padding: '11px 14px', borderRadius: 8, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 13.5 },
  inputNote: { fontSize: 11, color: 'var(--color-text-muted)' },
  breakdownBox: { margin: '24px 0', borderTop: '1px solid var(--color-border)', paddingTop: 16 },
  breakdownRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'var(--color-text-secondary)', marginBottom: 8 },
  totalRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 10, fontWeight: 700, fontSize: 16 },
  totalNumber: { fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)' },
  payBtn: { width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 800 },
  confirmCard: { padding: 48, textAlign: 'center', maxWidth: 600, margin: '40px auto' },
  checkGlow: {
    width: 64, height: 64, margin: '0 auto 20px', borderRadius: '50%', background: 'var(--gradient-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#04120F',
    boxShadow: 'var(--shadow-cyan-glow)',
  },
  confirmTitle: { fontSize: 26, fontWeight: 800, margin: '10px 0 4px' },
  confirmSub: { fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 24 },
  confirmDetailsBox: { background: 'var(--color-bg-surface)', padding: 20, borderRadius: 12, border: '1px solid var(--color-border)', textAlign: 'left', marginBottom: 28 },
  detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  confirmActions: { display: 'flex', flexDirection: 'column', gap: 12 },
  confirmBtn: { width: '100%', padding: '12px 0', fontSize: 14, fontWeight: 700 },
};
