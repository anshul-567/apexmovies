import { useEffect, useState } from 'react';
import api from '../../api/axiosClient';

const PRESET_SCREENS = [
  { name: 'Audi 1 4K Laser', rows: 8, cols: 10, label: '🎬 4K Laser (80 Seats)' },
  { name: 'IMAX 3D Grand Hall', rows: 10, cols: 12, label: '⚡ IMAX 3D (120 Seats)' },
  { name: '4DX Motion Dynamic', rows: 8, cols: 8, label: '🌪️ 4DX Motion (64 Seats)' },
  { name: 'VIP Director Class Recliners', rows: 6, cols: 8, label: '🛋️ VIP Recliner (48 Seats)' },
];

export default function ManageTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [selectedTheaterForScreens, setSelectedTheaterForScreens] = useState(null);
  const [theaterScreens, setTheaterScreens] = useState([]);
  const [loadingScreens, setLoadingScreens] = useState(false);

  const [theaterForm, setTheaterForm] = useState({ name: '', city: '', address: '' });
  const [screenForm, setScreenForm] = useState({ theaterId: '', name: '', totalRows: 8, totalColumns: 10 });
  const [theaterMessage, setTheaterMessage] = useState('');
  const [screenMessage, setScreenMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/theaters').then(({ data }) => setTheaters(data));
  useEffect(() => { load(); }, []);

  const loadScreensForTheater = (theaterId) => {
    setSelectedTheaterForScreens(theaterId);
    setLoadingScreens(true);
    api.get(`/theaters/${theaterId}/screens`)
      .then(({ data }) => setTheaterScreens(data))
      .catch(() => setTheaterScreens([]))
      .finally(() => setLoadingScreens(false));
  };

  const handleAddTheater = async (e) => {
    e.preventDefault();
    setError(''); setTheaterMessage('');
    try {
      await api.post('/theaters', theaterForm);
      setTheaterMessage('✓ Theater added successfully!');
      setTheaterForm({ name: '', city: '', address: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add theater');
    }
  };

  const handleAddScreen = async (e) => {
    e.preventDefault();
    setError(''); setScreenMessage('');
    if (!screenForm.theaterId) return setError('Choose a theater first');
    try {
      await api.post(`/theaters/${screenForm.theaterId}/screens`, screenForm);
      setScreenMessage('✓ Screen added with auto-generated seat matrix!');
      setScreenForm((prev) => ({ ...prev, name: '' }));
      loadScreensForTheater(screenForm.theaterId);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add screen');
    }
  };

  return (
    <div style={styles.layout}>
      {/* 1. Add Theater Form */}
      <form className="card" style={styles.form} onSubmit={handleAddTheater}>
        <h3 style={styles.formTitle}>Add a Cinema Theater</h3>
        {error && <div style={styles.error}>{error}</div>}
        {theaterMessage && <div style={styles.success}>{theaterMessage}</div>}

        <div>
          <label style={styles.label}>Theater Name</label>
          <input placeholder="e.g. Apex Cinemas Phoenix Mall" required value={theaterForm.name} onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })} style={styles.input} />
        </div>

        <div>
          <label style={styles.label}>City</label>
          <input placeholder="e.g. Mumbai, Indore, Bengaluru" required value={theaterForm.city} onChange={(e) => setTheaterForm({ ...theaterForm, city: e.target.value })} style={styles.input} />
        </div>

        <div>
          <label style={styles.label}>Full Address</label>
          <input placeholder="e.g. 4th Floor, Phoenix Marketcity, Kurla West" value={theaterForm.address} onChange={(e) => setTheaterForm({ ...theaterForm, address: e.target.value })} style={styles.input} />
        </div>

        <button className="btn-primary" style={{ marginTop: 8, padding: '12px 0' }}>Add Theater</button>
      </form>

      {/* 2. Add Screen Form */}
      <form className="card" style={styles.form} onSubmit={handleAddScreen}>
        <h3 style={styles.formTitle}>Add an Auditorium Screen</h3>
        {screenMessage && <div style={styles.success}>{screenMessage}</div>}

        <div>
          <label style={styles.label}>1. Select Target Theater</label>
          <select
            required
            value={screenForm.theaterId}
            onChange={(e) => {
              const tid = e.target.value;
              setScreenForm({ ...screenForm, theaterId: tid });
              if (tid) loadScreensForTheater(tid);
            }}
            style={styles.input}
          >
            <option value="">Choose theater…</option>
            {theaters.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.city}</option>)}
          </select>
        </div>

        {/* Quick Presets */}
        <div>
          <label style={styles.label}>Quick Screen Presets</label>
          <div style={styles.presetGrid}>
            {PRESET_SCREENS.map((p, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setScreenForm((prev) => ({ ...prev, name: p.name, totalRows: p.rows, totalColumns: p.cols }))}
                style={styles.presetBtn}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>Screen Name</label>
          <input
            placeholder="e.g. Audi 1 4K Laser or IMAX 3D"
            required
            value={screenForm.name}
            onChange={(e) => setScreenForm({ ...screenForm, name: e.target.value })}
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Total Rows</label>
            <input type="number" min="1" max="26" value={screenForm.totalRows} onChange={(e) => setScreenForm({ ...screenForm, totalRows: Number(e.target.value) })} style={styles.input} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Seats Per Row</label>
            <input type="number" min="1" max="30" value={screenForm.totalColumns} onChange={(e) => setScreenForm({ ...screenForm, totalColumns: Number(e.target.value) })} style={styles.input} />
          </div>
        </div>

        <button className="btn-primary" style={{ marginTop: 8, padding: '12px 0' }}>
          Add Screen & Generate Seat Matrix ({screenForm.totalRows * screenForm.totalColumns} Seats)
        </button>
      </form>

      {/* 3. Theaters & Active Screens Viewer */}
      <div style={styles.list}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '14px 0 10px', fontFamily: 'Sora, sans-serif' }}>
          All Registered Cinema Theaters ({theaters.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {theaters.map((t) => (
            <div key={t.id} className="card" style={styles.theaterRow}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <div style={styles.meta}>📍 {t.city} · {t.address}</div>
                </div>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 11, padding: '4px 8px' }}
                  onClick={() => loadScreensForTheater(t.id)}
                >
                  View Screens
                </button>
              </div>

              {selectedTheaterForScreens === t.id && (
                <div style={styles.screensSubList}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-cyan)', marginBottom: 6 }}>
                    Auditorium Screens ({theaterScreens.length}):
                  </div>
                  {loadingScreens ? (
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Loading screens…</div>
                  ) : theaterScreens.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>No screens added yet. Use form above to add one.</div>
                  ) : (
                    theaterScreens.map((s) => (
                      <div key={s.id} style={styles.screenPill}>
                        <span>🎬 <strong>{s.name}</strong></span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>{s.total_rows * s.total_columns} Seats ({s.total_rows}R × {s.total_columns}C)</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' },
  form: { padding: 24, display: 'flex', flexDirection: 'column', gap: 14, borderRadius: 16 },
  formTitle: { fontSize: 17, fontWeight: 700, fontFamily: 'Sora, sans-serif' },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: 4 },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg-elevated)', color: '#fff', fontSize: 13 },
  row: { display: 'flex', gap: 12 },
  presetGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 },
  presetBtn: { padding: '6px 8px', fontSize: 11, borderRadius: 6, border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-secondary)', cursor: 'pointer', textAlign: 'left' },
  error: { background: 'rgba(255,92,122,0.12)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  success: { background: 'rgba(104,245,225,0.12)', color: 'var(--color-cyan)', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  list: { gridColumn: '1 / -1', marginTop: 12 },
  theaterRow: { padding: 16, borderRadius: 12 },
  meta: { fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 },
  screensSubList: { marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 6 },
  screenPill: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, fontSize: 12 },
};
