const express = require('express');
const pool = require('../db'); // PostgreSQL connection
const router = express.Router();

// Submit or update a rating
router.post('/', async (req, res) => {
  const { store_id, rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) ' +
      'VALUES ($1, $2, $3) ' +
      'ON CONFLICT (user_id, store_id) ' +
      'DO UPDATE SET rating = EXCLUDED.rating ' +
      'RETURNING *',
      [req.user.id, store_id, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error submitting rating' });
  }
});

// Get store details with the average rating and user's rating
router.get('/store/:storeId', async (req, res) => {
  const { storeId } = req.params;

  try {
    const result = await pool.query(
      'SELECT s.*, ' +
      'COALESCE(ROUND(AVG(r.rating), 2), 0) as avg_rating, ' +
      'r.rating as user_rating ' +
      'FROM stores s ' +
      'LEFT JOIN ratings r ON s.id = r.store_id AND r.user_id = $1 ' +
      'WHERE s.id = $2 ' +
      'GROUP BY s.id',
      [req.user.id, storeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching store info' });
  }
});

module.exports = router;
