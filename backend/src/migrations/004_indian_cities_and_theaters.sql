-- Add Indian theaters and shows across major Indian cities
INSERT INTO theaters (id, admin_id, name, city, address) VALUES
  ('b3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'PVR ICON Phoenix Palladium', 'Mumbai', 'High Street Phoenix, Lower Parel, Mumbai'),
  ('b4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'INOX Megaplex Inorbit', 'Mumbai', 'Inorbit Mall, Malad West, Mumbai'),
  ('b5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'PVR Director''s Cut Ambience', 'Delhi NCR', 'Ambience Mall, Vasant Kunj, New Delhi'),
  ('b6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'PVR Superplex Mall of India', 'Delhi NCR', 'Sector 18, Noida, Delhi NCR'),
  ('b7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'PVR IMAX Forum South City', 'Bengaluru', 'Konanakunte Cross, Kanakapura Road, Bengaluru'),
  ('b8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Cinepolis Nexus Shantiniketan', 'Bengaluru', 'Whitefield Main Road, Bengaluru'),
  ('b9999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'AMB Cinemas Gachibowli', 'Hyderabad', 'Sarath City Capital Mall, Gachibowli, Hyderabad'),
  ('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'PVR Market City Phoenix', 'Pune', 'Viman Nagar, Pune')
ON CONFLICT (id) DO NOTHING;

-- Add Screens
INSERT INTO screens (id, theater_id, name, total_rows, total_columns) VALUES
  ('c3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'Audi 1 4DX', 8, 10),
  ('c4444444-4444-4444-4444-444444444444', 'b5555555-5555-5555-5555-555555555555', 'Gold Class Screen', 6, 8),
  ('c5555555-5555-5555-5555-555555555555', 'b7777777-7777-7777-7777-777777777777', 'IMAX Laser Screen', 10, 12),
  ('c6666666-6666-6666-6666-666666666666', 'b9999999-9999-9999-9999-999999999999', 'VIP Screen', 8, 10)
ON CONFLICT (id) DO NOTHING;

-- Generate seats for screens
DO $$
DECLARE
  r TEXT;
  n INT;
  rows TEXT[] := ARRAY['A','B','C','D','E','F','G','H'];
  sc_id UUID;
BEGIN
  FOREACH sc_id IN ARRAY ARRAY['c3333333-3333-3333-3333-333333333333'::uuid, 'c6666666-6666-6666-6666-666666666666'::uuid] LOOP
    FOREACH r IN ARRAY rows LOOP
      FOR n IN 1..10 LOOP
        INSERT INTO seats (screen_id, row_label, seat_number, seat_type)
        VALUES (sc_id, r, n, CASE WHEN r IN ('G','H') THEN 'premium' ELSE 'regular' END)
        ON CONFLICT DO NOTHING;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Shows for Indian Theaters
INSERT INTO shows (id, movie_id, screen_id, start_time, end_time, base_price) VALUES
  ('d5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', now() + interval '4 hours', now() + interval '6 hours', 350.00),
  ('d6666666-6666-6666-6666-666666666666', 'a2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', now() + interval '8 hours', now() + interval '10 hours', 320.00),
  ('d7777777-7777-7777-7777-777777777777', 'a1111111-1111-1111-1111-111111111111', 'c6666666-6666-6666-6666-666666666666', now() + interval '1 day 3 hours', now() + interval '1 day 5 hours', 400.00)
ON CONFLICT (id) DO NOTHING;

-- Materialize show_seats for new shows
DO $$
DECLARE
  show_row RECORD;
  seat_row RECORD;
  multiplier NUMERIC;
BEGIN
  FOR show_row IN SELECT id AS show_id, screen_id, base_price FROM shows WHERE id IN ('d5555555-5555-5555-5555-555555555555','d6666666-6666-6666-6666-666666666666','d7777777-7777-7777-7777-777777777777') LOOP
    FOR seat_row IN SELECT id AS seat_id, seat_type FROM seats WHERE screen_id = show_row.screen_id LOOP
      multiplier := CASE seat_row.seat_type
        WHEN 'premium' THEN 1.5
        WHEN 'recliner' THEN 2
        ELSE 1
      END;
      INSERT INTO show_seats (show_id, seat_id, status, price)
      VALUES (show_row.show_id, seat_row.seat_id, 'available', ROUND(show_row.base_price * multiplier, 2))
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
