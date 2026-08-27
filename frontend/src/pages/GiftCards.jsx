import { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

const CARD_THEMES = [
  {
    id: 'cinema_gold',
    name: 'Cinema VIP Gold',
    badge: '👑 Director Class',
    bg: 'linear-gradient(135deg, #1f1a08 0%, #3d2f07 50%, #151104 100%)',
    borderColor: '#FFD700',
    accent: '#FFD700',
    textColor: '#FFF6D6',
  },
  {
    id: 'birthday_blast',
    name: 'Birthday Blockbuster',
    badge: '🎂 Birthday Celebration',
    bg: 'linear-gradient(135deg, #2b0b1a 0%, #521535 50%, #1c0611 100%)',
    borderColor: '#FF5C7A',
    accent: '#FF5C7A',
    textColor: '#FFEBF0',
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Cyberpunk',
    badge: '⚡ IMAX 3D Experience',
    bg: 'linear-gradient(135deg, #051c1c 0%, #0d3b38 50%, #031414 100%)',
    borderColor: 'var(--color-cyan)',
    accent: 'var(--color-cyan)',
    textColor: '#E0FFF9',
  },
  {
    id: 'romantic_duet',
    name: 'Couple Movie Date',
    badge: '🍿 Cinema & Chill',
    bg: 'linear-gradient(135deg, #1c0e2d 0%, #3e1b68 50%, #11071c 100%)',
    borderColor: 'var(--color-violet)',
    accent: 'var(--color-violet)',
    textColor: '#F2E8FF',
  },
];

export default function GiftCards() {
  const { user } = useAuth();
  const [tab, setTab] = useState('buy'); // 'buy' | 'check' | 'my'

  // Buy Form State
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);
  const [message, setMessage] = useState('Enjoy the ultimate cinema blockbusters with delicious popcorn & soda at ApexMovies!');
  const [purchasing, setPurchasing] = useState(false);
  const [createdCard, setCreatedCard] = useState(null);
  const [buyError, setBuyError] = useState('');

  // Check Balance State
  const [checkCode, setCheckCode] = useState('');
  const [checkPin, setCheckPin] = useState('');
  const [checking, setChecking] = useState(false);
  const [verifiedCard, setVerifiedCard] = useState(null);
  const [checkError, setCheckError] = useState('');

  // My Cards State
  const [myCards, setMyCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  useEffect(() => {
    if (tab === 'my' && user) {
      setLoadingCards(true);
      api.get('/gift-cards/my-cards')
        .then(({ data }) => setMyCards(data.giftCards || []))
        .catch(() => {})
        .finally(() => setLoadingCards(false));
    }
  }, [tab, user]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount < 100) {
      setBuyError('Minimum gift card amount is ₹100');
      return;
    }
    if (!recipientName.trim() || !recipientEmail.trim()) {
      setBuyError('Please enter recipient name and email');
      return;
    }

    setBuyError('');
    setPurchasing(true);

    try {
      const { data } = await api.post('/gift-cards/purchase', {
        recipientName,
        recipientEmail,
        amount: finalAmount,
        theme: selectedTheme.id,
        message,
      });

      setCreatedCard(data.giftCard);
    } catch (err) {
      setBuyError(err.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleCheckBalance = async (e) => {
    e.preventDefault();
    if (!checkCode.trim() || !checkPin.trim()) {
      setCheckError('Please enter both 16-digit card code and 4-digit PIN');
      return;
    }

    setCheckError('');
    setChecking(true);
    setVerifiedCard(null);

    try {
      const { data } = await api.post('/gift-cards/check-balance', {
        cardCode: checkCode,
        pin: checkPin,
      });
      setVerifiedCard(data.card);
    } catch (err) {
      setCheckError(err.response?.data?.error || 'Card verification failed');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Hero Header */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>🎁 The Gift of Cinema</div>
        <h1 style={styles.heroTitle}>Apex Digital Gift Cards</h1>
        <p style={styles.heroSub}>
          Surprise friends, family, or colleagues with the magic of movies. Instant email delivery, customizable themes, and zero expiry pressure.
        </p>

        {/* Tab Switcher */}
        <div style={styles.tabBar}>
          <button
            style={{ ...styles.tabBtn, ...(tab === 'buy' ? styles.activeTabBtn : {}) }}
            onClick={() => { setTab('buy'); setCreatedCard(null); }}
          >
            💳 Buy Gift Card
          </button>
          <button
            style={{ ...styles.tabBtn, ...(tab === 'check' ? styles.activeTabBtn : {}) }}
            onClick={() => setTab('check')}
          >
            🔍 Check Balance
          </button>
          {user && (
            <button
              style={{ ...styles.tabBtn, ...(tab === 'my' ? styles.activeTabBtn : {}) }}
              onClick={() => setTab('my')}
            >
              💼 My Gift Cards
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: BUY GIFT CARD */}
      {tab === 'buy' && (
        <div style={styles.contentWrap}>
          {createdCard ? (
            /* Success Voucher Screen */
            <div className="card" style={styles.successCard}>
              <div style={styles.successBadge}>🎉 Gift Card Created Successfully!</div>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                An e-voucher confirmation has been generated for <strong>{createdCard.recipient_name}</strong> ({createdCard.recipient_email}).
              </p>

              {/* Digital Card Render */}
              <DigitalCardPreview
                theme={selectedTheme}
                amount={createdCard.initial_balance}
                recipientName={createdCard.recipient_name}
                cardCode={createdCard.card_code}
                pin={createdCard.pin}
                message={createdCard.message}
              />

              <div style={styles.voucherActions}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(`ApexMovies Gift Card: ${createdCard.card_code} (PIN: ${createdCard.pin}) Balance: ₹${createdCard.initial_balance}`);
                    alert('Gift Card details copied to clipboard!');
                  }}
                >
                  📋 Copy Voucher Details
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setCreatedCard(null);
                    setRecipientName('');
                    setRecipientEmail('');
                  }}
                >
                  Buy Another Gift Card
                </button>
              </div>
            </div>
          ) : (
            /* Buy Form + Live Preview Grid */
            <div style={styles.buyGrid}>
              {/* Left Column: Customizer Form */}
              <form onSubmit={handlePurchase} className="card" style={styles.formCard}>
                <h2 style={styles.sectionHeader}>Customize Your Gift Card</h2>

                {/* 1. Theme Selector */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>1. Choose Card Design Theme</label>
                  <div style={styles.themeGrid}>
                    {CARD_THEMES.map((th) => (
                      <button
                        type="button"
                        key={th.id}
                        onClick={() => setSelectedTheme(th)}
                        style={{
                          ...styles.themeOption,
                          borderColor: selectedTheme.id === th.id ? th.borderColor : 'var(--color-border)',
                          background: selectedTheme.id === th.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{th.badge.split(' ')[0]}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: th.accent }}>{th.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Amount Selector */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>2. Select Card Amount (INR)</label>
                  <div style={styles.amountGrid}>
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => { setAmount(amt); setCustomAmount(''); }}
                        style={{
                          ...styles.amountBtn,
                          ...(amount === amt && !customAmount ? styles.amountBtnActive : {}),
                        }}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Or enter custom amount (min ₹100)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    style={{ ...styles.input, marginTop: 10 }}
                  />
                </div>

                {/* 3. Recipient Info */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>3. Recipient Details</label>
                  <div style={styles.rowInputs}>
                    <input
                      type="text"
                      placeholder="Recipient Full Name"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      style={styles.input}
                    />
                    <input
                      type="email"
                      placeholder="Recipient Email Address"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                {/* 4. Greeting Message */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>4. Personal Greeting Note</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={styles.textarea}
                  />
                </div>

                {buyError && <div style={styles.errorBanner}>⚠ {buyError}</div>}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={purchasing}
                  style={styles.submitBtn}
                >
                  {purchasing
                    ? 'Creating Gift Card…'
                    : `Pay ₹${(customAmount ? parseFloat(customAmount) || 0 : amount).toLocaleString()} & Generate Card`}
                </button>
              </form>

              {/* Right Column: Live Interactive Preview */}
              <div style={styles.previewColumn}>
                <div style={styles.previewSticky}>
                  <div style={styles.previewLabel}>Live Digital Card Preview</div>
                  <DigitalCardPreview
                    theme={selectedTheme}
                    amount={customAmount ? parseFloat(customAmount) || 0 : amount}
                    recipientName={recipientName || 'Your Recipient'}
                    cardCode="APEX-XXXX-XXXX-XXXX"
                    pin="••••"
                    message={message}
                  />
                  <div style={styles.cardFeatures}>
                    <div style={styles.featureItem}>⚡ <strong>Instant Delivery:</strong> Sent via email with security PIN</div>
                    <div style={styles.featureItem}>🎟️ <strong>Full Utility:</strong> Valid on tickets, recliners, & snacks</div>
                    <div style={styles.featureItem}>📅 <strong>1 Year Validity:</strong> 365 days to redeem on any movie</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHECK BALANCE */}
      {tab === 'check' && (
        <div style={styles.checkWrap}>
          <form onSubmit={handleCheckBalance} className="card" style={styles.checkCard}>
            <h2 style={styles.sectionHeader}>Check Gift Card Balance</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Enter the 16-digit voucher card code and 4-digit security PIN printed on your e-voucher.
            </p>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gift Card Number</label>
              <input
                type="text"
                placeholder="e.g. APEX-4892-8172-9901"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>4-Digit Security PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="e.g. 1234"
                value={checkPin}
                onChange={(e) => setCheckPin(e.target.value)}
                style={styles.input}
              />
            </div>

            {checkError && <div style={styles.errorBanner}>⚠ {checkError}</div>}

            <button type="submit" className="btn-primary" disabled={checking} style={styles.submitBtn}>
              {checking ? 'Checking…' : 'Check Balance & Status'}
            </button>
          </form>

          {/* Verified Card Info */}
          {verifiedCard && (
            <div className="card" style={styles.verifiedResultCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Gift Card Balance</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'Sora, sans-serif' }}>
                    ₹{Number(verifiedCard.current_balance).toFixed(2)}
                  </div>
                </div>
                <div style={styles.statusBadgeActive}>
                  ✓ {verifiedCard.status?.toUpperCase()}
                </div>
              </div>

              <div style={styles.verifiedDetailsList}>
                <div style={styles.detailRow}>
                  <span>Recipient Name</span>
                  <strong>{verifiedCard.recipient_name}</strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Initial Amount</span>
                  <strong>₹{Number(verifiedCard.initial_balance).toFixed(2)}</strong>
                </div>
                <div style={styles.detailRow}>
                  <span>Expires On</span>
                  <strong>{new Date(verifiedCard.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY GIFT CARDS */}
      {tab === 'my' && (
        <div style={styles.contentWrap}>
          {loadingCards ? (
            <div style={{ textAlign: 'center', padding: 48 }}>Loading your gift cards…</div>
          ) : myCards.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
              <h3>No Gift Cards Found</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                You have not purchased or received any digital gift cards yet.
              </p>
              <button className="btn-primary" onClick={() => setTab('buy')}>
                Buy Your First Gift Card
              </button>
            </div>
          ) : (
            <div style={styles.cardsGrid}>
              {myCards.map((c) => (
                <div key={c.id} className="card" style={styles.myCardItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={styles.myCardCode}>{c.card_code}</span>
                    <span style={{ ...styles.statusPill, color: Number(c.current_balance) > 0 ? 'var(--color-cyan)' : 'var(--color-text-muted)' }}>
                      ₹{Number(c.current_balance).toFixed(2)} Left
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    For: <strong>{c.recipient_name}</strong> ({c.recipient_email})
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>
                    PIN: <strong style={{ color: '#FFD700' }}>{c.pin}</strong> · Expires: {new Date(c.expires_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DigitalCardPreview({ theme, amount, recipientName, cardCode, pin, message }) {
  return (
    <div
      style={{
        ...styles.cardPreviewBox,
        background: theme.bg,
        borderColor: theme.borderColor,
      }}
    >
      <div style={styles.cardTopRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎬</span>
          <span style={styles.brandTitle}>APEX MOVIES</span>
        </div>
        <span style={{ ...styles.cardBadge, borderColor: theme.accent, color: theme.accent }}>
          {theme.badge}
        </span>
      </div>

      <div style={styles.cardCenterAmount}>
        <span style={{ fontSize: 14, color: theme.textColor, opacity: 0.8 }}>GIFT VOUCHER</span>
        <div style={{ ...styles.amountBig, color: theme.accent }}>
          ₹{Number(amount).toLocaleString()}
        </div>
      </div>

      <div style={{ ...styles.cardMessage, color: theme.textColor }}>
        "{message || 'Enjoy the ultimate cinema blockbusters at ApexMovies!'}"
      </div>

      <div style={styles.cardBottomRow}>
        <div>
          <div style={{ fontSize: 10, color: theme.textColor, opacity: 0.7, textTransform: 'uppercase' }}>GIFTED TO</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{recipientName}</div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, color: '#fff', fontFamily: 'monospace' }}>
            {cardCode}
          </div>
          <div style={{ fontSize: 10.5, color: theme.textColor, opacity: 0.7 }}>
            PIN: <span style={{ color: theme.accent, fontWeight: 700 }}>{pin}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px 24px', maxWidth: 1100, margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: 40 },
  heroBadge: { display: 'inline-block', padding: '4px 12px', background: 'rgba(255,215,0,0.12)', color: '#FFD700', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 },
  heroTitle: { fontSize: 36, fontWeight: 800, fontFamily: 'Sora, sans-serif', marginBottom: 12 },
  heroSub: { fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.6 },
  tabBar: { display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  tabBtn: { padding: '10px 20px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)', fontWeight: 600, cursor: 'pointer' },
  activeTabBtn: { background: 'var(--gradient-primary)', color: '#04120F', borderColor: 'transparent', fontWeight: 700 },
  contentWrap: { marginTop: 30 },
  buyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 32, alignItems: 'start' },
  formCard: { padding: 32, borderRadius: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 800, marginBottom: 20, fontFamily: 'Sora, sans-serif' },
  formGroup: { marginBottom: 22 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 8 },
  themeGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  themeOption: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: '1px solid', cursor: 'pointer', textAlign: 'left' },
  amountGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  amountBtn: { padding: '10px 0', textAlign: 'center', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  amountBtnActive: { background: 'var(--color-cyan)', color: '#04120F', borderColor: 'var(--color-cyan)' },
  rowInputs: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)', color: '#fff', fontSize: 14 },
  textarea: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)', color: '#fff', fontSize: 14, resize: 'none' },
  errorBanner: { padding: '10px 14px', background: 'rgba(255,92,122,0.12)', border: '1px solid var(--color-danger)', borderRadius: 10, color: 'var(--color-danger)', fontSize: 13, marginBottom: 16 },
  submitBtn: { width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 800, borderRadius: 12 },
  previewColumn: { width: '100%' },
  previewSticky: { position: 'sticky', top: 90 },
  previewLabel: { fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  cardPreviewBox: {
    padding: '24px 28px', borderRadius: 20, border: '1.5px solid', boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
    display: 'flex', flexDirection: 'column', gap: 16, minHeight: 240, justifyContent: 'space-between',
  },
  cardTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brandTitle: { fontSize: 13, fontWeight: 900, letterSpacing: 2, color: '#fff', fontFamily: 'Sora, sans-serif' },
  cardBadge: { fontSize: 10, fontWeight: 800, border: '1px solid', padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' },
  cardCenterAmount: { textAlign: 'center', margin: '4px 0' },
  amountBig: { fontSize: 38, fontWeight: 900, fontFamily: 'Sora, sans-serif', letterSpacing: -0.5 },
  cardMessage: { fontSize: 12.5, fontStyle: 'italic', lineHeight: 1.4, opacity: 0.9, textAlign: 'center' },
  cardBottomRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 },
  cardFeatures: { marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 },
  featureItem: { fontSize: 13, color: 'var(--color-text-secondary)' },
  checkWrap: { maxWidth: 520, margin: '0 auto' },
  checkCard: { padding: 32, borderRadius: 20 },
  verifiedResultCard: { marginTop: 24, padding: 24, borderRadius: 16, border: '1px solid var(--color-cyan)', background: 'linear-gradient(135deg, rgba(104,245,225,0.06) 0%, rgba(20,20,20,0.6) 100%)' },
  statusBadgeActive: { padding: '4px 10px', background: 'rgba(104,245,225,0.15)', color: 'var(--color-cyan)', borderRadius: 6, fontSize: 11, fontWeight: 800 },
  verifiedDetailsList: { display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 },
  detailRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-secondary)' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
  myCardItem: { padding: 20, borderRadius: 14 },
  myCardCode: { fontSize: 14, fontWeight: 800, fontFamily: 'monospace', color: '#fff' },
  statusPill: { fontSize: 13, fontWeight: 800 },
  successCard: { padding: 36, textAlign: 'center', maxWidth: 580, margin: '0 auto', borderRadius: 20 },
  successBadge: { fontSize: 20, fontWeight: 800, color: 'var(--color-cyan)', marginBottom: 8, fontFamily: 'Sora, sans-serif' },
  voucherActions: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 },
};
