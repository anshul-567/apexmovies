import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQS = [
  {
    category: 'Booking & Seats',
    items: [
      {
        q: 'How long are my selected seats held while I complete checkout?',
        a: 'When you click "Proceed to checkout", your selected seats are locked atomically in our database for 5 minutes. You will see a live countdown timer on the checkout screen. If payment is not completed within 5 minutes, seats are automatically released for other moviegoers.',
      },
      {
        q: 'Can I select up to 10 seats in a single booking?',
        a: 'Yes! You can select between 1 and 10 seats per booking. All seats are locked in a single atomic transaction, allowing you to book for your entire family or group at once.',
      },
      {
        q: 'What do the seat colors on the seat map represent?',
        a: 'Gray indicates available seats; Neon Cyan indicates your currently selected seats; Purple indicates seats temporarily locked by another user; and Red indicates confirmed booked seats.',
      },
    ],
  },
  {
    category: 'Tickets & QR Entry',
    items: [
      {
        q: 'How do I access my booking ticket after payment?',
        a: 'Immediately after checkout, you can view your digital pass. You can also visit "My Bookings" at any time from the top navigation bar to view or download a print-ready PDF pass containing your encrypted QR code.',
      },
      {
        q: 'Do I need to print my ticket or is the mobile QR code sufficient?',
        a: 'All 57 partner theaters and 234 screens in India accept the digital QR code directly from your smartphone screen. Simply show the pass at the cinema turnstile or gate scanner.',
      },
    ],
  },
  {
    category: 'Discounts & Offers',
    items: [
      {
        q: 'How do I apply promo codes like WELCOME100 or WEEKEND3?',
        a: 'On the Checkout screen, enter your promo code into the "Discount Offer & Promo Code" field and click Apply, or simply click any of the "Popular Offers" chips to auto-apply instant discounts.',
      },
      {
        q: 'What are the requirements for the WEEKEND3 Buy 2 Get 1 Free deal?',
        a: 'You must select at least 3 seats. The discount is automatically calculated as 100% off the lowest priced seat among your selected tickets.',
      },
    ],
  },
  {
    category: 'Refunds & Cancellations',
    items: [
      {
        q: 'Can I cancel my movie ticket and get a refund?',
        a: 'Yes, tickets can be cancelled up to 2 hours prior to the scheduled showtime. 100% of the ticket price is refunded back to your original payment source (UPI / Card / NetBanking) within 2-4 business hours.',
      },
      {
        q: 'What happens if a show is cancelled by the cinema venue?',
        a: 'In the rare event of a technical cancellation by the theater, an automated 100% full refund (including convenience fees) is immediately processed to your original payment method.',
      },
    ],
  },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState('0-0'); // CategoryIdx-ItemIdx

  const toggleAccordion = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredFaqs = FAQS.map((cat, cIdx) => {
    const items = cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    );
    return { ...cat, items, cIdx };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div className="card" style={styles.heroCard}>
        <span style={styles.badge}>Help & Support</span>
        <h1 style={styles.heroTitle}>How Can We Help You?</h1>
        <p style={styles.heroSub}>Find quick answers to common questions about ticket bookings, seat locking, offers, and digital QR passes.</p>

        {/* Search Bar */}
        <div style={styles.searchBox}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            type="text"
            placeholder="Search FAQs (e.g. refund, QR code, seat hold, promo)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
          )}
        </div>
      </div>

      {/* FAQ Categories */}
      <div style={styles.faqsContainer}>
        {filteredFaqs.map((cat) => (
          <div key={cat.category} style={styles.categorySection}>
            <h2 style={styles.categoryTitle}>{cat.category}</h2>

            <div style={styles.accordionList}>
              {cat.items.map((item, iIdx) => {
                const key = `${cat.cIdx}-${iIdx}`;
                const isOpen = openIndex === key;

                return (
                  <div key={iIdx} className="card" style={styles.accordionCard}>
                    <div
                      style={styles.accordionHeader}
                      onClick={() => toggleAccordion(key)}
                    >
                      <span style={styles.questionText}>{item.q}</span>
                      <span style={{ ...styles.arrow, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        ▼
                      </span>
                    </div>

                    {isOpen && (
                      <div style={styles.accordionBody}>
                        <p style={styles.answerText}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="card" style={styles.emptyCard}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No matching results for "{search}"</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 16 }}>
              Need personalized assistance? Reach out to our 24/7 support team.
            </p>
            <button className="btn-primary" onClick={() => navigate('/contact')}>
              Contact Support
            </button>
          </div>
        )}
      </div>

      {/* Need more help banner */}
      <div className="card" style={styles.supportBanner}>
        <div>
          <h3 style={styles.bannerTitle}>Still have questions?</h3>
          <p style={styles.bannerSub}>Our customer care agents are online 24/7 to help resolve any booking issues.</p>
        </div>
        <button className="btn-primary" style={{ padding: '12px 24px', fontSize: 14 }} onClick={() => navigate('/contact')}>
          Get in Touch →
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 960, margin: '0 auto' },
  heroCard: {
    padding: '48px 40px', marginBottom: 48, textAlign: 'center',
    background: 'linear-gradient(135deg, rgba(104,245,225,0.12) 0%, rgba(155,108,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(104,245,225,0.25)',
  },
  badge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-cyan)', background: 'rgba(104,245,225,0.12)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 14,
  },
  heroTitle: { fontSize: 36, fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 15.5, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 28px' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: 12, maxWidth: 600, margin: '0 auto',
    padding: '12px 18px', borderRadius: 14, background: '#18181A',
    border: '1px solid var(--color-border)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
  },
  searchInput: { flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14.5, outline: 'none' },
  clearBtn: { background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 16 },
  faqsContainer: { display: 'flex', flexDirection: 'column', gap: 36 },
  categorySection: {},
  categoryTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16, color: 'var(--color-cyan)' },
  accordionList: { display: 'flex', flexDirection: 'column', gap: 12 },
  accordionCard: { padding: 0, overflow: 'hidden', border: '1px solid var(--color-border)' },
  accordionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '18px 22px', cursor: 'pointer', userSelect: 'none',
  },
  questionText: { fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' },
  arrow: { fontSize: 12, color: 'var(--color-text-muted)', transition: 'transform 0.2s ease' },
  accordionBody: { padding: '0 22px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 },
  answerText: { fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 },
  emptyCard: { padding: 48, textAlign: 'center', background: 'var(--color-bg-surface)' },
  supportBanner: {
    marginTop: 48, padding: 32, display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', background: 'var(--color-bg-elevated)', flexWrap: 'wrap', gap: 20,
  },
  bannerTitle: { fontSize: 18, fontWeight: 700, margin: '0 0 4px' },
  bannerSub: { fontSize: 13.5, color: 'var(--color-text-muted)', margin: 0 },
};
