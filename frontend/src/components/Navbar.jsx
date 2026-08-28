import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { selectedCity, setSelectedCity, cities } = useCity();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer upon navigating to a new route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="site-nav" style={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={styles.hamburgerBtn}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          <Link to="/" className="display" style={styles.logo}>
            <span className="text-gradient">ApexMovies</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="desktop-nav-links" style={styles.links}>
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

        {/* Right Actions */}
        <div style={styles.actions}>
          <div className="city-pill-wrapper" style={styles.cityPill}>
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

          <div className="desktop-auth-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {user ? (
              <>
                <span className="nav-user-name" style={{ color: 'var(--color-text-secondary)', fontSize: 13.5, maxWidth: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </span>
                <button className="btn-ghost" onClick={handleLogout} style={{ padding: '7px 14px', fontSize: 13 }}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }}>Log in</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          style={styles.backdrop}
        />
      )}

      {/* Mobile Glassmorphic Navigation Drawer */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          ...styles.drawer,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div style={styles.drawerHeader}>
          <Link to="/" className="display" style={styles.logo} onClick={() => setMobileMenuOpen(false)}>
            <span className="text-gradient">ApexMovies</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            style={styles.drawerCloseBtn}
          >
            ✕
          </button>
        </div>

        <div style={styles.drawerUserSection}>
          {user ? (
            <div style={styles.drawerUserInfo}>
              <div style={styles.avatarCircle}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>{user.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{user.email}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              <Link to="/login" className="btn-ghost" style={{ flex: 1, textAlign: 'center', padding: '10px 0' }}>Log in</Link>
              <Link to="/register" className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px 0' }}>Sign up</Link>
            </div>
          )}
        </div>

        <div style={styles.drawerLinks}>
          <NavLink to="/" className="mobile-nav-link" end onClick={() => setMobileMenuOpen(false)}>
            🎬 All Movies
          </NavLink>
          <NavLink to="/theaters" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            🏛️ Theaters & Shows
          </NavLink>
          <NavLink to="/offers" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            🏷️ Offers & Discounts
          </NavLink>
          <NavLink to="/gift-cards" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            🎁 Gift Cards
          </NavLink>
          <NavLink to="/rewards" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            🪙 ApexCoins Rewards
          </NavLink>
          <NavLink to="/premiere-club" className="mobile-nav-link" style={{ color: '#FFD700' }} onClick={() => setMobileMenuOpen(false)}>
            👑 Premiere Club VIP
          </NavLink>
          {user && (
            <>
              <div style={styles.drawerDivider} />
              <NavLink to="/bookings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                🎟️ My Bookings & Tickets
              </NavLink>
              <NavLink to="/favorites" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                ❤️ My Saved Wishlist
              </NavLink>
            </>
          )}
          {isAdmin && (
            <>
              <div style={styles.drawerDivider} />
              <NavLink to="/admin" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                ⚙️ Admin Dashboard
              </NavLink>
            </>
          )}
        </div>

        {user && (
          <div style={{ marginTop: 'auto', padding: '20px 24px' }}>
            <button
              className="btn-ghost"
              onClick={handleLogout}
              style={{ width: '100%', padding: '12px 0', borderColor: 'rgba(255,92,122,0.4)', color: 'var(--color-danger)' }}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 48px', borderBottom: '1px solid var(--color-border)',
    position: 'sticky', top: 0, background: 'rgba(10,10,10,0.92)',
    backdropFilter: 'blur(16px)', zIndex: 1000,
  },
  logo: { fontSize: 21, fontWeight: 800, letterSpacing: -0.5 },
  links: { display: 'flex', gap: 28, fontSize: 13.5, fontWeight: 500, color: 'var(--color-text-secondary)' },
  actions: { display: 'flex', alignItems: 'center', gap: 14 },
  hamburgerBtn: {
    display: 'none', background: 'none', border: 'none', color: '#FFFFFF',
    fontSize: 22, cursor: 'pointer', padding: '4px 6px',
  },
  cityPill: {
    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600,
    padding: '6px 12px', borderRadius: 20, border: '1px solid var(--color-border)',
    color: 'var(--color-text-secondary)', background: 'var(--color-bg-surface)',
  },
  citySelect: {
    background: '#1C1C1E', border: 'none', color: '#FFFFFF',
    fontWeight: 600, fontSize: 12.5, padding: '2px 4px', cursor: 'pointer', outline: 'none',
    colorScheme: 'dark',
  },
  cityDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--color-cyan)', boxShadow: '0 0 8px var(--color-cyan)', display: 'inline-block' },

  // Mobile Drawer
  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)', zIndex: 1100,
  },
  drawer: {
    position: 'fixed', top: 0, left: 0, bottom: 0, width: '82%', maxWidth: 340,
    background: 'rgba(18,18,20,0.98)', borderRight: '1px solid var(--color-border)',
    boxShadow: '10px 0 30px rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)',
    zIndex: 1200, display: 'flex', flexDirection: 'column',
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    overflowY: 'auto',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderBottom: '1px solid var(--color-border)',
  },
  drawerCloseBtn: {
    background: 'none', border: 'none', color: 'var(--color-text-muted)',
    fontSize: 20, cursor: 'pointer', padding: 4,
  },
  drawerUserSection: {
    padding: '18px 24px', background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid var(--color-border)',
  },
  drawerUserInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 38, height: 38, borderRadius: '50%', background: 'var(--gradient-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
    fontSize: 15, color: '#04120F',
  },
  drawerLinks: { display: 'flex', flexDirection: 'column', padding: '16px 12px' },
  drawerDivider: { height: 1, background: 'var(--color-border)', margin: '10px 12px' },
};
