import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import TicketCard from '../components/TicketCard';

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data || []);
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavoriteChange = (movieId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((m) => m.id !== movieId));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Wishlist</h1>
          <p style={styles.subtitle}>
            {favorites.length} saved {favorites.length === 1 ? 'movie' : 'movies'}
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
          <p>Loading your saved movies…</p>
        </div>
      ) : favorites.length > 0 ? (
        <div style={styles.grid}>
          {favorites.map((movie) => (
            <TicketCard
              key={movie.id}
              movie={movie}
              isInitiallyFavorited={true}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={styles.emptyCard}>
          <div style={styles.emptyIcon}>♥</div>
          <h2 style={styles.emptyTitle}>Your wishlist is empty.</h2>
          <p style={styles.emptyText}>Save movies here to find them quickly later.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Explore movies now
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '40px 48px', maxWidth: 1200, margin: '0 auto', minHeight: '80vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 },
  title: { fontSize: 28, fontWeight: 700, margin: 0, fontFamily: 'Sora, sans-serif' },
  subtitle: { fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 },
  emptyCard: {
    padding: '60px 32px', textAlign: 'center', maxWidth: 460, margin: '40px auto',
    background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)',
  },
  emptyIcon: {
    fontSize: 36, color: 'var(--color-danger)', width: 64, height: 64, borderRadius: '50%',
    background: 'rgba(255, 92, 122, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 18px',
  },
  emptyTitle: { fontSize: 20, fontWeight: 700, marginBottom: 8 },
  emptyText: { color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24, lineHeight: 1.5 },
};
