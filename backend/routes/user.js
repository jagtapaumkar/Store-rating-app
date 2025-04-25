const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();

const authenticateToken = require('../middleware/auth');
const { passwordValidation } = require('../middleware/validators');
const validateRequest = require('../middleware/validateRequest');

router.put(
  '/update-password',
  passwordValidation,
  validateRequest,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing current or new password' });
    }

    try {
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);

      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong while updating the password' });
    }
  }
);

module.exports = router;