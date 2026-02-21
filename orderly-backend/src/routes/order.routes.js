const express = require('express');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const controller = require('../controllers/order.controller');

const router = express.Router();

// Create Order → All roles allowed
router.post('/', auth, role('ADMIN', 'MANAGER', 'STAFF'), controller.createOrder);

// View Orders → Admin & Manager
router.get('/', auth, role('ADMIN', 'MANAGER','STAFF'), controller.getOrders);

module.exports = router;
