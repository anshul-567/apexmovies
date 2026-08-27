import { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

const EMPTY = { title: '', description: '', posterUrl: '', durationMins: '', genre: '', language: '', releaseDate: '', status: 'upcoming' };

export default function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const load = () => api.get('/movies', { params: { limit: 100 } }).then(({ data }) => setMovies(Array.isArray(data) ? data : (data.movies || [])));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/movies', form);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save movie');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/movies/${id}`);
    load();
  };

  return (
    <div style={styles.layout}>
      <form className="card" style={styles.form} onSubmit={handleSubmit}>
        <h3 style={styles.formTitle}>Add a movie</h3>
        {error && <div style={styles.error}>{error}</div>}
        <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Poster URL" value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} />
        <div style={styles.row}>
          <input placeholder="Duration (mins)" type="number" required value={form.durationMins} onChange={(e) => setForm({ ...form, durationMins: e.target.value })} />
          <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} />
        </div>
        <div style={styles.row}>
          <input placeholder="Language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
          <input type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} />
        </div>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="upcoming">Upcoming</option>
          <option value="now_showing">Now showing</option>
          <option value="archived">Archived</option>
        </select>
        <button className="btn-primary" style={{ marginTop: 16 }}>Save movie</button>
      </form>

      <div style={styles.list}>
        {movies.map((m) => (
          <div key={m.id} className="card" style={styles.row2}>
            <img src={m.poster_url} alt="" style={styles.thumb} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{m.title}</div>
              <div style={styles.meta}>{m.genre} · {m.duration_mins}min · {m.status}</div>
            </div>
            <button className="btn-ghost" onClick={() => handleDelete(m.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: 32, alignItems: 'start' },
  form: { padding: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  formTitle: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  row: { display: 'flex', gap: 12 },
  error: { background: 'rgba(255,92,122,0.12)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  row2: { display: 'flex', alignItems: 'center', gap: 14, padding: 14 },
  thumb: { width: 44, height: 64, objectFit: 'cover', borderRadius: 6 },
  meta: { fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 },
};
