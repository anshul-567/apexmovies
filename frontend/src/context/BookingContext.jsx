import { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../api/axiosClient';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]); // show_seat rows
  const [lockedUntil, setLockedUntil] = useState(null);

  const toggleSeat = useCallback((seat, maxSeats = 10) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.show_seat_id === seat.show_seat_id);
      if (exists) return prev.filter((s) => s.show_seat_id !== seat.show_seat_id);
      if (prev.length >= maxSeats) {
        return prev;
      }
      return [...prev, seat];
    });
  }, []);

  const selectedSeatsRef = useRef(selectedSeats);
  selectedSeatsRef.current = selectedSeats;

  const holdSelectedSeats = useCallback(async (showId) => {
    const seatsToHold = selectedSeatsRef.current;
    if (!seatsToHold.length) return;
    const { data } = await api.post('/bookings/hold', {
      showId,
      showSeatIds: seatsToHold.map((s) => s.show_seat_id),
    });
    setLockedUntil(data.lockedUntil);
    return data;
  }, []);

  const releaseSelectedSeats = useCallback(async () => {
    const seatsToRelease = selectedSeatsRef.current;
    if (!seatsToRelease.length) return;
    try {
      await api.post('/bookings/release', {
        showSeatIds: seatsToRelease.map((s) => s.show_seat_id),
      });
    } catch {}
    setSelectedSeats([]);
    setLockedUntil(null);
  }, []);

  const confirmCheckout = useCallback(
    async (
      showId,
      promoCode = '',
      useMembershipTicket = false,
      coinsToRedeem = 0,
      giftCardCode = '',
      giftCardPin = ''
    ) => {
      const seatsToConfirm = selectedSeatsRef.current;
      const { data } = await api.post('/bookings/checkout', {
        showId,
        showSeatIds: seatsToConfirm.map((s) => s.show_seat_id),
        promoCode,
        useMembershipTicket,
        coinsToRedeem,
        giftCardCode,
        giftCardPin,
      });
      setSelectedSeats([]);
      setLockedUntil(null);
      return data.booking;
    },
    []
  );

  const resetSelection = useCallback(() => {
    setSelectedSeats([]);
    setLockedUntil(null);
  }, []);

  const totalAmount = selectedSeats.reduce((sum, s) => sum + Number(s.price), 0);

  return (
    <BookingContext.Provider
      value={{
        show, setShow,
        selectedSeats, toggleSeat,
        lockedUntil, totalAmount,
        holdSelectedSeats, releaseSelectedSeats, confirmCheckout, resetSelection,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
