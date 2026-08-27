import { useMemo } from 'react';
import { useBooking } from '../context/BookingContext';

// Tier styling and descriptive metadata
const TIER_CONFIG = {
  recliner: {
    name: 'VIP Recliner Luxury',
    icon: '🛋️',
    badge: 'VIP Recliner',
    desc: 'Motorized plush leather recliners with personal service',
    color: '#FFD700',
    borderColor: 'rgba(255, 215, 0, 0.35)',
    glow: 'rgba(255, 215, 0, 0.15)',
  },
  premium: {
    name: 'Executive Premium Club',
    icon: '👑',
    badge: 'Prime View',
    desc: 'Prime central viewing with extra legroom & cushioned headrests',
    color: 'var(--color-cyan)',
    borderColor: 'rgba(104, 245, 225, 0.35)',
    glow: 'rgba(104, 245, 225, 0.15)',
  },
  regular: {
    name: 'Classic Standard',
    icon: '🎟️',
    badge: 'Standard',
    desc: 'Clear acoustic line-of-sight & comfortable stadium seating',
    color: 'var(--color-text-secondary)',
    borderColor: 'var(--color-border)',
    glow: 'transparent',
  },
};

// Groups seats into consecutive rows preserving natural cinema row sequence (A, B, C, D, ...)
// and clusters consecutive rows of the same tier together so the physical cinema layout is 100% realistic
function groupAuditoriumRows(seats) {
  const rowMap = {};
  for (const seat of seats) {
    if (!rowMap[seat.row_label]) {
      rowMap[seat.row_label] = {
        rowLabel: seat.row_label,
        tier: (seat.seat_type || 'regular').toLowerCase(),
        price: Number(seat.price),
        seats: [],
      };
    }
    rowMap[seat.row_label].seats.push(seat);
  }

  // Sort rows alphabetically (A, B, C, D, E, F, G, H...)
  const sortedRows = Object.values(rowMap).sort((a, b) => a.rowLabel.localeCompare(b.rowLabel));

  // Sort seats within each row numerically
  sortedRows.forEach((r) => r.seats.sort((a, b) => a.seat_number - b.seat_number));

  // Group into contiguous blocks sharing the same tier and price
  const sections = [];
  let currentSection = null;

  for (const row of sortedRows) {
    if (!currentSection || currentSection.tier !== row.tier) {
      currentSection = {
        tier: row.tier,
        price: row.price,
        rows: [row],
      };
      sections.push(currentSection);
    } else {
      currentSection.rows.push(row);
    }
  }

  return sections;
}

