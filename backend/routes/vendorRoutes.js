const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ctrl = require('../controllers/vendorController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', ctrl.getVendors);
router.get('/:id', ctrl.getVendor);
router.post('/', ctrl.createVendor);
router.put('/:id', ctrl.updateVendor);
router.delete('/:id', ctrl.deleteVendor);
router.post('/:id/upload', upload.single('document'), ctrl.uploadDocument);

module.exports = router;
