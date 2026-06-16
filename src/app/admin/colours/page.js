'use client';
import { useState, useEffect, useCallback } from 'react';
import { Trash2, Edit, Plus, Search } from 'lucide-react';

const FAMILIES = ['Whites & Neutrals','Yellows & Oranges','Reds & Pinks','Greens','Blues','Purples','Greys & Darks','Browns & Earth','Other'];
const empty = { name:'', hex:'#cccccc', family:FAMILIES[0] };
const PAGE_SIZE = 60;

export default function AdminColours() {
  const [shades, setShades] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => { const t = setTimeout(()=>setDebounced(query.trim()), 300); return ()=>clearTimeout(t); }, [query]);

  const load = useCallback(async (pageNum, replace) => {
    const params = new URLSearchParams({ page:String(pageNum), pageSize:String(PAGE_SIZE) });
    if (debounced) params.set('q', debounced);
    const data = await (await fetch(`/api/colors?${params}`)).json();
    setTotal(data.total);
    setShades(prev => replace ? data.items : [...prev, ...data.items]);
  }, [debounced]);

  useEffect(() => { setPage(1); load(1, true); }, [debounced, load]);

  async function save(e) {
    e.preventDefault();
    const url = editing ? `/api/colors/${editing}` : '/api/colors';
    await fetch(url, { method: editing?'PUT':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setShow(false); setEditing(null); setForm(empty); setPage(1); load(1, true);
  }
  async function del(id) { if (!confirm('Delete this shade?')) return; await fetch(`/api/colors/${id}`, { method:'DELETE' }); setPage(1); load(1, true); }
  function edit(s) { setEditing(s.id); setForm({ name:s.name, hex:s.hex, family:s.family }); setShow(true); }
  function loadMore() { const next = page+1; setPage(next); load(next, false); }
  const inp = 'w-full bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-4xl">Colour Palettes</h1>
        <button onClick={()=>{setShow(true);setEditing(null);setForm(empty);}} className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2"><Plus size={16}/> Add Shade</button>
      </div>
      <div className="relative max-w-md mb-2">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40"/>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search shades by name or hex…"
          className="w-full bg-ink-2 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm focus:border-gold outline-none"/>
      </div>
      <p className="text-cream/40 text-xs mb-6">Showing {shades.length.toLocaleString()} of {total.toLocaleString()} shades</p>
      {show && (
        <form onSubmit={save} className="glass rounded-2xl p-6 mb-8 space-y-3 max-w-md">
          <input className={inp} placeholder="Shade name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
          <select className={inp} value={form.family} onChange={e=>setForm({...form,family:e.target.value})}>
            {FAMILIES.map(f=> <option key={f} value={f}>{f}</option>)}
          </select>
          <div className="flex items-center gap-3">
            <input type="color" value={form.hex} onChange={e=>setForm({...form,hex:e.target.value})} className="h-12 w-16 rounded-lg bg-transparent cursor-pointer"/>
            <input className={inp} value={form.hex} onChange={e=>setForm({...form,hex:e.target.value})} placeholder="#hex"/>
          </div>
          <div className="flex gap-3">
            <button className="btn-gold px-6 py-2.5 rounded-xl text-sm font-semibold">{editing?'Update':'Create'}</button>
            <button type="button" onClick={()=>setShow(false)} className="glass px-6 py-2.5 rounded-xl text-sm">Cancel</button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {shades.map(s=>(
          <div key={s.id} className="glass rounded-2xl p-3">
            <div className="aspect-square rounded-xl mb-2" style={{ background: s.hex }}/>
            <p className="text-sm font-medium">{s.name}</p>
            <p className="text-xs text-cream/40">{s.family} · {s.hex}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>edit(s)} className="glass px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><Edit size={12}/></button>
              <button onClick={()=>del(s.id)} className="px-2.5 py-1 rounded-lg text-xs text-red-400 hover:bg-red-400/10"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>
      {shades.length < total && (
        <div className="text-center mt-8">
          <button onClick={loadMore} className="glass px-8 py-3 rounded-full text-sm font-semibold hover:border-gold">Load more shades</button>
        </div>
      )}
    </div>
  );
}
