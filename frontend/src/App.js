import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import VendorsPage from './pages/VendorsPage';
import RFQPage from './pages/RFQPage';
import QuotationsPage from './pages/QuotationsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import InvoicesPage from './pages/InvoicesPage';
import InventoryPage from './pages/InventoryPage';
import DashboardPage from './pages/DashboardPage';


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
