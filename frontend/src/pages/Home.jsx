import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import TicketCard from '../components/TicketCard';
import { useCity } from '../context/CityContext';

const GENRE_TILE_COLORS = {
  Action: 'linear-gradient(135deg, #9B6CFF, transparent)',
  'Sci-Fi': 'linear-gradient(135deg, #4455FF, transparent)',
  Drama: 'linear-gradient(135deg, #68F5E1, transparent)',
  Horror: 'linear-gradient(135deg, #FF5C7A, transparent)',
  Animation: 'linear-gradient(135deg, #9B6CFF, #4455FF)',
  Thriller: 'linear-gradient(135deg, #4455FF, #68F5E1)',
  Mystery: 'linear-gradient(135deg, #9B6CFF, #68F5E1)',
  Comedy: 'linear-gradient(135deg, #4455FF, #68F5E1)',
};
const DEFAULT_TILE_GRAD = 'linear-gradient(135deg, #68F5E1, transparent)';

const OFFERS = [
  { tag: 'First booking', title: '₹100 off your first ticket', desc: 'New to ApexMovies? Get ₹100 off your first booking, automatically applied at checkout.', code: 'WELCOME100', glow: 'var(--color-cyan)' },
  { tag: 'Weekend special', title: 'Buy 2, get 1 free', desc: 'Fri–Sun on select screens across Indian cities. Bring your crew, third ticket is on us.', code: 'WEEKEND3', glow: 'var(--color-violet)' },
  { tag: 'Card partner', title: '15% off with Apex Card', desc: 'Pay with a linked UPI or RuPay/Visa card and save 15% on every booking.', code: 'AUTO-APPLIED', glow: 'var(--color-blue)' },
];

const POPULAR_GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Thriller', 'Horror', 'Animation', 'Comedy', 'Mystery'];
const POPULAR_LANGUAGES = ['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Japanese'];

