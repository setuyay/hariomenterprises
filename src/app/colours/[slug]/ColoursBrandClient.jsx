'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SITE } from '@/lib/config';
import { Search, Heart, Copy, Download, Check } from 'lucide-react';
import { downloadColourCard } from '@/lib/colourCard';

const PAGE_SIZE = 60;
const FAV_KEY = 'he_fav_colours';
const chip = (active) => `px-4 py-2 rounded-full text-sm transition-colors ${active ? 'btn-gold font-semibold' : 'glass hover:border-gold'}`;

export default function ColoursBrandClient({ brand }) {
  const [families, setFamilies] = useState([]);
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState(null);
  const [favs, setFavs] = useState([]);
  const [showFavs, setShowFavs] = useState(false);
  const [copied, setCopied] = useState(false);
  const reqId = useRef(0);

  useEffect(() => { try { setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); } catch {} }, []);
  const favKey = (s) => `${s.name}|${s.hex}`;
  const isFav = (s) => favs.some((f) => favKey(f) === favKey(s));
  function toggleFav(s) {
    setFavs((prev) => {
      const exists = prev.some((f) => favKey(f) === favKey(s));
      const next = exists ? prev.filter((f) => favKey(f) !== favKey(s)) : [...prev, { name: s.name, hex: s.hex, family: s.family, brand: brand.name }];
      try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  useEffect(() => { const t = setTimeout(() => setDebounced(query.trim()), 300); return () => clearTimeout(t); }, [query]);

  const fetchPage = useCallback(async (pageNum, replace) => {
    const id = ++reqId.current;
    setLoading(true);
    const params = new URLSearchParams({ page: String(pageNum), pageSize: String(PAGE_SIZE), brand: brand.name });
    if (active !== 'All') params.set('family', active);
    if (debounced) params.set('q', debounced);
    const res = await fetch(`/api/colors?${params}`);
    const data = await res.json();
    if (id !== reqId.current) return;
    setTotal(data.total || 0);
    if (data.families?.length) setFamilies(data.families);
    setItems((prev) => (replace ? data.items : [...prev, ...data.items]));
    setLoading(false);
  }, [active, debounced, brand.name]);

  useEffect(() => { if (!showFavs) { setPage(1); fetchPage(1, true); } }, [active, debounced, showFavs, fetchPage]);

  function loadMore() { const n = page + 1; setPage(n); fetchPage(n, false); }
  const hasMore = items.length < total;

  async function copyHex(hex) {
    try { await navigator.clipboard.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  const brandFavs = favs.filter((f) => f.brand === brand.name);
  const grid = showFavs ? brandFavs : items;

  return (
    <div>
      {/* controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${brand.name} shades by name or hex…`}
            className="w-full bg-ink-2 border border-line rounded-full pl-11 pr-4 py-3 text-sm focus:border-gold outline-none" />
        </div>
        <button onClick={() => setShowFavs((v) => !v)}
          className={`px-4 py-2.5 rounded-full text-sm font-medium border inline-flex items-center gap-2 transition-colors ${showFavs ? 'bg-gold text-white border-gold' : 'border-line text-cream/70 hover:border-gold'}`}>
          <Heart size={15} className={showFavs ? 'fill-white' : ''} /> Favourites ({brandFavs.length})
        </button>
      </div>

      {!showFavs && (
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setActive('All')} className={chip(active === 'All')}>All</button>
          {families.map((f) => (
            <button key={f.family} onClick={() => setActive(f.family)} className={chip(active === f.family)}>
              {f.family} <span className="opacity-50">{f.count}</span>
            </button>
          ))}
        </div>
      )}

      {!showFavs && <p className="text-cream/40 text-xs mb-4">Showing {items.length.toLocaleString()} of {total.toLocaleString()} {brand.name} shades</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {grid.map((s, i) => (
          <div key={`${s.name}-${s.hex}-${i}`} className="group relative">
            <button onClick={() => setPicked(s)} className="block w-full text-left">
              <div className="aspect-square rounded-2xl border border-line group-hover:scale-105 transition-transform" style={{ background: s.hex }} />
              <p className="mt-2 text-sm truncate">{s.name}</p>
              <p className="text-xs text-cream/40">{s.hex}</p>
            </button>
            <button onClick={() => toggleFav(s)} aria-label="Favourite"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform">
              <Heart size={14} className={isFav(s) ? 'fill-nerolac text-nerolac' : 'text-cream/50'} />
            </button>
          </div>
        ))}
      </div>

      {grid.length === 0 && !loading && (
        <p className="text-center text-cream/50 py-16">{showFavs ? 'No favourites yet — tap the ♥ on any shade.' : 'No shades match your search.'}</p>
      )}

      {!showFavs && (hasMore || loading) && (
        <div className="text-center mt-10">
          <button onClick={loadMore} disabled={loading} className="glass px-8 py-3 rounded-full text-sm font-semibold hover:border-gold disabled:opacity-50">
            {loading ? 'Loading…' : 'Load more shades'}
          </button>
        </div>
      )}

      {/* shade preview modal */}
      {picked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70" onClick={() => setPicked(null)}>
          <div className="glass rounded-3xl p-7 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video rounded-2xl mb-5 relative" style={{ background: picked.hex }}>
              <button onClick={() => toggleFav(picked)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/85 flex items-center justify-center">
                <Heart size={16} className={isFav(picked) ? 'fill-nerolac text-nerolac' : 'text-cream/50'} />
              </button>
            </div>
            <h3 className="font-display text-3xl">{picked.name}</h3>
            <p className="text-cream/50 text-sm">{picked.family} · <span style={{ color: brand.color }} className="font-semibold">{brand.short}</span></p>
            <div className="flex items-center gap-2 mt-4">
              <button onClick={() => copyHex(picked.hex)} className="flex-1 glass py-2.5 rounded-xl text-sm font-medium hover:border-gold inline-flex items-center justify-center gap-2">
                {copied ? <><Check size={15} className="text-kamdhenu" /> Copied</> : <><Copy size={15} /> {picked.hex}</>}
              </button>
              <button onClick={() => downloadColourCard(picked, brand.name)} className="flex-1 glass py-2.5 rounded-xl text-sm font-medium hover:border-gold inline-flex items-center justify-center gap-2">
                <Download size={15} /> Card
              </button>
            </div>
            <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in the ${brand.name} shade "${picked.name}" (${picked.hex}).`)}`}
              target="_blank" rel="noreferrer" className="btn-gold block text-center py-3 rounded-xl mt-3 font-semibold text-sm">Enquire about this shade</a>
            <button onClick={() => setPicked(null)} className="w-full text-center text-cream/50 text-sm mt-3">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
