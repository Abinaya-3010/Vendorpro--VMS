const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/rfqs', require('./routes/rfqRoutes'));
app.use('/api/quotations', require('./routes/quotationRoutes'));
app.use('/api/purchase-orders', require('./routes/poRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('DB connection error:', err));
