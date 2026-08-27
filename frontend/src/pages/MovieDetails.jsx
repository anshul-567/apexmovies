import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setShow } = useBooking();
  const { user } = useAuth();
  const { selectedCity, setSelectedCity, cities } = useCity();

  const [movie, setMovie] = useState(null);
  const [allShows, setAllShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [reviewsData, setReviewsData] = useState({ reviews: [], stats: { total_reviews: 0, average_rating: 0 }, isVerifiedBuyer: false, userReview: null });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', text: '', isSpoiler: false });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [revealedSpoilers, setRevealedSpoilers] = useState(new Set());

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const res = await api.get(`/movies/${id}/reviews`);
      setReviewsData(res.data);
      if (res.data.userReview) {
        setReviewForm({
          rating: res.data.userReview.rating,
          title: res.data.userReview.review_title || '',
          text: res.data.userReview.review_text || '',
          isSpoiler: Boolean(res.data.userReview.is_spoiler),
        });
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/movies/${id}`),
      api.get(`/shows/movie/${id}`),
    ])
      .then(([movieRes, showsRes]) => {
        setMovie(movieRes.data);
        setAllShows(showsRes.data);
      })
      .catch((err) => console.error('Failed to load movie details', err))
      .finally(() => setLoading(false));

    fetchReviews();

    // Check favorite if user is logged in
    if (user) {
      api.get(`/movies/${id}/favorite`)
        .then(({ data }) => setIsFavorite(data.isFavorite))
        .catch(() => {});
    }
  }, [id, user]);

  // Filter shows by selected city (if a specific city is chosen)
  const cityFilteredShows = useMemo(() => {
    if (!selectedCity || selectedCity === 'All Cities') return allShows;
    return allShows.filter((s) => s.city && s.city.toLowerCase() === selectedCity.toLowerCase());
  }, [allShows, selectedCity]);

  // Extract unique available dates from city-filtered scheduled shows
  const availableDates = useMemo(() => {
    const datesMap = new Map();
    cityFilteredShows.forEach((s) => {
      const d = new Date(s.start_time);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!datesMap.has(dateKey)) {
        datesMap.set(dateKey, s.start_time);
      }
    });
    return Array.from(datesMap.entries()).map(([key, sampleTime]) => ({
      key,
      time: sampleTime,
    })).sort((a, b) => new Date(a.time) - new Date(b.time));
  }, [cityFilteredShows]);

  // Default selected date to first available date
  useEffect(() => {
    if (availableDates.length > 0 && (!selectedDate || !availableDates.some((d) => d.key === selectedDate))) {
      setSelectedDate(availableDates[0].key);
    }
  }, [availableDates, selectedDate]);

  // Filter shows for selected date within the chosen city
  const filteredShows = useMemo(() => {
    if (!selectedDate) return cityFilteredShows;
    return cityFilteredShows.filter((s) => {
      const d = new Date(s.start_time);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return key === selectedDate;
    });
  }, [cityFilteredShows, selectedDate]);

  // Group filtered shows by theater
  const theatersGrouped = useMemo(() => {
    return filteredShows.reduce((acc, s) => {
      const tName = s.theater_name;
      if (!acc[tName]) {
        acc[tName] = {
          name: tName,
          city: s.city,
          address: s.theater_address || `${s.city}`,
          shows: [],
        };
      }
      acc[tName].shows.push(s);
      return acc;
    }, {});
  }, [filteredShows]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (favLoading) return;

    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/movies/${id}/favorite`);
        setIsFavorite(false);
      } else {
        await api.post(`/movies/${id}/favorite`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to update favorite', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handlePickShow = (show) => {
    setShow(show);
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/shows/${show.id}/seats` } } });
      return;
    }
    navigate(`/shows/${show.id}/seats`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      setReviewSuccess('');

      await api.post(`/movies/${id}/reviews`, {
        rating: Number(reviewForm.rating),
        reviewTitle: reviewForm.title,
        reviewText: reviewForm.text,
        isSpoiler: Boolean(reviewForm.isSpoiler),
      });

      setReviewSuccess('Your review has been published!');
      await fetchReviews();
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviewForm({ rating: 5, title: '', text: '', isSpoiler: false });
      setReviewSuccess('Review deleted.');
      await fetchReviews();
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/reviews/${reviewId}/helpful`);
      await fetchReviews();
    } catch (err) {
      console.error('Failed to vote helpful', err);
    }
  };

  const toggleSpoiler = (reviewId) => {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) next.delete(reviewId);
      else next.add(reviewId);
      return next;
    });
  };

  const formatDay = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'TODAY';
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return 'TOMORROW';
    return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading || !movie) {
    return (
      <div style={{ padding: '80px 48px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <p>Loading movie experience…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Movie Hero Section */}
      <div className="card" style={styles.heroCard}>
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
        </div>

        <div style={styles.heroDetails}>
          <div style={styles.eyebrowRow}>
            <span style={styles.statusBadge}>
              {movie.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
            </span>
            {movie.rating && (
              <span style={styles.ratingBadge}>★ {movie.rating} / 10</span>
            )}
            {movie.age_rating && (
              <span
                style={{
                  ...styles.ageDetailsBadge,
                  borderColor: movie.age_rating === 'A' ? 'var(--color-danger)' : movie.age_rating === 'U' ? '#38EF7D' : 'var(--color-cyan)',
                  color: movie.age_rating === 'A' ? 'var(--color-danger)' : movie.age_rating === 'U' ? '#38EF7D' : 'var(--color-cyan)',
                  background: movie.age_rating === 'A' ? 'rgba(255,92,122,0.12)' : movie.age_rating === 'U' ? 'rgba(56,239,125,0.12)' : 'rgba(104,245,225,0.12)',
                }}
              >
                {movie.age_rating === 'U' ? 'U · All Ages' : movie.age_rating === 'A' ? 'A · Adults 18+' : `${movie.age_rating} · Parental Guidance`}
              </span>
            )}
          </div>

          <h1 style={styles.title}>{movie.title}</h1>

          <div style={styles.metaRow}>
            <span>{movie.genre}</span>
            <span style={styles.dot} />
            <span>{movie.duration_mins} mins</span>
            {movie.language && (
              <>
                <span style={styles.dot} />
                <span>{movie.language}</span>
              </>
            )}
            {movie.release_date && (
              <>
                <span style={styles.dot} />
                <span>Released {new Date(movie.release_date).toLocaleDateString()}</span>
              </>
            )}
          </div>

          <p style={styles.desc}>{movie.description}</p>

          <div style={styles.actionRow}>
            <button
              className="btn-ghost"
              onClick={handleFavoriteToggle}
              disabled={favLoading}
              style={{
                ...styles.favBtn,
                borderColor: isFavorite ? 'var(--color-danger)' : 'var(--color-border)',
                color: isFavorite ? 'var(--color-danger)' : 'var(--color-text-primary)',
              }}
            >
              <span style={{ fontSize: 18 }}>{isFavorite ? '♥' : '♡'}</span>
              {isFavorite ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Area */}
      <div style={styles.showtimesSection}>
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Select Date & Theater</h2>
            <span style={styles.showCountNote}>
              {cityFilteredShows.length} show{cityFilteredShows.length !== 1 ? 's' : ''} available {selectedCity !== 'All Cities' ? `in ${selectedCity}` : 'nationwide'}
            </span>
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

        {/* Date Selector Pills */}
        {availableDates.length > 0 ? (
          <div style={styles.datePickerWrap}>
            <div style={styles.datePillsList}>
              {availableDates.map((item) => {
                const isActive = item.key === selectedDate;
                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedDate(item.key)}
                    style={{
                      ...styles.datePill,
                      ...(isActive ? styles.datePillActive : {}),
                    }}
                  >
                    <span style={{ ...styles.datePillDay, color: isActive ? '#04120F' : 'var(--color-cyan)' }}>
                      {formatDay(item.time)}
                    </span>
                    <span style={{ ...styles.datePillDate, color: isActive ? '#04120F' : 'var(--color-text-primary)' }}>
                      {formatDateLabel(item.time)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Theaters & Showtimes for Selected Date */}
        {Object.keys(theatersGrouped).length > 0 ? (
          <div style={styles.theatersList}>
            {Object.values(theatersGrouped).map((theater) => (
              <div key={theater.name} className="card" style={styles.theaterCard}>
                <div style={styles.theaterHeader}>
                  <div>
                    <h3 style={styles.theaterName}>{theater.name}</h3>
                    <p style={styles.theaterAddress}>📍 {theater.address}</p>
                  </div>
                  {theater.city && <span style={styles.theaterCityTag}>{theater.city}</span>}
                </div>

                <div style={styles.showtimeGrid}>
                  {theater.shows.map((s) => (
                    <button
                      key={s.id}
                      className="btn-ghost"
                      onClick={() => handlePickShow(s)}
                      style={styles.showSlotBtn}
                    >
                      <div style={styles.showSlotTime}>
                        {formatTime(s.start_time)}
                      </div>
                      <div style={styles.showSlotMeta}>
                        <span>{s.screen_name}</span>
                        {s.base_price && <span style={styles.slotPrice}>₹{Number(s.base_price).toFixed(0)}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={styles.noShowsCard}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📍</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {selectedCity !== 'All Cities'
                ? `No shows currently scheduled in ${selectedCity} for this movie.`
                : 'No shows scheduled yet for this movie.'}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 16 }}>
              {selectedCity !== 'All Cities'
                ? 'Try switching to All Cities or picking a nearby city to view all showtimes.'
                : 'Please check back soon for newly scheduled theater timings.'}
            </p>
            {selectedCity !== 'All Cities' && (
              <button
                className="btn-primary"
                onClick={() => setSelectedCity('All Cities')}
                style={{ padding: '10px 22px', fontSize: 13.5 }}
              >
                View Shows in All Cities
              </button>
            )}
          </div>
        )}
      </div>

      {/* Verified Reviews & Community Ratings Section */}
      <div style={styles.reviewsSection}>
        <div style={styles.reviewsHeaderRow}>
          <div>
            <h2 style={styles.sectionTitle}>Audience Reviews & Community Ratings</h2>
            <div style={styles.scoreRow}>
              <span style={styles.scoreBig}>
                ★ {reviewsData.stats.average_rating > 0 ? Number(reviewsData.stats.average_rating).toFixed(1) : 'New'}
              </span>
              <span style={styles.scoreSub}>
                / 5 · ({reviewsData.stats.total_reviews} {reviewsData.stats.total_reviews === 1 ? 'review' : 'reviews'})
              </span>
              {reviewsData.stats.verified_buyer_reviews > 0 && (
                <span style={styles.verifiedCountBadge}>
                  ✓ {reviewsData.stats.verified_buyer_reviews} Verified Ticket {reviewsData.stats.verified_buyer_reviews === 1 ? 'Buyer' : 'Buyers'}
                </span>
              )}
            </div>
          </div>

          {reviewsData.isVerifiedBuyer && (
            <div style={styles.buyerBadge}>
              <span style={{ fontSize: 16 }}>🎟️</span>
              <span>You booked tickets for this movie!</span>
            </div>
          )}
        </div>

        {/* Review Submission Card */}
        <div className="card" style={styles.reviewFormCard}>
          <h3 style={styles.formTitle}>
            {reviewsData.userReview ? 'Edit Your Review' : 'Write an Audience Review'}
          </h3>

          {reviewSuccess && (
            <div style={styles.reviewSuccessMsg}>✓ {reviewSuccess}</div>
          )}
          {reviewError && (
            <div style={styles.reviewErrorMsg}>⚠️ {reviewError}</div>
          )}

          <form onSubmit={handleReviewSubmit}>
            {/* Star rating selector */}
            <div style={styles.starSelectRow}>
              <span style={styles.starLabel}>Your Rating:</span>
              <div style={styles.starButtons}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    style={{
                      ...styles.starBtn,
                      color: star <= reviewForm.rating ? '#FFD700' : 'var(--color-text-muted)',
                    }}
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span style={styles.starNumText}>({reviewForm.rating} of 5 Stars)</span>
            </div>

            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Review Headline (e.g. Masterpiece visuals in IMAX Laser!)"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                style={styles.reviewInput}
              />
            </div>

            <div style={styles.inputGroup}>
              <textarea
                rows={3}
                required
                placeholder="Share your thoughts on the acting, plot, sound design, and theater experience..."
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                style={{ ...styles.reviewInput, resize: 'vertical' }}
              />
            </div>

            <div style={styles.formBottomRow}>
              <label style={styles.spoilerLabel}>
                <input
                  type="checkbox"
                  checked={reviewForm.isSpoiler}
                  onChange={(e) => setReviewForm({ ...reviewForm, isSpoiler: e.target.checked })}
                  style={{ accentColor: 'var(--color-cyan)', width: 16, height: 16 }}
                />
                <span>This review contains plot spoilers</span>
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                {reviewsData.userReview && (
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                    onClick={() => handleDeleteReview(reviewsData.userReview.id)}
                  >
                    Delete Review
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-primary"
                  style={styles.submitReviewBtn}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Publishing...' : reviewsData.userReview ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Reviews List */}
        <div style={styles.reviewsList}>
          {reviewsLoading && <p style={styles.muted}>Loading community reviews…</p>}

          {!reviewsLoading && !reviewsData.reviews.length && (
            <div className="card" style={{ padding: 36, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✍️</div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: 0 }}>
                No reviews yet. Be the first to share your thoughts on {movie.title}!
              </p>
            </div>
          )}

          {reviewsData.reviews.map((rev) => {
            const isSpoilerHidden = rev.is_spoiler && !revealedSpoilers.has(rev.id);

            return (
              <div key={rev.id} className="card" style={styles.reviewCard}>
                <div style={styles.reviewCardTop}>
                  <div style={styles.reviewerInfo}>
                    <div style={styles.avatarCircle}>{rev.user_name?.charAt(0)?.toUpperCase() || 'U'}</div>
                    <div>
                      <div style={styles.reviewerNameRow}>
                        <span style={styles.reviewerName}>{rev.user_name}</span>
                        {rev.is_verified_buyer && (
                          <span style={styles.verifiedBadge}>✓ Verified Ticket Buyer</span>
                        )}
                        {rev.is_spoiler && (
                          <span style={styles.spoilerTag}>⚠️ Spoilers</span>
                        )}
                      </div>
                      <span style={styles.reviewDate}>
                        {new Date(rev.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div style={styles.ratingStars}>
                    {'★'.repeat(rev.rating)}
                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>{'★'.repeat(5 - rev.rating)}</span>
                  </div>
                </div>

                {rev.review_title && (
                  <h4 style={styles.reviewCardTitle}>{rev.review_title}</h4>
                )}

                {/* Review Text with Spoiler Protection */}
                <div style={styles.reviewTextWrap}>
                  {isSpoilerHidden ? (
                    <div style={styles.spoilerBlurBox}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        ⚠️ This review contains plot spoilers.
                      </span>
                      <button
                        className="btn-ghost"
                        style={styles.revealSpoilerBtn}
                        onClick={() => toggleSpoiler(rev.id)}
                      >
                        Click to Reveal
                      </button>
                    </div>
                  ) : (
                    <p style={styles.reviewCardText}>
                      {rev.review_text}
                      {rev.is_spoiler && (
                        <button
                          style={styles.hideSpoilerBtn}
                          onClick={() => toggleSpoiler(rev.id)}
                        >
                          (Hide Spoilers)
                        </button>
                      )}
                    </p>
                  )}
                </div>

                {/* Helpful Action Row */}
                <div style={styles.helpfulRow}>
                  <button
                    className="btn-ghost"
                    style={{
                      ...styles.helpfulBtn,
                      color: rev.user_voted_helpful ? 'var(--color-cyan)' : 'var(--color-text-muted)',
                      borderColor: rev.user_voted_helpful ? 'var(--color-cyan)' : 'var(--color-border)',
                    }}
                    onClick={() => handleHelpfulVote(rev.id)}
                  >
                    <span>👍 Helpful</span>
                    <span>({rev.helpful_count})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '40px 48px', maxWidth: 1100, margin: '0 auto' },
  heroCard: {
    display: 'flex', gap: 36, padding: 32, marginBottom: 40,
    background: 'linear-gradient(180deg, var(--color-bg-elevated) 0%, rgba(20,20,20,0.6) 100%)',
    position: 'relative', overflow: 'hidden', flexWrap: 'wrap',
  },
  posterWrap: { width: 220, minWidth: 200, flexShrink: 0 },
  poster: { width: '100%', height: 'auto', aspectRatio: '2/3', borderRadius: 14, objectFit: 'cover', display: 'block', boxShadow: '0 12px 36px rgba(0,0,0,0.6)' },
  heroDetails: { flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' },
  eyebrowRow: { display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 },
  statusBadge: {
    fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.6,
    background: 'var(--gradient-vibrant)', color: '#fff', padding: '4px 10px', borderRadius: 6,
  },
  ratingBadge: {
    fontSize: 12, fontWeight: 700, background: 'rgba(104,245,225,0.12)',
    color: 'var(--color-cyan)', padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(104,245,225,0.3)',
  },
  ageDetailsBadge: {
    fontSize: 11.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
    padding: '4px 10px', borderRadius: 6, border: '1px solid',
  },
  title: { fontSize: 36, fontWeight: 800, lineHeight: 1.15, margin: '0 0 12px', fontFamily: 'Sora, sans-serif' },
  metaRow: { display: 'flex', alignItems: 'center', gap: 10, color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 18, flexWrap: 'wrap' },
  dot: { width: 4, height: 4, borderRadius: '50%', background: 'var(--color-text-muted)' },
  desc: { color: 'var(--color-text-secondary)', fontSize: 15, lineHeight: 1.65, maxWidth: 640, marginBottom: 24 },
  actionRow: { marginTop: 'auto', display: 'flex', gap: 14, alignItems: 'center' },
  favBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, fontWeight: 600, fontSize: 14 },
  showtimesSection: { marginTop: 24 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 },
  sectionTitle: { fontSize: 22, fontWeight: 700, margin: '0 0 4px' },
  showCountNote: { fontSize: 13, color: 'var(--color-text-muted)' },
  cityPill: {
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
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
  theaterCityTag: {
    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
    background: 'rgba(104,245,225,0.1)', color: 'var(--color-cyan)', border: '1px solid rgba(104,245,225,0.25)',
  },
  datePickerWrap: { marginBottom: 24, overflowX: 'auto', paddingBottom: 6 },
  datePillsList: { display: 'flex', gap: 12 },
  datePill: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '12px 20px', minWidth: 90, borderRadius: 12, border: '1px solid var(--color-border)',
    background: 'var(--color-bg-surface)', cursor: 'pointer', transition: 'all 0.25s ease',
  },
  datePillActive: {
    background: 'var(--gradient-primary)', borderColor: 'transparent',
    boxShadow: 'var(--shadow-cyan-glow)', transform: 'translateY(-2px)',
  },
  datePillDay: { fontSize: 11, fontWeight: 800, letterSpacing: 0.6, marginBottom: 4 },
  datePillDate: { fontSize: 14, fontWeight: 700 },
  theatersList: { display: 'flex', flexDirection: 'column', gap: 18 },
  theaterCard: { padding: 22, background: 'var(--color-bg-elevated)' },
  theaterHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 12 },
  theaterName: { fontSize: 17, fontWeight: 700, margin: '0 0 4px' },
  theaterAddress: { fontSize: 13, color: 'var(--color-text-muted)', margin: 0 },
  showtimeGrid: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  showSlotBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    padding: '10px 18px', borderRadius: 10, minWidth: 120, transition: 'all 0.2s ease',
  },
  showSlotTime: { fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)' },
  showSlotMeta: { fontSize: 11, color: 'var(--color-text-muted)', display: 'flex', gap: 8, alignItems: 'center' },
  slotPrice: { color: 'var(--color-cyan)', fontWeight: 700 },
  noShowsCard: { padding: 48, textAlign: 'center', background: 'var(--color-bg-surface)' },

  // Reviews Styles
  reviewsSection: { marginTop: 48, borderTop: '1px solid var(--color-border)', paddingTop: 36 },
  reviewsHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  scoreRow: { display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4, flexWrap: 'wrap' },
  scoreBig: { fontSize: 24, fontWeight: 800, color: '#FFD700' },
  scoreSub: { fontSize: 13.5, color: 'var(--color-text-muted)' },
  verifiedCountBadge: { fontSize: 11, fontWeight: 700, background: 'rgba(56,239,125,0.15)', color: '#38EF7D', padding: '2px 8px', borderRadius: 6 },
  buyerBadge: { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(104,245,225,0.1)', border: '1px solid rgba(104,245,225,0.3)', padding: '6px 14px', borderRadius: 20, color: 'var(--color-cyan)', fontSize: 12.5, fontWeight: 600 },
  reviewFormCard: { padding: 24, marginBottom: 32, background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' },
  formTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16 },
  reviewSuccessMsg: { padding: '10px 14px', borderRadius: 8, background: 'rgba(56,239,125,0.15)', color: '#38EF7D', fontSize: 13, marginBottom: 14, fontWeight: 600 },
  reviewErrorMsg: { padding: '10px 14px', borderRadius: 8, background: 'rgba(255,92,122,0.15)', color: 'var(--color-danger)', fontSize: 13, marginBottom: 14, fontWeight: 600 },
  starSelectRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' },
  starLabel: { fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' },
  starButtons: { display: 'flex', gap: 2 },
  starBtn: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: '0 2px', transition: 'transform 0.1s ease' },
  starNumText: { fontSize: 12, color: 'var(--color-text-muted)' },
  reviewInput: { width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: '#fff', fontSize: 13.5 },
  formBottomRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 12 },
  spoilerLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--color-text-secondary)', cursor: 'pointer' },
  submitReviewBtn: { padding: '9px 20px', fontSize: 13, fontWeight: 700 },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  reviewCard: { padding: 22, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' },
  reviewCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  reviewerInfo: { display: 'flex', gap: 12, alignItems: 'center' },
  avatarCircle: { width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#000' },
  reviewerNameRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  reviewerName: { fontWeight: 700, fontSize: 14.5 },
  verifiedBadge: { fontSize: 10.5, fontWeight: 700, background: 'rgba(56,239,125,0.12)', color: '#38EF7D', padding: '2px 6px', borderRadius: 4 },
  spoilerTag: { fontSize: 10.5, fontWeight: 700, background: 'rgba(255,193,7,0.15)', color: '#FFC107', padding: '2px 6px', borderRadius: 4 },
  reviewDate: { fontSize: 11.5, color: 'var(--color-text-muted)' },
  ratingStars: { color: '#FFD700', fontSize: 16, letterSpacing: 2 },
  reviewCardTitle: { fontSize: 15, fontWeight: 700, margin: '0 0 6px' },
  reviewTextWrap: { marginBottom: 12 },
  reviewCardText: { fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 },
  spoilerBlurBox: { padding: '14px 18px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,193,7,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  revealSpoilerBtn: { padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#FFC107', borderColor: '#FFC107' },
  hideSpoilerBtn: { background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 12, cursor: 'pointer', marginLeft: 8, textDecoration: 'underline' },
  helpfulRow: { display: 'flex', justifyContent: 'flex-end' },
  helpfulBtn: { padding: '4px 12px', fontSize: 12, display: 'flex', gap: 6, alignItems: 'center' },
};
