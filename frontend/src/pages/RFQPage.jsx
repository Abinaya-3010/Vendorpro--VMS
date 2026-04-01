import React, { useEffect, useState } from 'react';
import { rfqAPI, vendorAPI } from '../utils/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Card from '../components/Card';

const EMPTY_ITEM = { description: '', quantity: 1, unit: 'pcs', estimatedPrice: '' };
const EMPTY_RFQ = { title: '', description: '', deadline: '', items: [{ ...EMPTY_ITEM }] };

export default function RFQPage() {
  const [rfqs, setRfqs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [sendModal, setSendModal] = useState(null);
  const [form, setForm] = useState(EMPTY_RFQ);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [r, v] = await Promise.all([rfqAPI.getAll(), vendorAPI.getAll({ status: 'Active' })]);
      setRfqs(r.data.data || []); setVendors(v.data.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }));
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i, k, v) => setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it) }));

  const save = async () => {
    if (!form.title || !form.deadline) return alert('Title and deadline required');
    setSaving(true);
    try {
      await rfqAPI.create(form); setModal(false); setForm(EMPTY_RFQ); load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const sendRFQ = async () => {
    if (!selectedVendors.length) return alert('Select at least one vendor');
    try { await rfqAPI.send(sendModal._id, selectedVendors); setSendModal(null); setSelectedVendors([]); load(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const del = async (id) => { if (!window.confirm('Delete?')) return; await rfqAPI.delete(id); load(); };
  const toggleVendor = (id) => setSelectedVendors(s => s.includes(id) ? s.filter(v => v !== id) : [...s, id]);

  const inp = "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const inpStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const label = "block text-xs text-slate-400 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">RFQ Management</h1>
          <p className="text-slate-400 text-xs mt-0.5">Request for Quotation</p>
        </div>
        <button onClick={() => { setForm(EMPTY_RFQ); setModal(true); }} className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>+ Create RFQ</button>
      </div>

      {loading ? <div className="text-center py-16 text-slate-500">Loading...</div> :
       rfqs.length === 0 ? <div className="text-center py-16 text-slate-500">No RFQs yet. Create your first RFQ!</div> :
       <div className="space-y-3">
        {rfqs.map(r => (
          <Card key={r._id} onClick={() => setDetail(r)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="mono text-xs text-indigo-400">{r.rfqNumber}</span>
                  <Badge text={r.status} />
                </div>
                <h3 className="font-semibold text-white">{r.title}</h3>
                {r.description && <p className="text-xs text-slate-400 mt-1">{r.description}</p>}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>📦 {r.items?.length} items</span>
                  <span>👥 {r.vendors?.length || 0} vendors</span>
                  <span>📅 Due: {new Date(r.deadline).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4" onClick={e => e.stopPropagation()}>
                {r.status === 'Draft' && (
                  <button onClick={() => { setSendModal(r); setSelectedVendors(r.vendors?.map(v => v._id || v) || []); }}
                    className="px-3 py-1.5 rounded text-xs font-medium text-white" style={{ background: '#6366f1' }}>Send</button>
                )}
                <button onClick={() => del(r._id)} className="px-3 py-1.5 rounded text-xs text-red-400 hover:text-red-300"
                  style={{ border: '1px solid rgba(239,68,68,0.2)' }}>Del</button>
              </div>
            </div>
          </Card>
        ))}
       </div>
      }

      {/* Create RFQ Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Create New RFQ" wide>
        <div className="space-y-4">
          <div><label className={label}>Title *</label><input className={inp} style={inpStyle} value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Office Equipment Procurement" /></div>
          <div><label className={label}>Description</label><textarea className={inp} style={inpStyle} rows="2" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Details..." /></div>
          <div><label className={label}>Deadline *</label><input type="date" className={inp} style={inpStyle} value={form.deadline} onChange={e => setForm(f => ({...f, deadline: e.target.value}))} /></div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={label + ' mb-0'}>Items *</label>
              <button onClick={addItem} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <input className={inp + ' flex-[3]'} style={inpStyle} value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} placeholder="Item description" />
                  <input type="number" className={inp + ' flex-1'} style={inpStyle} value={item.quantity} onChange={e => updateItem(i, 'quantity', Number(e.target.value))} placeholder="Qty" />
                  <select className={inp + ' flex-1'} style={inpStyle} value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)}>
                    {['pcs', 'kg', 'ltr', 'mtr', 'box', 'set'].map(u => <option key={u}>{u}</option>)}
                  </select>
                  <input type="number" className={inp + ' flex-1'} style={inpStyle} value={item.estimatedPrice} onChange={e => updateItem(i, 'estimatedPrice', e.target.value)} placeholder="Est. Price" />
                  {form.items.length > 1 && <button onClick={() => removeItem(i)} className="text-red-400 text-lg px-1">×</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg text-sm text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>
              {saving ? 'Creating...' : 'Create RFQ'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Send to Vendors Modal */}
      <Modal isOpen={!!sendModal} onClose={() => setSendModal(null)} title="Send RFQ to Vendors">
        <p className="text-xs text-slate-400 mb-4">Select vendors to receive this RFQ</p>
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {vendors.map(v => (
            <div key={v._id} onClick={() => toggleVendor(v._id)}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all"
              style={{ background: selectedVendors.includes(v._id) ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedVendors.includes(v._id) ? '#6366f1' : 'rgba(255,255,255,0.07)'}` }}>
              <div className={`w-4 h-4 rounded flex items-center justify-center text-xs ${selectedVendors.includes(v._id) ? 'bg-indigo-500 text-white' : 'border border-slate-600'}`}>
                {selectedVendors.includes(v._id) && '✓'}
              </div>
              <div>
                <div className="text-sm text-white">{v.name}</div>
                <div className="text-xs text-slate-400">{v.company} · <Badge text={v.category} /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSendModal(null)} className="flex-1 py-2 rounded-lg text-sm text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
          <button onClick={sendRFQ} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>
            Send to {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''}
          </button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="RFQ Details" wide>
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="mono text-indigo-400">{detail.rfqNumber}</span>
              <Badge text={detail.status} />
            </div>
            <h2 className="text-xl font-bold text-white">{detail.title}</h2>
            {detail.description && <p className="text-slate-400 text-sm">{detail.description}</p>}
            <div className="text-xs text-slate-400">Deadline: {new Date(detail.deadline).toLocaleDateString('en-IN')}</div>
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Items</p>
              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <table className="w-full text-sm">
                  <thead><tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {['Description', 'Qty', 'Unit', 'Est. Price'].map(h => <th key={h} className="text-left px-3 py-2 text-xs text-slate-400">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {detail.items?.map((it, i) => (
                      <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-3 py-2 text-white">{it.description}</td>
                        <td className="px-3 py-2 text-slate-300">{it.quantity}</td>
                        <td className="px-3 py-2 text-slate-300">{it.unit}</td>
                        <td className="px-3 py-2 text-slate-300">{it.estimatedPrice ? `₹${Number(it.estimatedPrice).toLocaleString('en-IN')}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
