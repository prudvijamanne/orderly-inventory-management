const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'UP',
      message: 'Backend is healthy'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
