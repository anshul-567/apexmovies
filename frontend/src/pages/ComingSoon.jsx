import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import TicketCard from '../components/TicketCard';

export default function ComingSoon() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');

  useEffect(() => {
    setLoading(true);
    api.get('/movies?status=upcoming&limit=40')
      .then(({ data }) => {
        setMovies(data.movies || []);
      })
      .catch((err) => console.error('Failed to load upcoming movies', err))
      .finally(() => setLoading(false));
  }, []);

  const genres = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Horror', 'Animation', 'Comedy', 'Mystery'];

  const filteredMovies = selectedGenre === 'All'
    ? movies
    : movies.filter((m) => m.genre === selectedGenre);

  return (
    <div style={styles.page}>
      <div className="card" style={styles.heroBanner}>
        <span style={styles.heroBadge}>Coming Soon</span>
        <h1 style={styles.heroTitle}>Upcoming Blockbusters</h1>
        <p style={styles.heroSub}>
          Get early access, set reminders, and explore trailers for the most anticipated cinema releases heading to theaters soon.
        </p>

        {/* Genre Filter Pills */}
        <div style={styles.genreRow}>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={selectedGenre === g ? 'btn-primary' : 'btn-ghost'}
              style={styles.genreBtn}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={styles.muted}>Discovering upcoming releases…</p>}

      {!loading && !filteredMovies.length && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ ...styles.muted, marginBottom: 16 }}>No upcoming releases found in {selectedGenre}.</p>
          <button className="btn-primary" onClick={() => setSelectedGenre('All')}>Show All Upcoming</button>
        </div>
      )}

      <div style={styles.grid}>
        {filteredMovies.map((movie) => (
          <TicketCard key={movie.id} movie={movie} ctaLabel="View Details" />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 1200, margin: '0 auto' },
  heroBanner: {
    padding: '40px', marginBottom: 40,
    background: 'linear-gradient(135deg, rgba(155,108,255,0.12) 0%, rgba(68,85,255,0.08) 50%, rgba(10,10,10,0.8) 100%)',
    border: '1px solid rgba(155,108,255,0.3)',
  },
  heroBadge: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8,
    color: 'var(--color-violet)', background: 'rgba(155,108,255,0.15)', padding: '4px 10px',
    borderRadius: 6, display: 'inline-block', marginBottom: 12,
  },
  heroTitle: { fontSize: 32, fontWeight: 800, marginBottom: 12, fontFamily: 'Sora, sans-serif' },
  heroSub: { fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 640, marginBottom: 24 },
  genreRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  genreBtn: { padding: '8px 16px', fontSize: 13, borderRadius: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 },
  muted: { color: 'var(--color-text-muted)', fontSize: 14, textAlign: 'center', margin: '40px 0' },
};
