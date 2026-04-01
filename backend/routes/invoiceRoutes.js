const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/invoiceController');

router.get('/', ctrl.getInvoices);
router.get('/:id', ctrl.getInvoice);
router.post('/', ctrl.createInvoice);
router.patch('/:id/status', ctrl.updateInvoiceStatus);
router.delete('/:id', ctrl.deleteInvoice);

module.exports = router;
