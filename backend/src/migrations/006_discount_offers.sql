-- Migration 006: Add Promo Code and Discount Amount to Bookings Table
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS promo_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0.00;
