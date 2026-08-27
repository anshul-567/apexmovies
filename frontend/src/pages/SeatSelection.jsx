import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import SeatMap from '../components/SeatMap';
import { useBooking } from '../context/BookingContext';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { selectedSeats, totalAmount, holdSelectedSeats, releaseSelectedSeats } = useBooking();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isProceedingRef = useRef(false);

  const loadSeats = useCallback(() => {
    setLoading(true);
    api.get(`/shows/${showId}/seats`)
      .then(({ data }) => {
        setSeats(data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load auditorium seat layout');
      })
      .finally(() => setLoading(false));
  }, [showId]);

  useEffect(() => { loadSeats(); }, [loadSeats]);

  // Release any held seats ONLY when unmounting if user leaves without checking out
  useEffect(() => {
    return () => {
      if (!isProceedingRef.current) {
        releaseSelectedSeats().catch(() => {});
      }
    };
  }, [releaseSelectedSeats]);

  const handleProceed = async () => {
    setError('');
    setSubmitting(true);
    try {
      await holdSelectedSeats(showId);
      isProceedingRef.current = true;
      navigate(`/shows/${showId}/checkout`);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not hold those seats. Please try again.');
      loadSeats();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Select your seats</h1>
      <p style={styles.subtitle}>Select up to 10 seats per booking</p>
      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--color-text-secondary)' }}>
          <p style={{ fontSize: 16 }}>Loading live auditorium seats…</p>
        </div>
      ) : (
        <SeatMap seats={seats} />
      )}

      <div style={styles.summaryBar}>
        <div>
          <div style={styles.summaryLabel}>{selectedSeats.length}/10 seat{selectedSeats.length !== 1 ? 's' : ''} selected</div>
          <div style={styles.summaryTotal}>₹{totalAmount.toFixed(2)}</div>
        </div>
        <button
          className="btn-primary"
          disabled={!selectedSeats.length || submitting}
          onClick={handleProceed}
        >
          {submitting ? 'Holding seats…' : 'Proceed to checkout'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 900, margin: '0 auto' },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 28, textAlign: 'center' },
  error: { background: 'rgba(255,92,122,0.12)', color: 'var(--color-danger)', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 },
  summaryBar: {
    marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px', borderRadius: 14, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
  },
  summaryLabel: { fontSize: 13, color: 'var(--color-text-muted)' },
  summaryTotal: { fontSize: 22, fontWeight: 700 },
};
