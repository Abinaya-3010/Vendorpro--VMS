# 🏢 VendorPro — Vendor Management System

A full-stack web application for managing vendors, procurement workflows, quotations, purchase orders, and invoices — built with React, Node.js, Express, and MongoDB Atlas.

---

## 📌 Project Description

VendorPro streamlines the entire vendor lifecycle for businesses. From onboarding vendors with their GST/PAN/bank details, to raising RFQs, collecting quotations, comparing prices, generating purchase orders, and automating invoice creation with GST calculation — all in one clean interface.

This project was built as part of a full-stack internship assignment with a 72-hour deadline, demonstrating the ability to design and deliver a working end-to-end system under time constraints.

---

## ✨ Features

### Vendor Management
- Add, edit, and delete vendors
- Store company profile, GST number, PAN, and bank account details
- Vendor categorization (IT, Construction, Logistics, Manufacturing, Services)
- Vendor rating system (1–5 stars)
- Document URL storage
- Active / Inactive status management
- Search and filter vendors

### Quotation Management
- Create RFQs (Request for Quotation) with itemized line items
- Send RFQ to multiple vendors simultaneously
- Vendors submit quotations with price, delivery timeline, and terms
- Side-by-side quotation comparison table
- Auto-flag of lowest price quotation

### Purchase Order Management
- One-click PO generation from selected quotation
- PO approval workflow (Pending → Approved / Rejected)
- PO status tracking
- Delivery date and notes

### Invoice Generation
- Automatic invoice creation from approved POs
- 18% GST calculation (CGST + SGST breakdown)
- Invoice status tracking (Pending → Paid)
- Browser-based print / PDF export

### Inventory Tracking
- Receive stock against approved POs
- Track ordered vs received quantities
- Return management flag per item

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| File Uploads | Multer |
| API Testing | Postman |

---

## 📁 Folder Structure

```
vendor-management-system/
│
├── backend/
│   ├── controllers/
│   │   ├── vendorController.js
│   │   ├── rfqController.js
│   │   ├── quotationController.js
│   │   ├── poController.js
│   │   ├── invoiceController.js
│   │   └── inventoryController.js
│   ├── models/
│   │   ├── Vendor.js
│   │   ├── RFQ.js
│   │   ├── Quotation.js
│   │   ├── PurchaseOrder.js
│   │   ├── Invoice.js
│   │   └── Inventory.js
│   ├── routes/
│   │   ├── vendorRoutes.js
│   │   ├── rfqRoutes.js
│   │   ├── quotationRoutes.js
│   │   ├── poRoutes.js
│   │   ├── invoiceRoutes.js
│   │   └── inventoryRoutes.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── uploads/
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── VendorsPage.jsx
│   │   │   ├── RFQPage.jsx
│   │   │   ├── QuotationsPage.jsx
│   │   │   ├── PurchaseOrdersPage.jsx
│   │   │   ├── InvoicesPage.jsx
│   │   │   └── InventoryPage.jsx
│   │   ├── components/
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   └── StatCard.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── postman_collection.json
├── sample_data.json
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- MongoDB Atlas account (free tier works)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/vendor-management-system.git
cd vendor-management-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string_here
```

> To get your MongoDB URI:
> 1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Create a free cluster
> 3. Click **Connect → Drivers**
> 4. Copy the connection string and replace `<password>` with your DB password

Start the backend server:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The backend will run at: `http://localhost:5000`

Optionally load sample data:

```bash
npm run seed
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run at: `http://localhost:3000`

> The frontend proxies API requests to `http://localhost:5000` automatically.

---

## 🔐 Environment Variables

Create `backend/.env` with:

```env
# Server
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vms_db?retryWrites=true&w=majority
```

> Never commit your `.env` file to GitHub. It is already listed in `.gitignore`.

---

## 📡 API Endpoints

### Vendors
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/vendors` | Get all vendors |
| `GET` | `/api/vendors/:id` | Get vendor by ID |
| `POST` | `/api/vendors` | Create new vendor |
| `PUT` | `/api/vendors/:id` | Update vendor |
| `DELETE` | `/api/vendors/:id` | Delete vendor |
| `POST` | `/api/vendors/:id/upload` | Upload document |

### RFQs (Request for Quotation)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rfqs` | Get all RFQs |
| `POST` | `/api/rfqs` | Create new RFQ |
| `PUT` | `/api/rfqs/:id` | Update RFQ |
| `POST` | `/api/rfqs/:id/send` | Send RFQ to vendors |
| `DELETE` | `/api/rfqs/:id` | Delete RFQ |

### Quotations
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quotations` | Get all quotations |
| `POST` | `/api/quotations` | Submit quotation |
| `GET` | `/api/quotations/compare/:rfqId` | Compare quotations for an RFQ |
| `POST` | `/api/quotations/:id/select` | Select winning quotation |

### Purchase Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/purchase-orders` | Get all POs |
| `GET` | `/api/purchase-orders/:id` | Get PO by ID |
| `POST` | `/api/purchase-orders` | Create PO |
| `PATCH` | `/api/purchase-orders/:id/status` | Update PO status |
| `DELETE` | `/api/purchase-orders/:id` | Delete PO |

