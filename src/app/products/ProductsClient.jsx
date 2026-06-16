'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

export default function ProductsClient({ brands, categories }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(sp.get('q') || '');
  const [brand, setBrand] = useState(sp.get('brand') || '');
  const [category, setCategory] = useState(sp.get('category') || '');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (brand) params.set('brand', brand);
    if (category) params.set('category', category);
    params.set('page', page);
    const res = await fetch(`/api/products?${params}`);
    setData(await res.json());
    setLoading(false);
  }, [q, brand, category, page]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);
  useEffect(() => { setPage(1); }, [q, brand, category]);

  const sel = 'bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none';

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-8">
      <aside className="space-y-5">
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3.5 text-cream/40"/>
            <input className={`${sel} w-full pl-9`} placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gold">Brand</label>
            <select className={`${sel} w-full mt-2`} value={brand} onChange={e=>setBrand(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(b=> <option key={b.id} value={b.id}>{b.brandName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-gold">Category</label>
            <select className={`${sel} w-full mt-2`} value={category} onChange={e=>setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {(q||brand||category) && (
            <button onClick={()=>{setQ('');setBrand('');setCategory('');}} className="text-xs text-gold underline">Clear filters</button>
          )}
        </div>
      </aside>
      <div>
        <p className="text-cream/50 text-sm mb-5">{data.total} product{data.total!==1?'s':''} found</p>
        {loading ? <p className="text-cream/40">Loading...</p> : data.items.length===0 ? (
          <p className="text-cream/40">No products match your filters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.items.map(p=> <ProductCard key={p.id} p={p}/>)}
          </div>
        )}
        {data.pages>1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({length:data.pages}).map((_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)}
                className={`w-10 h-10 rounded-full text-sm ${page===i+1?'btn-gold font-semibold':'glass hover:border-gold'}`}>{i+1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
