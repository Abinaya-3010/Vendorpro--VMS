import React, { useEffect, useState } from 'react';
import { poAPI, vendorAPI, invoiceAPI } from '../utils/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Card from '../components/Card';

export default function PurchaseOrdersPage() {
  const [pos, setPOs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [p, v] = await Promise.all([poAPI.getAll(filterStatus ? { status: filterStatus } : {}), vendorAPI.getAll()]);
      setPOs(p.data.data || []); setVendors(v.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    try { await poAPI.updateStatus(id, status); load(); if (detail?._id === id) setDetail(null); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const generateInvoice = async (po) => {
    if (!window.confirm('Generate invoice for this PO?')) return;
    try {
      const due = new Date(); due.setDate(due.getDate() + 30);
      await invoiceAPI.create({ poId: po._id, dueDate: due.toISOString() });
      alert('Invoice generated successfully!');
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const statusColors = { Pending: '#f59e0b', Approved: '#10b981', Rejected: '#ef4444', Completed: '#6366f1' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Purchase Orders</h1>
          <p className="text-slate-400 text-xs mt-0.5">{pos.length} total orders</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm text-white" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <option value="">All Status</option>
          {['Pending', 'Approved', 'Rejected', 'Completed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="text-center py-16 text-slate-500">Loading...</div> :
       pos.length === 0 ? <div className="text-center py-16 text-slate-500">No POs yet. Select a quotation to generate a PO.</div> :
       <div className="space-y-3">
        {pos.map(po => (
          <Card key={po._id} onClick={() => setDetail(po)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="mono text-indigo-400 text-sm font-semibold">{po.poNumber}</span>
                  <Badge text={po.status} />
                </div>
                <div className="font-semibold text-white">{po.vendor?.name}</div>
                <div className="text-xs text-slate-400">{po.vendor?.company}</div>
                {po.rfq && <div className="text-xs text-slate-500 mt-1">RFQ: {po.rfq.rfqNumber} - {po.rfq.title}</div>}
                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                  <span>📦 {po.items?.length} items</span>
                  {po.deliveryDate && <span>📅 {new Date(po.deliveryDate).toLocaleDateString('en-IN')}</span>}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-xl font-bold text-white mono">₹{Number(po.totalAmount).toLocaleString('en-IN')}</div>
                <div className="flex gap-2 mt-2 justify-end" onClick={e => e.stopPropagation()}>
                  {po.status === 'Pending' && <>
                    <button onClick={() => updateStatus(po._id, 'Approved')} className="px-2 py-1 rounded text-xs text-green-300" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>Approve</button>
                    <button onClick={() => updateStatus(po._id, 'Rejected')} className="px-2 py-1 rounded text-xs text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>Reject</button>
                  </>}
                  {po.status === 'Approved' && (
                    <button onClick={() => generateInvoice(po)} className="px-2 py-1 rounded text-xs text-indigo-300" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>Gen Invoice</button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
       </div>
      }

      {/* PO Detail Modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="Purchase Order Details" wide>
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-400">PO Number</p>
                <p className="font-bold text-indigo-400 mono">{detail.poNumber}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-400">Status</p>
                <Badge text={detail.status} />
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-400">Vendor</p>
                <p className="font-medium text-white">{detail.vendor?.name}</p>
                <p className="text-xs text-slate-400">{detail.vendor?.company}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-400">Total Amount</p>
                <p className="font-bold text-xl text-white mono">₹{Number(detail.totalAmount).toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Items</p>
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Description', 'Qty', 'Unit Price', 'Total'].map(h => <th key={h} className="text-left px-3 py-2 text-xs text-slate-400">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {detail.items?.map((it, i) => (
                      <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-3 py-2 text-white">{it.description}</td>
                        <td className="px-3 py-2 text-slate-300">{it.quantity}</td>
                        <td className="px-3 py-2 text-slate-300 mono">₹{Number(it.unitPrice || 0).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2 text-slate-300 mono">₹{Number(it.totalPrice || 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {detail.notes && <div><p className="text-xs text-slate-400">Notes</p><p className="text-sm text-slate-300 mt-1">{detail.notes}</p></div>}
            <div className="flex gap-3">
              {detail.status === 'Pending' && <>
                <button onClick={() => updateStatus(detail._id, 'Approved')} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#10b981' }}>Approve PO</button>
                <button onClick={() => updateStatus(detail._id, 'Rejected')} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#ef4444' }}>Reject PO</button>
              </>}
              {detail.status === 'Approved' && (
                <button onClick={() => { generateInvoice(detail); setDetail(null); }} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>Generate Invoice</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
