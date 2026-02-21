const express = require('express');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const controller = require('../controllers/user.controller');

const router = express.Router();

// Only ADMIN can manage users
router.get('/', auth, role('ADMIN'), controller.getUsers);
router.post('/', auth, role('ADMIN'), controller.createUser);
router.put('/:id', auth, role('ADMIN'), controller.updateUser);
router.delete('/:id', auth, role('ADMIN'), controller.deleteUser);

module.exports = router;
