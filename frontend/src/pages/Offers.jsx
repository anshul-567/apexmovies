import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OFFERS = [
  {
    id: 'welcome100',
    code: 'WELCOME100',
    title: '₹100 Off First Booking',
    desc: 'Get flat ₹100 discount on your very first movie booking on ApexMovies. Valid across all 47 cities.',
    badge: 'New User Special',
    minSubtotal: '₹200',
    validTill: '31 Dec 2026',
    terms: ['Valid once per new user account', 'Minimum transaction subtotal ₹200', 'Applicable on all screens including IMAX & 4DX'],
    gradient: 'linear-gradient(135deg, rgba(104, 245, 225, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: 'var(--color-cyan)',
  },
  {
    id: 'weekend3',
    code: 'WEEKEND3',
    title: 'Buy 2 Tickets, Get 1 FREE',
    desc: 'Planning a movie with friends? Book 3 or more seats and the lowest priced seat is 100% free.',
    badge: 'Group Deal',
    minSubtotal: '3 Seats',
    validTill: 'Every Friday to Sunday',
    terms: ['Requires minimum 3 seats selected', 'Free seat discount applied automatically to lowest priced seat', 'Valid on all genres and languages'],
    gradient: 'linear-gradient(135deg, rgba(155, 108, 255, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: 'var(--color-violet)',
  },
  {
    id: 'family4',
    code: 'FAMILY4',
    title: 'Flat ₹200 Off Family Pack',
    desc: 'Going to the cinema with the whole family? Get flat ₹200 off when you book 4 or more tickets.',
    badge: 'Family Saver',
    minSubtotal: '4 Seats',
    validTill: '31 Dec 2026',
    terms: ['Requires at least 4 seats selected', 'Flat ₹200 instant deduction at checkout', 'Valid across all showtimes'],
    gradient: 'linear-gradient(135deg, rgba(56, 239, 125, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: '#38EF7D',
  },
  {
    id: 'student25',
    code: 'STUDENT25',
    title: '25% Student Cinema Discount',
    desc: 'Special student concession! Get 25% instant discount (up to ₹150) on weekday shows.',
    badge: 'Student Special',
    minSubtotal: 'No Minimum',
    validTill: '31 Dec 2026',
    terms: ['25% instant discount up to ₹150', 'Valid on regular & premium seats', 'Applicable across all 47 cities'],
    gradient: 'linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: '#FFC107',
  },
  {
    id: 'apex15',
    code: 'APEX15',
    title: '15% Instant Apex Card Discount',
    desc: 'Enjoy an instant 15% discount on all movie tickets when paying with any linked UPI or Credit/Debit card.',
    badge: 'Partner Offer',
    minSubtotal: 'No Minimum',
    validTill: '31 Dec 2026',
    terms: ['15% off applied to total ticket subtotal', 'Valid unlimited times per user', 'Can be combined with venue concessions'],
    gradient: 'linear-gradient(135deg, rgba(68, 85, 255, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: 'var(--color-blue)',
  },
  {
    id: 'flat50',
    code: 'FLAT50',
    title: 'Flat ₹50 Off on 2+ Tickets',
    desc: 'Book tickets for two or more and save flat ₹50 instantly on your order.',
    badge: 'Duo Saver',
    minSubtotal: '2 Seats',
    validTill: '31 Dec 2026',
    terms: ['Requires at least 2 seats in the booking', 'Flat ₹50 deducted at checkout', 'Valid on all weekdays and weekends'],
    gradient: 'linear-gradient(135deg, rgba(255, 92, 122, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: 'var(--color-danger)',
  },
  {
    id: 'popcorn50',
    code: 'POPCORN50',
    title: '₹50 F&B Snack Voucher',
    desc: 'Get flat ₹50 off on popcorn & beverage cinema combos with your movie tickets.',
    badge: 'Snack Deal',
    minSubtotal: 'No Minimum',
    validTill: '31 Dec 2026',
    terms: ['Flat ₹50 instant deduction', 'Valid on all theater bookings', 'Redeemable on snack counter at theater'],
    gradient: 'linear-gradient(135deg, rgba(255, 138, 0, 0.15) 0%, rgba(20, 20, 20, 0.8) 100%)',
    borderColor: '#FF8A00',
  },
];

const PAYMENT_OFFERS = [
  { code: 'CREDPAY', title: 'Cred Pay UPI Discount', desc: 'Flat ₹75 instant discount on Cred UPI transactions above ₹300.', icon: '💳', codeTag: 'Code: CREDPAY' },
  { code: 'GPAY100', title: 'Google Pay UPI Special', desc: '20% instant discount up to ₹100 on Google Pay UPI checkout.', icon: '⚡', codeTag: 'Code: GPAY100' },
  { code: 'HDFCICICI', title: 'HDFC & ICICI Card Partner', desc: '50% off on second ticket on select Credit & Debit cards up to ₹150.', icon: '🏦', codeTag: 'Code: HDFCICICI' },
  { code: 'RUPAY20', title: 'RuPay Platinum Benefit', desc: '20% instant discount up to ₹100 on all RuPay Credit & Debit cards.', icon: '🇮🇳', codeTag: 'Code: RUPAY20' },
];

