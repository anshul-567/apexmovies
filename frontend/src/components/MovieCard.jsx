import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';

export default function MovieCard({ movie, onFavoriteChange, isInitiallyFavorited }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(isInitiallyFavorited || false);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (favLoading) return;

    setFavLoading(true);
    try {
      if (isFav) {
        await api.delete(`/movies/${movie.id}/favorite`);
        setIsFav(false);
        if (onFavoriteChange) onFavoriteChange(movie.id, false);
      } else {
        await api.post(`/movies/${movie.id}/favorite`);
        setIsFav(true);
        if (onFavoriteChange) onFavoriteChange(movie.id, true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="card" style={styles.card} onClick={() => navigate(`/movies/${movie.id}`)}>
      <div style={styles.posterWrap}>
        <img
          src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'}
          alt={movie.title}
          style={styles.poster}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
          }}
        />
        {movie.status === 'now_showing' && <span style={styles.badge}>Trending</span>}
        {movie.rating && <span style={styles.rating}>★ {movie.rating}</span>}
        <button
          onClick={handleFavoriteClick}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            background: 'rgba(10, 10, 10, 0.75)',
            backdropFilter: 'blur(6px)',
            border: isFav ? '1px solid var(--color-danger)' : '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isFav ? 'var(--color-danger)' : 'rgba(255,255,255,0.7)',
            fontSize: 16,
            zIndex: 4,
          }}
        >
          {isFav ? '♥' : '♡'}
        </button>
        <div style={styles.overlay}>
          <div style={styles.playGlow}>▶</div>
        </div>
      </div>
      <div style={{ padding: '14px 14px 16px' }}>
        <div style={styles.titleRow}>
          <div style={styles.title} title={movie.title}>{movie.title}</div>
          {movie.age_rating && (
            <span
              style={{
                ...styles.ageBadge,
                borderColor: movie.age_rating === 'A' ? 'var(--color-danger)' : movie.age_rating === 'U' ? '#38EF7D' : 'var(--color-cyan)',
                color: movie.age_rating === 'A' ? 'var(--color-danger)' : movie.age_rating === 'U' ? '#38EF7D' : 'var(--color-cyan)',
                background: movie.age_rating === 'A' ? 'rgba(255,92,122,0.12)' : movie.age_rating === 'U' ? 'rgba(56,239,125,0.12)' : 'rgba(104,245,225,0.12)',
              }}
            >
              {movie.age_rating}
            </span>
          )}
        </div>
        <div style={styles.sub}>
          <span>{movie.genre}</span>
          <span style={styles.dot} />
          <span>{movie.duration_mins} min</span>
          {movie.language && (
            <>
              <span style={styles.dot} />
              <span>{movie.language}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease' },
  posterWrap: { position: 'relative', aspectRatio: '2/3', overflow: 'hidden' },
  poster: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  badge: {
    position: 'absolute', top: 12, left: 12, fontSize: 10, fontWeight: 700,
    letterSpacing: 0.5, textTransform: 'uppercase', padding: '5px 10px',
    borderRadius: 6, background: 'var(--gradient-vibrant)', color: '#fff',
  },
  rating: {
    position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700,
    padding: '4px 8px', borderRadius: 6, background: 'rgba(0,0,0,0.55)',
    color: 'var(--color-cyan)',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 100%)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 18,
    opacity: 0, transition: 'opacity 0.3s ease',
  },
  playGlow: {
    width: 46, height: 46, borderRadius: '50%', background: 'var(--gradient-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 26px rgba(104,245,225,0.6)',
  },
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, marginBottom: 6 },
  title: {
    fontSize: 14.5, fontWeight: 600, lineHeight: 1.3,
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
  },
  ageBadge: {
    fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
    padding: '2px 5px', borderRadius: 4, border: '1px solid', flexShrink: 0,
  },
  sub: { fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 },
  dot: { width: 3, height: 3, borderRadius: '50%', background: 'var(--color-text-muted)', display: 'inline-block' },
};
