const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'mysql',
  user: process.env.MYSQL_USER || 'app_user',
  password: process.env.MYSQL_PASSWORD || 'app_password',
  database: process.env.MYSQL_DATABASE || 'sales_mysql',
  waitForConnections: true,
  connectionLimit: 10
});

const pgPool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'sales_pg',
  port: Number(process.env.POSTGRES_PORT || 5432)
});

app.get('/health', (_, res) => res.json({ ok: true, service: 'customer-service' }));

app.post('/auth/register', async (req, res) => {
  try {
    const { username, password, email, full_name, phone } = req.body;
    if (!username || !password || !email || !full_name || !phone) {
      return res.status(400).json({ message: 'username, password, email, full_name, phone are required' });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'phone must be a 10-digit number' });
    }

    const [existing] = await mysqlPool.query('SELECT id FROM customers WHERE username = ? OR email = ?', [username, email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await mysqlPool.query(
      'INSERT INTO customers (username, password, email, full_name, phone) VALUES (?, ?, ?, ?, ?)',
      [username, hashed, email, full_name, phone]
    );

    return res.status(201).json({ id: result.insertId, username, email, full_name, phone });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await mysqlPool.query(
      'SELECT id, username, email, full_name, phone, password FROM customers WHERE username = ?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    if (category) {
      const { rows } = await pgPool.query('SELECT * FROM products WHERE category = $1 ORDER BY id DESC', [category]);
      return res.json(rows);
    }
    const { rows } = await pgPool.query('SELECT * FROM products ORDER BY id DESC');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/products/search', async (req, res) => {
  try {
    const keyword = req.query.q || '';
    const { rows } = await pgPool.query(
      'SELECT * FROM products WHERE LOWER(name) LIKE LOWER($1) ORDER BY id DESC',
      [`%${keyword}%`]
    );
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/cart', async (req, res) => {
  try {
    const { customer_id } = req.body;
    if (!customer_id) {
      return res.status(400).json({ message: 'customer_id is required' });
    }

    const [result] = await mysqlPool.query('INSERT INTO carts (customer_id, status) VALUES (?, ?)', [customer_id, 'active']);
    return res.status(201).json({ cart_id: result.insertId, customer_id, status: 'active' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/cart/add', async (req, res) => {
  try {
    const { cart_id, product_id, quantity } = req.body;
    if (!cart_id || !product_id || !quantity) {
      return res.status(400).json({ message: 'cart_id, product_id, quantity are required' });
    }

    const [cartRows] = await mysqlPool.query('SELECT id FROM carts WHERE id = ?', [cart_id]);
    if (!cartRows.length) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const [existing] = await mysqlPool.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', [cart_id, product_id]);

    if (existing.length) {
      const newQty = existing[0].quantity + Number(quantity);
      await mysqlPool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      await mysqlPool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cart_id, product_id, quantity]
      );
    }

    return res.status(201).json({ message: 'Added to cart' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/cart/:id', async (req, res) => {
  try {
    const cartId = req.params.id;
    const [items] = await mysqlPool.query('SELECT product_id, quantity FROM cart_items WHERE cart_id = ?', [cartId]);

    if (!items.length) {
      return res.json({ cart_id: Number(cartId), items: [], total: 0 });
    }

    const productIds = items.map((item) => item.product_id);
    const { rows: products } = await pgPool.query('SELECT id, name, price FROM products WHERE id = ANY($1)', [productIds]);

    const mergedItems = items.map((item) => {
      const p = products.find((product) => product.id === item.product_id);
      const price = p ? Number(p.price) : 0;
      return {
        product_id: item.product_id,
        name: p ? p.name : 'Unknown',
        quantity: item.quantity,
        price,
        line_total: price * item.quantity
      };
    });

    const total = mergedItems.reduce((sum, item) => sum + item.line_total, 0);

    return res.json({ cart_id: Number(cartId), items: mergedItems, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`customer-service listening on ${port}`);
});
