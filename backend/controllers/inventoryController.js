const Inventory = require('../models/Inventory');
const PurchaseOrder = require('../models/PurchaseOrder');

exports.getInventory = async (req, res, next) => {
  try {
    const items = await Inventory.find()
      .populate('vendor', 'name company')
      .populate('purchaseOrder', 'poNumber totalAmount status')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
};

exports.getInventoryItem = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id)
      .populate('vendor', 'name company email')
      .populate('purchaseOrder', 'poNumber totalAmount deliveryDate');
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};

exports.receiveStock = async (req, res, next) => {
  try {
    const { poId } = req.body;
    let data = req.body;
    if (poId) {
      const po = await PurchaseOrder.findById(poId);
      if (!po) return res.status(404).json({ success: false, message: 'PO not found' });
      data.vendor = po.vendor;
      data.purchaseOrder = po._id;
      if (!data.items) {
        data.items = po.items.map(i => ({
          description: i.description,
          orderedQty: i.quantity,
          receivedQty: i.quantity,
          returnedQty: 0,
          isReturned: false
        }));
      }
      await PurchaseOrder.findByIdAndUpdate(poId, { status: 'Completed' });
    }
    const inventory = await Inventory.create(data);
    res.status(201).json({ success: true, data: inventory });
  } catch (err) { next(err); }
};

exports.updateInventory = async (req, res, next) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
};
