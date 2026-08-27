-- ApexMovies initial schema
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE user_role AS ENUM ('customer', 'theater_admin');
CREATE TYPE seat_status AS ENUM ('available', 'locked', 'booked');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'failed');

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role NOT NULL DEFAULT 'customer',
    phone           VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked         BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE movies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    poster_url      VARCHAR(500),
    duration_mins   INTEGER NOT NULL CHECK (duration_mins > 0),
    genre           VARCHAR(100),
    language        VARCHAR(50),
    release_date    DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    rating          NUMERIC(2,1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_genre ON movies(genre);

CREATE TABLE theaters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID NOT NULL REFERENCES users(id),
    name            VARCHAR(200) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    address         VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_theaters_city ON theaters(city);

CREATE TABLE screens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theater_id      UUID NOT NULL REFERENCES theaters(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    total_rows      INTEGER NOT NULL,
    total_columns   INTEGER NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE seats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_id       UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    row_label       VARCHAR(5) NOT NULL,
    seat_number     INTEGER NOT NULL,
    seat_type       VARCHAR(20) NOT NULL DEFAULT 'regular',
    UNIQUE (screen_id, row_label, seat_number)
);

CREATE TABLE shows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id        UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    screen_id       UUID NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    start_time      TIMESTAMPTZ NOT NULL,
    end_time        TIMESTAMPTZ NOT NULL,
    base_price      NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT no_screen_overlap EXCLUDE USING gist (
        screen_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    )
);
CREATE INDEX idx_shows_movie ON shows(movie_id);
CREATE INDEX idx_shows_screen_time ON shows(screen_id, start_time);

CREATE TABLE show_seats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id         UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    seat_id         UUID NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    status          seat_status NOT NULL DEFAULT 'available',
    price           NUMERIC(10,2) NOT NULL,
    locked_by       UUID REFERENCES users(id),
    locked_until    TIMESTAMPTZ,
    version         INTEGER NOT NULL DEFAULT 0,
    UNIQUE (show_id, seat_id)
);
CREATE INDEX idx_show_seats_show ON show_seats(show_id);
CREATE INDEX idx_show_seats_status ON show_seats(show_id, status);

CREATE TABLE bookings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id),
    show_id             UUID NOT NULL REFERENCES shows(id),
    total_amount        NUMERIC(10,2) NOT NULL,
    status              booking_status NOT NULL DEFAULT 'pending',
    booking_reference   VARCHAR(20) UNIQUE NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at        TIMESTAMPTZ
);
CREATE INDEX idx_bookings_user ON bookings(user_id);

CREATE TABLE booking_seats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    show_seat_id    UUID NOT NULL REFERENCES show_seats(id),
    price           NUMERIC(10,2) NOT NULL,
    UNIQUE (show_seat_id)
);
