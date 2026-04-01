<<<<<<< HEAD
# VendorPro — Vendor Management System

A full-stack MVP for managing vendors, RFQs, quotations, purchase orders, invoices, and inventory.

## Tech Stack
- **Backend:** Node.js + Express.js + MongoDB (Mongoose)
- **Frontend:** React.js + Tailwind CSS + Axios

---

## Project Structure
```
vms/
├── backend/
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── uploads/            # Uploaded documents
│   ├── server.js           # Entry point
│   ├── seed.js             # Sample data seeder
│   └── .env                # Environment config
└── frontend/
    ├── src/
    │   ├── pages/          # React page components
    │   ├── components/     # Reusable components
    │   └── utils/api.js    # Axios API helpers
    └── public/
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally OR MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/vms_db
```

Start the server:
```bash
npm run dev         # Development (nodemon)
npm start           # Production
```

Seed sample data (optional):
```bash
npm run seed
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`
API runs at: `http://localhost:5000`

---

## API Endpoints

### Vendors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vendors | List all vendors |
| GET | /api/vendors/:id | Get vendor by ID |
| POST | /api/vendors | Create vendor |
| PUT | /api/vendors/:id | Update vendor |
| DELETE | /api/vendors/:id | Delete vendor |
| POST | /api/vendors/:id/upload | Upload document |

### RFQs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/rfqs | List all RFQs |
| GET | /api/rfqs/:id | Get RFQ by ID |
| POST | /api/rfqs | Create RFQ |
| PUT | /api/rfqs/:id | Update RFQ |
| POST | /api/rfqs/:id/send | Send to vendors |
| DELETE | /api/rfqs/:id | Delete RFQ |

### Quotations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quotations | List all quotations |
| GET | /api/quotations/:id | Get quotation |
| POST | /api/quotations | Submit quotation |
| GET | /api/quotations/compare/:rfqId | Compare quotations for RFQ |
| POST | /api/quotations/:id/select | Select winning quotation |

### Purchase Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/purchase-orders | List all POs |
| GET | /api/purchase-orders/:id | Get PO by ID |
| POST | /api/purchase-orders | Create PO |
| PATCH | /api/purchase-orders/:id/status | Update PO status |
| DELETE | /api/purchase-orders/:id | Delete PO |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/invoices | List all invoices |
| GET | /api/invoices/:id | Get invoice by ID |
| POST | /api/invoices | Create invoice |
| PATCH | /api/invoices/:id/status | Update invoice status |
| DELETE | /api/invoices/:id | Delete invoice |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/inventory | List all entries |
| GET | /api/inventory/:id | Get entry |
| POST | /api/inventory | Receive stock |
| PUT | /api/inventory/:id | Update entry |

---

## Complete Workflow
```
1. Add Vendor → /vendors
2. Create RFQ → /rfqs (add items, set deadline)
3. Send RFQ to vendors
4. Submit Quotations → /quotations (vendor prices)
5. Compare Quotations → auto-flags lowest price
6. Select Quotation → auto-creates Purchase Order
7. Approve PO → /purchase-orders
8. Generate Invoice → auto-calculates 18% GST
9. Mark Invoice Paid → /invoices
10. Receive Inventory → /inventory (stock tracking)
```

---

## ER Diagram (Text)
```
Vendor ──────┬──── RFQ
             │      │
             │      ▼
             │    Quotation ──── (selected) ──►  PurchaseOrder
             │                                        │
             │                                        ▼
             └────────────────────────────────────  Invoice
                                                        │
                                                        ▼
                                                    Inventory
```

### Relationships:
- **RFQ** has many **Vendors** (M:N) — stored as array of vendor IDs
- **Quotation** belongs to one **RFQ** and one **Vendor**
- **PurchaseOrder** references one **Quotation**, one **RFQ**, one **Vendor**
- **Invoice** belongs to one **PurchaseOrder** and one **Vendor**
- **Inventory** belongs to one **PurchaseOrder** and one **Vendor**

---

## Database Schemas

### Vendor
```json
{ name, company, email, phone, gst, pan, category, bankName, accountNumber, ifsc, rating (1-5), documentUrl, status, address }
```

### RFQ
```json
{ rfqNumber, title, description, items[{description, quantity, unit, estimatedPrice}], deadline, vendors[], status: Draft|Sent|Closed }
```

### Quotation
```json
{ rfq, vendor, totalPrice, validityDays, deliveryDays, terms, items[], status: Submitted|Selected|Rejected, isLowest }
```

### PurchaseOrder
```json
{ poNumber, rfq, quotation, vendor, items[], totalAmount, status: Pending|Approved|Rejected|Completed, deliveryDate, notes }
```

### Invoice
```json
{ invoiceNumber, purchaseOrder, vendor, items[], subTotal, gstRate(18%), gstAmount, totalAmount, status: Pending|Paid|Cancelled, dueDate, paidDate }
```

### Inventory
```json
{ purchaseOrder, vendor, items[{description, orderedQty, receivedQty, returnedQty, isReturned}], receivedDate, notes }
```

---

## Features Implemented
- ✅ Vendor CRUD + document upload
- ✅ Vendor rating + categorization
- ✅ RFQ creation with multi-item support
- ✅ Send RFQ to multiple vendors
- ✅ Quotation submission with pricing
- ✅ Side-by-side quotation comparison
- ✅ Auto-flag lowest price quotation
- ✅ One-click PO generation from quotation
- ✅ PO approval workflow (Approve/Reject)
- ✅ Invoice generation with 18% GST
- ✅ Invoice print/PDF (browser print)
- ✅ Invoice payment tracking
- ✅ Inventory receipt tracking
- ✅ Return management flag

## Notes / Trade-offs
- No JWT auth (simplified for MVP — easily added)
- GST hardcoded at 18% (configurable per invoice)
- File uploads store URL only (no cloud storage)
- PDF generation via browser print dialog
=======
# VendorPro-VMS
Full-stack Vendor Management System built with React, Node.js, Express &amp; MongoDB Atlas.
>>>>>>> eef223f81c578b00407d57a887aabe625fe610cf
