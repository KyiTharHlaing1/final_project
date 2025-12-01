const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const localEnvPath = path.join(__dirname, '.env.local');
if (fs.existsSync(localEnvPath)) {
  require('dotenv').config({ path: localEnvPath });
} else {
  require('dotenv').config(); // fallback to process env or root .env
}

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'users_db',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/health', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

app.get('/users', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (_e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users', async (req, res) => {
  const { name, email, city } = req.body || {};
  if (!name || !email || !city) {
    return res.status(400).json({ error: 'name, email, city are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, city) VALUES (?, ?, ?)',
      [name, email, city]
    );
    res.status(201).json({ id: result.insertId, name, email, city });
  } catch (e) {
    const code = e && e.code === 'ER_DUP_ENTRY' ? 409 : 500;
    res.status(code).json({ error: e.message });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () =>
  console.log(`API listening on http://localhost:${port}`)
);
