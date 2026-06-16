'use client';
import { useState, useEffect } from 'react';
import { Trash2, Phone, Mail } from 'lucide-react';

export default function AdminInquiries() {
  const [list, setList] = useState([]);
  const load = async () => setList(await (await fetch('/api/inquiries')).json());
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    await fetch(`/api/inquiries/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    load();
  }
  async function del(id) {
    if (!confirm('Delete this inquiry?')) return;
    await fetch(`/api/inquiries/${id}`, { method:'DELETE' }); load();
  }

  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Customer Inquiries</h1>
      <div className="space-y-4">
        {list.length===0 && <p className="text-cream/40">No inquiries yet.</p>}
        {list.map(i=>(
          <div key={i.id} className="glass rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display text-xl">{i.customerName}</h3>
                <p className="text-cream/50 text-xs mt-1">{new Date(i.createdAt).toLocaleString()} · {i.product?.productName || 'General Inquiry'}</p>
              </div>
              <select value={i.status} onChange={e=>setStatus(i.id,e.target.value)} className="bg-ink-2 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            {i.message && <p className="text-cream/70 text-sm mt-3">{i.message}</p>}
            <div className="flex gap-4 mt-4 text-sm items-center">
              <a href={`tel:${i.phone}`} className="flex items-center gap-1 text-gold hover:underline"><Phone size={14}/> {i.phone}</a>
              {i.email && <a href={`mailto:${i.email}`} className="flex items-center gap-1 text-cream/60 hover:text-gold"><Mail size={14}/> {i.email}</a>}
              <button onClick={()=>del(i.id)} className="ml-auto text-red-400 flex items-center gap-1 text-xs hover:underline"><Trash2 size={14}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
