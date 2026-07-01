import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { prisma } from '@/lib/prisma';
import { BRANDS } from '@/lib/config';
import { Palette, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Colour Collections — Nerolac, Kamdhenu & MRF Shades',
  description: 'Explore colour collections by brand — Nerolac, Kamdhenu and MRF shades. Search, preview, favourite, copy shade codes and download colour cards at Hariom Enterprises, Mandla.',
};

export default async function ColoursHub() {
  // raw count keeps this resilient regardless of Prisma client regeneration
  let counts = {};
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT brand, COUNT(*)::int AS c FROM color_shades WHERE brand IS NOT NULL GROUP BY brand');
    counts = Object.fromEntries(rows.map((r) => [r.brand, r.c]));
  } catch { counts = {}; }

  return (
    <>
      <Navbar />
      <FloatingActions />
      <section className="shell pt-36 pb-20">
        <div className="kicker mono"><span className="l"></span>Colour collections</div>
        <h1 className="font-display text-4xl md:text-5xl mb-4 max-w-2xl">Find your perfect shade.</h1>
        <p className="text-cream/60 max-w-xl mb-12">Browse colour collections by brand. Search, preview, favourite your picks, copy shade codes and download colour cards.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {BRANDS.map((b) => (
            <Link key={b.slug} href={`/colours/${b.slug}`} className="group rounded-3xl overflow-hidden border border-line hover:-translate-y-1 transition-transform">
              <div className="h-40 relative" style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}aa)` }}>
                <Palette className="absolute top-5 left-5 text-white/80" size={28} />
                <span className="absolute bottom-4 left-5 text-white/90 text-xs font-bold tracking-widest bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">{b.short}</span>
              </div>
              <div className="glass p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl">{b.name}</h3>
                  <p className="text-cream/50 text-sm mt-1">{(counts[b.name] || 0).toLocaleString()} shades</p>
                </div>
                <ArrowRight className="text-gold group-hover:translate-x-1 transition-transform" size={22} />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