export default function Offers() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div style={styles.page}>
      {/* Header Banner */}
      <div className="card" style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>Exclusive Deals</span>
          <h1 style={styles.heroTitle}>Offers & Discount Coupons</h1>
          <p style={styles.heroSub}>
            Unlock massive savings on cinema tickets, group outings, and bank partner discounts across 47 Indian cities.
          </p>
        </div>
      </div>

      {/* Main Promo Codes Grid */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>Active Promo Codes</h2>
        <span style={styles.sectionNote}>Click "Copy Code" and apply during checkout</span>
      </div>

      <div style={styles.offersGrid}>
        {OFFERS.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.id}
              className="card"
              style={{
                ...styles.offerCard,
                background: offer.gradient,
                borderColor: offer.borderColor,
              }}
            >
              <div style={styles.cardHeader}>
                <span style={{ ...styles.cardBadge, color: offer.borderColor, borderColor: offer.borderColor }}>
                  {offer.badge}
                </span>
                <span style={styles.validity}>Expires: {offer.validTill}</span>
              </div>

              <h3 style={styles.offerTitle}>{offer.title}</h3>
              <p style={styles.offerDesc}>{offer.desc}</p>

              {/* Code Box */}
              <div style={styles.codeBox}>
                <div>
                  <div style={styles.codeLabel}>PROMO CODE</div>
                  <div style={styles.codeText}>{offer.code}</div>
                </div>
                <button
                  className={isCopied ? 'btn-ghost' : 'btn-primary'}
                  style={styles.copyBtn}
                  onClick={() => handleCopy(offer.code)}
                >
                  {isCopied ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>

              {/* Terms */}
              <div style={styles.termsList}>
                <div style={styles.termsTitle}>Offer Terms:</div>
                {offer.terms.map((t, idx) => (
                  <div key={idx} style={styles.termItem}>• {t}</div>
                ))}
              </div>

              <button
                className="btn-ghost"
                style={styles.bookNowBtn}
                onClick={() => navigate('/')}
              >
                Explore Movies to Redeem →
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Partners Section */}
      <div style={{ marginTop: 56 }}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Bank & Wallet Partner Offers</h2>
          <span style={styles.sectionNote}>Use these promo codes at checkout for partner instant discounts</span>
        </div>

        <div style={styles.partnerGrid}>
          {PAYMENT_OFFERS.map((p, i) => {
            const isCopied = copiedCode === p.code;
            return (
              <div key={i} className="card" style={styles.partnerCard}>
                <div style={styles.partnerIcon}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <h4 style={styles.partnerTitle}>{p.title}</h4>
                    <span style={styles.codeTag}>{p.code}</span>
                  </div>
                  <p style={styles.partnerDesc}>{p.desc}</p>
                  <button
                    className={isCopied ? 'btn-ghost' : 'btn-primary'}
                    style={{ padding: '4px 10px', fontSize: 11.5, marginTop: 8 }}
                    onClick={() => handleCopy(p.code)}
                  >
                    {isCopied ? '✓ Copied' : 'Copy Code'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 1180, margin: '0 auto' },
  heroBanner: {
    padding: '48px 40px', marginBottom: 48, position: 'relative', overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(104,245,225,0.12) 0%, rgba(155,108,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(104,245,225,0.3)',
  },
  heroContent: { maxWidth: 680 },
  heroBadge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-cyan)', background: 'rgba(104,245,225,0.12)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 12,
  },
  heroTitle: { fontSize: 34, fontWeight: 800, marginBottom: 12, lineHeight: 1.2, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, flexWrap: 'wrap', gap: 8 },
  sectionTitle: { fontSize: 22, fontWeight: 700 },
  sectionNote: { fontSize: 13, color: 'var(--color-text-muted)' },
  offersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 24 },
  offerCard: { padding: 28, display: 'flex', flexDirection: 'column', borderRadius: 16 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardBadge: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, border: '1px solid', padding: '3px 8px', borderRadius: 6 },
  validity: { fontSize: 12, color: 'var(--color-text-muted)' },
  offerTitle: { fontSize: 20, fontWeight: 700, marginBottom: 8 },
  offerDesc: { fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 20 },
  codeBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'rgba(0,0,0,0.5)', padding: '12px 16px', borderRadius: 10,
    border: '1px dashed rgba(255,255,255,0.2)', marginBottom: 18,
  },
  codeLabel: { fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: 0.6 },
  codeText: { fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'Space Mono, monospace' },
  copyBtn: { padding: '8px 16px', fontSize: 12.5, fontWeight: 700 },
  termsList: { fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 20, flex: 1 },
  termsTitle: { fontWeight: 700, marginBottom: 4, color: 'var(--color-text-secondary)' },
  termItem: { lineHeight: 1.5, marginBottom: 2 },
  bookNowBtn: { width: '100%', padding: '10px 0', fontSize: 13, fontWeight: 600 },
  partnerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  partnerCard: { padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start', background: 'var(--color-bg-surface)' },
  partnerIcon: { fontSize: 26 },
  partnerTitle: { fontSize: 14.5, fontWeight: 700, marginBottom: 4 },
  partnerDesc: { fontSize: 12.5, color: 'var(--color-text-muted)', lineHeight: 1.4 },
  codeTag: { fontSize: 11, fontWeight: 800, color: 'var(--color-cyan)', background: 'rgba(104,245,225,0.12)', padding: '2px 6px', borderRadius: 4, fontFamily: 'Space Mono, monospace' },
};
