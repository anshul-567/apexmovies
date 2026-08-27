import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { selectedCity, setSelectedCity, cities } = useCity();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" className="display" style={styles.logo}>
        <span className="text-gradient">ApexMovies</span>
      </Link>

      <div style={styles.links}>
        <NavLink to="/" className="nav-link" end>Movies</NavLink>
        <NavLink to="/theaters" className="nav-link">Theaters</NavLink>
        <NavLink to="/offers" className="nav-link">Offers</NavLink>
        <NavLink to="/gift-cards" className="nav-link">🎁 Gift Cards</NavLink>
        <NavLink to="/rewards" className="nav-link">🪙 Rewards</NavLink>
        <NavLink to="/premiere-club" className="nav-link" style={{ color: '#FFD700' }}>👑 Premiere Club</NavLink>
        {isAdmin && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
        {user && <NavLink to="/bookings" className="nav-link">My bookings</NavLink>}
        {user && <NavLink to="/favorites" className="nav-link">Wishlist</NavLink>}
      </div>

      <div style={styles.actions}>
        <div style={styles.cityPill}>
          <span style={styles.cityDot} />
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
        {user ? (
          <>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>{user.name}</span>
            <button className="btn-ghost" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/register" className="btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 48px', borderBottom: '1px solid var(--color-border)',
    position: 'sticky', top: 0, background: 'rgba(10,10,10,0.85)',
    backdropFilter: 'blur(12px)', zIndex: 100,
  },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: -0.5 },
  links: { display: 'flex', gap: 36, fontSize: 14, fontWeight: 500, color: 'var(--color-text-secondary)' },
  link: { color: 'inherit' },
  actions: { display: 'flex', alignItems: 'center', gap: 16 },
  cityPill: {
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
    padding: '6px 12px', borderRadius: 20, border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)', background: 'var(--color-bg-surface)',
  },
  citySelect: {
    background: '#1C1C1E', border: 'none', color: '#FFFFFF',
    fontWeight: 600, fontSize: 13, padding: '2px 4px', cursor: 'pointer', outline: 'none',
    colorScheme: 'dark',
  },
  cityDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--color-cyan)', boxShadow: '0 0 8px var(--color-cyan)', display: 'inline-block' },
};
