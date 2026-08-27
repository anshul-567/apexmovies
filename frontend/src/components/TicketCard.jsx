import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';

export default function TicketCard({ movie, ctaLabel, onFavoriteChange, isInitiallyFavorited }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(isInitiallyFavorited || false);
  const [favLoading, setFavLoading] = useState(false);

  const isUpcoming = movie.status === 'upcoming';

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
    <div className="ticket-card" onClick={() => navigate(`/movies/${movie.id}`)}>
      <div className="ticket-poster">
        <img
          src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop'}
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop';
          }}
        />
        {movie.status === 'now_showing' && !movie.rating && <span className="ticket-badge">Now showing</span>}
        {isUpcoming && movie.release_date && (
          <span className="ticket-badge">
            {new Date(movie.release_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        )}
        {movie.rating && <span className="ticket-rating">★ {movie.rating}</span>}

        <button
          className="ticket-fav-btn"
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
            transition: 'all 0.2s ease',
            zIndex: 3,
          }}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>
      <div className="ticket-perf" />
      <div className="ticket-info">
        <div className="ticket-title">{movie.title}</div>
        <div className="ticket-sub">
          {movie.genre} <span className="ticket-dot" /> {movie.duration_mins} min
          {movie.language ? ` · ${movie.language}` : ''}
        </div>
        <div className="ticket-cta">
          <span className="price mono">{ctaLabel || (movie.min_price ? `From ₹${Number(movie.min_price).toFixed(0)}` : (isUpcoming ? 'Notify me' : 'View showtimes'))}</span>
          <span className="book">{isUpcoming ? '→' : 'Book →'}</span>
        </div>
      </div>
    </div>
  );
}
