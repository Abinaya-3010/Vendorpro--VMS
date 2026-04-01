const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{
    description: String,
    orderedQty: Number,
    receivedQty: Number,
    returnedQty: { type: Number, default: 0 },
    isReturned: { type: Boolean, default: false }
  }],
  receivedDate: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Inventory', inventorySchema);
