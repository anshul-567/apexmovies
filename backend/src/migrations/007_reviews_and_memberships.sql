-- Migration 007: Reviews & Ratings and Memberships

-- 1. Movie Reviews & Community Ratings
CREATE TABLE IF NOT EXISTS movie_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title VARCHAR(255),
  review_text TEXT NOT NULL,
  is_spoiler BOOLEAN DEFAULT FALSE,
  is_verified_buyer BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_movie_review UNIQUE (movie_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_movie_reviews_movie ON movie_reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_movie_reviews_user ON movie_reviews(user_id);

-- Helpful Votes Table
CREATE TABLE IF NOT EXISTS review_helpful_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES movie_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_review_vote UNIQUE (review_id, user_id)
);

-- 2. Apex Premiere Club Membership Tiers
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  tier VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'standard', 'gold'
  price NUMERIC(10,2) DEFAULT 0.00,
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  free_tickets_remaining INTEGER DEFAULT 0,
  free_tickets_total INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_memberships_user ON user_memberships(user_id);
