const Quotation = require('../models/Quotation');
const RFQ = require('../models/RFQ');

exports.getQuotations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.rfq) filter.rfq = req.query.rfq;
    if (req.query.vendor) filter.vendor = req.query.vendor;
    const quotations = await Quotation.find(filter)
      .populate('vendor', 'name company email rating')
      .populate('rfq', 'title rfqNumber')
      .sort({ totalPrice: 1 });
    res.json({ success: true, data: quotations });
  } catch (err) { next(err); }
};

exports.getQuotation = async (req, res, next) => {
  try {
    const q = await Quotation.findById(req.params.id)
      .populate('vendor', 'name company email phone rating gst pan')
      .populate('rfq', 'title rfqNumber description items deadline');
    if (!q) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data: q });
  } catch (err) { next(err); }
};

exports.submitQuotation = async (req, res, next) => {
  try {
    const { rfq, vendor, totalPrice, items } = req.body;
    if (!rfq || !vendor || !totalPrice)
      return res.status(400).json({ success: false, message: 'RFQ, vendor and totalPrice are required' });

    // Check if already submitted
    const existing = await Quotation.findOne({ rfq, vendor });
    if (existing) {
      const updated = await Quotation.findByIdAndUpdate(existing._id, req.body, { new: true }).populate('vendor', 'name company').populate('rfq', 'title');
      return res.json({ success: true, data: updated });
    }

    const quotation = await Quotation.create(req.body);
    await quotation.populate('vendor', 'name company');
    await quotation.populate('rfq', 'title');

    // Flag lowest
    await flagLowest(rfq);
    res.status(201).json({ success: true, data: quotation });
  } catch (err) { next(err); }
};

exports.compareQuotations = async (req, res, next) => {
  try {
    const { rfqId } = req.params;
    const quotations = await Quotation.find({ rfq: rfqId })
      .populate('vendor', 'name company email rating')
      .sort({ totalPrice: 1 });
    const rfq = await RFQ.findById(rfqId);
    res.json({ success: true, data: { rfq, quotations } });
  } catch (err) { next(err); }
};

exports.selectQuotation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id);
    if (!quotation) return res.status(404).json({ success: false, message: 'Not found' });
    await Quotation.updateMany({ rfq: quotation.rfq }, { status: 'Rejected' });
    const selected = await Quotation.findByIdAndUpdate(id, { status: 'Selected' }, { new: true })
      .populate('vendor', 'name company email')
      .populate('rfq', 'title rfqNumber');
    await RFQ.findByIdAndUpdate(quotation.rfq, { status: 'Closed' });
    res.json({ success: true, data: selected });
  } catch (err) { next(err); }
};

async function flagLowest(rfqId) {
  const all = await Quotation.find({ rfq: rfqId }).sort({ totalPrice: 1 });
  if (!all.length) return;
  await Quotation.updateMany({ rfq: rfqId }, { isLowest: false });
  await Quotation.findByIdAndUpdate(all[0]._id, { isLowest: true });
}
