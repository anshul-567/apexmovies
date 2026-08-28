import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import api from '../api/axiosClient';

const AVAILABLE_OFFERS = [
  { code: 'WELCOME100', title: '₹100 Off', desc: 'Flat ₹100 off on first booking (Min ₹200)', badge: 'First Booking' },
  { code: 'WEEKEND3', title: 'Buy 2 Get 1 Free', desc: '100% off lowest priced seat (Min 3 seats)', badge: 'Weekend Offer' },
  { code: 'FAMILY4', title: '₹200 Off Family', desc: 'Flat ₹200 off on 4+ seats', badge: 'Family Pack' },
  { code: 'APEX15', title: '15% Off', desc: '15% instant discount on any booking', badge: 'Apex Exclusive' },
  { code: 'CREDPAY', title: '₹75 Cred UPI', desc: 'Flat ₹75 instant discount on bookings >= ₹300', badge: 'Cred Special' },
  { code: 'GPAY100', title: '20% GPay', desc: '20% discount up to ₹100 on UPI', badge: 'Google Pay' },
  { code: 'HDFCICICI', title: 'Bank Partner', desc: '50% off on 2nd ticket (Max ₹150)', badge: 'Card Partner' },
  { code: 'RUPAY20', title: '20% RuPay', desc: '20% off up to ₹100 on RuPay cards', badge: 'RuPay Platinum' },
  { code: 'STUDENT25', title: '25% Student', desc: '25% off up to ₹150 on tickets', badge: 'Student Special' },
  { code: 'FLAT50', title: '₹50 Off', desc: 'Flat ₹50 off on 2+ tickets', badge: 'Duo Saver' },
  { code: 'POPCORN50', title: '₹50 Snack Voucher', desc: 'Flat ₹50 off on cinema combo orders', badge: 'Snack Deal' },
];

