'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldCheck, PackageSearch } from 'lucide-react';
import WarrantyStatusBadge from '@/components/WarrantyStatusBadge';

const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const validTill = (purchaseDate) => {
  const d = new Date(purchaseDate);
  d.setFullYear(d.getFullYear() + 5);
  return fmt(d);
};

export default function WarrantyStatusClient({ initialWarrantyId = '' }) {
  const [mode, setMode] = useState('warrantyId'); // 'warrantyId' | 'mobile'
  const [query, setQuery] = useState(initialWarrantyId);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = useCallback(async (m, q) => {
    const value = (q ?? '').trim();
    if (!value) { setError('Please enter a value to search.'); return; }
    setLoading(true); setError(''); setResults(null);
    try {
      const param = m === 'mobile' ? `mobile=${encodeURIComponent(value)}` : `warrantyId=${encodeURIComponent(value)}`;
      const res = await fetch(`/api/warranty/track?${param}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setResults(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-search when arriving from a QR/verify link.
  useEffect(() => {
    if (initialWarrantyId) search('warrantyId', initialWarrantyId);
  }, [initialWarrantyId, search]);

  const inp = 'w-full bg-white/70 backdrop-blur border border-line rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold focus:bg-white transition-colors';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass backdrop-blur-md rounded-2xl p-6 md:p-7 border border-line">
        {/* mode toggle */}
        <div className="inline-flex bg-white/60 border border-line rounded-full p-1 mb-5">
          {[['warrantyId', 'Warranty ID'], ['mobile', 'Mobile Number']].map(([m, label]) => (
            <button key={m} type="button" onClick={() => { setMode(m); setResults(null); setError(''); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${mode === m ? 'btn-gold' : 'text-cream/60 hover:text-gold'}`}>
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); search(mode, query); }} className="flex flex-col sm:flex-row gap-3">
          <input className={inp} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'warrantyId' ? 'e.g. HE-2026-00001' : 'Registered 10-digit mobile'} />
          <button disabled={loading} className="btn-gold px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 shrink-0">
            <Search size={16} /> {loading ? 'Searching…' : 'Track'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {/* results */}
      {results && results.length === 0 && (
        <div className="glass rounded-2xl p-8 mt-6 text-center text-cream/60 border border-line">
          <PackageSearch className="mx-auto text-gold mb-3" size={32} />
          No warranty found for that {mode === 'mobile' ? 'mobile number' : 'Warranty ID'}. Double-check and try again.
        </div>
      )}

      <div className="space-y-4 mt-6">
        {results && results.map((w) => (
          <motion.div key={w.warrantyId} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="glass rounded-2xl p-6 border border-line">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="font-mono font-bold text-gold">{w.warrantyId}</p>
                <h3 className="font-display text-xl mt-0.5">{w.customerName}</h3>
              </div>
              <WarrantyStatusBadge status={w.status} />
            </div>
            <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
              <div className="flex justify-between gap-3"><span className="text-cream/50">Product</span><span className="text-cream/90 text-right">{w.brandName} — {w.productName}</span></div>
              <div className="flex justify-between gap-3"><span className="text-cream/50">Registered</span><span className="text-cream/90">{fmt(w.createdAt)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-cream/50">Purchased</span><span className="text-cream/90">{fmt(w.purchaseDate)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-cream/50">Warranty valid till</span><span className="text-cream/90 inline-flex items-center gap-1"><ShieldCheck size={14} className="text-kamdhenu" /> {validTill(w.purchaseDate)}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