### Invoices
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/invoices` | Get all invoices |
| `GET` | `/api/invoices/:id` | Get invoice by ID |
| `POST` | `/api/invoices` | Generate invoice from PO |
| `PATCH` | `/api/invoices/:id/status` | Update invoice status |
| `DELETE` | `/api/invoices/:id` | Delete invoice |

### Inventory
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/inventory` | Get all inventory records |
| `POST` | `/api/inventory` | Receive stock from PO |
| `PUT` | `/api/inventory/:id` | Update inventory record |

---

## 🔁 Complete Workflow

```
1. Add Vendor         →  Fill in name, company, GST, PAN, bank details
2. Create RFQ         →  Add items with quantity and estimated price
3. Send RFQ           →  Select one or more active vendors
4. Submit Quotations  →  Enter vendor price, delivery days, and terms
5. Compare Quotes     →  View side-by-side table, lowest is auto-flagged
6. Select Quote       →  Purchase Order is auto-generated
7. Approve PO         →  Change status from Pending to Approved
8. Generate Invoice   →  Auto-calculates 18% GST on PO total
9. Mark Paid          →  Invoice status updates with payment date
10. Receive Stock     →  Inventory entry created from PO items
```

---

## 🗄️ Database Schema

### Vendor
```json
{
  "name": "string (required)",
  "company": "string (required)",
  "email": "string (required, unique)",
  "phone": "string",
  "gst": "string",
  "pan": "string",
  "category": "IT | Construction | Logistics | Manufacturing | Services | Other",
  "bankName": "string",
  "accountNumber": "string",
  "ifsc": "string",
  "rating": "number (1–5)",
  "documentUrl": "string",
  "status": "Active | Inactive",
  "address": "string"
}
```

### RFQ
```json
{
  "rfqNumber": "string (auto-generated: RFQ-0001)",
  "title": "string (required)",
  "description": "string",
  "items": [{ "description": "string", "quantity": "number", "unit": "string", "estimatedPrice": "number" }],
  "deadline": "date (required)",
  "vendors": ["VendorId"],
  "status": "Draft | Sent | Closed"
}
```

### Quotation
```json
{
  "rfq": "RFQId",
  "vendor": "VendorId",
  "totalPrice": "number (required)",
  "validityDays": "number",
  "deliveryDays": "number",
  "terms": "string",
  "items": [{ "description": "string", "quantity": "number", "unitPrice": "number", "totalPrice": "number" }],
  "status": "Submitted | Selected | Rejected",
  "isLowest": "boolean"
}
```

### PurchaseOrder
```json
{
  "poNumber": "string (auto-generated: PO-0001)",
  "rfq": "RFQId",
  "quotation": "QuotationId",
  "vendor": "VendorId",
  "items": [{ "description": "string", "quantity": "number", "unitPrice": "number", "totalPrice": "number" }],
  "totalAmount": "number",
  "status": "Pending | Approved | Rejected | Completed",
  "deliveryDate": "date",
  "notes": "string"
}
```

### Invoice
```json
{
  "invoiceNumber": "string (auto-generated: INV-0001)",
  "purchaseOrder": "PurchaseOrderId",
  "vendor": "VendorId",
  "items": [{ "description": "string", "quantity": "number", "unitPrice": "number", "totalPrice": "number" }],
  "subTotal": "number",
  "gstRate": "number (default: 18)",
  "gstAmount": "number (auto-calculated)",
  "totalAmount": "number (auto-calculated)",
  "status": "Pending | Paid | Cancelled",
  "dueDate": "date",
  "paidDate": "date"
}
```

### Inventory
```json
{
  "purchaseOrder": "PurchaseOrderId",
  "vendor": "VendorId",
  "items": [{ "description": "string", "orderedQty": "number", "receivedQty": "number", "returnedQty": "number", "isReturned": "boolean" }],
  "receivedDate": "date",
  "notes": "string"
}
```

---

## 🚀 Future Improvements

- [ ] JWT authentication and role-based access (Admin, Vendor, Finance)
- [ ] Vendor self-registration portal
- [ ] Email notifications when RFQ is sent or PO is approved
- [ ] Multi-tax support (IGST for inter-state, TDS deduction)
- [ ] PDF invoice download using a library like `pdfkit` or `puppeteer`
- [ ] Dashboard with charts and analytics (spend by category, vendor performance)
- [ ] Negotiation tracker on quotations
- [ ] Vendor blacklisting with reason
- [ ] Cloud file storage for vendor documents (AWS S3 / Cloudinary)
- [ ] Audit logs for all status changes
- [ ] Mobile responsive design improvements

---

## 🧪 Testing with Postman

Import the included `postman_collection.json` file into Postman:

1. Open Postman → **Import** → select `postman_collection.json`
2. Set the base URL variable to `http://localhost:5000/api`
3. Run requests in order: Vendors → RFQs → Quotations → Purchase Orders → Invoices

---

## 👩‍💻 Author

**Abinaya J**
Full Stack Developer Intern
Built with React, Node.js, Express, and MongoDB Atlas.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
