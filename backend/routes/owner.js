const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/store/ratings', async (req, res) => {
    try {
      const storeResult = await pool.query(
        'SELECT id FROM stores WHERE owner_id = $1',
        [req.user.id]
      );
  
      if (storeResult.rows.length === 0) {
        return res.status(404).json({ error: 'Store not found for this owner' });
      }
  
      const storeId = storeResult.rows[0].id;
  
      const ratingsResult = await pool.query(
        `SELECT u.name, u.email, r.rating
         FROM ratings r
         JOIN users u ON r.user_id = u.id
         WHERE r.store_id = $1`,
        [storeId]
      );
  
      res.json({ ratings: ratingsResult.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching ratings' });
    }
});

router.get('/store/average-rating', async (req, res) => {
    try {
      const storeResult = await pool.query(
        'SELECT id FROM stores WHERE owner_id = $1',
        [req.user.id]
      );
  
      if (storeResult.rows.length === 0) {
        return res.status(404).json({ error: 'Store not found for this owner' });
      }
  
      const storeId = storeResult.rows[0].id;
  
      const avgResult = await pool.query(
        'SELECT ROUND(AVG(rating), 2) AS avg_rating FROM ratings WHERE store_id = $1',
        [storeId]
      );
  
      res.json({ avg_rating: avgResult.rows[0].avg_rating || 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching average rating' });
    }
});

module.exports = router;