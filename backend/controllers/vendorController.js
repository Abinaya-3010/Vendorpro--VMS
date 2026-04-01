const Vendor = require('../models/Vendor');

exports.getVendors = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: vendors });
  } catch (err) { next(err); }
};

exports.getVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (err) { next(err); }
};

exports.createVendor = async (req, res, next) => {
  try {
    const { name, company, email } = req.body;
    if (!name || !company || !email) return res.status(400).json({ success: false, message: 'Name, company, and email are required' });
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (err) { next(err); }
};

exports.updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (err) { next(err); }
};

exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, message: 'Vendor deleted' });
  } catch (err) { next(err); }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = '/uploads/' + req.file.filename;
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { documentUrl: url }, { new: true });
    res.json({ success: true, data: vendor });
  } catch (err) { next(err); }
};
