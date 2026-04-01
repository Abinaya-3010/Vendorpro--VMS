const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Vendor = require('./models/Vendor');
const RFQ = require('./models/RFQ');
const Quotation = require('./models/Quotation');
const PurchaseOrder = require('./models/PurchaseOrder');
const Invoice = require('./models/Invoice');
const Inventory = require('./models/Inventory');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');

  await Promise.all([
    Vendor.deleteMany(), RFQ.deleteMany(), Quotation.deleteMany(),
    PurchaseOrder.deleteMany(), Invoice.deleteMany(), Inventory.deleteMany()
  ]);

  const vendors = await Vendor.insertMany([
    { name: 'Rajesh Kumar', company: 'TechSupply Pvt Ltd', email: 'rajesh@techsupply.com', phone: '9876543210', gst: '27AAPFU0939F1ZV', pan: 'AAPFU0939F', category: 'IT', bankName: 'HDFC Bank', accountNumber: '50100123456789', ifsc: 'HDFC0001234', rating: 4, address: 'Mumbai, Maharashtra', status: 'Active' },
    { name: 'Priya Sharma', company: 'BuildMart Solutions', email: 'priya@buildmart.com', phone: '9876501234', gst: '07AAECB2190H1ZP', pan: 'AAECB2190H', category: 'Construction', bankName: 'SBI', accountNumber: '32019876543', ifsc: 'SBIN0001234', rating: 3, address: 'Delhi, NCR', status: 'Active' },
    { name: 'Amit Patel', company: 'FastLog Logistics', email: 'amit@fastlog.com', phone: '9988776655', gst: '24AABCF1234G1ZX', pan: 'AABCF1234G', category: 'Logistics', bankName: 'ICICI Bank', accountNumber: '009101234567', ifsc: 'ICIC0001234', rating: 5, address: 'Ahmedabad, Gujarat', status: 'Active' },
    { name: 'Sunita Reddy', company: 'ManufactoPro India', email: 'sunita@manufactopro.com', phone: '9123456789', gst: '36AAFCM1234A1ZY', pan: 'AAFCM1234A', category: 'Manufacturing', bankName: 'Axis Bank', accountNumber: '912010012345678', ifsc: 'UTIB0001234', rating: 4, address: 'Hyderabad, Telangana', status: 'Active' }
  ]);

  console.log('Vendors seeded:', vendors.length);

  const rfq = await RFQ.create({
    title: 'Office IT Equipment Procurement',
    description: 'Requirement for laptops, monitors, and peripherals for new office setup',
    items: [
      { description: 'Dell Laptop i7 16GB RAM', quantity: 10, unit: 'pcs', estimatedPrice: 75000 },
      { description: '27 inch LED Monitor', quantity: 10, unit: 'pcs', estimatedPrice: 18000 },
      { description: 'Wireless Keyboard & Mouse Set', quantity: 10, unit: 'sets', estimatedPrice: 2500 }
    ],
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    vendors: [vendors[0]._id, vendors[3]._id],
    status: 'Sent'
  });

  const q1 = await Quotation.create({
    rfq: rfq._id, vendor: vendors[0]._id,
    totalPrice: 925000, validityDays: 30, deliveryDays: 7,
    terms: 'Payment within 30 days. Includes 1-year warranty.',
    items: [
      { description: 'Dell Laptop i7 16GB RAM', quantity: 10, unitPrice: 72000, totalPrice: 720000 },
      { description: '27 inch LED Monitor', quantity: 10, unitPrice: 17000, totalPrice: 170000 },
      { description: 'Wireless Keyboard & Mouse Set', quantity: 10, unitPrice: 3500, totalPrice: 35000 }
    ],
    isLowest: true
  });

  const q2 = await Quotation.create({
    rfq: rfq._id, vendor: vendors[3]._id,
    totalPrice: 980000, validityDays: 45, deliveryDays: 10,
    terms: 'Payment within 45 days. 2-year comprehensive warranty.',
    items: [
      { description: 'Dell Laptop i7 16GB RAM', quantity: 10, unitPrice: 76000, totalPrice: 760000 },
      { description: '27 inch LED Monitor', quantity: 10, unitPrice: 18000, totalPrice: 180000 },
      { description: 'Wireless Keyboard & Mouse Set', quantity: 10, unitPrice: 4000, totalPrice: 40000 }
    ],
    isLowest: false
  });

  const po = await PurchaseOrder.create({
    rfq: rfq._id, quotation: q1._id, vendor: vendors[0]._id,
    items: q1.items, totalAmount: q1.totalPrice,
    status: 'Approved',
    deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    notes: 'Urgent requirement. Please ensure timely delivery.'
  });

  await Quotation.findByIdAndUpdate(q1._id, { status: 'Selected' });
  await Quotation.findByIdAndUpdate(q2._id, { status: 'Rejected' });

  await Invoice.create({
    purchaseOrder: po._id, vendor: vendors[0]._id,
    items: po.items, subTotal: po.totalAmount,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: 'Pending'
  });

  await Inventory.create({
    purchaseOrder: po._id, vendor: vendors[0]._id,
    items: po.items.map(i => ({ description: i.description, orderedQty: i.quantity, receivedQty: i.quantity, returnedQty: 0, isReturned: false })),
    receivedDate: new Date(),
    notes: 'All items received in good condition'
  });

  console.log('Seed completed successfully!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
