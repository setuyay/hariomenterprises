'use client';
import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/config';

const empty = { productName:'', brandId:'', category:CATEGORIES[0], images:[], description:'', features:[], specs:[] };

export default function AdminProducts() {
  const [data, setData] = useState({ items: [], pages: 1 });
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);

  const load = async () => setData(await (await fetch(`/api/products?page=${page}&limit=12`)).json());
  useEffect(() => { load(); }, [page]);
  useEffect(() => { (async()=>setBrands(await (await fetch('/api/brands')).json()))(); }, []);

  async function uploadImages(e) {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    [...files].forEach(f => fd.append('files', f));
    const res = await fetch('/api/upload', { method:'POST', body: fd });
    const { urls } = await res.json();
    setForm(f => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
  }
  function addSpec() { setForm(f=>({...f, specs:[...f.specs,{key:'',value:''}]})); }
  function addFeature() { setForm(f=>({...f, features:[...f.features,'']})); }

  async function save(e) {
    e.preventDefault();
    const payload = {
      ...form,
      brandId: Number(form.brandId),
      specs: Object.fromEntries(form.specs.filter(s=>s.key).map(s=>[s.key,s.value])),
      features: form.features.filter(Boolean),
    };
    const url = editing ? `/api/products/${editing}` : '/api/products';
    await fetch(url, { method: editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    setShow(false); setEditing(null); setForm(empty); load();
  }
  async function del(id) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method:'DELETE' }); load();
  }
  function edit(p) {
    setEditing(p.id);
    setForm({
      productName: p.productName, brandId: p.brandId, category: p.category,
      images: JSON.parse(p.images||'[]'), description: p.description||'',
      features: JSON.parse(p.features||'[]'),
      specs: Object.entries(JSON.parse(p.specs||'{}')).map(([key,value])=>({key,value})),
    });
    setShow(true);
  }
  const inp = 'w-full bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl">Products</h1>
        <button onClick={()=>{setShow(true);setEditing(null);setForm(empty);}} className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2"><Plus size={16}/> Add Product</button>
      </div>

      {show && (
        <form onSubmit={save} className="glass rounded-2xl p-6 mb-8 space-y-4 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-3">
            <input className={inp} placeholder="Product Name" value={form.productName} onChange={e=>setForm({...form,productName:e.target.value})} required/>
            <select className={inp} value={form.brandId} onChange={e=>setForm({...form,brandId:e.target.value})} required>
              <option value="">Select Brand</option>
              {brands.map(b=> <option key={b.id} value={b.id}>{b.brandName}</option>)}
            </select>
            <select className={inp} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
              {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea className={inp} rows={3} placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>

          <div>
            <label className="text-xs text-cream/50">Images (multiple)</label>
            <input type="file" accept="image/*" multiple onChange={uploadImages} className="text-sm text-cream/60 mt-1 block"/>
            {uploading && <p className="text-gold text-xs mt-1">Uploading...</p>}
            <div className="flex gap-2 flex-wrap mt-2">
              {form.images.map((img,i)=>(
                <div key={i} className="relative">
                  <img src={img} className="w-16 h-16 object-cover rounded-lg"/>
                  <button type="button" onClick={()=>setForm(f=>({...f,images:f.images.filter((_,x)=>x!==i)}))} className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5"><X size={12}/></button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center"><label className="text-xs text-cream/50">Features</label><button type="button" onClick={addFeature} className="text-gold text-xs">+ Add</button></div>
            {form.features.map((f,i)=>(
              <input key={i} className={`${inp} mt-2`} value={f} placeholder="Feature" onChange={e=>setForm(s=>({...s,features:s.features.map((x,xi)=>xi===i?e.target.value:x)}))}/>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center"><label className="text-xs text-cream/50">Specifications</label><button type="button" onClick={addSpec} className="text-gold text-xs">+ Add</button></div>
            {form.specs.map((s,i)=>(
              <div key={i} className="grid grid-cols-2 gap-2 mt-2">
                <input className={inp} placeholder="Label" value={s.key} onChange={e=>setForm(st=>({...st,specs:st.specs.map((x,xi)=>xi===i?{...x,key:e.target.value}:x)}))}/>
                <input className={inp} placeholder="Value" value={s.value} onChange={e=>setForm(st=>({...st,specs:st.specs.map((x,xi)=>xi===i?{...x,value:e.target.value}:x)}))}/>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold">{editing?'Update':'Create'}</button>
            <button type="button" onClick={()=>setShow(false)} className="glass px-6 py-2.5 rounded-xl text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-cream/50 text-xs uppercase tracking-wider border-b border-white/10">
            <tr><th className="text-left p-4">Product</th><th className="text-left p-4">Brand</th><th className="text-left p-4">Category</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {data.items.map(p=>(
              <tr key={p.id} className="border-b border-white/5">
                <td className="p-4 flex items-center gap-3">
                  <img src={p.image||'/uploads/sample-product.svg'} className="w-10 h-10 rounded-lg object-cover"/>
                  {p.productName}
                </td>
                <td className="p-4 text-cream/60">{p.brand?.brandName}</td>
                <td className="p-4 text-cream/60">{p.category}</td>
                <td className="p-4">
                  <div className="flex gap-2 justify-center">
                    <button onClick={()=>edit(p)} className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><Edit size={13}/></button>
                    <button onClick={()=>del(p.id)} className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-400/10"><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.pages>1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({length:data.pages}).map((_,i)=>(
            <button key={i} onClick={()=>setPage(i+1)} className={`w-9 h-9 rounded-full text-sm ${page===i+1?'btn-gold':'glass'}`}>{i+1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
