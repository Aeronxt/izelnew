-- Create clothes table
CREATE TABLE IF NOT EXISTS clothes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  type VARCHAR(100),
  category VARCHAR(100),
  details TEXT,
  discount INTEGER DEFAULT 0,
  rating DECIMAL(2, 1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  state INTEGER DEFAULT 0,
  stock_by_size JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  address TEXT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  original_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  coupon_code VARCHAR(50),
  payment_method VARCHAR(20) CHECK (payment_method IN ('credit_card', 'bkash', 'nagad', 'cash_on_delivery')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'pending_payment', 'completed', 'failed', 'refunded')),
  product_sku VARCHAR(100),
  order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'completed')),
  transaction_id TEXT,
  stripe_session_id TEXT,
  tracking_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for better performance
CREATE INDEX idx_clothes_category ON clothes(category);
CREATE INDEX idx_clothes_type ON clothes(type);
CREATE INDEX idx_clothes_created_at ON clothes(created_at DESC);

-- Create indexes for orders table
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer ON orders(customer_name);
CREATE INDEX idx_orders_transaction_id ON orders(transaction_id);

-- Enable Row Level Security
ALTER TABLE clothes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON clothes
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to read their orders
CREATE POLICY "Allow users to read their orders" ON orders
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to create orders
CREATE POLICY "Allow users to create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for clothes
CREATE TRIGGER update_clothes_updated_at BEFORE UPDATE
  ON clothes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically update updated_at for orders
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE
  ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create transaction functions
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void AS $$
BEGIN
  -- Start a new transaction
  -- Note: This is mostly for documentation as transactions are automatically started
  -- when needed in Supabase
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void AS $$
BEGIN
  -- Commit the current transaction
  COMMIT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void AS $$
BEGIN
  -- Rollback the current transaction
  ROLLBACK;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data (optional - you can modify or remove this)
INSERT INTO clothes (title, price, image_url, type, category, details, discount, rating, review_count, stock_by_size) VALUES
  ('Breed Dry Dog Food', 100, '/assets/dogfood.png', 'Pet Food', 'pets', 'Premium quality dry dog food for all breeds', 0, 4.5, 65, '{"small": 10, "medium": 15, "large": 20}'),
  ('Canon DSLR Camera', 360, '/assets/camera.png', 'Camera', 'electronics', 'Professional DSLR camera with 18-55mm lens', 0, 4.8, 95, '{"one_size": 5}'),
  ('Kids Electric Car', 960, '/assets/car.png', 'Toy Car', 'toys', 'Battery-powered ride-on car for children', 0, 4.2, 35, '{"one_size": 8}'),
  ('ASUS FHD Gaming Laptop', 700, '/assets/labtop.png', 'Laptop', 'electronics', 'High-performance gaming laptop with RTX graphics', 0, 4.6, 325, '{"one_size": 12}'),
  ('Curology Product Set', 500, '/assets/cream.png', 'Skincare', 'beauty', 'Complete skincare routine set', 0, 4.3, 145, '{"one_size": 25}'),
  ('GP11 Shooter USB Gamepad', 660, '/assets/g-black.png', 'Gamepad', 'gaming', 'Wireless gaming controller for PC and console', 40, 4.7, 55, '{"one_size": 30}'),
  ('Quilted Satin Jacket', 660, '/assets/jacket.png', 'Jacket', 'men', 'Stylish quilted jacket for all seasons', 40, 4.4, 75, '{"S": 10, "M": 15, "L": 12, "XL": 8}'),
  ('Small BookShelf', 360, '/assets/bookself.png', 'Furniture', 'home', 'Compact bookshelf for small spaces', 40, 4.1, 65, '{"one_size": 7}'),
  ('JBL Wireless Headphones', 160, '/assets/headphones.png', 'Headphones', 'electronics', 'Premium wireless headphones with noise cancellation', 40, 4.9, 265, '{"one_size": 40}'),
  ('Gucci Duffle Bag', 1160, '/assets/bag.png', 'Bag', 'accessories', 'Luxury leather duffle bag', 40, 4.8, 89, '{"one_size": 15}'),
  ('The North Face Coat', 360, '/assets/coat.png', 'Coat', 'women', 'Warm winter coat with hood', 40, 4.5, 124, '{"XS": 5, "S": 8, "M": 12, "L": 10, "XL": 6}'),
  ('RGB Gaming Keyboard', 1160, '/assets/keyboard.png', 'Keyboard', 'gaming', 'Mechanical RGB gaming keyboard', 35, 4.7, 189, '{"one_size": 22}'),
  ('IPS LCD Gaming Monitor', 400, '/assets/tv.png', 'Monitor', 'electronics', '27-inch gaming monitor with 144Hz refresh rate', 30, 4.6, 99, '{"one_size": 18}'),
  ('S-Series Comfort Chair', 400, '/assets/chair.png', 'Chair', 'furniture', 'Ergonomic office chair with lumbar support', 25, 4.3, 210, '{"one_size": 14}'),
  ('JBL Boombox Speaker', 1200, '/assets/JBL_BOOMBOX.png', 'Speaker', 'electronics', 'Portable Bluetooth speaker with powerful bass', 0, 4.8, 156, '{"one_size": 20}'),
  ('Perfume Set', 1200, '/assets/perfume.png', 'Perfume', 'beauty', 'Luxury perfume collection', 0, 4.4, 78, '{"one_size": 35}'),
  ('iPhone 14 Pro Max', 1200, '/assets/phone.png', 'Phone', 'electronics', 'Latest iPhone with advanced camera system', 0, 4.9, 445, '{"one_size": 25}'),
  ('PlayStation 5', 1200, '/assets/playstation.png', 'Console', 'gaming', 'Next-gen gaming console', 0, 4.8, 567, '{"one_size": 10}'),
  ('Amazon Echo Speakers', 1200, '/assets/speakers.png', 'Speaker', 'electronics', 'Smart speakers with Alexa', 0, 4.5, 234, '{"one_size": 28}'),
  ('Women Fashion Collection', 1200, '/assets/womenCollections.png', 'Clothing', 'women', 'Trendy fashion collection for women', 0, 4.6, 167, '{"XS": 8, "S": 12, "M": 15, "L": 10, "XL": 6}'),
  ('Nike Running Shoes', 400, '/assets/shoes.png', 'Shoes', 'footwear', 'Comfortable running shoes for athletes', 0, 4.7, 298, '{"US6": 5, "US7": 8, "US8": 10, "US9": 12, "US10": 8, "US11": 6}'); 