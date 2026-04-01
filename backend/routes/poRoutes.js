const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/poController');

router.get('/', ctrl.getPOs);
router.get('/:id', ctrl.getPO);
router.post('/', ctrl.createPO);
router.patch('/:id/status', ctrl.updatePOStatus);
router.delete('/:id', ctrl.deletePO);

module.exports = router;
