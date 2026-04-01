const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  items: [{ description: String, quantity: Number, unitPrice: Number, totalPrice: Number }],
  subTotal: { type: Number, required: true },
  gstRate: { type: Number, default: 18 },
  gstAmount: { type: Number },
  totalAmount: { type: Number },
  status: { type: String, enum: ['Pending', 'Paid', 'Cancelled'], default: 'Pending' },
  dueDate: { type: Date },
  paidDate: { type: Date }
}, { timestamps: true });
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = 'INV-' + String(count + 1).padStart(4, '0');
  }
  this.gstAmount = parseFloat(((this.subTotal * this.gstRate) / 100).toFixed(2));
  this.totalAmount = parseFloat((this.subTotal + this.gstAmount).toFixed(2));
  next();
});
module.exports = mongoose.model('Invoice', invoiceSchema);
