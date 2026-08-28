import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { useCity } from '../context/CityContext';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

export default function Theaters() {
  const { selectedCity, setSelectedCity, cities } = useCity();
  const { user } = useAuth();
  const { setShow } = useBooking();
  const navigate = useNavigate();

  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTheater, setExpandedTheater] = useState(null);
  const [theaterShows, setTheaterShows] = useState({});
  const [loadingShows, setLoadingShows] = useState(false);

  useEffect(() => {
    api.get('/theaters')
      .then(({ data }) => setTheaters(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredTheaters = useMemo(() => {
    if (!selectedCity || selectedCity === 'All Cities') return theaters;
    return theaters.filter((t) => t.city && t.city.toLowerCase() === selectedCity.toLowerCase());
  }, [theaters, selectedCity]);

  const grouped = useMemo(() => {
    return filteredTheaters.reduce((acc, t) => {
      (acc[t.city] = acc[t.city] || []).push(t);
      return acc;
    }, {});
  }, [filteredTheaters]);

  const toggleTheaterShows = async (theaterId) => {
    if (expandedTheater === theaterId) {
      setExpandedTheater(null);
      return;
    }
    setExpandedTheater(theaterId);
    if (!theaterShows[theaterId]) {
      setLoadingShows(true);
      try {
        const { data } = await api.get(`/theaters/${theaterId}/shows`);
        setTheaterShows((prev) => ({ ...prev, [theaterId]: data }));
      } catch (err) {
        console.error('Failed to load shows for theater', err);
      } finally {
        setLoadingShows(false);
      }
    }
  };

  const handleBookShow = (showItem) => {
    setShow(showItem);
    if (!user) {
      // Redirect to login preserving the target booking path
      navigate('/login', { state: { from: { pathname: `/shows/${showItem.id}/seats` } } });
      return;
    }
    navigate(`/shows/${showItem.id}/seats`);
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Theaters & Cinemas</h1>
          <p style={styles.subTitle}>
            {filteredTheaters.length} theater{filteredTheaters.length !== 1 ? 's' : ''} available {selectedCity !== 'All Cities' ? `in ${selectedCity}` : 'across India'}
          </p>
        </div>

        <div style={styles.cityPill}>
          <span style={styles.cityDot} />
          <span style={styles.cityLabel}>City:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={styles.citySelect}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p style={styles.muted}>Loading theaters…</p>}
      {!loading && !filteredTheaters.length && (
        <div className="card" style={styles.emptyCard}>
          <p style={{ ...styles.muted, marginBottom: 16 }}>No theaters found in {selectedCity}.</p>
          <button className="btn-primary" onClick={() => setSelectedCity('All Cities')}>Show All Cities</button>
        </div>
      )}

      {Object.entries(grouped).map(([city, cityTheaters]) => (
        <div key={city} style={{ marginBottom: 40 }}>
          <h2 style={styles.cityTitle}>📍 {city} ({cityTheaters.length} Theaters)</h2>
          <div style={styles.grid}>
            {cityTheaters.map((t) => {
              const isExpanded = expandedTheater === t.id;
              const shows = theaterShows[t.id] || [];

              return (
                <div key={t.id} className="card" style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <div style={styles.name}>{t.name}</div>
                      <div style={styles.address}>📍 {t.address}</div>
                    </div>
                    <button
                      className={isExpanded ? 'btn-primary' : 'btn-ghost'}
                      style={{ fontSize: 12, padding: '6px 12px', whiteSpace: 'nowrap' }}
                      onClick={() => toggleTheaterShows(t.id)}
                    >
                      {isExpanded ? 'Hide Shows ▲' : 'View Shows ▼'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={styles.showsContainer}>
                      <div style={styles.showsTitle}>Now Playing & Upcoming Shows:</div>
                      {loadingShows && !theaterShows[t.id] ? (
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', padding: '12px 0' }}>
                          Loading scheduled showtimes…
                        </div>
                      ) : shows.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', padding: '8px 0' }}>
                          No upcoming shows currently scheduled for this theater today.
                        </div>
                      ) : (
                        <div style={styles.showsList}>
                          {shows.map((s) => (
                            <div key={s.id} style={styles.showRow}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={styles.movieTitle}>{s.movie_title}</div>
                                <div style={styles.showMeta}>
                                  <span>{s.language} · {s.genre}</span>
                                  <span>🎬 {s.screen_name}</span>
                                </div>
                              </div>
                              <button
                                className="btn-primary"
                                style={styles.bookBtn}
                                onClick={() => handleBookShow(s)}
                              >
                                <span style={{ fontWeight: 700 }}>{formatTime(s.start_time)}</span>
                                <span style={styles.btnPrice}>₹{Number(s.base_price).toFixed(0)}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: { padding: '24px 16px 48px', maxWidth: 1200, margin: '0 auto' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 },
  title: { fontSize: 26, fontWeight: 700, margin: '0 0 6px', fontFamily: 'Sora, sans-serif' },
  subTitle: { fontSize: 13.5, color: 'var(--color-text-muted)', margin: 0 },
  cityPill: {
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600,
    padding: '6px 12px', borderRadius: 20, border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)', background: 'var(--color-bg-surface)',
  },
  cityDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--color-cyan)', boxShadow: '0 0 8px var(--color-cyan)', display: 'inline-block' },
  cityLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: 0.5 },
  citySelect: {
    background: '#1C1C1E', border: 'none', color: '#FFFFFF',
    fontWeight: 600, fontSize: 13, padding: '2px 4px', cursor: 'pointer', outline: 'none',
    colorScheme: 'dark',
  },
  cityTitle: { fontSize: 19, fontWeight: 700, color: 'var(--color-cyan)', marginBottom: 16, fontFamily: 'Sora, sans-serif' },
  grid: { display: 'flex', flexDirection: 'column', gap: 14 },
  card: { padding: 20, border: '1px solid var(--color-border)', borderRadius: 14 },
  name: { fontWeight: 700, fontSize: 16, marginBottom: 4, fontFamily: 'Sora, sans-serif' },
  address: { fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.4 },
  muted: { color: 'var(--color-text-muted)', fontSize: 14 },
  emptyCard: { padding: 48, textAlign: 'center', background: 'var(--color-bg-surface)' },
  showsContainer: { marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' },
  showsTitle: { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-text-secondary)', marginBottom: 10 },
  showsList: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 },
  showRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8, padding: '8px 12px', gap: 10,
  },
  movieTitle: { fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  showMeta: { fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', gap: 8, marginTop: 2 },
  bookBtn: { padding: '6px 12px', fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70 },
  btnPrice: { fontSize: 10, opacity: 0.9 },
};

