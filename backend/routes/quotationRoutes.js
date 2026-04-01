const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/quotationController');

router.get('/', ctrl.getQuotations);
router.get('/compare/:rfqId', ctrl.compareQuotations);
router.get('/:id', ctrl.getQuotation);
router.post('/', ctrl.submitQuotation);
router.post('/:id/select', ctrl.selectQuotation);

module.exports = router;
