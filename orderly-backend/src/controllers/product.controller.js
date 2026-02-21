const pool = require('../config/db');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, price, description, status } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, sku, category, price, description, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, sku, category, price, description, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};


exports.getProducts = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM products
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

