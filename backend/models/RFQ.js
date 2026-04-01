const mongoose = require('mongoose');
const rfqItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'pcs' },
  estimatedPrice: { type: Number }
});
const rfqSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rfqNumber: { type: String, unique: true },
  description: { type: String },
  items: [rfqItemSchema],
  deadline: { type: Date, required: true },
  vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
  status: { type: String, enum: ['Draft', 'Sent', 'Closed'], default: 'Draft' }
}, { timestamps: true });
rfqSchema.pre('save', async function (next) {
  if (!this.rfqNumber) {
    const count = await mongoose.model('RFQ').countDocuments();
    this.rfqNumber = 'RFQ-' + String(count + 1).padStart(4, '0');
  }
  next();
});
module.exports = mongoose.model('RFQ', rfqSchema);
