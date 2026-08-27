import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function BookingTicket({ booking }) {
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!booking) return null;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || downloading) return;
    setDownloading(true);
    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0A0A0A',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 15, 20, imgWidth, imgHeight);
      pdf.save(`ApexMovies-Ticket-${booking.booking_reference || booking.id}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Could not generate PDF. Please try printing the page directly.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const startTimeFormatted = booking.start_time
    ? new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'N/A';
  const endTimeFormatted = booking.end_time
    ? new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  const dateFormatted = booking.start_time
    ? new Date(booking.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';
  const bookedOn = booking.created_at
    ? new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'N/A';

  const qrPayload = JSON.stringify({
    app: 'ApexMovies',
    reference: booking.booking_reference,
    bookingId: booking.id,
    customer: booking.customer_name,
    seats: booking.seats?.map((s) => `${s.row}${s.seat_number}`).join(','),
  });

  return (
    <div style={styles.container}>
      {/* Action Toolbar */}
      <div style={styles.toolbar}>
        <button
          className="btn-primary"
          onClick={handleDownloadPDF}
          disabled={downloading}
          style={styles.actionBtn}
        >
          {downloading ? 'Generating PDF…' : '⬇ Download PDF Ticket'}
        </button>
        <button
          className="btn-ghost"
          onClick={handlePrint}
          style={styles.actionBtn}
        >
          🖨 Print Ticket
        </button>
      </div>

      {/* Printable Ticket Card */}
      <div ref={ticketRef} style={styles.ticketCard}>
        {/* Ticket Header */}
        <div style={styles.ticketHeader}>
          <div style={styles.brandRow}>
            <div className="display" style={styles.brandLogo}>
              <span className="text-gradient">ApexMovies</span>
            </div>
            <span style={styles.eTicketTag}>E-TICKET PASS</span>
          </div>
          <div style={styles.headerRef}>
            <span style={styles.headerRefLabel}>BOOKING REF:</span>
            <span style={styles.headerRefVal}>{booking.booking_reference}</span>
          </div>
        </div>

        {/* Main Body Grid */}
        <div style={styles.ticketBody}>
          {/* Left: Poster */}
          {booking.poster_url && (
            <div style={styles.posterSection}>
              <img src={booking.poster_url} alt={booking.movie_title} style={styles.posterImg} />
            </div>
          )}

          {/* Middle: Movie & Showing Info */}
          <div style={styles.infoSection}>
            <h2 style={styles.movieTitle}>{booking.movie_title}</h2>
            <div style={styles.genreDuration}>
              {booking.genre} {booking.duration_mins ? `· ${booking.duration_mins} min` : ''} {booking.language ? `· ${booking.language}` : ''}
            </div>

            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>THEATER</span>
                <span style={styles.detailVal}>{booking.theater_name}</span>
                {booking.theater_address && (
                  <span style={styles.detailSub}>{booking.theater_address}</span>
                )}
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>SCREEN</span>
                <span style={styles.detailVal}>{booking.screen_name || 'Standard Screen'}</span>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>DATE</span>
                <span style={styles.detailVal}>{dateFormatted}</span>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>TIME</span>
                <span style={styles.detailVal}>
                  {startTimeFormatted}
                  {endTimeFormatted && <span style={styles.detailSub}> (ends ~{endTimeFormatted})</span>}
                </span>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>CUSTOMER</span>
                <span style={styles.detailVal}>{booking.customer_name || 'Valued Guest'}</span>
              </div>

              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>STATUS</span>
                <span style={{ ...styles.detailVal, color: 'var(--color-cyan)', textTransform: 'uppercase', fontWeight: 800 }}>
                  ● {booking.status || 'CONFIRMED'}
                </span>
              </div>
            </div>

            {/* Selected Seats */}
            <div style={styles.seatsArea}>
              <span style={styles.detailLabel}>RESERVED SEATS</span>
              <div style={styles.seatsRow}>
                {booking.seats?.map((seat, idx) => (
                  <span key={idx} style={styles.seatChip}>
                    {seat.row}{seat.seat_number}
                    {seat.seat_type && seat.seat_type !== 'regular' && (
                      <small style={styles.seatTypeTag}> ({seat.seat_type})</small>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: QR Code & Total */}
          <div style={styles.qrSection}>
            <div style={styles.qrBox}>
              <QRCodeSVG
                value={qrPayload}
                size={110}
                bgColor="#141414"
                fgColor="#68F5E1"
                level="M"
              />
            </div>
            <span style={styles.qrCaption}>Scan at gate</span>

            <div style={styles.priceBox}>
              <span style={styles.priceLabel}>TOTAL PAID</span>
              <span style={styles.priceAmount}>₹{Number(booking.total_amount).toFixed(2)}</span>
              {Number(booking.discount_amount) > 0 && (
                <span style={styles.discountTag}>
                  Saved ₹{Number(booking.discount_amount).toFixed(0)} ({booking.promo_code})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Perforation dashed line */}
        <div style={styles.perforation}>
          <div style={styles.perfNotchLeft} />
          <div style={styles.perfLine} />
          <div style={styles.perfNotchRight} />
        </div>

        {/* Ticket Footer */}
        <div style={styles.ticketFooter}>
          <div style={styles.footerNote}>
            <span>Booked on: {bookedOn}</span>
            <span>• Please arrive 15 minutes before showtime. Enjoy the movie!</span>
          </div>
          <div style={styles.watermark}>ApexMovies Official Pass</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 840, margin: '0 auto' },
  toolbar: { display: 'flex', gap: 14, justifyContent: 'flex-end', marginBottom: 20 },
  actionBtn: { padding: '10px 20px', fontSize: 14, fontWeight: 600, borderRadius: 10 },
  ticketCard: {
    background: '#141414',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
    position: 'relative',
    color: '#FFFFFF',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 28px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'linear-gradient(90deg, rgba(104,245,225,0.06) 0%, rgba(155,108,255,0.06) 100%)',
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: 14 },
  brandLogo: { fontSize: 22, fontWeight: 800 },
  eTicketTag: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.2,
    background: 'var(--gradient-vibrant)',
    color: '#FFFFFF',
    padding: '3px 8px',
    borderRadius: 4,
  },
  headerRef: { display: 'flex', alignItems: 'center', gap: 8 },
  headerRefLabel: { fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: 0.5 },
  headerRefVal: { fontSize: 14, color: 'var(--color-cyan)', fontWeight: 800, fontFamily: 'Space Mono, monospace' },
  ticketBody: {
    display: 'flex',
    gap: 24,
    padding: '28px',
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  posterSection: { width: 140, flexShrink: 0 },
  posterImg: { width: '100%', height: 'auto', aspectRatio: '2/3', borderRadius: 10, objectFit: 'cover', display: 'block' },
  infoSection: { flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column' },
  movieTitle: { fontSize: 24, fontWeight: 800, margin: '0 0 6px', fontFamily: 'Sora, sans-serif' },
  genreDuration: { fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', marginBottom: 18 },
  detailItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  detailLabel: { fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: 'var(--color-text-muted)', textTransform: 'uppercase' },
  detailVal: { fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' },
  detailSub: { fontSize: 11.5, color: 'var(--color-text-secondary)', marginTop: 1 },
  seatsArea: { marginTop: 'auto', paddingTop: 10 },
  seatsRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 },
  seatChip: {
    background: 'var(--gradient-primary)',
    color: '#04120F',
    fontWeight: 800,
    fontSize: 12.5,
    padding: '4px 10px',
    borderRadius: 6,
    display: 'inline-flex',
    alignItems: 'center',
  },
  seatTypeTag: { fontSize: 10, fontWeight: 600, opacity: 0.85, marginLeft: 2 },
  qrSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    borderLeft: '1px dashed rgba(255, 255, 255, 0.1)',
    minWidth: 150,
  },
  qrBox: {
    padding: 10,
    background: '#141414',
    border: '1px solid rgba(104,245,225,0.3)',
    borderRadius: 12,
    boxShadow: '0 0 16px rgba(104,245,225,0.1)',
  },
  qrCaption: { fontSize: 10.5, color: 'var(--color-text-muted)', marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  priceBox: { marginTop: 20, textAlign: 'center' },
  priceLabel: { display: 'block', fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: 0.5 },
  priceAmount: { fontSize: 20, fontWeight: 800, color: 'var(--color-cyan)', fontFamily: 'Sora, sans-serif' },
  discountTag: { display: 'block', marginTop: 4, fontSize: 10.5, fontWeight: 700, color: '#38EF7D', background: 'rgba(56,239,125,0.1)', padding: '2px 6px', borderRadius: 4 },
  perforation: { position: 'relative', height: 20, display: 'flex', alignItems: 'center' },
  perfNotchLeft: {
    position: 'absolute',
    left: -10,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--color-bg)',
  },
  perfLine: { width: '100%', height: 1, borderTop: '2px dashed rgba(255, 255, 255, 0.15)' },
  perfNotchRight: {
    position: 'absolute',
    right: -10,
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: 'var(--color-bg)',
  },
  ticketFooter: {
    padding: '16px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11.5,
    color: 'var(--color-text-muted)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  footerNote: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  watermark: { fontWeight: 700, color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: 0.5 },
};
