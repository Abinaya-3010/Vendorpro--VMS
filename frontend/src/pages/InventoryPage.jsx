import React, { useEffect, useState } from 'react';
import { inventoryAPI, poAPI } from '../utils/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Card from '../components/Card';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [pos, setPOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [selectedPO, setSelectedPO] = useState('');
  const [notes, setNotes] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [inv, p] = await Promise.all([inventoryAPI.getAll(), poAPI.getAll({ status: 'Approved' })]);
      setInventory(inv.data.data || []); setPOs(p.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const receive = async () => {
    if (!selectedPO) return alert('Select a PO');
    try {
      await inventoryAPI.receive({ poId: selectedPO, notes });
      setModal(false); setSelectedPO(''); setNotes(''); load();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const toggleReturn = async (invId, itemIdx, current) => {
    const inv = inventory.find(i => i._id === invId);
    if (!inv) return;
    const items = inv.items.map((it, i) => i === itemIdx ? { ...it, isReturned: !current } : it);
    try { await inventoryAPI.update(invId, { items }); load(); }
    catch (e) { alert('Error updating'); }
  };

  const inp = "w-full px-3 py-2 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
  const inpStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Inventory</h1>
          <p className="text-slate-400 text-xs mt-0.5">Stock receipt & tracking</p>
        </div>
        <button onClick={() => setModal(true)} className="px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>+ Receive Stock</button>
      </div>

      {loading ? <div className="text-center py-16 text-slate-500">Loading...</div> :
       inventory.length === 0 ? <div className="text-center py-16 text-slate-500">No inventory entries. Receive stock from an approved PO.</div> :
       <div className="space-y-4">
        {inventory.map(inv => (
          <Card key={inv._id} onClick={() => setDetail(inv)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-white">{inv.vendor?.name}</div>
                <div className="text-xs text-slate-400">{inv.vendor?.company}</div>
                <div className="text-xs text-slate-500 mt-1">PO: {inv.purchaseOrder?.poNumber}</div>
              </div>
              <div className="text-right text-xs text-slate-400">
                Received: {new Date(inv.receivedDate).toLocaleDateString('en-IN')}
              </div>
            </div>
            <div className="space-y-2">
              {inv.items?.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-sm text-slate-300">{item.description}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Ordered: {item.orderedQty}</span>
                    <span className="text-xs text-green-400">Received: {item.receivedQty}</span>
                    {item.isReturned && <span className="text-xs text-red-400">↩ Returned</span>}
                  </div>
                </div>
              ))}
              {inv.items?.length > 3 && <p className="text-xs text-slate-500 pl-2">+{inv.items.length - 3} more items</p>}
            </div>
          </Card>
        ))}
       </div>
      }

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Receive Stock">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Purchase Order *</label>
            <select className={inp} style={inpStyle} value={selectedPO} onChange={e => setSelectedPO(e.target.value)}>
              <option value="">Select approved PO</option>
              {pos.map(p => <option key={p._id} value={p._id}>{p.poNumber} — {p.vendor?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes</label>
            <textarea className={inp} style={inpStyle} rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Condition of goods, any damage..." />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setModal(false)} className="flex-1 py-2 rounded-lg text-sm text-slate-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
            <button onClick={receive} className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #c084fc)' }}>Receive All Items</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="Inventory Details" wide>
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-400">Vendor</p>
                <p className="font-semibold text-white">{detail.vendor?.name}</p>
                <p className="text-xs text-slate-400">{detail.vendor?.company}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-400">PO Reference</p>
                <p className="font-semibold text-indigo-400 mono">{detail.purchaseOrder?.poNumber}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">Items</p>
              <div className="space-y-2">
                {detail.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div className="text-sm text-white">{item.description}</div>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-slate-400">Ordered: <span className="text-white">{item.orderedQty}</span></span>
                        <span className="text-slate-400">Received: <span className="text-green-400">{item.receivedQty}</span></span>
                        {item.returnedQty > 0 && <span className="text-slate-400">Returned: <span className="text-red-400">{item.returnedQty}</span></span>}
                      </div>
                    </div>
                    <button onClick={() => toggleReturn(detail._id, i, item.isReturned)}
                      className={`px-3 py-1 rounded text-xs font-medium ${item.isReturned ? 'text-green-300' : 'text-red-300'}`}
                      style={{ background: item.isReturned ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${item.isReturned ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      {item.isReturned ? '✓ Kept' : '↩ Return'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {detail.notes && <div><p className="text-xs text-slate-400">Notes</p><p className="text-sm text-slate-300">{detail.notes}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  );
}
