CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('mobile', 'laptop')),
  price NUMERIC(12,2) NOT NULL,
  quantity INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, price, quantity, description)
VALUES
  ('iPhone 15', 'mobile', 999.00, 20, 'Apple smartphone'),
  ('Samsung Galaxy S24', 'mobile', 899.00, 30, 'Samsung flagship mobile'),
  ('MacBook Air M3', 'laptop', 1299.00, 15, 'Apple lightweight laptop'),
  ('Dell XPS 13', 'laptop', 1199.00, 10, 'Dell premium ultrabook');
