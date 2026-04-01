import React, { useEffect, useState } from 'react';
import { quotationAPI, rfqAPI, vendorAPI, poAPI } from '../utils/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Card from '../components/Card';

const EMPTY_FORM = { rfq: '', vendor: '', totalPrice: '', validityDays: 30, deliveryDays: 7, terms: '', items: [] };

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [compareModal, setCompareModal] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedRFQ, setSelectedRFQ] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [q, r, v] = await Promise.all([quotationAPI.getAll(), rfqAPI.getAll(), vendorAPI.getAll()]);
      setQuotations(q.data.data || []); setRfqs(r.data.data || []); setVendors(v.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const compare = async (rfqId) => {
    try {
      const res = await quotationAPI.compare(rfqId);
      setCompareData(res.data.data); setCompareModal(true);
    } catch (e) { alert('Error loading comparison'); }
  };

  const selectQuotation = async (id) => {
    if (!window.confirm('Select this quotation and generate PO?')) return;
    try {
      await quotationAPI.select(id);
      const q = compareData?.quotations.find(q => q._id === id);
      if (q) await poAPI.create({ quotationId: id });
      alert('Quotation selected and PO created!');
      setCompareModal(false); load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const submit = async () => {
    if (!form.rfq || !form.vendor || !form.totalPrice) return alert('RFQ, vendor, and total price required');
    setSaving(true);
    try {
      await quotationAPI.submit({ ...form, totalPrice: Number(form.totalPrice) });
      setModal(false); setForm(EMPTY_FORM); load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const rfqsWithQuotes = [...new Set(quotations.map(q => q.rfq?._id).filter(Boolean))];

  const inp = "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const inpStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const label = "block text-xs text-slate-400 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Quotations</h1>
          <p className="text-slate-400 text-xs mt-0.5">Vendor quote submissions & comparison</p>
        </div>
        <div className="flex gap-2">
          {rfqsWithQuotes.length > 0 && (
            <select className="px-3 py-2 rounded-lg text-sm text-white" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              onChange={e => e.target.value && compare(e.target.value)} defaultValue="">
              <option value="" disabled>Compare RFQ...</option>
              {rfqs.filter(r => rfqsWithQuotes.includes(r._id)).map(r => <option key={r._id} value={r._id}>{r.rfqNumber} - {r.title}</option>)}
            </select>
          )}
          <button onClick={() => { setForm(EMPTY_FORM); setModal(true); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>+ Submit Quote</button>
        </div>
      </div>

      {loading ? <div className="text-center py-16 text-slate-500">Loading...</div> :
       quotations.length === 0 ? <div className="text-center py-16 text-slate-500">No quotations yet.</div> :
       <div className="space-y-3">
        {quotations.map(q => (
          <Card key={q._id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{q.vendor?.name}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">{q.vendor?.company}</span>
                  {q.isLowest && <span className="px-2 py-0.5 rounded text-xs font-medium text-green-300" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>🏆 Lowest</span>}
                </div>
                <div className="text-xs text-slate-400">{q.rfq?.title} · {q.rfq?.rfqNumber}</div>
                {q.terms && <div className="text-xs text-slate-500 mt-1">{q.terms}</div>}
                <div className="flex gap-4 mt-2 text-xs text-slate-400">
                  <span>Valid: {q.validityDays} days</span>
                  {q.deliveryDays && <span>Delivery: {q.deliveryDays} days</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-white mono">₹{Number(q.totalPrice).toLocaleString('en-IN')}</div>
                <Badge text={q.status} />
              </div>
            </div>
          </Card>
        ))}
       </div>
      }

      {/* Submit Quote Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Submit Quotation">
        <div className="space-y-4">
          <div>
            <label className={label}>RFQ *</label>
            <select className={inp} style={inpStyle} value={form.rfq} onChange={e => setForm(f => ({...f, rfq: e.target.value}))}>
              <option value="">Select RFQ</option>
              {rfqs.filter(r => r.status === 'Sent').map(r => <option key={r._id} value={r._id}>{r.rfqNumber} - {r.title}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Vendor *</label>
            <select className={inp} style={inpStyle} value={form.vendor} onChange={e => setForm(f => ({...f, vendor: e.target.value}))}>
              <option value="">Select Vendor</option>
              {vendors.map(v => <option key={v._id} value={v._id}>{v.name} - {v.company}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={label}>Total Price (₹) *</label><input type="number" className={inp} style={inpStyle} value={form.totalPrice} onChange={e => setForm(f => ({...f, totalPrice: e.target.value}))} placeholder="0" /></div>
            <div><label className={label}>Validity (days)</label><input type="number" className={inp} style={inpStyle} value={form.validityDays} onChange={e => setForm(f => ({...f, validityDays: Number(e.target.value)}))} /></div>
          </div>
          <div><label className={label}>Delivery Days</label><input type="number" className={inp} style={inpStyle} value={form.deliveryDays} onChange={e => setForm(f => ({...f, deliveryDays: Number(e.target.value)}))} /></div>
          <div><label className={label}>Terms & Conditions</label><textarea className={inp} style={inpStyle} rows="2" value={form.terms} onChange={e => setForm(f => ({...f, terms: e.target.value}))} placeholder="Payment terms, warranty..." /></div>
          <div className="flex gap-3">
            <button onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg text-sm text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            <button onClick={submit} disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>
              {saving ? 'Submitting...' : 'Submit Quote'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Compare Modal */}
      <Modal isOpen={compareModal} onClose={() => setCompareModal(false)} title="Quotation Comparison" wide>
        {compareData && (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-white">{compareData.rfq?.title}</h3>
              <p className="text-xs text-slate-400">{compareData.rfq?.rfqNumber}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Vendor', 'Total Price', 'Delivery', 'Validity', 'Terms', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-xs text-slate-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareData.quotations.map((q, i) => (
                    <tr key={q._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: q.isLowest ? 'rgba(74,222,128,0.04)' : '' }}>
                      <td className="px-3 py-3">
                        <div className="font-medium text-white">{q.vendor?.name}</div>
                        <div className="text-xs text-slate-400">{q.vendor?.company}</div>
                        {q.isLowest && <span className="text-xs text-green-400">🏆 Lowest</span>}
                      </td>
                      <td className="px-3 py-3 font-bold mono" style={{ color: q.isLowest ? '#4ade80' : '#e2e8f0' }}>
                        ₹{Number(q.totalPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="px-3 py-3 text-slate-300">{q.deliveryDays ? `${q.deliveryDays} days` : '—'}</td>
                      <td className="px-3 py-3 text-slate-300">{q.validityDays} days</td>
                      <td className="px-3 py-3 text-slate-400 text-xs max-w-32 truncate">{q.terms || '—'}</td>
                      <td className="px-3 py-3"><Badge text={q.status} /></td>
                      <td className="px-3 py-3">
                        {q.status === 'Submitted' && (
                          <button onClick={() => selectQuotation(q._id)} className="px-3 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
                            style={{ background: q.isLowest ? '#10b981' : '#6366f1' }}>
                            {q.isLowest ? 'Auto Select' : 'Select'}
                          </button>
                        )}
                        {q.status === 'Selected' && <span className="text-xs text-green-400">✓ Selected</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {compareData.quotations.length === 0 && <p className="text-center py-8 text-slate-500">No quotations submitted yet.</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
