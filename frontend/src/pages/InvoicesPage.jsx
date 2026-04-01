import React, { useEffect, useState } from 'react';
import { invoiceAPI, inventoryAPI } from '../utils/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Card from '../components/Card';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await invoiceAPI.getAll(filterStatus ? { status: filterStatus } : {});
      setInvoices(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      await invoiceAPI.updateStatus(id, status);
      load(); if (detail?._id === id) setDetail(null);
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const receiveInventory = async (inv) => {
    if (!window.confirm('Mark goods as received and update inventory?')) return;
    try {
      await inventoryAPI.receive({ poId: inv.purchaseOrder?._id || inv.purchaseOrder });
      await invoiceAPI.updateStatus(inv._id, 'Paid');
      alert('Inventory updated and invoice marked as paid!');
      load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const printInvoice = (inv) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Invoice ${inv.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; color: #6366f1; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f8f9fa; }
        .totals { text-align: right; margin-top: 20px; }
        .total-row { font-size: 18px; font-weight: bold; }
        .badge { padding: 4px 10px; border-radius: 4px; font-size: 12px; }
        .pending { background: #fef3c7; color: #92400e; }
        .paid { background: #d1fae5; color: #065f46; }
      </style></head><body>
      <div class="header">
        <div><div class="title">INVOICE</div><div style="color:#666;margin-top:4px">${inv.invoiceNumber}</div></div>
        <div style="text-align:right"><strong>Date:</strong> ${new Date(inv.createdAt).toLocaleDateString('en-IN')}<br>
        <strong>Due:</strong> ${inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-IN') : 'N/A'}<br>
        <span class="badge ${inv.status.toLowerCase()}">${inv.status}</span></div>
      </div>
      <hr><div style="margin:20px 0"><strong>Vendor:</strong> ${inv.vendor?.name} — ${inv.vendor?.company}<br>
      <strong>GST:</strong> ${inv.vendor?.gst || 'N/A'} &nbsp; <strong>PAN:</strong> ${inv.vendor?.pan || 'N/A'}</div>
      <table><tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
      ${(inv.items || []).map(i => `<tr><td>${i.description}</td><td>${i.quantity}</td><td>₹${Number(i.unitPrice||0).toLocaleString('en-IN')}</td><td>₹${Number(i.totalPrice||0).toLocaleString('en-IN')}</td></tr>`).join('')}
      </table>
      <div class="totals">
        <div>Sub Total: ₹${Number(inv.subTotal).toLocaleString('en-IN')}</div>
        <div>GST (${inv.gstRate}%): ₹${Number(inv.gstAmount).toLocaleString('en-IN')}</div>
        <div class="total-row">TOTAL: ₹${Number(inv.totalAmount).toLocaleString('en-IN')}</div>
      </div>
      </body></html>`);
    win.document.close(); win.print();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Invoices</h1>
          <p className="text-slate-400 text-xs mt-0.5">{invoices.length} total invoices</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm text-white" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <option value="">All Status</option>
          {['Pending', 'Paid', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="text-center py-16 text-slate-500">Loading...</div> :
       invoices.length === 0 ? <div className="text-center py-16 text-slate-500">No invoices yet. Generate from an approved PO.</div> :
       <div className="space-y-3">
        {invoices.map(inv => (
          <Card key={inv._id} onClick={() => setDetail(inv)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="mono text-indigo-400 text-sm font-semibold">{inv.invoiceNumber}</span>
                  <Badge text={inv.status} />
                </div>
                <div className="font-semibold text-white">{inv.vendor?.name}</div>
                <div className="text-xs text-slate-400">{inv.vendor?.company}</div>
                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                  {inv.dueDate && <span>Due: {new Date(inv.dueDate).toLocaleDateString('en-IN')}</span>}
                  {inv.paidDate && <span className="text-green-400">Paid: {new Date(inv.paidDate).toLocaleDateString('en-IN')}</span>}
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-xs text-slate-400">Sub: ₹{Number(inv.subTotal).toLocaleString('en-IN')}</div>
                <div className="text-xs text-slate-400">GST ({inv.gstRate}%): ₹{Number(inv.gstAmount).toLocaleString('en-IN')}</div>
                <div className="text-xl font-bold text-white mono mt-1">₹{Number(inv.totalAmount).toLocaleString('en-IN')}</div>
                <div className="flex gap-2 mt-2 justify-end" onClick={e => e.stopPropagation()}>
                  <button onClick={() => printInvoice(inv)} className="px-2 py-1 rounded text-xs text-slate-300" style={{ background: 'rgba(255,255,255,0.08)' }}>🖨 Print</button>
                  {inv.status === 'Pending' && <>
                    <button onClick={() => updateStatus(inv._id, 'Paid')} className="px-2 py-1 rounded text-xs text-green-300" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>Mark Paid</button>
                  </>}
                </div>
              </div>
            </div>
          </Card>
        ))}
       </div>
      }

      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="Invoice Details" wide>
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[['Invoice No.', detail.invoiceNumber], ['Status', <Badge key="s" text={detail.status} />], ['GST Rate', `${detail.gstRate}%`], ['Sub Total', `₹${Number(detail.subTotal).toLocaleString('en-IN')}`], ['GST Amount', `₹${Number(detail.gstAmount).toLocaleString('en-IN')}`], ['Total', `₹${Number(detail.totalAmount).toLocaleString('en-IN')}`]].map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs text-slate-400">{k}</p>
                  <p className="font-semibold text-white mono">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Line Items</p>
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
                        <td className="px-3 py-2 text-slate-300 mono">₹{Number(it.unitPrice||0).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2 text-slate-300 mono">₹{Number(it.totalPrice||0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => printInvoice(detail)} className="flex-1 py-2 rounded-lg text-sm text-slate-300" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>🖨 Print / PDF</button>
              {detail.status === 'Pending' && (
                <button onClick={() => updateStatus(detail._id, 'Paid')} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#10b981' }}>Mark as Paid</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
