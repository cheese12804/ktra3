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

app.get('/health', (_, res) => res.json({ ok: true, service: 'staff-service' }));

app.post('/staff/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await mysqlPool.query(
      'SELECT id, username, role, password FROM staff WHERE username = ?',
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const staffUser = rows[0];
    const isValid = await bcrypt.compare(password, staffUser.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      staff: {
        id: staffUser.id,
        username: staffUser.username,
        role: staffUser.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: 'name, category, price, quantity are required' });
    }

    const { rows } = await pgPool.query(
      'INSERT INTO products(name, category, price, quantity, description) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [name, category, price, quantity, description || '']
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, description } = req.body;

    const { rows } = await pgPool.query(
      `UPDATE products
       SET name = $1, category = $2, price = $3, quantity = $4, description = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, category, price, quantity, description || '', id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pgPool.query('DELETE FROM products WHERE id = $1', [id]);

    if (!rowCount) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/products', async (_, res) => {
  try {
    const { rows } = await pgPool.query('SELECT * FROM products ORDER BY id DESC');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`staff-service listening on ${port}`);
});
