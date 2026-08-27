import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import BookingTicket from '../components/BookingTicket';

export default function BookingTicketPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/bookings/${bookingId}`)
      .then(({ data }) => setBooking(data))
      .catch((err) => {
        console.error('Failed to fetch ticket', err);
        setError(err.response?.data?.error || 'Ticket not found or you do not have permission to view it.');
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  return (
    <div style={styles.page}>
      <div style={styles.topNav}>
        <Link to="/bookings" style={styles.backLink}>
          ← Back to My Bookings
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-secondary)' }}>
          <p>Retrieving your ticket…</p>
        </div>
      ) : error ? (
        <div className="card" style={styles.errorCard}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Unable to load ticket</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24 }}>{error}</p>
          <button className="btn-primary" onClick={() => navigate('/bookings')}>
            View My Bookings
          </button>
        </div>
      ) : (
        <BookingTicket booking={booking} />
      )}
    </div>
  );
}

const styles = {
  page: { padding: '36px 48px 60px', maxWidth: 900, margin: '0 auto', minHeight: '85vh' },
  topNav: { marginBottom: 24 },
  backLink: { fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center' },
  errorCard: { padding: 48, textAlign: 'center', maxWidth: 480, margin: '40px auto' },
};
