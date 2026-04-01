const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/inventoryController');

router.get('/', ctrl.getInventory);
router.get('/:id', ctrl.getInventoryItem);
router.post('/', ctrl.receiveStock);
router.put('/:id', ctrl.updateInventory);

module.exports = router;
