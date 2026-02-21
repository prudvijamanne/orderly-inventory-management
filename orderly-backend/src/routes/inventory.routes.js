const express = require('express');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const controller = require('../controllers/inventory.controller');

const router = express.Router();

router.get('/', auth, role('ADMIN','MANAGER','STAFF'), controller.getInventory);
router.post('/', auth, role('ADMIN','MANAGER'), controller.updateInventory);

module.exports = router;
