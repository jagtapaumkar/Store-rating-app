const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorize');

// Apply middleware for all admin routes
router.use(authenticateToken);
router.use(authorizeRoles(['admin']));

router.get('/dashboard', async (req, res) => {
    try {
      const users = await pool.query('SELECT COUNT(*) FROM users');
      const stores = await pool.query('SELECT COUNT(*) FROM stores');
      const ratings = await pool.query('SELECT COUNT(*) FROM ratings');
  
      res.json({
        total_users: parseInt(users.rows[0].count),
        total_stores: parseInt(stores.rows[0].count),
        total_ratings: parseInt(ratings.rows[0].count)
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to load dashboard stats' });
    }
  });

  router.get('/users', async (req, res) => {
    const { name, email, address, role } = req.query;
  
    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    let values = [];
  
    if (name) {
      values.push(`%${name}%`);
      query += ` AND name ILIKE $${values.length}`;
    }
    if (email) {
      values.push(`%${email}%`);
      query += ` AND email ILIKE $${values.length}`;
    }
    if (address) {
      values.push(`%${address}%`);
      query += ` AND address ILIKE $${values.length}`;
    }
    if (role) {
      values.push(role);
      query += ` AND role = $${values.length}`;
    }
  
    const result = await pool.query(query, values);
    res.json({ users: result.rows });
  });

  router.get('/user/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const userResult = await pool.query(
        'SELECT id, name, email, address, role FROM users WHERE id = $1',
        [id]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = userResult.rows[0];
  
      // If user is store owner, fetch their average rating
      if (user.role === 'owner') {
        const store = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [user.id]);
        if (store.rows.length > 0) {
          const storeId = store.rows[0].id;
          const avg = await pool.query('SELECT ROUND(AVG(rating), 2) AS avg_rating FROM ratings WHERE store_id = $1', [storeId]);
          user.rating = avg.rows[0].avg_rating || 0;
        }
      }
  
      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  });

  router.get('/stores', async (req, res) => {
    const { name, email, address } = req.query;
  
    let query = `
      SELECT s.id, s.name, s.email, s.address, u.name AS owner_name,
        COALESCE(ROUND(AVG(r.rating), 2), 0) AS avg_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1`;
    let values = [];
  
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
  
    query += ` GROUP BY s.id, u.name ORDER BY s.name ASC`;
  
    const result = await pool.query(query, values);
    res.json({ stores: result.rows });
  });
  
  module.exports = router;
