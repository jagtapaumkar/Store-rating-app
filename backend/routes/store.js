// backend/routes/store.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Middleware to check admin role
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
}

// Create new store (Admin only)
router.post('/', isAdmin, async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  if (!name || name.length < 20 || name.length > 60) {
    return res.status(400).json({ error: 'Name must be 20-60 characters' });
  }
  if (address && address.length > 400) {
    return res.status(400).json({ error: 'Address max 400 characters' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not add store' });
  }
});

// List all stores (with optional filters)
router.get('/', async (req, res) => {
  const { name, email, address } = req.query;
  let query = `
    SELECT s.*, 
      COALESCE(ROUND(AVG(r.rating), 2), 0) as avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1`;

  const values = [];

  if (name) {
    values.push(`%${name}%`);
    query += ` AND s.name ILIKE $${values.length}`;
  }
  if (email) {
    values.push(`%${email}%`);
    query += ` AND s.email ILIKE $${values.length}`;
  }
  if (address) {
    values.push(`%${address}%`);
    query += ` AND s.address ILIKE $${values.length}`;
  }

  query += ' GROUP BY s.id ORDER BY s.name ASC';

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching stores' });
  }
});

module.exports = router;
