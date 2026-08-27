import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';

const TIERS = [
  {
    id: 'free',
    name: 'Silver Member',
    price: '₹0',
    cycle: 'Forever Free',
    badge: 'Standard',
    freeTickets: 0,
    desc: 'For casual moviegoers discovering weekend releases.',
    perks: [
      'Earn 5% ApexCoins on all ticket bookings',
      'Access to standard 4K shows and theater seat maps',
      'Digital QR gate passes & PDF downloads',
      'Standard customer support',
    ],
    buttonText: 'Current Plan',
    gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: 'var(--color-border)',
  },
  {
    id: 'standard',
    name: 'Standard Premiere Pass',
    price: '₹499',
    cycle: '/month',
    badge: 'Most Popular',
    freeTickets: 2,
    desc: 'The best value for cinema lovers. 2 free tickets monthly + ₹0 fees.',
    perks: [
      '🎟️ 2 Free Movie Tickets every month (Up to ₹700 value)',
      '⚡ ₹0 Convenience Fees on all bookings across India',
      '🍿 10% Instant Discount on F&B Cinema Concessions',
      '👑 Priority Seat Selection 2 hours before general release',
      'Earn 2X ApexCoins reward points',
    ],
    buttonText: 'Upgrade to Standard',
    gradient: 'linear-gradient(135deg, rgba(104, 245, 225, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: 'var(--color-cyan)',
    popular: true,
  },
  {
    id: 'gold',
    name: 'Gold VIP Pass',
    price: '₹899',
    cycle: '/month',
    badge: 'Ultimate Luxury',
    freeTickets: 4,
    desc: '4 free tickets monthly + free popcorn + VIP lounge admission.',
    perks: [
      '🎟️ 4 Free Movie Tickets every month (Up to ₹1,400 value)',
      '⚡ ₹0 Convenience Fees on all bookings nationwide',
      '🍿 Free Popcorn & Beverage Combo with every theater visit',
      '🛋️ Exclusive VIP Director\'s Cut & Gold Class Lounge Entry',
      '🛡️ Free 100% Cancellation up to 1 hr before showtime',
      'Earn 3X ApexCoins reward points',
    ],
    buttonText: 'Upgrade to Gold VIP',
    gradient: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: '#FFD700',
    gold: true,
  },
];

