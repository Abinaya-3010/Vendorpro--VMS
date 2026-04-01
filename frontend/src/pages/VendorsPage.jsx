import React, { useEffect, useState } from 'react';
import { vendorAPI } from '../utils/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Card from '../components/Card';

const CATS = ['IT', 'Construction', 'Logistics', 'Manufacturing', 'Services', 'Other'];
const EMPTY = { name: '', company: '', email: '', phone: '', gst: '', pan: '', category: 'IT', bankName: '', accountNumber: '', ifsc: '', rating: 3, address: '', status: 'Active' };

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= rating ? 'text-yellow-400' : 'text-slate-600'}`}>★</span>
      ))}
    </div>
  );
}

function VendorForm({ vendor, onChange }) {
  const inp = "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const inpStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };
  const label = "block text-xs text-slate-400 mb-1";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>Name *</label><input className={inp} style={inpStyle} value={vendor.name} onChange={e => onChange('name', e.target.value)} placeholder="John Doe" /></div>
        <div><label className={label}>Company *</label><input className={inp} style={inpStyle} value={vendor.company} onChange={e => onChange('company', e.target.value)} placeholder="Acme Ltd" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>Email *</label><input className={inp} style={inpStyle} value={vendor.email} onChange={e => onChange('email', e.target.value)} placeholder="email@company.com" /></div>
        <div><label className={label}>Phone</label><input className={inp} style={inpStyle} value={vendor.phone} onChange={e => onChange('phone', e.target.value)} placeholder="9876543210" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={label}>GST Number</label><input className={inp} style={inpStyle} value={vendor.gst} onChange={e => onChange('gst', e.target.value)} placeholder="27AAPFU0939F1ZV" /></div>
        <div><label className={label}>PAN Number</label><input className={inp} style={inpStyle} value={vendor.pan} onChange={e => onChange('pan', e.target.value)} placeholder="AAPFU0939F" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>Category</label>
          <select className={inp} style={inpStyle} value={vendor.category} onChange={e => onChange('category', e.target.value)}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Rating (1–5)</label>
          <input type="number" min="1" max="5" className={inp} style={inpStyle} value={vendor.rating} onChange={e => onChange('rating', Number(e.target.value))} />
        </div>
      </div>
      <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-xs text-slate-400 mb-3 font-medium">Bank Details</p>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={label}>Bank Name</label><input className={inp} style={inpStyle} value={vendor.bankName} onChange={e => onChange('bankName', e.target.value)} placeholder="HDFC Bank" /></div>
          <div><label className={label}>Account No.</label><input className={inp} style={inpStyle} value={vendor.accountNumber} onChange={e => onChange('accountNumber', e.target.value)} placeholder="50100123456" /></div>
          <div><label className={label}>IFSC Code</label><input className={inp} style={inpStyle} value={vendor.ifsc} onChange={e => onChange('ifsc', e.target.value)} placeholder="HDFC0001234" /></div>
        </div>
      </div>
      <div><label className={label}>Address</label><textarea className={inp} style={inpStyle} rows="2" value={vendor.address} onChange={e => onChange('address', e.target.value)} placeholder="Full address" /></div>
      <div>
        <label className={label}>Status</label>
        <select className={inp} style={inpStyle} value={vendor.status} onChange={e => onChange('status', e.target.value)}>
          <option>Active</option><option>Inactive</option>
        </select>
      </div>
    </div>
  );
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [detailVendor, setDetailVendor] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await vendorAPI.getAll({ search });
      setVendors(res.data.data || []);
    } catch { setVendors([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const openAdd = () => { setForm(EMPTY); setEditVendor(null); setModal(true); };
  const openEdit = (v) => { setForm({ ...v }); setEditVendor(v._id); setModal(true); };
  const change = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.company || !form.email) return alert('Name, company and email are required');
    setSaving(true);
    try {
      if (editVendor) await vendorAPI.update(editVendor, form);
      else await vendorAPI.create(form);
      setModal(false); load();
    } catch (e) { alert(e.response?.data?.message || 'Error saving vendor'); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    await vendorAPI.delete(id); load();
  };

  const inp = "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const inpStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Vendors</h1>
          <p className="text-slate-400 text-xs mt-0.5">{vendors.length} registered vendors</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>+ Add Vendor</button>
      </div>

      <div className="mb-4">
        <input className={inp} style={inpStyle} placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No vendors found. Add your first vendor!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map(v => (
            <Card key={v._id} onClick={() => setDetailVendor(v)}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>
                    {v.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{v.name}</div>
                    <div className="text-xs text-slate-400">{v.company}</div>
                  </div>
                </div>
                <Badge text={v.status} />
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>✉</span><span>{v.email}</span>
                </div>
                {v.gst && <div className="flex items-center gap-2 text-xs text-slate-400"><span>◈</span><span className="mono">{v.gst}</span></div>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Badge text={v.category} /><Stars rating={v.rating} /></div>
                <div className="flex gap-2">
                  <button onClick={e => { e.stopPropagation(); openEdit(v); }} className="text-xs text-indigo-400 hover:text-indigo-300">Edit</button>
                  <button onClick={e => { e.stopPropagation(); del(v._id); }} className="text-xs text-red-400 hover:text-red-300">Del</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editVendor ? 'Edit Vendor' : 'Add New Vendor'}>
        <VendorForm vendor={form} onChange={change} />
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>
            {saving ? 'Saving...' : editVendor ? 'Update' : 'Add Vendor'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!detailVendor} onClose={() => setDetailVendor(null)} title="Vendor Details">
        {detailVendor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>
                {detailVendor.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white text-lg">{detailVendor.name}</div>
                <div className="text-slate-400 text-sm">{detailVendor.company}</div>
                <Stars rating={detailVendor.rating} />
              </div>
            </div>
            {[['Email', detailVendor.email], ['Phone', detailVendor.phone], ['GST', detailVendor.gst], ['PAN', detailVendor.pan], ['Category', detailVendor.category], ['Bank', detailVendor.bankName], ['Account', detailVendor.accountNumber], ['IFSC', detailVendor.ifsc], ['Address', detailVendor.address]].filter(([,v]) => v).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-xs text-slate-400">{k}</span>
                <span className="text-sm text-white mono">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
