import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo display" style={{ fontSize: 21, fontWeight: 800, textDecoration: 'none' }}>
            <span className="text-gradient">ApexMovies</span>
          </Link>
          <p>Browse now-showing and upcoming releases, compare showtimes across 47 Indian cities, and lock in your seats in seconds.</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Now showing</Link>
          <Link to="/coming-soon">Coming soon</Link>
          <Link to="/theaters">Theaters</Link>
          <Link to="/offers">Offers</Link>
          <Link to="/gift-cards">🎁 Gift Cards</Link>
          <Link to="/rewards">🪙 ApexCoins Rewards</Link>
          <Link to="/premiere-club" style={{ color: '#FFD700' }}>👑 Premiere Club</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/list-theater">List your theater</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/help">Help center</Link>
          <Link to="/refund-policy">Refund policy</Link>
          <Link to="/terms">Terms of use</Link>
          <Link to="/privacy">Privacy policy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ApexMovies India Pvt. Ltd.</span>
        <span>Built for movie lovers across India.</span>
      </div>
    </footer>
  );
}
