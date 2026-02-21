const pool = require('../config/db');

// ==========================
// UPDATE INVENTORY
// ==========================
exports.updateInventory = async (req, res, next) => {
  try {
    const { product_id, quantity, min_stock, location } = req.body;

    const result = await pool.query(
      `INSERT INTO inventory (product_id, quantity, min_stock, location)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id)
       DO UPDATE SET
         quantity = EXCLUDED.quantity,
         min_stock = EXCLUDED.min_stock,
         location = EXCLUDED.location,
         updated_at = NOW()
       RETURNING *`,
      [product_id, quantity, min_stock, location]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};


// ==========================
// GET INVENTORY
// ==========================
exports.getInventory = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
          i.product_id,
          p.name AS product_name,
          p.sku,
          i.quantity,
          i.min_stock,
          i.location,
          i.updated_at
       FROM inventory i
       JOIN products p ON p.id = i.product_id`
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
