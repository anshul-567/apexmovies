import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Theaters from './pages/Theaters';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import Favorites from './pages/Favorites';
import BookingTicket from './pages/BookingTicket';
import AdminDashboard from './pages/admin/AdminDashboard';

// Newly added detailed pages
import Offers from './pages/Offers';
import ComingSoon from './pages/ComingSoon';
import About from './pages/About';
import Careers from './pages/Careers';
import ListTheater from './pages/ListTheater';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import PremiereClub from './pages/PremiereClub';
import MembershipCheckout from './pages/MembershipCheckout';
import GiftCards from './pages/GiftCards';
import RewardsWallet from './pages/RewardsWallet';

function RequireAuth({ children, adminOnly }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/theaters" element={<Theaters />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Explore & Company Routes */}
      <Route path="/offers" element={<Offers />} />
      <Route path="/gift-cards" element={<GiftCards />} />
      <Route path="/rewards" element={<RequireAuth><RewardsWallet /></RequireAuth>} />
      <Route path="/premiere-club" element={<PremiereClub />} />
      <Route path="/membership-checkout/:tier" element={<RequireAuth><MembershipCheckout /></RequireAuth>} />
      <Route path="/coming-soon" element={<ComingSoon />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/list-theater" element={<ListTheater />} />
      <Route path="/contact" element={<Contact />} />

      {/* Support & Legal Routes */}
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Customer Protected Routes */}
      <Route path="/shows/:showId/seats" element={<RequireAuth><SeatSelection /></RequireAuth>} />
      <Route path="/shows/:showId/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
      <Route path="/bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
      <Route path="/bookings/:bookingId/ticket" element={<RequireAuth><BookingTicket /></RequireAuth>} />
      <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />

      <Route path="/admin/*" element={<RequireAuth adminOnly><AdminDashboard /></RequireAuth>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CityProvider>
          <BookingProvider>
            <Navbar />
            <AppRoutes />
            <Footer />
            {/* Vercel Web Analytics & Speed Insights */}
            <Analytics />
            <SpeedInsights />
          </BookingProvider>
        </CityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
