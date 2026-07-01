import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ColoursBrandClient from './ColoursBrandClient';
import { brandBySlug, BRANDS } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const b = brandBySlug(slug);
  if (!b) return { title: 'Colours not found' };
  return {
    title: `${b.name} Colours — Shade Collection`,
    description: `Browse the ${b.name} colour collection at Hariom Enterprises. Search shades, preview, favourite, copy shade codes and download colour cards.`,
  };
}

export default async function BrandColoursPage({ params }) {
  const { slug } = await params;
  const info = brandBySlug(slug);
  if (!info) notFound();

  return (
    <>
      <Navbar />
      <FloatingActions />
      <section className="shell pt-36 pb-20">
        <div className="flex items-center gap-2 text-cream/50 text-sm mb-4">
          <Link href="/colours" className="hover:text-gold">Colours</Link><span>/</span><span className="text-cream">{info.name}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold tracking-widest text-white px-2.5 py-1 rounded-md" style={{ background: info.color }}>{info.short}</span>
          <h1 className="font-display text-4xl md:text-5xl">{info.name} Colours</h1>
        </div>
        <p className="text-cream/60 max-w-xl mb-6">Search the {info.name} shade collection, preview any colour, save favourites, copy shade codes and download colour cards.</p>

        <div className="flex gap-2 mb-10">
          {BRANDS.filter((b) => b.slug !== slug).map((b) => (
            <Link key={b.slug} href={`/colours/${b.slug}`} className="glass px-4 py-1.5 rounded-full text-xs font-semibold hover:border-gold inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: b.color }} /> {b.name}
            </Link>
          ))}
        </div>

        <ColoursBrandClient brand={info} />
      </section>
      <Footer />
    </>
  );
}
