 VendorPro — Vendor Management System

A full-stack MVP for managing vendors, RFQs, quotations, purchase orders, invoices, and inventory.



 Tech Stack

* **Backend:** Node.js, Express.js, MongoDB (Mongoose)
* **Frontend:** React.js, Tailwind CSS, Axios



Project Structure

```
vms/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── seed.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   └── utils/api.js
    └── public/
```



 Setup Instructions

 Prerequisites

* Node.js v18+
* MongoDB (local or Atlas)



 Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/vms_db
```

Run backend:

```
npm run dev
```



 Frontend Setup

```
cd frontend
npm install
npm start
```



 App URLs

* Frontend: http://localhost:3000
* Backend: http://localhost:5000



 Features

* Vendor management (CRUD + upload)
* RFQ creation & vendor assignment
* Quotation submission & comparison
* Auto lowest price detection
* Purchase order generation
* Invoice with GST calculation
* Inventory tracking



 Notes

* No authentication (MVP)
* GST fixed at 18%
* File upload stores URL only



 Workflow

1. Add Vendor
2. Create RFQ
3. Send RFQ
4. Submit Quotations
5. Compare & Select
6. Generate PO
7. Approve PO
8. Generate Invoice
9. Track Inventory



