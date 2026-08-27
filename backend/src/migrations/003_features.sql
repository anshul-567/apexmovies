-- ApexMovies migration 003: Features expansion (favorites/wishlist, search indexes)

CREATE TABLE IF NOT EXISTS movie_favorites (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id    UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, movie_id)
);

CREATE INDEX IF NOT EXISTS idx_movie_favorites_user ON movie_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_favorites_movie ON movie_favorites(movie_id);

-- Additional indexing to optimize search, language, rating, and showtime filtering
CREATE INDEX IF NOT EXISTS idx_movies_language ON movies(language);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies(rating);
CREATE INDEX IF NOT EXISTS idx_shows_start_time ON shows(start_time);
