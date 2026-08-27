-- Migration 009: Gift Cards, Rewards Wallet, and Cancellations

-- 1. Gift Cards Table
CREATE TABLE IF NOT EXISTS gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_code VARCHAR(30) UNIQUE NOT NULL,
    pin VARCHAR(10) NOT NULL,
    initial_balance NUMERIC(10, 2) NOT NULL,
    current_balance NUMERIC(10, 2) NOT NULL,
    purchaser_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    message TEXT,
    theme VARCHAR(50) DEFAULT 'cinema_gold',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired', 'disabled')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(card_code);
CREATE INDEX IF NOT EXISTS idx_gift_cards_purchaser ON gift_cards(purchaser_user_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_recipient ON gift_cards(recipient_email);

-- 2. User Wallets Table (100 Welcome Coins for everyone)
CREATE TABLE IF NOT EXISTS user_wallets (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    coin_balance NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Wallet Transactions Ledger Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('earned', 'redeemed', 'refund', 'welcome_bonus', 'gift_card_claim')),
    description TEXT NOT NULL,
    reference_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON wallet_transactions(user_id);

-- 4. Cancellations & Refunds Table
CREATE TABLE IF NOT EXISTS booking_cancellations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refund_amount NUMERIC(10, 2) NOT NULL,
    cancellation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    reason TEXT,
    refund_method VARCHAR(30) DEFAULT 'apex_wallet',
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cancellations_booking ON booking_cancellations(booking_id);
CREATE INDEX IF NOT EXISTS idx_cancellations_user ON booking_cancellations(user_id);

-- Initialize wallets for existing users
INSERT INTO user_wallets (user_id, coin_balance)
SELECT id, 100.00 FROM users
ON CONFLICT (user_id) DO NOTHING;
