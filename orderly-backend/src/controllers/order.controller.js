const pool = require('../config/db');

exports.createOrder = async (req, res, next) => {
  const client = await pool.connect();

  try {
    const { items } = req.body; 
    // items = [{ product_id, quantity }]
    const userId = req.user.userId;

    await client.query('BEGIN');

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, status)
       VALUES ($1, 'CREATED')
       RETURNING *`,
      [userId]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const stock = await client.query(
        `SELECT quantity FROM inventory WHERE product_id = $1`,
        [item.product_id]
      );

      if (stock.rows.length === 0 || stock.rows[0].quantity < item.quantity) {
        throw new Error('Insufficient stock');
      }

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [orderId, item.product_id, item.quantity]
      );

      await client.query(
        `UPDATE inventory
         SET quantity = quantity - $1
         WHERE product_id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ orderId, status: 'CREATED' });

  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};
