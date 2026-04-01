const PurchaseOrder = require('../models/PurchaseOrder');
const Quotation = require('../models/Quotation');

exports.getPOs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.vendor) filter.vendor = req.query.vendor;
    const pos = await PurchaseOrder.find(filter)
      .populate('vendor', 'name company email')
      .populate('rfq', 'title rfqNumber')
      .populate('quotation', 'totalPrice validityDays')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: pos });
  } catch (err) { next(err); }
};

exports.getPO = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate('vendor', 'name company email phone gst pan bankName accountNumber ifsc address')
      .populate('rfq', 'title rfqNumber description')
      .populate('quotation');
    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });
    res.json({ success: true, data: po });
  } catch (err) { next(err); }
};

exports.createPO = async (req, res, next) => {
  try {
    const { quotationId } = req.body;
    let data = req.body;

    if (quotationId) {
      const q = await Quotation.findById(quotationId).populate('rfq');
      if (!q) return res.status(404).json({ success: false, message: 'Quotation not found' });
      data = {
        rfq: q.rfq._id,
        quotation: q._id,
        vendor: q.vendor,
        items: q.items,
        totalAmount: q.totalPrice,
        deliveryDate: req.body.deliveryDate,
        notes: req.body.notes
      };
    }

    const po = await PurchaseOrder.create(data);
    await po.populate('vendor', 'name company email');
    res.status(201).json({ success: true, data: po });
  } catch (err) { next(err); }
};

exports.updatePOStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const po = await PurchaseOrder.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('vendor', 'name company email')
      .populate('rfq', 'title rfqNumber');
    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });
    res.json({ success: true, data: po });
  } catch (err) { next(err); }
};

exports.deletePO = async (req, res, next) => {
  try {
    await PurchaseOrder.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'PO deleted' });
  } catch (err) { next(err); }
};