export default function Home() {
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity, cities } = useCity();

  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const [city, setCity] = useState(selectedCity === 'All Cities' ? '' : selectedCity);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('relevance');
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Keep local city filter in sync with global selectedCity
  useEffect(() => {
    setCity(selectedCity === 'All Cities' ? '' : selectedCity);
    setPage(1);
  }, [selectedCity]);

  // Main fetch function with all filter params
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search: search.trim() || undefined,
        genre: genre === 'All' ? undefined : genre,
        language: language === 'All' ? undefined : language,
        city: city || undefined,
        date: date || undefined,
        status: status === 'All' ? undefined : status,
        minRating: minRating === 'All' ? undefined : minRating,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort || undefined,
      };

      const { data } = await api.get('/movies', { params });
      if (data && data.movies) {
        setMovies(data.movies);
        setPagination(data.pagination || { page, limit: 12, total: data.movies.length, totalPages: 1 });
      } else if (Array.isArray(data)) {
        setMovies(data);
        setPagination({ page: 1, limit: 12, total: data.length, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, genre, language, city, date, status, minRating, maxPrice, sort]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  const handleClearFilters = () => {
    setSearch('');
    setGenre('All');
    setLanguage('All');
    setCity('');
    setDate('');
    setStatus('All');
    setMinRating('All');
    setMaxPrice('');
    setSort('relevance');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || (genre && genre !== 'All') || (language && language !== 'All') ||
    city || date || (status && status !== 'All') || (minRating && minRating !== 'All') ||
    maxPrice || (sort && sort !== 'relevance')
  );

  const featured = useMemo(() => {
    return movies.find((m) => m.status === 'now_showing') || movies[0];
  }, [movies]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero: featured movie banner (shown when no deep search is active or on page 1) */}
      {!hasActiveFilters && featured && (
        <section style={styles.hero}>
          <div style={styles.heroBg}>
            <img src={featured.poster_url} alt="" style={styles.heroBgImg} />
            <div style={styles.heroScrim} />
          </div>
          <div style={styles.heroContent}>
            <div style={styles.heroEyebrow}>★ Featured this week</div>
            <h1 style={styles.heroTitle}>{featured.title}</h1>
            <div style={styles.heroMeta}>
              {featured.rating && <><span style={styles.heroRating}>★ {featured.rating}</span><span style={styles.sep} /></>}
              <span>{featured.genre}</span>
              <span style={styles.sep} />
              <span>{featured.duration_mins} min</span>
              {featured.language && <><span style={styles.sep} /><span>{featured.language}</span></>}
            </div>
            <p style={styles.heroDesc}>{featured.description}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" style={styles.heroBtnPrimary} onClick={() => navigate(`/movies/${featured.id}`)}>
                🎬 Book tickets
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Search & Filter Bar */}
      <div style={{ ...styles.searchWrap, marginTop: !hasActiveFilters && featured ? -28 : 28 }}>
        <form onSubmit={handleSearchSubmit} className="card" style={styles.searchBar}>
          {/* Text search */}
          <div style={{ ...styles.searchField, flex: 1.5 }}>
            <label style={styles.searchLabel}>Search Movies</label>
            <input
              type="text"
              placeholder="Title, genre, or language…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={styles.bareInput}
            />
          </div>

          {/* City */}
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>City</label>
            <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} style={styles.bareInput}>
              <option value="">All cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Genre */}
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Genre</label>
            <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }} style={styles.bareInput}>
              {POPULAR_GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Date */}
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setPage(1); }}
              style={styles.bareInput}
            />
          </div>

          {/* Sort By */}
          <div style={{ ...styles.searchField, borderRight: 'none' }}>
            <label style={styles.searchLabel}>Sort By</label>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} style={styles.bareInput}>
              <option value="relevance">Relevance</option>
              <option value="rating_desc">Rating: High → Low</option>
              <option value="release_desc">Release: Newest</option>
              <option value="title_asc">Title: A → Z</option>
              <option value="price_asc">Price: Low → High</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="btn-primary" style={styles.searchSubmit}>
            Search
          </button>
        </form>

        {/* Secondary Filter Controls Toggle */}
        <div style={styles.filterControlsRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={styles.filterToggleBtn}
            >
              ⚙ {showAdvanced ? 'Hide Advanced Filters' : 'More Filters (Language, Rating, Price, Status)'}
            </button>

            {hasActiveFilters && (
              <button type="button" className="btn-ghost" onClick={handleClearFilters} style={styles.clearBtn}>
                ✕ Clear all filters
              </button>
            )}
          </div>

          {/* Active Filter Pills */}
          <div style={styles.activePillsRow}>
            {search && <span style={styles.activePill}>Query: "{search}" <b onClick={() => setSearch('')}>×</b></span>}
            {city && <span style={styles.activePill}>City: {city} <b onClick={() => setCity('')}>×</b></span>}
            {genre !== 'All' && <span style={styles.activePill}>Genre: {genre} <b onClick={() => setGenre('All')}>×</b></span>}
            {language !== 'All' && <span style={styles.activePill}>Lang: {language} <b onClick={() => setLanguage('All')}>×</b></span>}
            {date && <span style={styles.activePill}>Date: {date} <b onClick={() => setDate('')}>×</b></span>}
            {status !== 'All' && <span style={styles.activePill}>Status: {status.replace('_', ' ')} <b onClick={() => setStatus('All')}>×</b></span>}
            {minRating !== 'All' && <span style={styles.activePill}>★ {minRating}+ <b onClick={() => setMinRating('All')}>×</b></span>}
            {maxPrice && <span style={styles.activePill}>Max: ₹{maxPrice} <b onClick={() => setMaxPrice('')}>×</b></span>}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvanced && (
          <div className="card" style={styles.advancedPanel}>
            <div style={styles.advancedGrid}>
              <div style={styles.advancedItem}>
                <label style={styles.advancedLabel}>Language</label>
                <select value={language} onChange={(e) => { setLanguage(e.target.value); setPage(1); }}>
                  {POPULAR_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div style={styles.advancedItem}>
                <label style={styles.advancedLabel}>Movie Status</label>
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                  <option value="All">All Statuses</option>
                  <option value="now_showing">Now Showing</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div style={styles.advancedItem}>
                <label style={styles.advancedLabel}>Minimum Rating</label>
                <select value={minRating} onChange={(e) => { setMinRating(e.target.value); setPage(1); }}>
                  <option value="All">All Ratings</option>
                  <option value="7">7.0+ ★</option>
                  <option value="8">8.0+ ★</option>
                  <option value="9">9.0+ ★</option>
                </select>
              </div>

              <div style={styles.advancedItem}>
                <label style={styles.advancedLabel}>Max Ticket Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 350"
                  value={maxPrice}
                  onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Genre quick-select chips */}
      <section style={{ ...styles.section, paddingBottom: 16 }}>
        <div style={styles.chipsRow}>
          {POPULAR_GENRES.map((g) => (
            <div
              key={g}
              onClick={() => { setGenre(g); setPage(1); }}
              style={{ ...styles.chip, ...(genre === g ? styles.chipActive : {}) }}
            >
              {g}
            </div>
          ))}
        </div>
      </section>

      {/* Movies Grid Section */}
      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.sectionTitle}>
            {hasActiveFilters ? 'Search & Filter Results' : 'Explore Movies'}
          </h2>
          <span style={styles.resultsCount}>
            {pagination.total} {pagination.total === 1 ? 'movie' : 'movies'} found
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <p>Discovering movies…</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            <div style={styles.grid}>
              {movies.map((m) => (
                <TicketCard key={m.id} movie={m} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div style={styles.paginationWrap}>
                <button
                  className="btn-ghost"
                  disabled={page <= 1}
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                >
                  ← Previous
                </button>

                <div style={styles.pageNumbers}>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                      style={{
                        ...styles.pageBtn,
                        ...(page === p ? styles.pageBtnActive : {}),
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-ghost"
                  disabled={page >= pagination.totalPages}
                  onClick={() => { setPage((p) => Math.min(pagination.totalPages, p + 1)); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="card" style={styles.emptyState}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎬</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No movies found matching your filters.</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 20 }}>
              Try adjusting your search terms, removing active filters, or checking back later.
            </p>
            <button className="btn-primary" onClick={handleClearFilters}>
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* Browse by genre tiles */}
      {!hasActiveFilters && (
        <section style={styles.section}>
          <div style={styles.sectionHead}><h2 style={styles.sectionTitle}>Browse by genre</h2></div>
          <div style={styles.genreGrid}>
            {POPULAR_GENRES.filter((g) => g !== 'All').map((g) => (
              <div
                key={g}
                className="genre-tile"
                style={{ '--tile-grad': GENRE_TILE_COLORS[g] || DEFAULT_TILE_GRAD }}
                onClick={() => { setGenre(g); setPage(1); window.scrollTo({ top: 450, behavior: 'smooth' }); }}
              >
                <span>{g}</span>
                <small>Explore {g}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Offers Section */}
      <section id="offers" style={styles.section}>
        <div style={styles.sectionHead}><h2 style={styles.sectionTitle}>Exclusive Offers</h2></div>
        <div style={styles.offersGrid}>
          {OFFERS.map((o) => (
            <div key={o.code} className="offer-card" style={{ '--offer-glow': o.glow }}>
              <div className="offer-tag">{o.tag}</div>
              <div className="offer-title">{o.title}</div>
              <div className="offer-desc">{o.desc}</div>
              <div className="offer-code">{o.code}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { position: 'relative', height: 480, overflow: 'hidden', display: 'flex', alignItems: 'flex-end' },
  heroBg: { position: 'absolute', inset: 0 },
  heroBgImg: { width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 },
  heroScrim: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(0deg, var(--color-bg) 5%, rgba(10,10,10,0.6) 45%, rgba(10,10,10,0.2) 100%), linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 55%, transparent 100%)',
  },
  heroContent: { position: 'relative', padding: '0 48px 48px', maxWidth: 620 },
  heroEyebrow: {
    display: 'inline-flex', fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase',
    color: '#04120F', background: 'var(--gradient-primary)', padding: '6px 12px', borderRadius: 6, marginBottom: 16,
  },
  heroTitle: { fontSize: 44, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.2, marginBottom: 12, fontFamily: 'Sora, sans-serif' },
  heroMeta: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 },
  heroRating: { color: 'var(--color-cyan)', fontWeight: 700 },
  sep: { width: 3, height: 3, borderRadius: '50%', background: 'var(--color-text-muted)', display: 'inline-block' },
  heroDesc: { fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 460, marginBottom: 24 },
  heroBtnPrimary: { fontSize: 15, padding: '14px 24px' },
  searchWrap: { padding: '0 48px', position: 'relative', zIndex: 5, marginBottom: 24 },
  searchBar: { display: 'flex', alignItems: 'stretch', padding: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', flexWrap: 'wrap', gap: 6 },
  searchField: { flex: 1, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 14px', borderRight: '1px solid var(--color-border)' },
  searchLabel: { fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6, color: 'var(--color-text-muted)' },
  bareInput: {
    background: 'none', border: 'none', padding: 0, fontSize: 14, fontWeight: 600,
    color: 'var(--color-text-primary)', outline: 'none', colorScheme: 'dark',
  },
  searchSubmit: { borderRadius: 10, padding: '0 26px', fontSize: 14, fontWeight: 700, minHeight: 46 },
  filterControlsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', gap: 10 },
  filterToggleBtn: { fontSize: 12.5, padding: '6px 14px', borderRadius: 8 },
  clearBtn: { fontSize: 12.5, padding: '6px 14px', borderRadius: 8, borderColor: 'rgba(255,92,122,0.4)', color: 'var(--color-danger)' },
  activePillsRow: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  activePill: {
    fontSize: 11.5, background: 'rgba(104, 245, 225, 0.1)', color: 'var(--color-cyan)',
    border: '1px solid rgba(104, 245, 225, 0.3)', padding: '4px 10px', borderRadius: 12,
    display: 'flex', alignItems: 'center', gap: 6, cursor: 'default',
  },
  advancedPanel: { marginTop: 14, padding: 18, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' },
  advancedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 },
  advancedItem: { display: 'flex', flexDirection: 'column', gap: 6 },
  advancedLabel: { fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' },
  section: { padding: '0 48px 48px' },
  sectionHead: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 700, letterSpacing: -0.3 },
  resultsCount: { fontSize: 13, color: 'var(--color-text-muted)' },
  chipsRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  chip: { fontSize: 13, fontWeight: 500, padding: '8px 16px', borderRadius: 20, border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', cursor: 'pointer', transition: 'all 0.2s ease' },
  chipActive: { background: 'var(--gradient-primary)', color: '#04120F', borderColor: 'transparent', fontWeight: 700, boxShadow: 'var(--shadow-cyan-glow)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 22 },
  genreGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 },
  offersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 },
  paginationWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 40 },
  pageNumbers: { display: 'flex', gap: 6 },
  pageBtn: {
    width: 36, height: 36, borderRadius: 8, border: '1px solid var(--color-border)',
    background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  pageBtnActive: { background: 'var(--gradient-primary)', color: '#04120F', borderColor: 'transparent', fontWeight: 800 },
  emptyState: { padding: 48, textAlign: 'center', maxWidth: 500, margin: '40px auto' },
};
