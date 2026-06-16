'use client';
import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Percent } from 'lucide-react';

const EMPTY = { title: '', description: '', discount: '', code: '', image: '', active: true, startDate: '', endDate: '' };
const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);

  const load = async () => setOffers(await (await fetch('/api/offers')).json());
  useEffect(() => { load(); }, []);

  async function uploadImage(e) {
    const files = e.target.files;
    if (!files.length) return;
    const fd = new FormData();
    fd.append('files', files[0]);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const { urls } = await res.json();
    setForm(f => ({ ...f, image: urls[0] }));
  }
  async function save(e) {
    e.preventDefault();
    const url = editing ? `/api/offers/${editing}` : '/api/offers';
    await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShow(false); setEditing(null); setForm(EMPTY); load();
  }
  async function del(id) {
    if (!confirm('Delete this offer?')) return;
    await fetch(`/api/offers/${id}`, { method: 'DELETE' }); load();
  }
  async function toggleActive(o) {
    await fetch(`/api/offers/${o.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...o, startDate: toDateInput(o.startDate), endDate: toDateInput(o.endDate), active: !o.active }),
    });
    load();
  }
  function edit(o) {
    setEditing(o.id);
    setForm({ title: o.title, description: o.description || '', discount: o.discount || '', code: o.code || '', image: o.image || '', active: o.active, startDate: toDateInput(o.startDate), endDate: toDateInput(o.endDate) });
    setShow(true);
  }
  const inp = 'w-full bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl">Offers</h1>
        <button onClick={() => { setShow(true); setEditing(null); setForm(EMPTY); }} className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Add Offer</button>
      </div>
      {show && (
        <form onSubmit={save} className="glass rounded-2xl p-6 mb-8 space-y-3 max-w-lg">
          <input className={inp} placeholder="Title (e.g. Monsoon Paint Sale)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <input className={inp} placeholder="Discount (e.g. Flat 15% Off)" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
            <input className={inp} placeholder="Coupon Code (optional)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          </div>
          <textarea className={inp} rows={3} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-cream/50">Valid From</label>
              <input type="date" className={inp} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-cream/50">Valid Until</label>
              <input type="date" className={inp} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-cream/50">Banner Image</label>
            <input type="file" accept="image/*" onChange={uploadImage} className="text-sm text-cream/60 mt-1" />
            {form.image && <img src={form.image} className="h-24 mt-2 rounded-lg object-cover" />}
          </div>
          <label className="flex items-center gap-2 text-sm text-cream/70">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active (show on website)
          </label>
          <div className="flex gap-3">
            <button className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShow(false)} className="glass px-6 py-2.5 rounded-xl text-sm">Cancel</button>
          </div>
        </form>
      )}
      {offers.length === 0 && <p className="text-cream/40 text-sm">No offers yet. Click “Add Offer” to create your first promotion.</p>}
      <div className="grid md:grid-cols-3 gap-5">
        {offers.map(o => (
          <div key={o.id} className="glass rounded-2xl overflow-hidden">
            {o.image
              ? <img src={o.image} className="h-32 w-full object-cover" />
              : <div className="h-32 w-full flex items-center justify-center bg-gold/10"><Percent size={32} className="text-gold/60" /></div>}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg text-gold">{o.title}</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${o.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-cream/40 border-white/10'}`}>{o.active ? 'Active' : 'Hidden'}</span>
              </div>
              {o.discount && <p className="text-cream font-semibold text-sm mt-1">{o.discount}</p>}
              {o.code && <span className="inline-block mt-1 px-2 py-0.5 rounded bg-gold/10 text-gold text-[11px] border border-gold/20 tracking-wide">CODE: {o.code}</span>}
              <p className="text-cream/60 text-sm mt-2 line-clamp-2">{o.description}</p>
              {(o.startDate || o.endDate) && (
                <p className="text-cream/40 text-xs mt-2">{o.startDate ? toDateInput(o.startDate) : '…'} → {o.endDate ? toDateInput(o.endDate) : '…'}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => toggleActive(o)} className="glass px-3 py-1.5 rounded-lg text-xs hover:border-gold">{o.active ? 'Hide' : 'Show'}</button>
                <button onClick={() => edit(o)} className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><Edit size={13} /> Edit</button>
                <button onClick={() => del(o.id)} className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 text-red-400 hover:bg-red-400/10"><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
