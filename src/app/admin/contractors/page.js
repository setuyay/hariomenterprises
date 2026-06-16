'use client';
import { useState, useEffect } from 'react';
import { Trash2, Phone, Mail, MapPin, Building2 } from 'lucide-react';

export default function AdminContractors() {
  const [list, setList] = useState([]);
  const load = async () => setList(await (await fetch('/api/contractors')).json());
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    await fetch(`/api/contractors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }
  async function del(id) {
    if (!confirm('Delete this application?')) return;
    await fetch(`/api/contractors/${id}`, { method: 'DELETE' }); load();
  }

  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Contractor Applications</h1>
      <div className="space-y-4">
        {list.length === 0 && <p className="text-cream/40">No applications yet.</p>}
        {list.map(c => (
          <div key={c.id} className="glass rounded-2xl p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-display text-xl">{c.name}</h3>
                <p className="text-cream/50 text-xs mt-1">{new Date(c.createdAt).toLocaleString()}{c.workType ? ` · ${c.workType}` : ''}</p>
              </div>
              <select value={c.status} onChange={e => setStatus(c.id, e.target.value)} className="bg-ink-2 border border-line rounded-lg px-3 py-1.5 text-xs">
                <option value="new">New</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            {c.businessName && <p className="flex items-center gap-1.5 text-cream/70 text-sm mt-3"><Building2 size={14} className="text-gold"/> {c.businessName}</p>}
            {c.message && <p className="text-cream/70 text-sm mt-2">{c.message}</p>}
            <div className="flex gap-4 mt-4 text-sm items-center flex-wrap">
              <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-gold hover:underline"><Phone size={14}/> {c.phone}</a>
              {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-cream/60 hover:text-gold"><Mail size={14}/> {c.email}</a>}
              {c.city && <span className="flex items-center gap-1 text-cream/60"><MapPin size={14}/> {c.city}</span>}
              <button onClick={() => del(c.id)} className="ml-auto text-red-400 flex items-center gap-1 text-xs hover:underline"><Trash2 size={14}/> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
