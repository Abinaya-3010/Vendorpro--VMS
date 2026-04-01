const mongoose = require('mongoose');
const poSchema = new mongoose.Schema({
  poNumber: { type: String, unique: true },
  rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
  quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{ description: String, quantity: Number, unitPrice: Number, totalPrice: Number }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed'], default: 'Pending' },
  deliveryDate: { type: Date },
  notes: { type: String }
}, { timestamps: true });
poSchema.pre('save', async function (next) {
  if (!this.poNumber) {
    const count = await mongoose.model('PurchaseOrder').countDocuments();
    this.poNumber = 'PO-' + String(count + 1).padStart(4, '0');
  }
  next();
});
module.exports = mongoose.model('PurchaseOrder', poSchema);