export default function SeatMap({ seats }) {
  const { selectedSeats, toggleSeat } = useBooking();
  const sections = useMemo(() => groupAuditoriumRows(seats), [seats]);
  const selectedIds = new Set(selectedSeats.map((s) => s.show_seat_id));

  const seatState = (seat) => {
    if (selectedIds.has(seat.show_seat_id)) return 'selected';
    if (seat.status === 'booked') return 'booked';
    if (seat.status === 'locked') return 'locked';
    return 'available';
  };

  return (
    <div style={styles.container}>
      {/* Curved Screen Banner (Front of Theater) */}
      <div style={styles.screen}>
        <div style={styles.screenBar} />
        <div style={styles.screenLabel}>All Eyes This Way · 4K Laser Screen</div>
      </div>

      {/* Auditorium Physical Seating Layout (Row A through Row H) */}
      <div style={styles.hallLayout}>
        {sections.map((sec, secIdx) => {
          const config = TIER_CONFIG[sec.tier] || TIER_CONFIG.regular;
          const isRecliner = sec.tier === 'recliner';
          const isPremium = sec.tier === 'premium';

          return (
            <div key={secIdx} style={styles.tierSection}>
              {/* Category & Pricing Divider */}
              <div style={styles.sectionDivider}>
                <div style={styles.dividerLine} />
                <div style={{ ...styles.dividerPill, borderColor: config.borderColor, color: config.color }}>
                  <span>{config.icon}</span>
                  <span style={styles.dividerName}>{config.name}</span>
                  <span style={styles.dividerDot}>·</span>
                  <span style={styles.dividerPrice}>₹{sec.price.toFixed(0)}</span>
                </div>
                <div style={styles.dividerLine} />
              </div>

              {/* Rows inside this tier in natural alphabetical sequence */}
              <div style={styles.rowsContainer}>
                {sec.rows.map((row) => (
                  <div key={row.rowLabel} style={styles.row}>
                    <span style={styles.rowLabelLeft}>{row.rowLabel}</span>
                    <div style={styles.seatsList}>
                      {row.seats.map((seat) => {
                        const state = seatState(seat);

                        return (
                          <button
                            key={seat.show_seat_id}
                            disabled={state === 'booked' || state === 'locked'}
                            onClick={() => toggleSeat(seat, 10)}
                            title={`Row ${row.rowLabel} Seat ${seat.seat_number} · ${config.name} · ₹${Number(seat.price).toFixed(0)}`}
                            style={{
                              ...styles.seat,
                              ...(isRecliner ? styles.reclinerSeat : isPremium ? styles.premiumSeat : {}),
                              ...seatStyles[state],
                            }}
                          >
                            {seat.seat_number}
                          </button>
                        );
                      })}
                    </div>
                    <span style={styles.rowLabelRight}>{row.rowLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Legend & Information */}
      <div style={styles.legend}>
        <LegendItem style={seatStyles.available} label="Available" />
        <LegendItem style={seatStyles.selected} label="Selected" />
        <LegendItem style={seatStyles.locked} label="Held by another user" />
        <LegendItem style={seatStyles.booked} label="Booked / Sold Out" />
      </div>
    </div>
  );
}

function LegendItem({ style, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
      <span style={{ ...style, width: 20, height: 20, borderRadius: 6, cursor: 'default' }} />
      {label}
    </div>
  );
}

const styles = {
  container: { width: '100%' },
  screen: { textAlign: 'center', marginBottom: 44 },
  screenBar: {
    height: 6, borderRadius: 3, margin: '0 auto 12px', maxWidth: 480,
    background: 'linear-gradient(90deg, transparent 0%, var(--color-cyan) 25%, #FFD700 75%, transparent 100%)',
    boxShadow: '0 4px 28px rgba(104,245,225,0.4)',
  },
  screenLabel: { fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 },
  hallLayout: { display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' },
  tierSection: { width: '100%', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' },
  sectionDivider: {
    display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 640, margin: '6px 0 10px',
  },
  dividerLine: { flex: 1, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)' },
  dividerPill: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 20,
    border: '1px solid', background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(8px)',
    fontSize: 12, fontWeight: 700,
  },
  dividerName: { letterSpacing: 0.3 },
  dividerDot: { opacity: 0.5 },
  dividerPrice: { fontWeight: 800, fontFamily: 'Sora, sans-serif' },
  rowsContainer: { display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', width: '100%' },
  row: { display: 'flex', alignItems: 'center', gap: 12, width: '100%', justifyContent: 'center' },
  rowLabelLeft: { width: 22, fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 700, textAlign: 'center' },
  rowLabelRight: { width: 22, fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 700, textAlign: 'center' },
  seatsList: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  seat: {
    width: 32, height: 32, borderRadius: 8, fontSize: 11, fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform 0.15s, box-shadow 0.2s',
  },
  reclinerSeat: {
    width: 38, height: 34, borderRadius: 10, border: '1px solid rgba(255,215,0,0.35)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  premiumSeat: {
    width: 34, height: 32, borderRadius: 8, border: '1px solid rgba(104,245,225,0.3)',
  },
  legend: { display: 'flex', gap: 24, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap', padding: '16px 20px', background: 'var(--color-bg-elevated)', borderRadius: 12, border: '1px solid var(--color-border)' },
};

const seatStyles = {
  available: { background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' },
  selected: { background: 'var(--gradient-primary)', border: 'none', color: '#04120F', boxShadow: 'var(--shadow-cyan-glow)', transform: 'scale(1.12)' },
  locked: { background: 'rgba(155,108,255,0.15)', border: '1px solid var(--color-violet)', color: 'var(--color-violet)', cursor: 'not-allowed' },
  booked: { background: 'rgba(255,92,122,0.15)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', cursor: 'not-allowed', opacity: 0.6 },
};
