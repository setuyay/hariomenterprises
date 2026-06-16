import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ p }) {
  return (
    <Link href={`/products/${p.id}`} className="group glass rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
        <Image src={p.image || '/uploads/sample-product.svg'} alt={p.productName} fill
          className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width:768px) 100vw, 33vw" loading="lazy"/>
        <span className="absolute top-3 left-3 text-[10px] tracking-widest uppercase bg-ink/70 backdrop-blur px-3 py-1 rounded-full text-gold">{p.category}</span>
      </div>
      <div className="p-5">
        <p className="text-xs text-cream/50 tracking-widest uppercase">{p.brand?.brandName}</p>
        <h3 className="font-display text-xl mt-1 group-hover:text-gold transition-colors">{p.productName}</h3>
        <p className="text-sm text-cream/60 mt-2 line-clamp-2">{p.description}</p>
        <span className="inline-block mt-4 text-xs tracking-widest uppercase text-gold border-b border-gold/40 pb-0.5">View Details →</span>
      </div>
    </Link>
  );
}
