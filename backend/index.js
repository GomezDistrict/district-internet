const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_PASSWORD = 'district2024';
const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = 'http://localhost:3000';

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

// Email helper - send business owner invitation
async function sendInviteEmail(ownerName, ownerEmail, tempPassword, listingName) {
  try {
    await resend.emails.send({
      from: 'District Internet <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Your District Internet listing is live — ${listingName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #111; color: #fff; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; background: #F5C800; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; font-size: 18px; font-weight: bold; color: #111; text-align: center;">DI</div>
            <h1 style="font-size: 22px; color: #fff; margin: 12px 0 4px;">District Internet</h1>
            <p style="color: rgba(255,255,255,0.45); font-size: 13px; margin: 0;">Sanford, NC Local Directory</p>
          </div>
          <div style="background: #1A1A1A; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #F5C800; font-size: 18px; margin: 0 0 12px;">Hi ${ownerName},</h2>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
              Your business <strong style="color: #fff;">${listingName}</strong> is now listed on District Internet — Sanford's local business directory.
            </p>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.7; margin: 0;">
              You can log in to your business portal to update your information, add social media links, and keep your listing current.
            </p>
          </div>
          <div style="background: #1A1A1A; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #F5C800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px;">Your Login Credentials</h3>
            <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 0 0 8px;">Email</p>
            <p style="color: #fff; font-size: 15px; font-weight: bold; margin: 0 0 16px;">${ownerEmail}</p>
            <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 0 0 8px;">Temporary Password</p>
            <p style="color: #fff; font-size: 15px; font-weight: bold; margin: 0 0 16px; background: #252525; padding: 8px 12px; border-radius: 4px; display: inline-block;">${tempPassword}</p>
            <p style="color: rgba(255,255,255,0.45); font-size: 12px; margin: 0;">Please change your password after your first login.</p>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${SITE_URL}/#owner" style="display: inline-block; background: #F5C800; color: #111; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 4px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em;">Access Your Portal</a>
          </div>
          <p style="color: rgba(255,255,255,0.25); font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} District Internet · Sanford, NC · No ads, no algorithms.
          </p>
        </div>
      `
    });
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
}

// Email helper - send yearly reminder
async function sendReminderEmail(ownerName, ownerEmail, listingName) {
  try {
    await resend.emails.send({
      from: 'District Internet <onboarding@resend.dev>',
      to: ownerEmail,
      subject: `Time to verify your listing — ${listingName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #111; color: #fff; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; background: #F5C800; border-radius: 50%; width: 48px; height: 48px; line-height: 48px; font-size: 18px; font-weight: bold; color: #111; text-align: center;">DI</div>
            <h1 style="font-size: 22px; color: #fff; margin: 12px 0 4px;">District Internet</h1>
            <p style="color: rgba(255,255,255,0.45); font-size: 13px; margin: 0;">Sanford, NC Local Directory</p>
          </div>
          <div style="background: #1A1A1A; border-radius: 6px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #F5C800; font-size: 18px; margin: 0 0 12px;">Hi ${ownerName},</h2>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.7; margin: 0 0 16px;">
              It's been a year since your business <strong style="color: #fff;">${listingName}</strong> was listed on District Internet.
            </p>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.7; margin: 0;">
              Please log in and verify that your business information is still accurate — address, phone number, website, and social media links.
            </p>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${SITE_URL}/#owner" style="display: inline-block; background: #F5C800; color: #111; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 4px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em;">Review Your Listing</a>
          </div>
          <p style="color: rgba(255,255,255,0.25); font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} District Internet · Sanford, NC · No ads, no algorithms.
          </p>
        </div>
      `
    });
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
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

// Legacy admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Auth Routes
app.post('/api/auth/setup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
  db.query('SELECT id FROM users WHERE role = ?', ['admin'], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(403).json({ error: 'Admin already exists' });
    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
      [name, email, hashed, 'admin'],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
      }
    );
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });
    db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, listing_id: user.listing_id }
    });
  });
});

app.get('/api/admin/users', adminAuth, (req, res) => {
  db.query('SELECT id, name, email, role, listing_id, invited_at, last_login, created_at FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create business owner user with email invitation
app.post('/api/admin/users', adminAuth, async (req, res) => {
  const { name, email, password, listing_id, send_invite } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (name, email, password, role, listing_id, invited_at) VALUES (?,?,?,?,?,NOW())',
    [name, email, hashed, 'business_owner', listing_id || null],
    async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      let emailSent = false;
      if (send_invite && listing_id) {
        db.query('SELECT name FROM listings WHERE id = ?', [listing_id], async (err, listings) => {
          if (!err && listings.length > 0) {
            emailSent = await sendInviteEmail(name, email, password, listings[0].name);
          }
        });
      }
      res.json({ success: true, id: result.insertId, emailSent });
    }
  );
});

app.put('/api/auth/password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = results[0];
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ error: 'Current password incorrect' });
    const hashed = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

// Send yearly reminder to all business owners
app.post('/api/admin/send-reminders', adminAuth, async (req, res) => {
  db.query(
    `SELECT u.name, u.email, l.name as listing_name 
     FROM users u 
     JOIN listings l ON u.listing_id = l.id 
     WHERE u.role = 'business_owner' AND u.listing_id IS NOT NULL`,
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      let sent = 0;
      for (const owner of results) {
        const ok = await sendReminderEmail(owner.name, owner.email, owner.listing_name);
        if (ok) sent++;
      }
      res.json({ success: true, sent, total: results.length });
    }
  );
});

app.get('/api/owner/listing', async (req, res) => {
  const { email, password } = req.query;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Unauthorized' });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Unauthorized' });
    if (!user.listing_id) return res.status(404).json({ error: 'No listing linked' });
    db.query('SELECT * FROM listings WHERE id = ?', [user.listing_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0]);
    });
  });
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