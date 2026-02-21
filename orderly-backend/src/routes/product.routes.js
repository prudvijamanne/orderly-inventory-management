const express = require('express');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const controller = require('../controllers/product.controller');

const router = express.Router();

router.post('/', auth, role('ADMIN','MANAGER'), controller.createProduct);
router.get('/', auth, controller.getProducts);

module.exports = router;
