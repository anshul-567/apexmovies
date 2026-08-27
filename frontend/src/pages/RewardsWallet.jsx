import { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { Link } from 'react-router-dom';

export default function RewardsWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/wallet/me')
      .then(({ data }) => setWallet(data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load wallet'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 20px' }}>Loading your Apex Rewards Wallet…</div>;
  }

  const coinBalance = wallet?.coinBalance || 0;
  const tier = wallet?.tier || 'free';
  const earnRate = wallet?.earnRatePercent || 5;
  const transactions = wallet?.transactions || [];

  return (
    <div style={styles.page}>
      {/* Hero Header */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>🪙 Apex Loyalty Wallet</div>
        <h1 style={styles.heroTitle}>ApexCoins Rewards & Cashback</h1>
        <p style={styles.heroSub}>
          Earn coins with every booking, unlock exclusive perks, and redeem your balance as direct cash discounts at checkout (1 Coin = ₹1).
        </p>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {/* Top Cards: Balance & Multiplier */}
      <div style={styles.topCardsGrid}>
        {/* Balance Card */}
        <div className="card" style={styles.balanceCard}>
          <div style={styles.balanceHeader}>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Available ApexCoins Balance
            </span>
            <span style={styles.rateBadge}>1 Coin = ₹1.00</span>
          </div>

          <div style={styles.coinCountWrap}>
            <span style={{ fontSize: 32 }}>🪙</span>
            <span style={styles.coinCount}>{coinBalance.toFixed(0)}</span>
            <span style={styles.currencyEquiv}>≈ ₹{coinBalance.toFixed(2)}</span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '14px 0 20px' }}>
            Usable directly on movie tickets, IMAX shows, VIP recliners, and cinema snacks.
          </p>

          <Link to="/" className="btn-primary" style={{ display: 'inline-block', textAlign: 'center', width: '100%', padding: '12px 0' }}>
            Book Movies & Redeem Coins
          </Link>
        </div>

        {/* Tier Cashback Multiplier Card */}
        <div className="card" style={styles.multiplierCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Current Earning Rate
            </span>
            <span style={{ ...styles.tierBadge, borderColor: tier === 'gold' ? '#FFD700' : 'var(--color-cyan)', color: tier === 'gold' ? '#FFD700' : 'var(--color-cyan)' }}>
              {tier.toUpperCase()} MEMBER
            </span>
          </div>

          <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Sora, sans-serif', color: '#fff', marginBottom: 8 }}>
            {earnRate}% <span style={{ fontSize: 16, color: 'var(--color-cyan)', fontWeight: 700 }}>Cashback on Every Ticket</span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            {tier === 'gold'
              ? '👑 You are enjoying maximum VIP 3X coin earnings (15% cashback on all orders)!'
              : tier === 'standard'
              ? '⚡ You are earning 2X coins (10% cashback). Upgrade to Gold VIP to unlock 15% cashback!'
              : 'Upgrade to Apex Premiere Club to boost your earning rate up to 15% cashback!'}
          </p>

          {tier !== 'gold' && (
            <Link to="/premiere-club" className="btn-ghost" style={{ display: 'inline-block', textAlign: 'center', width: '100%', padding: '12px 0' }}>
              Upgrade Tier for 3X Coins
            </Link>
          )}
        </div>
      </div>

      {/* How It Works 3-Step Banner */}
      <div className="card" style={styles.howItWorksCard}>
        <h2 style={styles.sectionHeader}>How ApexCoins Work</h2>
        <div style={styles.stepsGrid}>
          <div style={styles.stepItem}>
            <div style={styles.stepIcon}>🎟️</div>
            <div style={styles.stepTitle}>1. Book Tickets</div>
            <div style={styles.stepDesc}>Pick any movie, theater, or show across 15+ Indian cities.</div>
          </div>
          <div style={styles.stepItem}>
            <div style={styles.stepIcon}>💰</div>
            <div style={styles.stepTitle}>2. Auto-Earn Cashback</div>
            <div style={styles.stepDesc}>Receive up to 15% of your bill directly credited as ApexCoins.</div>
          </div>
          <div style={styles.stepItem}>
            <div style={styles.stepIcon}>✨</div>
            <div style={styles.stepTitle}>3. Instant Discounts</div>
            <div style={styles.stepDesc}>Slide to redeem coins at checkout to reduce your total payable amount.</div>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="card" style={styles.ledgerCard}>
        <h2 style={styles.sectionHeader}>Wallet Activity & History</h2>
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--color-text-secondary)' }}>
            No transactions yet. Complete your first booking to start earning coins!
          </div>
        ) : (
          <div style={styles.txList}>
            {transactions.map((tx) => {
              const isPositive = Number(tx.amount) > 0;
              return (
                <div key={tx.id} style={styles.txRow}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ ...styles.txIconBox, background: isPositive ? 'rgba(104,245,225,0.1)' : 'rgba(255,92,122,0.1)' }}>
                      {tx.type === 'refund' ? '🛡️' : tx.type === 'earned' ? '🪙' : tx.type === 'welcome_bonus' ? '🎉' : '💸'}
                    </div>
                    <div>
                      <div style={styles.txDesc}>{tx.description}</div>
                      <div style={styles.txDate}>
                        {new Date(tx.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ ...styles.txAmount, color: isPositive ? 'var(--color-cyan)' : 'var(--color-danger)' }}>
                    {isPositive ? `+${Number(tx.amount).toFixed(2)}` : `${Number(tx.amount).toFixed(2)}`} Coins
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px 24px', maxWidth: 960, margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: 40 },
  heroBadge: { display: 'inline-block', padding: '4px 12px', background: 'rgba(104,245,225,0.12)', color: 'var(--color-cyan)', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 },
  heroTitle: { fontSize: 36, fontWeight: 800, fontFamily: 'Sora, sans-serif', marginBottom: 12 },
  heroSub: { fontSize: 15, color: 'var(--color-text-secondary)', maxWidth: 620, margin: '0 auto', lineHeight: 1.6 },
  errorBanner: { padding: '12px 16px', background: 'rgba(255,92,122,0.12)', border: '1px solid var(--color-danger)', borderRadius: 10, color: 'var(--color-danger)', marginBottom: 24, textAlign: 'center' },
  topCardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 },
  balanceCard: { padding: 30, borderRadius: 20, background: 'linear-gradient(135deg, rgba(104,245,225,0.06) 0%, rgba(20,20,20,0.6) 100%)', border: '1px solid rgba(104,245,225,0.3)' },
  balanceHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rateBadge: { padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.08)', fontSize: 11, fontWeight: 700, color: 'var(--color-cyan)' },
  coinCountWrap: { display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 14 },
  coinCount: { fontSize: 44, fontWeight: 900, fontFamily: 'Sora, sans-serif', color: '#fff', letterSpacing: -1 },
  currencyEquiv: { fontSize: 18, color: 'var(--color-cyan)', fontWeight: 700 },
  multiplierCard: { padding: 30, borderRadius: 20 },
  tierBadge: { fontSize: 10, fontWeight: 800, border: '1px solid', padding: '2px 8px', borderRadius: 6, textTransform: 'uppercase' },
  howItWorksCard: { padding: 30, borderRadius: 20, marginBottom: 32 },
  sectionHeader: { fontSize: 20, fontWeight: 800, marginBottom: 20, fontFamily: 'Sora, sans-serif' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 },
  stepItem: { textAlign: 'center', padding: '16px 12px' },
  stepIcon: { fontSize: 32, marginBottom: 10 },
  stepTitle: { fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#fff' },
  stepDesc: { fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 },
  ledgerCard: { padding: 30, borderRadius: 20 },
  txList: { display: 'flex', flexDirection: 'column', gap: 14 },
  txRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' },
  txIconBox: { width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  txDesc: { fontSize: 14, fontWeight: 600, color: '#fff' },
  txDate: { fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: 800, fontFamily: 'Sora, sans-serif' },
};
