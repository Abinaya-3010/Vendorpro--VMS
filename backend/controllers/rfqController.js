const RFQ = require('../models/RFQ');

exports.getRFQs = async (req, res, next) => {
  try {
    const rfqs = await RFQ.find().populate('vendors', 'name company email').sort({ createdAt: -1 });
    res.json({ success: true, data: rfqs });
  } catch (err) { next(err); }
};

exports.getRFQ = async (req, res, next) => {
  try {
    const rfq = await RFQ.findById(req.params.id).populate('vendors', 'name company email phone');
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });
    res.json({ success: true, data: rfq });
  } catch (err) { next(err); }
};

exports.createRFQ = async (req, res, next) => {
  try {
    const { title, deadline, items } = req.body;
    if (!title || !deadline || !items || !items.length)
      return res.status(400).json({ success: false, message: 'Title, deadline, and items are required' });
    const rfq = await RFQ.create(req.body);
    res.status(201).json({ success: true, data: rfq });
  } catch (err) { next(err); }
};

exports.updateRFQ = async (req, res, next) => {
  try {
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });
    res.json({ success: true, data: rfq });
  } catch (err) { next(err); }
};

exports.sendRFQ = async (req, res, next) => {
  try {
    const { vendorIds } = req.body;
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, { vendors: vendorIds, status: 'Sent' }, { new: true }).populate('vendors', 'name company email');
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });
    res.json({ success: true, data: rfq, message: 'RFQ sent to vendors' });
  } catch (err) { next(err); }
};

exports.deleteRFQ = async (req, res, next) => {
  try {
    await RFQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'RFQ deleted' });
  } catch (err) { next(err); }
};
