'use client';
import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus } from 'lucide-react';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ brandName: '', brandLogo: '', description: '', category: '' });
  const [show, setShow] = useState(false);

  const load = async () => setBrands(await (await fetch('/api/brands')).json());
  useEffect(() => { load(); }, []);

  async function uploadLogo(e) {
    const files = e.target.files;
    if (!files.length) return;
    const fd = new FormData();
    fd.append('files', files[0]);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const { urls } = await res.json();
    setForm(f => ({ ...f, brandLogo: urls[0] }));
  }
  async function save(e) {
    e.preventDefault();
    const url = editing ? `/api/brands/${editing}` : '/api/brands';
    await fetch(url, { method: editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setShow(false); setEditing(null); setForm({ brandName:'', brandLogo:'', description:'', category:'' }); load();
  }
  async function del(id) {
    if (!confirm('Delete this brand and all its products?')) return;
    await fetch(`/api/brands/${id}`, { method: 'DELETE' }); load();
  }
  function edit(b) { setEditing(b.id); setForm({ brandName:b.brandName, brandLogo:b.brandLogo||'', description:b.description||'', category:b.category||'' }); setShow(true); }
  const inp = 'w-full bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none';
  const CATEGORIES = ['Premium Decorative','Decorative & Economy','Protective & Industrial','Wood Finishes','Specialty'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl">Brands</h1>
        <button onClick={()=>{setShow(true);setEditing(null);setForm({brandName:'',brandLogo:'',description:'',category:''});}} className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2"><Plus size={16}/> Add Brand</button>
      </div>
      {show && (
        <form onSubmit={save} className="glass rounded-2xl p-6 mb-8 space-y-3 max-w-lg">
          <input className={inp} placeholder="Brand Name" value={form.brandName} onChange={e=>setForm({...form,brandName:e.target.value})} required/>
          <select className={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            <option value="">Select classification…</option>
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className={inp} rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <div>
            <label className="text-xs text-cream/50">Logo</label>
            <input type="file" accept="image/*" onChange={uploadLogo} className="text-sm text-cream/60 mt-1"/>
            {form.brandLogo && <img src={form.brandLogo} className="h-16 mt-2 rounded"/>}
          </div>
          <div className="flex gap-3">
            <button className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold">{editing?'Update':'Create'}</button>
            <button type="button" onClick={()=>setShow(false)} className="glass px-6 py-2.5 rounded-xl text-sm">Cancel</button>
          </div>
        </form>
      )}
      <div className="grid md:grid-cols-3 gap-5">
        {brands.map(b=>(
          <div key={b.id} className="glass rounded-2xl p-5">
            {b.brandLogo && <img src={b.brandLogo} className="h-14 mb-3 object-contain"/>}
            <h3 className="font-display text-xl text-gold">{b.brandName}</h3>
            {b.category && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[11px] border border-gold/20">{b.category}</span>}
            <p className="text-cream/50 text-xs mt-1">{b._count?.products||0} products</p>
            <p className="text-cream/60 text-sm mt-2 line-clamp-2">{b.description}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={()=>edit(b)} className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><Edit size={13}/> Edit</button>
              <button onClick={()=>del(b.id)} className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 text-red-400 hover:bg-red-400/10"><Trash2 size={13}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
