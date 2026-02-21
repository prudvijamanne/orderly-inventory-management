const db = require('../config/db');
const bcrypt = require('bcrypt');

// ==========================
// GET ALL USERS (ADMIN)
// ==========================
exports.getUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, role, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ==========================
// CREATE USER (ADMIN)
// ==========================
exports.createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const defaultPassword = 'welcome123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      defaultPassword: 'welcome123',
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// ==========================
// UPDATE USER
// ==========================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const result = await db.query(
      `UPDATE users
       SET name = $1, email = $2, role = $3
       WHERE id = $4
       RETURNING id, name, email, role, created_at`,
      [name, email, role, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// ==========================
// DELETE USER
// ==========================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM users WHERE id = $1`, [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};
