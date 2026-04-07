// import React, { useEffect, useState } from "react";
// import { getVendors } from "./api"; // make sure api.js exists in src

// function App() {
//   const [vendors, setVendors] = useState([]);

//   useEffect(() => {
//     getVendors().then((res) => {
//       if (res.success) {
//         setVendors(res.data);
//       }
//     });
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Vendors List</h1>
//       <ul>
//         {vendors.map((v) => (
//           <li key={v._id}>
//             {v.name} - {v.company} - {v.email} - {v.phone}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;

// import React, { useEffect, useState } from "react";
// import { getVendors } from "./api";

// function App() {
//   const [vendors, setVendors] = useState([]);

//   useEffect(() => {
//     const fetchVendors = async () => {
//       const res = await getVendors();
//       console.log("API Response:", res); // 🔍 debug

//       if (res.success && res.data) {
//         setVendors(res.data);
//       }
//     };

//     fetchVendors();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Vendors List</h1>

//       {vendors.length === 0 ? (
//         <p>No vendors found</p>
//       ) : (
//         <ul>
//           {vendors.map((v) => (
//             <li key={v._id}>
//               {v.name} - {v.company} - {v.email} - {v.phone}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from "react";
// import { getVendors } from "./api";

// function App() {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     getVendors()
//       .then((res) => {
//         if (res.success) {
//           setVendors(res.data);
//         } else {
//           setError("Failed to fetch vendors");
//         }
//       })
//       .catch(() => setError("Something went wrong"))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p style={{ padding: "20px" }}>Loading vendors...</p>;
//   if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Vendors List</h1>
//       {vendors.length === 0 ? (
//         <p>No vendors found</p>
//       ) : (
//         <ul>
//           {vendors.map((v) => (
//             <li key={v._id}>
//               {v.name} - {v.company} - {v.email} - {v.phone}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;


// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

// // Temporary pages (later real pages add pannalam)
// function DashboardPage() {
//   return <h1 style={{ color: "white" }}>Dashboard</h1>;
// }
// function VendorsPage() {
//   return <h1 style={{ color: "white" }}>Vendors</h1>;
// }
// function RFQPage() {
//   return <h1 style={{ color: "white" }}>RFQs</h1>;
// }
// function QuotationsPage() {
//   return <h1 style={{ color: "white" }}>Quotations</h1>;
// }
// function PurchaseOrdersPage() {
//   return <h1 style={{ color: "white" }}>Orders</h1>;
// }
// function InvoicesPage() {
//   return <h1 style={{ color: "white" }}>Invoices</h1>;
// }
// function InventoryPage() {
//   return <h1 style={{ color: "white" }}>Inventory</h1>;
// }

// const NAV = [
//   { to: '/', label: 'Dashboard' },
//   { to: '/vendors', label: 'Vendors' },
//   { to: '/rfqs', label: 'RFQs' },
//   { to: '/quotations', label: 'Quotations' },
//   { to: '/purchase-orders', label: 'Orders' },
//   { to: '/invoices', label: 'Invoices' },
//   { to: '/inventory', label: 'Inventory' },
// ];

// function Sidebar() {
//   return (
//     <aside style={{ width: "200px", background: "#111", color: "white", padding: "20px" }}>
//       <h2>VendorPro</h2>
//       {NAV.map((item) => (
//         <NavLink key={item.to} to={item.to} style={{ display: "block", color: "white", margin: "10px 0" }}>
//           {item.label}
//         </NavLink>
//       ))}
//     </aside>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <div style={{ display: "flex", minHeight: "100vh" }}>
//         <Sidebar />
//         <div style={{ flex: 1, padding: "20px", background: "#222" }}>
//           <Routes>
//             <Route path="/" element={<DashboardPage />} />
//             <Route path="/vendors" element={<VendorsPage />} />
//             <Route path="/rfqs" element={<RFQPage />} />
//             <Route path="/quotations" element={<QuotationsPage />} />
//             <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
//             <Route path="/invoices" element={<InvoicesPage />} />
//             <Route path="/inventory" element={<InventoryPage />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import VendorsPage from './pages/VendorsPage.jsx';
import RFQPage from './pages/RFQPage.jsx';
import QuotationsPage from './pages/QuotationsPage.jsx';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage.jsx';
import InvoicesPage from './pages/InvoicesPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';


const NAV = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/vendors', label: 'Vendors', icon: '◈' },
  { to: '/rfqs', label: 'RFQs', icon: '◉' },
  { to: '/quotations', label: 'Quotations', icon: '◇' },
  { to: '/purchase-orders', label: 'Orders', icon: '◈' },
  { to: '/invoices', label: 'Invoices', icon: '◎' },
  { to: '/inventory', label: 'Inventory', icon: '⬡' },
];

function Sidebar({ open, setOpen }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 z-30 transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: 'linear-gradient(180deg, #12121a 0%, #0e0e16 100%)', borderRight: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>V</div>
            <div>
              <div className="text-white font-semibold text-sm">VendorPro</div>
              <div className="text-xs" style={{ color: '#6366f1' }}>Management System</div>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(192,132,252,0.1))',
                borderLeft: '2px solid #6366f1',
                boxShadow: '0 0 12px rgba(99,102,241,0.1)'
              } : {}}>
              <span className="text-base" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg text-xs text-slate-500"
          style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <div className="text-slate-400 font-medium mb-1">VendorPro v1.0</div>
          <div>MVP Build · 2026</div>
        </div>
      </aside>
    </>
  );
}

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <span className="text-xl">☰</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #4ade80' }}></div>
            <span className="text-xs text-slate-400">System Online</span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/rfqs" element={<RFQPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
