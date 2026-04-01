const Invoice = require('../models/Invoice');
const PurchaseOrder = require('../models/PurchaseOrder');

exports.getInvoices = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.vendor) filter.vendor = req.query.vendor;
    const invoices = await Invoice.find(filter)
      .populate('vendor', 'name company email')
      .populate('purchaseOrder', 'poNumber totalAmount')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: invoices });
  } catch (err) { next(err); }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const inv = await Invoice.findById(req.params.id)
      .populate('vendor', 'name company email phone gst pan bankName accountNumber ifsc address')
      .populate({ path: 'purchaseOrder', populate: { path: 'rfq', select: 'title rfqNumber' } });
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: inv });
  } catch (err) { next(err); }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const { poId } = req.body;
    let data = req.body;

    if (poId) {
      const po = await PurchaseOrder.findById(poId);
      if (!po) return res.status(404).json({ success: false, message: 'PO not found' });
      data = {
        purchaseOrder: po._id,
        vendor: po.vendor,
        items: po.items,
        subTotal: po.totalAmount,
        dueDate: req.body.dueDate
      };
    }

    const invoice = await Invoice.create(data);
    await invoice.populate('vendor', 'name company email');
    await invoice.populate('purchaseOrder', 'poNumber');
    res.status(201).json({ success: true, data: invoice });
  } catch (err) { next(err); }
};

exports.updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'Paid') update.paidDate = new Date();
    const inv = await Invoice.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('vendor', 'name company email')
      .populate('purchaseOrder', 'poNumber');
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: inv });
  } catch (err) { next(err); }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (err) { next(err); }
};
