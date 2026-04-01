const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/rfqController');

router.get('/', ctrl.getRFQs);
router.get('/:id', ctrl.getRFQ);
router.post('/', ctrl.createRFQ);
router.put('/:id', ctrl.updateRFQ);
router.post('/:id/send', ctrl.sendRFQ);
router.delete('/:id', ctrl.deleteRFQ);

module.exports = router;
