'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Check, X, Download, FileText, Image as ImageIcon, ChevronDown, Phone, Mail, MapPin } from 'lucide-react';
import WarrantyStatusBadge from '@/components/WarrantyStatusBadge';
import { downloadWarrantyCertificate } from '@/lib/warrantyCertificate';
import { WARRANTY_STATUSES } from '@/lib/warrantySchema';

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

export default function AdminWarranty() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set('q', q.trim());
      if (status !== 'All') params.set('status', status);
      const res = await fetch(`/api/warranty?${params.toString()}`);
      if (!res.ok) { setItems([]); return; }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); } finally { setLoading(false); }
  }, [q, status]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  async function setStat(id, s) {
    await fetch(`/api/warranty/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s }) });
    load();
  }
  async function del(id) {
    if (!confirm('Delete this warranty registration?')) return;
    await fetch(`/api/warranty/${id}`, { method: 'DELETE' });
    load();
  }

  const inp = 'bg-ink-2 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-gold';

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="font-display text-4xl">Warranty Registrations</h1>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
            <input className={`${inp} pl-9 w-64`} placeholder="Search ID, name, mobile, product…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className={inp} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="All">All statuses</option>
            {WARRANTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading && <p className="text-cream/40 text-sm mb-4">Loading…</p>}
      {!loading && items.length === 0 && <p className="text-cream/40">No warranty registrations found.</p>}

      <div className="space-y-4">
        {items.map((w) => (
          <div key={w.id} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono font-bold text-gold">{w.warrantyId}</p>
                <h3 className="font-display text-xl mt-0.5">{w.customerName}</h3>
                <p className="text-cream/50 text-xs mt-1">{w.brandName} · {w.productName} · registered {fmt(w.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <WarrantyStatusBadge status={w.status} />
                <select value={w.status} onChange={(e) => setStat(w.id, e.target.value)} className="bg-ink-2 border border-line rounded-lg px-2 py-1.5 text-xs">
                  {WARRANTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* quick contact + actions */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
              <a href={`tel:${w.mobile}`} className="flex items-center gap-1 text-gold hover:underline"><Phone size={14} /> {w.mobile}</a>
              <a href={`mailto:${w.email}`} className="flex items-center gap-1 text-cream/60 hover:text-gold"><Mail size={14} /> {w.email}</a>
              <span className="flex items-center gap-1 text-cream/60"><MapPin size={14} /> {w.city}, {w.district}</span>
              <button onClick={() => setExpanded(expanded === w.id ? null : w.id)} className="ml-auto flex items-center gap-1 text-cream/60 hover:text-gold text-xs">
                {expanded === w.id ? 'Hide' : 'View'} details <ChevronDown size={14} className={`transition-transform ${expanded === w.id ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* details */}
            {expanded === w.id && (
              <div className="mt-4 pt-4 border-t border-line grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <Detail k="Address" v={`${w.address}, ${w.city}, ${w.district} – ${w.pincode}`} />
                <Detail k="Shade" v={w.shadeName} />
                <Detail k="Batch No." v={w.batchNumber} />
                <Detail k="Purchase Date" v={fmt(w.purchaseDate)} />
                <Detail k="Quantity" v={w.quantityPurchased} />
                <Detail k="Invoice No." v={w.invoiceNumber} />
                <Detail k="Property Type" v={w.propertyType} />
                <Detail k="Painted Area" v={w.paintedArea} />
                <Detail k="Contractor" v={w.contractorName} />
                <Detail k="Application Date" v={fmt(w.applicationDate)} />
              </div>
            )}

            {/* downloads + delete */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {w.invoiceFile && <a href={w.invoiceFile} target="_blank" rel="noreferrer" className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><FileText size={13} /> Invoice</a>}
              {w.productPhoto && <a href={w.productPhoto} target="_blank" rel="noreferrer" className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><ImageIcon size={13} /> Product photo</a>}
              {w.wallPhoto && <a href={w.wallPhoto} target="_blank" rel="noreferrer" className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><ImageIcon size={13} /> Wall photo</a>}
              <button onClick={() => downloadWarrantyCertificate(w)} className="glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:border-gold"><Download size={13} /> Certificate</button>
              {w.status !== 'Approved' && <button onClick={() => setStat(w.id, 'Approved')} className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 text-kamdhenu hover:bg-kamdhenu/10"><Check size={13} /> Approve</button>}
              {w.status !== 'Rejected' && <button onClick={() => setStat(w.id, 'Rejected')} className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 text-red-400 hover:bg-red-400/10"><X size={13} /> Reject</button>}
              <button onClick={() => del(w.id)} className="ml-auto px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 text-red-400 hover:bg-red-400/10"><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Detail({ k, v }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-cream/50">{k}</span>
      <span className="text-cream/90 text-right">{v || '—'}</span>
    </div>
  );
}
