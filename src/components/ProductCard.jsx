import Link from 'next/link';
import { brandByName } from '@/lib/config';

function parseJSON(s, fallback) {
  try { return JSON.parse(s || ''); } catch { return fallback; }
}

export default function ProductCard({ p }) {
  const brand = brandByName(p.brand?.brandName);
  const specs = parseJSON(p.specs, {});

  return (
    <Link href={`/products/${p.id}`} className="group glass rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-500 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
        <img src={p.image || '/uploads/sample-product.svg'} alt={p.productName} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        {brand && (
          <span className="absolute top-3 left-3 text-[10px] font-bold tracking-widest text-white px-2.5 py-1 rounded-md shadow" style={{ background: brand.color }}>
            {brand.short}
          </span>
        )}
        <span className="absolute top-3 right-3 text-[10px] tracking-widest uppercase bg-ink/70 backdrop-blur px-2.5 py-1 rounded-full text-gold">{p.category}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl group-hover:text-gold transition-colors">{p.productName}</h3>
        <p className="text-sm text-cream/60 mt-2 line-clamp-2">{p.description}</p>

        {(specs.finish || specs.coverage || specs.packSizes) && (
          <dl className="mt-3 space-y-1 text-xs">
            {specs.finish && <div className="flex gap-2"><dt className="text-cream/40 w-16 shrink-0">Finish</dt><dd className="text-cream/65 truncate">{specs.finish}</dd></div>}
            {specs.coverage && <div className="flex gap-2"><dt className="text-cream/40 w-16 shrink-0">Coverage</dt><dd className="text-cream/65 truncate">{specs.coverage}</dd></div>}
            {specs.packSizes && <div className="flex gap-2"><dt className="text-cream/40 w-16 shrink-0">Packs</dt><dd className="text-cream/65 truncate">{specs.packSizes}</dd></div>}
          </dl>
        )}

        <span className="inline-block mt-4 text-xs tracking-widest uppercase text-gold border-b border-gold/40 pb-0.5 self-start">View Details →</span>
      </div>
    </Link>
  );
}
