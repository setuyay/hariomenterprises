import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { SITE } from '@/lib/config';
import {
  Paintbrush, PaintRoller, SprayCan, Layers, Brush, Wrench, Ruler, Hammer,
  ShieldCheck, Truck, BadgeCheck, MessageCircle, Phone,
} from 'lucide-react';

export const metadata = {
  title: 'Painting Tools & Accessories',
  description: 'Brushes, rollers, spray equipment, putty, abrasives, masking and sundries — all the professional painting tools and accessories you need, in stock at Hariom Enterprises, Mandla.',
};

const U = (id) => `https://images.unsplash.com/photo-${id}?w=700&q=72&auto=format&fit=crop`;
const TOOLS = [
  [Paintbrush, 'Brushes', 'Synthetic and natural-bristle brushes in every size, for cutting-in, trims and fine detail work.'],
  [PaintRoller, 'Rollers & Trays', 'Foam, fabric and textured rollers with trays for fast, even coverage on walls and ceilings.'],
  [SprayCan, 'Spray Equipment', 'Spray guns and accessories for a flawless, professional finish on large surfaces.'],
  [Layers, 'Putty & Fillers', 'Wall putty, fillers and crack-fill compounds for a smooth, sealed base before painting.'],
  [Brush, 'Sandpaper & Abrasives', 'Sheets, blocks and abrasives for surface prep and silky between-coat smoothing.'],
  [Wrench, 'Masking & Sundries', 'Masking tape, drop sheets, dust sheets and the small sundries that make a clean job.'],
  [Hammer, 'Scrapers & Putty Knives', 'Scrapers, putty knives and chisels for prep, repair and removing old finishes.'],
  [Ruler, 'Mixing & Measuring', 'Mixing paddles, measuring jugs and stirrers for the perfect consistency every time.'],
];

// Only confirmed, correctly-matched painting photos
const ACTION = [
  [U('1562259949-e8e7689d7828'), 'Rolling on a fresh coat'],
  [U('1599619585752-c3edb42a414c'), 'Roller tray, ready to go'],
  [U('1607400201515-c2c41c07d307'), 'Sealing &amp; filling'],
  [U('1589939705384-5185137a7f0f'), 'The right kit for the job'],
];

const PERKS = [
  [BadgeCheck, 'Genuine quality', 'Trusted, durable tools that last project after project.'],
  [ShieldCheck, 'Pro & DIY ready', 'The right kit whether you are a contractor or a first-timer.'],
  [Truck, 'In stock & local', 'Alongside our paints — pick up everything in one trip.'],
];

export default function PaintingToolsPage() {
  const waText = 'Hi Hariom Enterprises, I want to ask about painting tools & accessories.';
  return (
    <>
      <Navbar />
      <FloatingActions />

      {/* HERO */}
      <section className="shell pt-36 pb-16">
        <div className="kicker mono"><span className="l"></span>Painting tools &amp; accessories</div>
        <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-5 max-w-2xl">Everything you need to <span className="text-gold">paint it right.</span></h1>
        <p className="text-cream/65 max-w-xl mb-7 md:text-lg leading-relaxed">Brushes, rollers, spray gear, putties, abrasives and sundries — all in stock alongside our paints, so your project never stalls for a missing tool.</p>
        <div className="flex gap-4 flex-wrap">
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="btn-wa inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full"><MessageCircle size={17} /> Ask on WhatsApp</a>
          <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-2 btn-ghost font-semibold px-7 py-3.5 rounded-full"><Phone size={16} /> Call now</a>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="shell pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLS.map(([Icon, t, d], i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#f4ecdd] text-gold mb-4"><Icon size={22} /></span>
              <h3 className="font-display text-xl mb-1">{t}</h3>
              <p className="text-cream/65 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        {/* TOOLS IN ACTION — real photos */}
        <div className="mt-16">
          <div className="kicker mono"><span className="l"></span>Tools in action</div>
          <h2 className="font-display text-3xl md:text-4xl mb-8">Built for a flawless finish.</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTION.map(([src, cap], i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
                <img src={src} alt={cap} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
                <span className="absolute bottom-3 left-4 right-4 text-white text-sm font-display" dangerouslySetInnerHTML={{ __html: cap }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERKS + CTA */}
      <section className="bg-[#f4ecdd] py-20">
        <div className="shell grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="kicker mono"><span className="l"></span>Why buy here</div>
            <h2 className="font-display text-4xl mb-6">Tools that match our paints.</h2>
            <div className="grid sm:grid-cols-1 gap-4">
              {PERKS.map(([Icon, t, d], i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-white text-gold shrink-0"><Icon size={20} /></span>
                  <div>
                    <h3 className="font-display text-lg">{t}</h3>
                    <p className="text-cream/65 text-sm">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl p-8 md:p-10 text-white" style={{ background: 'linear-gradient(135deg,#e8472b,#ff7a45)' }}>
            <h3 className="font-display text-3xl mb-2">Need a tool list for your project?</h3>
            <p className="text-white/90 mb-6 max-w-md">Tell us what you&apos;re painting and we&apos;ll put together the right brushes, rollers and prep kit — ready to collect.</p>
            <div className="flex gap-3 flex-wrap">
              <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="btn-wa inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full"><MessageCircle size={16} /> WhatsApp us</a>
              <Link href="/products" className="inline-flex items-center gap-2 bg-night text-white font-semibold px-6 py-3 rounded-full hover:bg-black transition-colors">Browse paints →</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
