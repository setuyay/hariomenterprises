import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';
import { brandBySlug, BRANDS, CATEGORIES } from '@/lib/config';

export const dynamic = 'force-dynamic';

const catId = (c) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const b = brandBySlug(slug);
  if (!b) return { title: 'Brand not found' };
  return {
    title: `${b.name} — Products`,
    description: `Browse the full ${b.name} range at Hariom Enterprises, Mandla — interior, exterior, wood, metal, enamels, primers, putty and waterproofing.`,
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const info = brandBySlug(slug);
  if (!info) notFound();

  const brand = await prisma.brand.findFirst({ where: { brandName: info.name } });
  if (!brand) notFound();

  const products = await prisma.product.findMany({
    where: { brandId: brand.id },
    orderBy: { productName: 'asc' },
    include: { brand: true },
  });

  const byCat = {};
  for (const p of products) (byCat[p.category] ||= []).push(p);
  const cats = CATEGORIES.filter((c) => byCat[c]);

  return (
    <>
      <Navbar />
      <FloatingActions />

      {/* BRAND HERO */}
      <section className="pt-32 pb-12 text-white" style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}>
        <div className="shell">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Link href="/products" className="hover:text-white">Products</Link><span>/</span><span className="text-white">{info.name}</span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {brand.brandLogo
              ? <img src={brand.brandLogo} alt={info.name} className="h-14 bg-white rounded-xl p-2 object-contain" />
              : <span className="font-bold text-xs tracking-widest bg-white/20 backdrop-blur px-3 py-2 rounded-lg">{info.short}</span>}
            <h1 className="font-display text-4xl md:text-5xl">{info.name}</h1>
          </div>
          {brand.description && <p className="text-white/85 max-w-2xl mt-4 leading-relaxed">{brand.description}</p>}
          <p className="text-white/70 text-sm mt-3">{products.length} products · {cats.length} categories</p>

          {/* other brands */}
          <div className="flex gap-2 mt-6">
            {BRANDS.filter((b) => b.slug !== slug).map((b) => (
              <Link key={b.slug} href={`/brands/${b.slug}`} className="text-xs font-semibold bg-white/15 hover:bg-white/25 backdrop-blur px-4 py-2 rounded-full transition-colors">{b.name} →</Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY QUICK-NAV */}
      {cats.length > 0 && (
        <section className="shell py-6 border-b border-line">
          <div className="flex gap-2 flex-wrap">
            {cats.map((c) => (
              <a key={c} href={`#${catId(c)}`} className="glass px-4 py-2 rounded-full text-sm hover:border-gold transition-colors">
                {c} <span className="text-cream/40">{byCat[c].length}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* PRODUCTS BY CATEGORY */}
      {cats.length === 0 ? (
        <section className="shell py-20"><p className="text-cream/50">No products listed for this brand yet.</p></section>
      ) : cats.map((c) => (
        <section key={c} id={catId(c)} className="shell py-12 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-display text-3xl">{c}</h2>
            <Link href={`/products?brand=${brand.id}&category=${encodeURIComponent(c)}`} className="text-gold text-sm font-semibold hover:underline whitespace-nowrap">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {byCat[c].map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      ))}

      <Footer />
    </>
  );
}
