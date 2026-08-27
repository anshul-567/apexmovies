import { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

export default function ManageShows() {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [form, setForm] = useState({ movieId: '', theaterId: '', screenId: '', startTime: '', basePrice: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/movies', { params: { limit: 100 } }).then(({ data }) => setMovies(Array.isArray(data) ? data : (data.movies || [])));
    api.get('/theaters').then(({ data }) => setTheaters(data));
  }, []);

  useEffect(() => {
    if (form.theaterId) {
      setLoadingScreens(true);
      api.get(`/theaters/${form.theaterId}/screens`)
        .then(({ data }) => {
          setScreens(data);
          // Auto-select first screen if available
          if (data.length > 0) {
            setForm((prev) => ({ ...prev, screenId: data[0].id }));
          }
        })
        .catch(() => setScreens([]))
        .finally(() => setLoadingScreens(false));
    } else {
      setScreens([]);
    }
  }, [form.theaterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await api.post('/shows', {
        movieId: form.movieId,
        screenId: form.screenId,
        startTime: form.startTime,
        basePrice: Number(form.basePrice),
      });
      setMessage('Show scheduled successfully!');
      setForm((prev) => ({ ...prev, startTime: '', basePrice: '' }));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not schedule show — check for overlapping timings on this screen.');
    }
  };

  return (
    <form className="card" style={styles.form} onSubmit={handleSubmit}>
      <h3 style={styles.formTitle}>Schedule a Show</h3>
      {error && <div style={styles.error}>{error}</div>}
      {message && <div style={styles.success}>{message}</div>}

      <div>
        <label style={styles.label}>1. Select Movie</label>
        <select required value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })} style={styles.select}>
          <option value="">Choose movie…</option>
          {movies.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      </div>

      <div>
        <label style={styles.label}>2. Select Theater</label>
        <select required value={form.theaterId} onChange={(e) => setForm({ ...form, theaterId: e.target.value, screenId: '' })} style={styles.select}>
          <option value="">Choose theater…</option>
          {theaters.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.city}</option>)}
        </select>
      </div>

      <div>
        <label style={styles.label}>3. Select Auditorium Screen</label>
        <select
          required
          value={form.screenId}
          onChange={(e) => setForm({ ...form, screenId: e.target.value })}
          disabled={!form.theaterId || loadingScreens}
          style={styles.select}
        >
          {!form.theaterId ? (
            <option value="">First select a theater above…</option>
          ) : loadingScreens ? (
            <option value="">Loading screens…</option>
          ) : screens.length === 0 ? (
            <option value="">No screens found for this theater</option>
          ) : (
            screens.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.total_rows * s.total_columns} Seats · {s.total_rows} Rows × {s.total_columns} Cols)
              </option>
            ))
          )}
        </select>
      </div>

      <div>
        <label style={styles.label}>4. Show Date & Time</label>
        <input
          type="datetime-local"
          required
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          style={styles.select}
        />
      </div>

      <div>
        <label style={styles.label}>5. Base Ticket Price (₹)</label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g. 250"
          required
          value={form.basePrice}
          onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
          style={styles.select}
        />
      </div>

      <button className="btn-primary" style={{ marginTop: 14, padding: '12px 0', fontSize: 14, fontWeight: 700 }}>
        Schedule Show
      </button>
    </form>
  );
}

const styles = {
  form: { padding: 28, maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 16 },
  formTitle: { fontSize: 18, fontWeight: 700, fontFamily: 'Sora, sans-serif' },
  label: { display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 6 },
  select: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)', color: '#fff', fontSize: 13 },
  error: { background: 'rgba(255,92,122,0.12)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  success: { background: 'rgba(104,245,225,0.12)', color: 'var(--color-cyan)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
};
