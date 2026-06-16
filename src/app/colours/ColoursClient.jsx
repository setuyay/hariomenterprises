'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SITE } from '@/lib/config';
import { Search } from 'lucide-react';

const PAGE_SIZE = 60;

export default function ColoursClient() {
  const [families, setFamilies] = useState([]);
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState(null);
  const reqId = useRef(0);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchPage = useCallback(async (pageNum, replace) => {
    const id = ++reqId.current;
    setLoading(true);
    const params = new URLSearchParams({ page: String(pageNum), pageSize: String(PAGE_SIZE) });
    if (active !== 'All') params.set('family', active);
    if (debounced) params.set('q', debounced);
    const res = await fetch(`/api/colors?${params}`);
    const data = await res.json();
    if (id !== reqId.current) return; // stale response, ignore
    setTotal(data.total);
    if (data.families?.length) setFamilies(data.families);
    setItems(prev => (replace ? data.items : [...prev, ...data.items]));
    setLoading(false);
  }, [active, debounced]);

  // Reset to page 1 whenever filter or search changes.
  useEffect(() => { setPage(1); fetchPage(1, true); }, [active, debounced, fetchPage]);

  function loadMore() {
    const next = page + 1;
    setPage(next);
    fetchPage(next, false);
  }

  const hasMore = items.length < total;

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40"/>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search 2,000+ shades by name or hex…"
          className="w-full bg-ink-2 border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm focus:border-gold outline-none"
        />
      </div>

      {/* Family filters */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button onClick={() => setActive('All')}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${active==='All'?'btn-gold font-semibold':'glass hover:border-gold'}`}>
          All
        </button>
        {families.map(f => (
          <button key={f.family} onClick={() => setActive(f.family)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${active===f.family?'btn-gold font-semibold':'glass hover:border-gold'}`}>
            {f.family} <span className="opacity-50">{f.count}</span>
          </button>
        ))}
      </div>

      <p className="text-cream/40 text-xs mb-4">
        Showing {items.length.toLocaleString()} of {total.toLocaleString()} shades
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map(s => (
          <button key={s.id} onClick={() => setPicked(s)} className="group text-left">
            <div className="aspect-square rounded-2xl border border-white/10 group-hover:scale-105 transition-transform" style={{ background: s.hex }}/>
            <p className="mt-2 text-sm truncate">{s.name}</p>
            <p className="text-xs text-cream/40">{s.hex}</p>
          </button>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <p className="text-center text-cream/50 py-16">No shades match your search.</p>
      )}

      {(hasMore || loading) && (
        <div className="text-center mt-10">
          <button onClick={loadMore} disabled={loading}
            className="glass px-8 py-3 rounded-full text-sm font-semibold hover:border-gold disabled:opacity-50">
            {loading ? 'Loading…' : 'Load more shades'}
          </button>
        </div>
      )}

      {picked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70" onClick={() => setPicked(null)}>
          <div className="glass rounded-3xl p-8 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="aspect-video rounded-2xl mb-5" style={{ background: picked.hex }}/>
            <h3 className="font-display text-3xl">{picked.name}</h3>
            <p className="text-cream/50 text-sm">{picked.family} · {picked.hex}</p>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in the shade "${picked.name}" (${picked.hex}).`)}`}
              target="_blank" rel="noreferrer" className="btn-gold block text-center py-3 rounded-xl mt-6 font-semibold text-sm">Enquire about this shade</a>
            <button onClick={() => setPicked(null)} className="w-full text-center text-cream/50 text-sm mt-3">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
