import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal State
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Plans changed');
  const [submittingCancel, setSubmittingCancel] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);
  const [cancelError, setCancelError] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    api.get('/bookings/mine')
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    if (!cancellingBooking) return;

    setSubmittingCancel(true);
    setCancelError('');

    try {
      const { data } = await api.post(`/bookings/${cancellingBooking.id}/cancel`, {
        reason: cancelReason,
      });
      setCancelResult(data);
      // Refresh bookings list
      fetchBookings();
    } catch (err) {
      setCancelError(err.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setSubmittingCancel(false);
    }
  };

  const isShowCancellable = (startTime) => {
    const showMs = new Date(startTime).getTime();
    const nowMs = Date.now();
    return (showMs - nowMs) / (1000 * 60 * 60) >= 1; // > 1 hour before showtime
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Bookings & E-Tickets</h1>
      {loading && <p style={styles.muted}>Loading bookings…</p>}
      {!loading && !bookings.length && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ ...styles.muted, marginBottom: 16 }}>No bookings yet — go find something to watch.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Explore Movies</button>
        </div>
      )}

      <div style={styles.list}>
        {bookings.map((b) => {
          const cancellable = b.status === 'confirmed' && isShowCancellable(b.start_time);

          return (
            <div key={b.id} className="card" style={styles.card}>
              <img src={b.poster_url} alt={b.movie_title} style={styles.poster} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={styles.movieTitle}>{b.movie_title}</div>
                <div style={styles.meta}>{b.theater_name} · {b.screen_name}</div>
                <div style={styles.meta}>
                  {new Date(b.start_time).toLocaleString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div style={styles.seats}>
                  {b.seats.map((s, i) => (
                    <span key={i} style={styles.seatChip}>{s.row}{s.seat_number}</span>
                  ))}
                </div>
              </div>

              <div style={styles.right}>
                <div style={styles.ref}>Ref: {b.booking_reference}</div>
                <div style={styles.amount}>₹{Number(b.total_amount).toFixed(2)}</div>
                {Number(b.discount_amount) > 0 && (
                  <div style={styles.discountTag}>Saved ₹{Number(b.discount_amount).toFixed(0)}</div>
                )}
                <div style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      ...styles.status,
                      ...(b.status === 'confirmed' ? styles.confirmed : styles.cancelledStatus),
                    }}
                  >
                    ● {b.status === 'cancelled' ? 'Cancelled & Refunded' : b.status}
                  </span>
                </div>

                {b.status === 'confirmed' && (
                  <div style={styles.btnRow}>
                    <button
                      className="btn-primary"
                      style={styles.ticketBtn}
                      onClick={() => navigate(`/bookings/${b.id}/ticket`)}
                    >
                      View Ticket
                    </button>

                    {cancellable && (
                      <button
                        className="btn-ghost"
                        style={styles.cancelBtn}
                        onClick={() => {
                          setCancellingBooking(b);
                          setCancelResult(null);
                          setCancelError('');
                        }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingBooking && (
        <div style={styles.modalOverlay}>
          <div className="card" style={styles.modalCard}>
            {cancelResult ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🛡️</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-cyan)', marginBottom: 8 }}>
                  Booking Cancelled Successfully
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 20 }}>
                  Your refund of <strong>₹{cancelResult.refundAmount?.toFixed(2)}</strong> has been instantly credited to your <strong>ApexCoins Rewards Wallet</strong>.
                </p>

                <div style={styles.refundDetailsBox}>
                  <div style={styles.refundRow}>
                    <span>Booking Reference</span>
                    <strong>{cancelResult.bookingReference}</strong>
                  </div>
                  <div style={styles.refundRow}>
                    <span>Refund Amount</span>
                    <strong style={{ color: 'var(--color-cyan)' }}>+₹{cancelResult.refundAmount?.toFixed(2)}</strong>
                  </div>
                  <div style={styles.refundRow}>
                    <span>Cancellation Fee</span>
                    <span>₹{cancelResult.cancellationFee?.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24 }}>
                  <button className="btn-primary" onClick={() => navigate('/rewards')}>
                    View Rewards Wallet
                  </button>
                  <button className="btn-ghost" onClick={() => setCancellingBooking(null)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCancelBooking}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Sora, sans-serif' }}>
                    Cancel Booking & Request Refund
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCancellingBooking(null)}
                    style={styles.closeBtn}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{cancellingBooking.movie_title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {cancellingBooking.theater_name} · Ref: {cancellingBooking.booking_reference}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-cyan)', fontWeight: 700, marginTop: 4 }}>
                    Total Paid: ₹{Number(cancellingBooking.total_amount).toFixed(2)}
                  </div>
                </div>

                <div style={{ fontSize: 12.5, color: 'var(--color-text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
                  🛡️ <strong>Refund Policy:</strong> Gold VIP members receive 100% full refund (₹0 cancellation fee). Standard bookings receive 75% refund instantly to your ApexCoins Wallet.
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                    Reason for Cancellation
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    style={styles.selectInput}
                  >
                    <option value="Plans changed">Change of plans / scheduling conflict</option>
                    <option value="Booked wrong show or seats">Accidentally booked wrong seats or showtime</option>
                    <option value="Emergency or unable to travel">Emergency / Unable to visit cinema</option>
                    <option value="Other">Other reason</option>
                  </select>
                </div>

                {cancelError && <div style={styles.errorBanner}>⚠ {cancelError}</div>}

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submittingCancel}
                    style={{ flex: 1, padding: '12px 0', background: 'var(--color-danger)', borderColor: 'transparent' }}
                  >
                    {submittingCancel ? 'Processing Refund…' : 'Confirm Cancellation'}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setCancellingBooking(null)}
                    style={{ padding: '0 16px' }}
                  >
                    Keep Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 880, margin: '0 auto', minHeight: '80vh' },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 28 },
  muted: { color: 'var(--color-text-muted)', fontSize: 14 },
  list: { display: 'flex', flexDirection: 'column', gap: 18 },
  card: { display: 'flex', gap: 20, padding: 20, alignItems: 'center', flexWrap: 'wrap' },
  poster: { width: 70, height: 105, objectFit: 'cover', borderRadius: 8 },
  movieTitle: { fontWeight: 700, fontSize: 16, marginBottom: 4 },
  meta: { fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 2 },
  seats: { display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  seatChip: { fontSize: 11, fontWeight: 700, background: 'rgba(104,245,225,0.1)', border: '1px solid rgba(104,245,225,0.3)', color: 'var(--color-cyan)', padding: '3px 8px', borderRadius: 6 },
  right: { textAlign: 'right', marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  ref: { fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 700, marginBottom: 4, fontFamily: 'Space Mono, monospace' },
  amount: { fontSize: 18, fontWeight: 800, marginBottom: 2 },
  discountTag: { fontSize: 11, fontWeight: 700, color: '#38EF7D', background: 'rgba(56,239,125,0.1)', padding: '2px 6px', borderRadius: 4, marginBottom: 6 },
  status: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' },
  confirmed: { color: 'var(--color-cyan)' },
  cancelledStatus: { color: 'var(--color-danger)' },
  btnRow: { display: 'flex', gap: 8, marginTop: 6 },
  ticketBtn: { fontSize: 12, padding: '6px 14px', borderRadius: 6 },
  cancelBtn: { fontSize: 12, padding: '6px 12px', borderRadius: 6, color: 'var(--color-danger)', borderColor: 'rgba(255,92,122,0.3)' },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
  },
  modalCard: { width: '100%', maxWidth: 460, padding: 28, borderRadius: 20, border: '1px solid var(--color-border)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 18, cursor: 'pointer' },
  selectInput: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)', color: '#fff', fontSize: 13 },
  errorBanner: { padding: '10px 14px', background: 'rgba(255,92,122,0.12)', border: '1px solid var(--color-danger)', borderRadius: 8, color: 'var(--color-danger)', fontSize: 12.5, marginBottom: 12 },
  refundDetailsBox: { padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' },
  refundRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-secondary)' },
};


