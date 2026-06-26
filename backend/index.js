const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes
app.get('/api/cities', (req, res) => {
  db.query('SELECT * FROM cities', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/listings', (req, res) => {
  const { city, category } = req.query;
  let query = 'SELECT * FROM listings WHERE 1=1';
  const params = [];
  if (city) { query += ' AND city_id = ?'; params.push(city); }
  if (category) { query += ' AND category_id = ?'; params.push(category); }
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/listings/:id', (req, res) => {
  db.query('SELECT * FROM listings WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  });
});

app.get('/api/search', (req, res) => {
  const { q } = req.query;
  const search = `%${q}%`;
  db.query(
    'SELECT * FROM listings WHERE name LIKE ? OR description LIKE ? OR address LIKE ?',
    [search, search, search],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`District Internet API running on port ${PORT}`);
});