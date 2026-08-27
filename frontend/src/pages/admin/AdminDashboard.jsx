import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import ManageMovies from './ManageMovies';
import ManageTheaters from './ManageTheaters';
import ManageShows from './ManageShows';

export default function AdminDashboard() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Admin dashboard</h1>
      <div style={styles.tabs}>
        <NavLink to="movies" className="nav-link" style={{ padding: '8px 16px', fontSize: 15 }}>Movies</NavLink>
        <NavLink to="theaters" className="nav-link" style={{ padding: '8px 16px', fontSize: 15 }}>Theaters &amp; Screens</NavLink>
        <NavLink to="shows" className="nav-link" style={{ padding: '8px 16px', fontSize: 15 }}>Schedule Shows</NavLink>
      </div>

      <Routes>
        <Route index element={<Navigate to="movies" replace />} />
        <Route path="movies" element={<ManageMovies />} />
        <Route path="theaters" element={<ManageTheaters />} />
        <Route path="shows" element={<ManageShows />} />
      </Routes>
    </div>
  );
}

const styles = {
  page: { padding: '48px', maxWidth: 1200, margin: '0 auto' },
  title: { fontSize: 26, fontWeight: 700, marginBottom: 24, fontFamily: 'Sora, sans-serif' },
  tabs: { display: 'flex', gap: 24, marginBottom: 32, borderBottom: '1px solid var(--color-border)', paddingBottom: 8 },
};
