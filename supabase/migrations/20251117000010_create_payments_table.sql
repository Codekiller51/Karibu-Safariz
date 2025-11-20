-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL CHECK (amount \u003e 0),
  currency currency_type NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method text,
  transaction_id text UNIQUE
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own payments
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND user_id = auth.uid()));

-- Allow authenticated users to create payments (e.g., after initiating a payment)
CREATE POLICY "Users can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM bookings WHERE id = booking_id AND user_id = auth.uid()));

-- Allow admins to manage all payments
CREATE POLICY "Admins can manage payments"
  ON payments
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);