export default function PremiereClub() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribingTier, setSubscribingTier] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchMembership();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMembership = async () => {
    try {
      setLoading(true);
      const res = await api.get('/memberships/me');
      setMembership(res.data);
    } catch (err) {
      console.error('Failed to fetch membership', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (tier) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/membership-checkout/${tier}`);
  };

  const currentTier = membership?.tier || 'free';

  return (
    <div style={styles.page}>
      {/* Hero Banner */}
      <div className="card" style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>Apex Premiere Club</span>
          <h1 style={styles.heroTitle}>Unlimited Movie Perks & Free Tickets</h1>
          <p style={styles.heroSub}>
            Elevate your cinema lifestyle with free monthly movie tickets, zero convenience booking fees, complimentary popcorn combos, and VIP lounge access across 47 Indian cities.
          </p>
        </div>
      </div>

      {message && (
        <div className="card" style={styles.successBanner}>
          <span style={{ fontSize: 20 }}>🎉</span>
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="card" style={styles.errorBanner}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Active Membership Status Card */}
      {user && membership && currentTier !== 'free' && (
        <div className="card" style={styles.activePassCard}>
          <div style={styles.activePassHeader}>
            <div>
              <span style={styles.activeLabel}>ACTIVE MEMBERSHIP</span>
              <h2 style={styles.activeTierName}>{membership.tierInfo?.name}</h2>
            </div>
            <div style={styles.ticketCountBadge}>
              <div style={styles.ticketCountNumber}>{membership.freeTicketsRemaining}</div>
              <div style={styles.ticketCountText}>Free Tickets Left</div>
            </div>
          </div>

          <div style={styles.activeDetailsRow}>
            <div style={styles.activeDetailItem}>
              <span style={styles.detailLabel}>Monthly Allowance:</span>
              <span style={styles.detailValue}>{membership.freeTicketsTotal} Tickets / month</span>
            </div>
            <div style={styles.activeDetailItem}>
              <span style={styles.detailLabel}>Renewal / Cycle End:</span>
              <span style={styles.detailValue}>
                {membership.expiresAt ? new Date(membership.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active'}
              </span>
            </div>
            <div style={styles.activeDetailItem}>
              <span style={styles.detailLabel}>Status:</span>
              <span style={{ ...styles.detailValue, color: 'var(--color-cyan)', textTransform: 'capitalize' }}>
                ● {membership.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tiers Grid */}
      <div style={styles.tiersGrid}>
        {TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id;
          const isSubscribing = subscribingTier === tier.id;

          return (
            <div
              key={tier.id}
              className="card"
              style={{
                ...styles.tierCard,
                background: tier.gradient,
                borderColor: isCurrent ? 'var(--color-cyan)' : tier.borderColor,
                boxShadow: tier.popular ? '0 12px 40px rgba(104, 245, 225, 0.15)' : 'none',
              }}
            >
              <div style={styles.cardTop}>
                <span
                  style={{
                    ...styles.badge,
                    color: tier.borderColor === 'var(--color-border)' ? 'var(--color-text-secondary)' : tier.borderColor,
                    borderColor: tier.borderColor,
                  }}
                >
                  {tier.badge}
                </span>

                <h3 style={styles.tierName}>{tier.name}</h3>
                <p style={styles.tierDesc}>{tier.desc}</p>

                <div style={styles.priceRow}>
                  <span style={styles.priceText}>{tier.price}</span>
                  <span style={styles.cycleText}>{tier.cycle}</span>
                </div>
              </div>

              <div style={styles.perksList}>
                <div style={styles.perksHeader}>Included Benefits:</div>
                {tier.perks.map((p, idx) => (
                  <div key={idx} style={styles.perkItem}>
                    • {p}
                  </div>
                ))}
              </div>

              <div style={styles.cardAction}>
                {isCurrent ? (
                  <button className="btn-ghost" style={styles.currentBtn} disabled>
                    ✓ Active Membership
                  </button>
                ) : tier.id === 'free' ? (
                  <button className="btn-ghost" style={styles.actionBtn} onClick={() => navigate('/')}>
                    Browse Movies
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    style={{
                      ...styles.actionBtn,
                      background: tier.gold ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : undefined,
                      color: tier.gold ? '#000' : undefined,
                      fontWeight: 800,
                    }}
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Activating...' : tier.buttonText} →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ / Guarantee */}
      <div className="card" style={styles.guaranteeCard}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🛡️</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Cancel Anytime with 1 Click</h3>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, maxWidth: 640, margin: '0 auto 16px', lineHeight: 1.6 }}>
          No lock-in contracts or hidden fees. Your free tickets and benefits remain active until the end of your 30-day billing cycle.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 1180, margin: '0 auto' },
  heroBanner: {
    padding: '48px 40px', marginBottom: 40,
    background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(104,245,225,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(255,215,0,0.25)',
  },
  heroContent: { maxWidth: 720 },
  heroBadge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: '#FFD700', background: 'rgba(255,215,0,0.15)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 12,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, marginBottom: 12, lineHeight: 1.2, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 15.5, color: 'var(--color-text-secondary)', lineHeight: 1.6 },
  successBanner: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(56, 239, 125, 0.15)', borderColor: '#38EF7D', color: '#38EF7D', marginBottom: 24 },
  errorBanner: { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255, 92, 122, 0.15)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', marginBottom: 24 },
  activePassCard: {
    padding: 28, marginBottom: 36,
    background: 'linear-gradient(135deg, rgba(104,245,225,0.1) 0%, rgba(20,20,20,0.9) 100%)',
    border: '1px solid var(--color-cyan)',
  },
  activePassHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 },
  activeLabel: { fontSize: 11, fontWeight: 800, color: 'var(--color-cyan)', letterSpacing: 0.8 },
  activeTierName: { fontSize: 24, fontWeight: 800, margin: '4px 0 0' },
  ticketCountBadge: { textAlign: 'center', padding: '12px 24px', background: 'rgba(0,0,0,0.5)', borderRadius: 12, border: '1px solid var(--color-cyan)' },
  ticketCountNumber: { fontSize: 28, fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'Sora, sans-serif' },
  ticketCountText: { fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' },
  activeDetailsRow: { display: 'flex', gap: 24, flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: 16 },
  activeDetailItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  detailLabel: { fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)' },
  detailValue: { fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-primary)' },
  tiersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48 },
  tierCard: { padding: 32, display: 'flex', flexDirection: 'column', borderRadius: 16, border: '1px solid', position: 'relative' },
  cardTop: { marginBottom: 20 },
  badge: { fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6, border: '1px solid', padding: '3px 8px', borderRadius: 6, display: 'inline-block', marginBottom: 12 },
  tierName: { fontSize: 20, fontWeight: 700, marginBottom: 6 },
  tierDesc: { fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 16 },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: 4 },
  priceText: { fontSize: 36, fontWeight: 800, fontFamily: 'Sora, sans-serif', color: '#fff' },
  cycleText: { fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 },
  perksList: { flex: 1, marginBottom: 28 },
  perksHeader: { fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  perkItem: { fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 },
  cardAction: {},
  actionBtn: { width: '100%', padding: '12px 0', fontSize: 14, fontWeight: 700 },
  currentBtn: { width: '100%', padding: '12px 0', fontSize: 13, fontWeight: 600, opacity: 0.8, cursor: 'default' },
  guaranteeCard: { padding: 36, textAlign: 'center', background: 'var(--color-bg-surface)' },
};