export default function Checkout() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { selectedSeats, totalAmount, show, confirmCheckout } = useBooking();

  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Promo, Membership, Wallet & Gift Card state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discountAmount, finalAmount, message }
  const [promoError, setPromoError] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [membership, setMembership] = useState(null);
  const [useMembershipTicket, setUseMembershipTicket] = useState(false);

  // Wallet Coins state
  const [wallet, setWallet] = useState(null);
  const [useCoins, setUseCoins] = useState(false);
  const [coinsToRedeem, setCoinsToRedeem] = useState(0);

  // Gift Card state
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardPin, setGiftCardPin] = useState('');
  const [appliedGiftCard, setAppliedGiftCard] = useState(null);
  const [giftCardError, setGiftCardError] = useState('');
  const [checkingGiftCard, setCheckingGiftCard] = useState(false);

  // Fetch membership & wallet on mount
  useEffect(() => {
    api.get('/memberships/me')
      .then(({ data }) => setMembership(data))
      .catch(() => {});

    api.get('/wallet/me')
      .then(({ data }) => setWallet(data))
      .catch(() => {});
  }, []);

  const subtotal = totalAmount;

  // Compute member free ticket discount (lowest priced seat)
  const membershipDiscount = useMemo(() => {
    if (!useMembershipTicket || !selectedSeats.length) return 0;
    const sorted = selectedSeats.map((s) => Number(s.price)).sort((a, b) => a - b);
    return sorted[0] || 0;
  }, [useMembershipTicket, selectedSeats]);

  // Seats eligible for promo (excluding the 1 free member ticket if active)
  const promoSeats = useMemo(() => {
    if (!useMembershipTicket || selectedSeats.length <= 1) return selectedSeats;
    const sorted = [...selectedSeats].sort((a, b) => Number(a.price) - Number(b.price));
    return sorted.slice(1);
  }, [useMembershipTicket, selectedSeats]);

  const promoDiscount = appliedPromo ? Number(appliedPromo.discountAmount || 0) : 0;
  const afterTicketDiscounts = Math.max(0, subtotal - ((useMembershipTicket ? membershipDiscount : 0) + promoDiscount));

  // Max coins that can be redeemed (up to available wallet balance and current remaining payable)
  const availableCoins = wallet ? Number(wallet.coinBalance) : 0;
  const coinsDiscount = useCoins ? Math.min(availableCoins, afterTicketDiscounts) : 0;
  const afterCoinsPayable = Math.max(0, afterTicketDiscounts - coinsDiscount);

  // Gift card discount (up to card balance and after-coins remaining payable)
  const giftCardDiscount = appliedGiftCard ? Math.min(Number(appliedGiftCard.current_balance), afterCoinsPayable) : 0;
  const payableAmount = Math.max(0, afterCoinsPayable - giftCardDiscount);

  const handleApplyPromo = async (codeToApply) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (useMembershipTicket && selectedSeats.length <= 1) {
      setPromoError('Your seat is already 100% free with your member pass!');
      return;
    }

    setPromoError('');
    setValidatingPromo(true);

    try {
      const seatsToValidate = promoSeats.map((s) => ({
        id: s.show_seat_id,
        price: Number(s.price),
      }));

      const { data } = await api.post('/bookings/validate-promo', {
        seats: seatsToValidate,
        promoCode: code,
      });

      setAppliedPromo(data);
      setPromoInput(code);
      setPromoError('');
    } catch (err) {
      setAppliedPromo(null);
      setPromoError(err.response?.data?.error || 'Invalid promo code');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handleToggleMembershipTicket = async (checked) => {
    setUseMembershipTicket(checked);
    if (appliedPromo && appliedPromo.code) {
      const remainingSeats = checked
        ? [...selectedSeats].sort((a, b) => Number(a.price) - Number(b.price)).slice(1)
        : selectedSeats;

      if (remainingSeats.length > 0) {
        try {
          const { data } = await api.post('/bookings/validate-promo', {
            seats: remainingSeats.map((s) => ({ id: s.show_seat_id, price: Number(s.price) })),
            promoCode: appliedPromo.code,
          });
          setAppliedPromo(data);
        } catch {
          setAppliedPromo(null);
        }
      } else {
        setAppliedPromo(null);
      }
    }
  };

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim() || !giftCardPin.trim()) {
      setGiftCardError('Please enter both gift card code and PIN');
      return;
    }
    setGiftCardError('');
    setCheckingGiftCard(true);

    try {
      const { data } = await api.post('/gift-cards/check-balance', {
        cardCode: giftCardCode.trim().toUpperCase(),
        pin: giftCardPin.trim(),
      });
      setAppliedGiftCard(data.card);
      setGiftCardError('');
    } catch (err) {
      setAppliedGiftCard(null);
      setGiftCardError(err.response?.data?.error || 'Invalid gift card code or PIN');
    } finally {
      setCheckingGiftCard(false);
    }
  };

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardCode('');
    setGiftCardPin('');
    setGiftCardError('');
  };

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      const promoCode = appliedPromo ? appliedPromo.code : '';
      const booking = await confirmCheckout(
        showId,
        promoCode,
        useMembershipTicket,
        useCoins ? coinsDiscount : 0,
        appliedGiftCard ? giftCardCode.trim().toUpperCase() : '',
        appliedGiftCard ? giftCardPin.trim() : ''
      );
      setConfirmation(booking);
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed. Your seat hold may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    const hasDiscount = Number(confirmation.discount_amount) > 0;
    return (
      <div style={styles.page}>
        <div className="card" style={styles.confirmCard}>
          <div style={styles.checkGlow}>✓</div>
          <h1 style={styles.confirmTitle}>Booking confirmed</h1>
          <p style={styles.confirmRef}>Reference <span className="text-gradient" style={{ fontWeight: 700 }}>{confirmation.booking_reference}</span></p>
          <p style={styles.confirmAmount}>₹{Number(confirmation.total_amount).toFixed(2)} charged</p>

          {hasDiscount && (
            <div style={styles.savingsBanner}>
              🎉 You saved <strong style={{ color: 'var(--color-cyan)' }}>₹{Number(confirmation.discount_amount).toFixed(2)}</strong> with code <span style={styles.savedCode}>{confirmation.promo_code}</span>
            </div>
          )}

          <div style={styles.confirmActions}>
            <button
              className="btn-primary"
              style={styles.confirmBtnPrimary}
              onClick={() => navigate(`/bookings/${confirmation.id}/ticket`)}
            >
              🎟 View Ticket
            </button>
            <button
              className="btn-ghost"
              style={styles.confirmBtn}
              onClick={() => navigate(`/bookings/${confirmation.id}/ticket`)}
            >
              ⬇ Download Ticket
            </button>
            <button
              className="btn-ghost"
              style={styles.confirmBtn}
              onClick={() => navigate('/bookings')}
            >
              📋 View My Bookings
            </button>
            <button
              className="btn-ghost"
              style={styles.confirmBtn}
              onClick={() => navigate('/')}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Confirm and pay</h1>
      {error && <div style={styles.error}>{error}</div>}

      {/* Booking Summary */}
      <div className="card" style={styles.summaryCard}>
        {show && <div style={styles.showTitle}>{show.theater_name} · {new Date(show.start_time).toLocaleString()}</div>}
        <div style={styles.seatList}>
          {selectedSeats.map((s) => (
            <span key={s.show_seat_id} style={styles.seatChip}>
              {s.row_label}{s.seat_number} <small style={styles.seatTypeTag}>({s.seat_type})</small>
            </span>
          ))}
        </div>

        {/* Apex Premiere Club Member Benefits */}
        {membership && membership.tier !== 'free' && (
          <div style={styles.memberPerkCard}>
            <div style={styles.memberPerkTop}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>👑</span>
                <div>
                  <strong style={{ color: '#FFD700', fontSize: 13.5 }}>{membership.tierInfo?.name} Active</strong>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
                    {membership.freeTicketsRemaining} Free Ticket{membership.freeTicketsRemaining !== 1 ? 's' : ''} available
                  </div>
                </div>
              </div>

              {membership.freeTicketsRemaining > 0 && (
                <label style={styles.ticketToggleLabel}>
                  <input
                    type="checkbox"
                    checked={useMembershipTicket}
                    onChange={(e) => handleToggleMembershipTicket(e.target.checked)}
                    style={{ accentColor: '#FFD700', width: 16, height: 16 }}
                  />
                  <span>Redeem 1 Free Ticket</span>
                </label>
              )}
            </div>
            {useMembershipTicket && (
              <div style={styles.ticketRedeemedNote}>
                ✓ 1 Free Member Ticket applied (-₹{membershipDiscount.toFixed(2)})
              </div>
            )}
          </div>
        )}

        {/* Promo Code Input & Offers */}
        <div style={styles.promoSection}>
          <div style={styles.promoLabel}>Discount Offer & Promo Code</div>
          <div style={styles.promoInputRow}>
            <input
              type="text"
              placeholder="Enter coupon code (e.g. WELCOME100)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              disabled={validatingPromo || appliedPromo != null}
              style={styles.promoInput}
            />
            {appliedPromo ? (
              <button className="btn-ghost" style={styles.removePromoBtn} onClick={handleRemovePromo}>
                Remove
              </button>
            ) : (
              <button
                className="btn-primary"
                style={styles.applyPromoBtn}
                onClick={() => handleApplyPromo()}
                disabled={validatingPromo || !promoInput.trim()}
              >
                {validatingPromo ? 'Validating…' : 'Apply'}
              </button>
            )}
          </div>

          {promoError && <div style={styles.promoErrorText}>⚠ {promoError}</div>}
          {appliedPromo && (
            <div style={styles.promoSuccessBox}>
              <span>✓ <strong>{appliedPromo.code}</strong> applied ({appliedPromo.message})</span>
              <button onClick={handleRemovePromo} style={styles.removeIconBtn} title="Remove code">✕</button>
            </div>
          )}

          {/* Quick Apply Chips */}
          <div style={styles.quickOffersHeader}>Popular Offers (Click to Apply)</div>
          <div style={styles.offerChipsGrid}>
            {AVAILABLE_OFFERS.map((off) => {
              const isSelected = appliedPromo?.code === off.code;
              return (
                <div
                  key={off.code}
                  onClick={() => handleApplyPromo(off.code)}
                  style={{
                    ...styles.offerChip,
                    ...(isSelected ? styles.offerChipActive : {}),
                  }}
                >
                  <div style={styles.offerChipTop}>
                    <span style={styles.offerChipCode}>{off.code}</span>
                    <span style={styles.offerChipBadge}>{off.badge}</span>
                  </div>
                  <div style={styles.offerChipDesc}>{off.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ApexCoins Wallet Box */}
        {wallet && availableCoins > 0 && (
          <div style={styles.walletBox}>
            <div style={styles.walletHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🪙</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Redeem ApexCoins</div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-muted)' }}>
                    Balance: <strong>{availableCoins.toFixed(0)} Coins</strong> (Save up to ₹{Math.min(availableCoins, afterTicketDiscounts).toFixed(2)})
                  </div>
                </div>
              </div>
              <label style={styles.walletToggleLabel}>
                <input
                  type="checkbox"
                  checked={useCoins}
                  onChange={(e) => setUseCoins(e.target.checked)}
                  disabled={afterTicketDiscounts <= 0}
                  style={{ accentColor: 'var(--color-cyan)', width: 16, height: 16 }}
                />
                <span>Use Coins</span>
              </label>
            </div>
            {useCoins && (
              <div style={styles.coinsRedeemedNote}>
                ✓ Redeeming {coinsDiscount.toFixed(0)} ApexCoins (-₹{coinsDiscount.toFixed(2)})
              </div>
            )}
          </div>
        )}

        {/* Gift Card Voucher Box */}
        <div style={styles.giftCardBox}>
          <div style={styles.promoLabel}>Apex Gift Card / E-Voucher</div>
          <div style={styles.giftCardInputsRow}>
            <input
              type="text"
              placeholder="16-Digit Card Code (APEX-XXXX-...)"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
              disabled={checkingGiftCard || appliedGiftCard != null}
              style={{ ...styles.promoInput, flex: 2 }}
            />
            <input
              type="password"
              maxLength={4}
              placeholder="PIN"
              value={giftCardPin}
              onChange={(e) => setGiftCardPin(e.target.value)}
              disabled={checkingGiftCard || appliedGiftCard != null}
              style={{ ...styles.promoInput, flex: 1, maxWidth: 80, textAlign: 'center' }}
            />
            {appliedGiftCard ? (
              <button className="btn-ghost" style={styles.removePromoBtn} onClick={handleRemoveGiftCard}>
                Remove
              </button>
            ) : (
              <button
                className="btn-primary"
                style={styles.applyPromoBtn}
                onClick={handleApplyGiftCard}
                disabled={checkingGiftCard || !giftCardCode.trim() || !giftCardPin.trim()}
              >
                {checkingGiftCard ? '...' : 'Apply'}
              </button>
            )}
          </div>

          {giftCardError && <div style={styles.promoErrorText}>⚠ {giftCardError}</div>}
          {appliedGiftCard && (
            <div style={styles.promoSuccessBox}>
              <span>✓ <strong>Gift Card</strong> applied (Available: ₹{Number(appliedGiftCard.current_balance).toFixed(2)})</span>
              <button onClick={handleRemoveGiftCard} style={styles.removeIconBtn} title="Remove gift card">✕</button>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div style={styles.breakdown}>
          <div style={styles.breakdownRow}>
            <span>Tickets Subtotal ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {useMembershipTicket && (
            <div style={{ ...styles.breakdownRow, color: '#FFD700', fontWeight: 600 }}>
              <span>👑 Member Pass (1 Free Ticket)</span>
              <span>-₹{membershipDiscount.toFixed(2)}</span>
            </div>
          )}

          {appliedPromo && (
            <div style={{ ...styles.breakdownRow, color: 'var(--color-cyan)', fontWeight: 600 }}>
              <span>🎟️ Coupon Discount ({appliedPromo.code})</span>
              <span>-₹{promoDiscount.toFixed(2)}</span>
            </div>
          )}

          {useCoins && coinsDiscount > 0 && (
            <div style={{ ...styles.breakdownRow, color: 'var(--color-cyan)', fontWeight: 600 }}>
              <span>🪙 ApexCoins Redeemed</span>
              <span>-₹{coinsDiscount.toFixed(2)}</span>
            </div>
          )}

          {appliedGiftCard && giftCardDiscount > 0 && (
            <div style={{ ...styles.breakdownRow, color: '#FFD700', fontWeight: 600 }}>
              <span>🎁 Gift Card Balance Applied</span>
              <span>-₹{giftCardDiscount.toFixed(2)}</span>
            </div>
          )}

          <div style={styles.totalRow}>
            <span>Amount Payable</span>
            <span style={styles.totalAmount}>₹{payableAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        style={{ width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 700 }}
        onClick={handleConfirm}
        disabled={submitting}
      >
        {submitting ? 'Confirming booking…' : `Pay ₹${payableAmount.toFixed(2)} & Confirm`}
      </button>
    </div>
  );
}

const styles = {
  page: { padding: '24px 16px 48px', maxWidth: 560, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  error: { background: 'rgba(255,92,122,0.12)', color: 'var(--color-danger)', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 },
  summaryCard: { padding: 20, marginBottom: 20 },
  showTitle: { fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 },
  seatList: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  seatChip: { background: 'var(--gradient-primary)', color: '#04120F', fontWeight: 700, fontSize: 12, padding: '6px 12px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4 },
  seatTypeTag: { fontSize: 10, opacity: 0.85, fontWeight: 600, textTransform: 'capitalize' },
  
  // Promo section
  promoSection: { borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '20px 0', marginBottom: 20 },
  promoLabel: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--color-text-secondary)', marginBottom: 10 },
  promoInputRow: { display: 'flex', gap: 8, marginBottom: 10 },
  promoInput: { flex: 1, padding: '10px 14px', borderRadius: 8, fontSize: 13.5, letterSpacing: 0.5, fontWeight: 600, textTransform: 'uppercase' },
  applyPromoBtn: { padding: '0 20px', borderRadius: 8, fontSize: 13, fontWeight: 700 },
  removePromoBtn: { padding: '0 16px', borderRadius: 8, fontSize: 12.5, color: 'var(--color-danger)', borderColor: 'rgba(255,92,122,0.4)' },
  promoErrorText: { fontSize: 12.5, color: 'var(--color-danger)', marginTop: 4, marginBottom: 8 },
  promoSuccessBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'rgba(104, 245, 225, 0.12)', border: '1px solid var(--color-cyan)',
    color: 'var(--color-cyan)', padding: '8px 12px', borderRadius: 8, fontSize: 12.5, marginBottom: 14,
  },
  removeIconBtn: { background: 'none', border: 'none', color: 'var(--color-cyan)', cursor: 'pointer', fontWeight: 700, fontSize: 14, padding: 0 },
  quickOffersHeader: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text-muted)', marginBottom: 10 },
  offerChipsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 },
  offerChip: {
    padding: '10px 12px', borderRadius: 10, background: 'var(--color-bg-surface)',
    border: '1px dashed var(--color-border)', cursor: 'pointer', transition: 'all 0.2s ease',
  },
  offerChipActive: { borderColor: 'var(--color-cyan)', background: 'rgba(104, 245, 225, 0.08)', boxShadow: '0 0 12px rgba(104, 245, 225, 0.2)' },
  offerChipTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  offerChipCode: { fontFamily: 'Space Mono, monospace', fontSize: 12, fontWeight: 700, color: 'var(--color-cyan)' },
  offerChipBadge: { fontSize: 9.5, padding: '2px 6px', borderRadius: 4, background: 'rgba(155,108,255,0.2)', color: 'var(--color-violet)', fontWeight: 700 },
  offerChipDesc: { fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.3 },

  // Member Perk
  memberPerkCard: { padding: 14, borderRadius: 10, background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(20,20,20,0.8) 100%)', border: '1px solid rgba(255,215,0,0.3)', marginBottom: 20 },
  memberPerkTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  ticketToggleLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#FFD700', fontWeight: 700, cursor: 'pointer' },
  ticketRedeemedNote: { fontSize: 12, color: '#FFD700', marginTop: 8, fontWeight: 600, borderTop: '1px solid rgba(255,215,0,0.2)', paddingTop: 6 },

  // Wallet Coins Box
  walletBox: { padding: 14, borderRadius: 10, background: 'linear-gradient(135deg, rgba(104,245,225,0.08) 0%, rgba(20,20,20,0.8) 100%)', border: '1px solid rgba(104,245,225,0.3)', marginBottom: 20 },
  walletHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  walletToggleLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-cyan)', fontWeight: 700, cursor: 'pointer' },
  coinsRedeemedNote: { fontSize: 12, color: 'var(--color-cyan)', marginTop: 8, fontWeight: 600, borderTop: '1px solid rgba(104,245,225,0.2)', paddingTop: 6 },

  // Gift Card Box
  giftCardBox: { borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '18px 0', marginBottom: 20 },
  giftCardInputsRow: { display: 'flex', gap: 8, marginBottom: 8 },

  // Breakdown
  breakdown: { display: 'flex', flexDirection: 'column', gap: 10 },
  breakdownRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--color-text-secondary)' },
  totalRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 14, fontSize: 16, fontWeight: 600 },
  totalAmount: { fontWeight: 800, fontSize: 22, color: 'var(--color-text-primary)' },

  // Confirm Card
  confirmCard: { padding: 40, textAlign: 'center' },
  checkGlow: {
    width: 64, height: 64, margin: '0 auto 20px', borderRadius: '50%', background: 'var(--gradient-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#04120F',
    boxShadow: 'var(--shadow-cyan-glow)',
  },
  confirmTitle: { fontSize: 24, fontWeight: 700, marginBottom: 12 },
  confirmRef: { color: 'var(--color-text-secondary)', marginBottom: 8 },
  confirmAmount: { color: 'var(--color-text-primary)', marginBottom: 14, fontSize: 18, fontWeight: 700 },
  savingsBanner: {
    background: 'rgba(104, 245, 225, 0.12)', border: '1px solid var(--color-cyan)',
    color: '#FFFFFF', padding: '10px 16px', borderRadius: 10, fontSize: 13.5, marginBottom: 24,
    display: 'inline-block',
  },
  savedCode: { fontFamily: 'Space Mono, monospace', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 },
  confirmActions: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto' },
  confirmBtnPrimary: { width: '100%', padding: '12px 0', fontSize: 14, fontWeight: 700 },
  confirmBtn: { width: '100%', padding: '11px 0', fontSize: 13.5 },
};

