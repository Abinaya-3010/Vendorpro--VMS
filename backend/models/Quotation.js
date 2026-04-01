const mongoose = require('mongoose');
const quotationSchema = new mongoose.Schema({
  rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  totalPrice: { type: Number, required: true },
  validityDays: { type: Number, default: 30 },
  terms: { type: String },
  deliveryDays: { type: Number },
  items: [{ description: String, quantity: Number, unitPrice: Number, totalPrice: Number }],
  status: { type: String, enum: ['Submitted', 'Selected', 'Rejected'], default: 'Submitted' },
  isLowest: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Quotation', quotationSchema);
