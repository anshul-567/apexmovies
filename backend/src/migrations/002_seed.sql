-- ApexMovies seed data
-- Run after 001_init.sql: psql $DATABASE_URL -f src/migrations/002_seed.sql
-- Admin login: admin@apexmovies.com / Password123!
-- Customer login: jane@example.com / Password123!
-- (password hash below is bcrypt for "Password123!")

INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Apex Admin', 'admin@apexmovies.com', '$2b$12$qA2cYBEmPK.6/WfVYXiSGelvZVfjyfaKj5cEVj/DmlGOCkItQStKe', 'theater_admin'),
  ('22222222-2222-2222-2222-222222222222', 'Jane Doe', 'jane@example.com', '$2b$12$qA2cYBEmPK.6/WfVYXiSGelvZVfjyfaKj5cEVj/DmlGOCkItQStKe', 'customer');

INSERT INTO movies (id, title, description, poster_url, duration_mins, genre, language, release_date, status, rating) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Nebula Drift', 'A salvage crew stumbles onto a signal that shouldn''t exist.', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', 138, 'Sci-Fi', 'English', '2026-06-01', 'now_showing', 8.4),
  ('a2222222-2222-2222-2222-222222222222', 'Iron Horizon', 'A convoy runs a war-torn highway against the clock.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop', 125, 'Action', 'English', '2026-05-15', 'now_showing', 7.9),
  ('a3333333-3333-3333-3333-333333333333', 'Velvet Static', 'Two estranged sisters reunite for one impossible night.', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=600&fit=crop', 112, 'Drama', 'English', '2026-07-01', 'now_showing', 8.9),
  ('a4444444-4444-4444-4444-444444444444', 'Crimson Fold', 'A detective unravels a conspiracy that folds time itself.', 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop', 130, 'Thriller', 'English', '2026-08-14', 'upcoming', NULL),
  ('a5555555-5555-5555-5555-555555555555', 'Glass Meridian', 'An orbital station drifts toward a border no one can see.', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5c0?w=400&h=600&fit=crop', 142, 'Sci-Fi', 'English', '2026-08-21', 'upcoming', NULL);

INSERT INTO theaters (id, admin_id, name, city, address) VALUES
  ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Apex Cineplex Vijay Nagar', 'Indore', '123 Vijay Nagar Square, Indore'),
  ('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Apex IMAX Palasia', 'Indore', '45 Palasia Road, Indore');

-- Screens (8 rows x 10 seats each, regular seat type by default)
INSERT INTO screens (id, theater_id, name, total_rows, total_columns) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Screen 1', 8, 10),
  ('c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'IMAX Screen', 10, 12);

-- Generate seats for Screen 1: rows A-H, back two rows (G,H) are premium
DO $$
DECLARE
  r TEXT;
  n INT;
  rows TEXT[] := ARRAY['A','B','C','D','E','F','G','H'];
  seat_type TEXT;
BEGIN
  FOREACH r IN ARRAY rows LOOP
    seat_type := CASE WHEN r IN ('G','H') THEN 'premium' ELSE 'regular' END;
    FOR n IN 1..10 LOOP
      INSERT INTO seats (screen_id, row_label, seat_number, seat_type)
      VALUES ('c1111111-1111-1111-1111-111111111111', r, n, seat_type);
    END LOOP;
  END LOOP;
END $$;

-- Generate seats for IMAX Screen: rows A-J, back three rows are recliner
DO $$
DECLARE
  r TEXT;
  n INT;
  rows TEXT[] := ARRAY['A','B','C','D','E','F','G','H','I','J'];
  seat_type TEXT;
BEGIN
  FOREACH r IN ARRAY rows LOOP
    seat_type := CASE WHEN r IN ('H','I','J') THEN 'recliner' ELSE 'regular' END;
    FOR n IN 1..12 LOOP
      INSERT INTO seats (screen_id, row_label, seat_number, seat_type)
      VALUES ('c2222222-2222-2222-2222-222222222222', r, n, seat_type);
    END LOOP;
  END LOOP;
END $$;

-- Shows: Nebula Drift and Iron Horizon playing today/tomorrow on both screens
INSERT INTO shows (id, movie_id, screen_id, start_time, end_time, base_price) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', now() + interval '3 hours', now() + interval '3 hours' + interval '153 minutes', 250.00),
  ('d2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', now() + interval '7 hours', now() + interval '7 hours' + interval '140 minutes', 220.00),
  ('d3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', now() + interval '1 day 2 hours', now() + interval '1 day 2 hours' + interval '153 minutes', 350.00),
  ('d4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', now() + interval '1 day 6 hours', now() + interval '1 day 6 hours' + interval '127 minutes', 300.00);

-- Materialize show_seats for each show, pricing by seat_type multiplier
DO $$
DECLARE
  show_row RECORD;
  seat_row RECORD;
  multiplier NUMERIC;
BEGIN
  FOR show_row IN SELECT id AS show_id, screen_id, base_price FROM shows LOOP
    FOR seat_row IN SELECT id AS seat_id, seat_type FROM seats WHERE screen_id = show_row.screen_id LOOP
      multiplier := CASE seat_row.seat_type
        WHEN 'premium' THEN 1.5
        WHEN 'recliner' THEN 2
        ELSE 1
      END;
      INSERT INTO show_seats (show_id, seat_id, status, price)
      VALUES (show_row.show_id, seat_row.seat_id, 'available', ROUND(show_row.base_price * multiplier, 2));
    END LOOP;
  END LOOP;
END $$;
