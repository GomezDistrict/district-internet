const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Admin password - simple protection for local/early use
const ADMIN_PASSWORD = 'district2024';

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

// Admin auth middleware
function adminAuth(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Public Routes
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

// Admin auth check
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Admin - Create listing
app.post('/api/admin/listings', adminAuth, (req, res) => {
  const { city_id, category_id, name, description, address, phone, website, initials, featured, chamber_member, facebook, instagram, twitter, tiktok, youtube } = req.body;
  db.query(
    'INSERT INTO listings (city_id, category_id, name, description, address, phone, website, initials, featured, chamber_member, facebook, instagram, twitter, tiktok, youtube) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [city_id, category_id, name, description, address, phone, website, initials, featured || 0, chamber_member || 0, facebook, instagram, twitter, tiktok, youtube],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: results.insertId, message: 'Listing created' });
    }
  );
});

// Admin - Update listing
app.put('/api/admin/listings/:id', adminAuth, (req, res) => {
  const { city_id, category_id, name, description, address, phone, website, initials, featured, chamber_member, facebook, instagram, twitter, tiktok, youtube } = req.body;
  db.query(
    'UPDATE listings SET city_id=?, category_id=?, name=?, description=?, address=?, phone=?, website=?, initials=?, featured=?, chamber_member=?, facebook=?, instagram=?, twitter=?, tiktok=?, youtube=? WHERE id=?',
    [city_id, category_id, name, description, address, phone, website, initials, featured || 0, chamber_member || 0, facebook, instagram, twitter, tiktok, youtube, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Listing updated' });
    }
  );
});

// Admin - Delete listing
app.delete('/api/admin/listings/:id', adminAuth, (req, res) => {
  db.query('DELETE FROM listings WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Listing deleted' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`District Internet API running on port ${PORT}`);
});