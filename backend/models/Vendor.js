const mongoose = require('mongoose');
const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  gst: { type: String },
  pan: { type: String },
  category: { type: String, enum: ['IT', 'Construction', 'Logistics', 'Manufacturing', 'Services', 'Other'], default: 'Other' },
  bankName: { type: String },
  accountNumber: { type: String },
  ifsc: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  documentUrl: { type: String },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  address: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Vendor', vendorSchema);
