import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { vendorAPI, rfqAPI, poAPI, invoiceAPI } from '../utils/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ vendors: 0, rfqs: 0, pos: 0, invoices: 0 });

  useEffect(() => {
    Promise.all([vendorAPI.getAll(), rfqAPI.getAll(), poAPI.getAll(), invoiceAPI.getAll()])
      .then(([v, r, p, i]) => setStats({
        vendors: v.data.data?.length || 0,
        rfqs: r.data.data?.length || 0,
        pos: p.data.data?.length || 0,
        invoices: i.data.data?.length || 0
      })).catch(() => {});
  }, []);

  const steps = [
    { step: '01', title: 'Register Vendor', desc: 'Add vendor with GST, PAN, bank details', path: '/vendors', color: '#6366f1' },
    { step: '02', title: 'Create RFQ', desc: 'Send Request for Quotation to vendors', path: '/rfqs', color: '#c084fc' },
    { step: '03', title: 'Compare Quotes', desc: 'Review and select best quotation', path: '/quotations', color: '#06b6d4' },
    { step: '04', title: 'Purchase Order', desc: 'Generate PO from selected quote', path: '/purchase-orders', color: '#10b981' },
    { step: '05', title: 'Invoice', desc: 'Auto-generate invoice with 18% GST', path: '/invoices', color: '#f59e0b' },
    { step: '06', title: 'Inventory', desc: 'Track received goods and returns', path: '/inventory', color: '#ec4899' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">Vendor Management System — Complete procurement workflow</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Vendors" value={stats.vendors} icon="◈" color="#6366f1" />
        <StatCard label="Active RFQs" value={stats.rfqs} icon="◉" color="#c084fc" />
        <StatCard label="Purchase Orders" value={stats.pos} icon="◈" color="#10b981" />
        <StatCard label="Invoices" value={stats.invoices} icon="◎" color="#f59e0b" />
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Procurement Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map(({ step, title, desc, path, color }) => (
            <a key={step} href={path}
              className="group rounded-xl p-5 transition-all duration-200 hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)` }}>
              <div className="flex items-start gap-4">
                <div className="text-2xl font-bold mono" style={{ color: color + '60' }}>{step}</div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-indigo-300 transition-colors">{title}</h3>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
              <div className="mt-3 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded" style={{ background: color }} />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(192,132,252,0.05))', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400" style={{ boxShadow: '0 0 6px #818cf8' }}></div>
          <span className="text-sm font-medium text-slate-300">Quick Start</span>
        </div>
        <p className="text-xs text-slate-400">Start by adding vendors → Create an RFQ → Collect quotations → Compare → Generate PO → Invoice → Track inventory</p>
      </div>
    </div>
  );
}
