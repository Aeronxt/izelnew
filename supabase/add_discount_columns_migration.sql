-- Migration to add discount and coupon functionality to orders table
-- Run this migration to add the missing columns

-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS original_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(20);

-- Update the payment_status check constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('pending', 'pending_payment', 'completed', 'failed', 'refunded'));

-- Update the order_status check constraint  
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_status_check 
CHECK (order_status IN ('pending', 'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'));

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders(coupon_code);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON orders(stripe_session_id);

-- Update existing records to set default values where needed
UPDATE orders 
SET 
  original_amount = amount,
  discount_amount = 0
WHERE original_amount IS NULL;

COMMENT ON COLUMN orders.customer_email IS 'Customer email address';
COMMENT ON COLUMN orders.original_amount IS 'Original amount before any discounts';
COMMENT ON COLUMN orders.discount_amount IS 'Amount discounted from the order';
COMMENT ON COLUMN orders.coupon_code IS 'Coupon code used for discount';
COMMENT ON COLUMN orders.payment_status IS 'Status of the payment process';
COMMENT ON COLUMN orders.stripe_session_id IS 'Stripe checkout session ID';
COMMENT ON COLUMN orders.tracking_number IS 'Order tracking number for customer';

-- Show completion message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully! Discount and coupon columns added to orders table.';
END $$; 