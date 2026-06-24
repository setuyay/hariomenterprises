'use client';
import { useState, useEffect } from 'react';
import { Trash2, Phone, MapPin } from 'lucide-react';

export default function AdminContractorRequests() {
  const [list, setList] = useState([]);
  const load = async () => {
    try {
      const res = await fetch('/api/contractor-requests');
      if (!res.ok) return;
      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch { /* ignore transient fetch/parse errors */ }
  };
  useEffect(() => { load(); }, []);

  async function setStatus(id, status) {
    await fetch(`/api/contractor-requests/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }
  async function del(id) {
    if (!confirm('Delete this request?')) return;
    await fetch(`/api/contractor-requests/${id}`, { method: 'DELETE' }); load();
  }

  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Contractor Requests</h1>
      <div className="space-y-4">
        {list.length === 0 && <p className="text-cream/40">No requests yet.</p>}
        {list.map(c => (
          <div key={c.id} className="glass rounded-2xl p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-display text-xl">{c.name}</h3>
                <p className="text-cream/50 text-xs mt-1">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
              <select value={c.status} onChange={e => setStatus(c.id, e.target.value)} className="bg-ink-2 border border-line rounded-lg px-3 py-1.5 text-xs">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="assigned">Assigned</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <p className="flex items-start gap-1.5 text-cream/70 text-sm mt-3"><MapPin size={14} className="text-gold mt-0.5 shrink-0" /> {c.address}</p>
            <div className="flex gap-4 mt-4 text-sm items-center flex-wrap">
              <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-gold hover:underline"><Phone size={14} /> {c.phone}</a>
              <button onClick={() => del(c.id)} className="ml-auto text-red-400 flex items-center gap-1 text-xs hover:underline"><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
