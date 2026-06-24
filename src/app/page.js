import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import FloatingActions from '@/components/FloatingActions';
import HeroSlider from '@/components/HeroSlider';
import QuoteForm from '@/components/QuoteForm';
import { prisma } from '@/lib/prisma';
import { CATEGORIES, SITE, STATS, REVIEWS, BRANCHES, BRAND_COLORS } from '@/lib/config';
import { ShieldCheck, Sparkles, Truck, Award, Quote, MapPin, Phone, Star, Lock,
  Home as HomeIcon, Building2, Droplets, Layers, Hammer, Ruler, Paintbrush, PaintRoller, SprayCan, Brush, Wrench, Tag, Gift } from 'lucide-react';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

export const dynamic = 'force-dynamic';

async function getData() {
  const [brands, featured, allOffers] = await Promise.all([
    prisma.brand.findMany({ orderBy: { brandName: 'asc' } }),
    prisma.product.findMany({ take: 6, orderBy: { createdAt: 'desc' }, include: { brand: true } }),
    prisma.offer.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } }),
  ]);
  // Offer validity is by calendar date in IST (the server clock is UTC), so compare
  // YYYY-MM-DD strings rather than raw instants to avoid timezone off-by-one bugs.
  const istToday = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  const dateStr = (d) => (d ? new Date(d).toISOString().slice(0, 10) : null);
  const offers = allOffers.filter(o => {
    const start = dateStr(o.startDate), end = dateStr(o.endDate);
    return (!start || start <= istToday) && (!end || end >= istToday);
  });
  return { brands, featured, offers };
}

const TICKER = ['Nerolac', 'MRF Paints', 'Kamdhenu', '2,000+ Shades', 'Interior', 'Exterior', 'Waterproofing', 'Wood & Metal', 'Free Site Visit', 'Shade Matching'];

const SERVICES = [
  [HomeIcon, 'Interior Painting', 'Walls, ceilings and rooms finished flawlessly with premium emulsions.'],
  [Building2, 'Exterior Painting', 'Weatherproof exterior coats that protect and beautify your facade.'],
  [Droplets, 'Waterproofing', 'Terraces, walls and wet areas sealed against leaks and damp.', '/waterproofing'],
  [Layers, 'Texture & Designer Finishes', 'Statement walls with textures, metallics and designer effects.'],
  [Hammer, 'Wood & Metal Polishing', 'PU, melamine and enamel finishes for furniture, doors and grills.'],
  [Ruler, 'Free Site Consultation', 'Free site visit, shade matching and a clear estimate before you start.'],
];

const TOOLS = [
  [Paintbrush, 'Brushes', 'Synthetic and natural-bristle brushes in every size.'],
  [PaintRoller, 'Rollers & Trays', 'Foam, fabric and textured rollers with trays.'],
  [SprayCan, 'Spray Equipment', 'Spray guns and accessories for a smooth finish.'],
  [Layers, 'Putty & Fillers', 'Wall putty, fillers and crack-fill compounds.'],
  [Brush, 'Sandpaper & Abrasives', 'Sheets, blocks and abrasives for surface prep.'],
  [Wrench, 'Masking & Sundries', 'Masking tape, sheets, scrapers and sundries.'],
];

const GALLERY = [
  ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=70&auto=format&fit=crop', 'Living Room'],
  ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=70&auto=format&fit=crop', 'Modern Interior'],
  ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=70&auto=format&fit=crop', 'Minimal Bedroom'],
  ['https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=70&auto=format&fit=crop', 'Cozy Lounge'],
  ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=70&auto=format&fit=crop', 'Bright Living'],
  ['https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&q=70&auto=format&fit=crop', 'Accent Wall'],
  ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=70&auto=format&fit=crop', 'Dining Space'],
  ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=70&auto=format&fit=crop', 'Designer Room'],
];

export default async function Home() {
  const { brands, featured, offers } = await getData();
  return (
    <>
      <Navbar />
      <FloatingActions />

      <HeroSlider />

      {/* TICKER */}
      <div className="bg-night text-white overflow-hidden whitespace-nowrap py-3">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="font-display text-base">{t} <span className="text-sun">✦</span></span>
          ))}
        </div>
      </div>

      {/* STAT BAND */}
      <section className="bg-night text-white py-14">
        <div className="shell grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <b className="font-display text-3xl md:text-4xl text-sun block leading-none">{s.value}</b>
              <span className="block mt-2 text-white/70 text-sm leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* OFFERS */}
      {offers.length > 0 && (
        <section id="offers" className="shell py-20">
          <div className="kicker mono"><span className="l"></span>Limited-time offers</div>
          <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
            <h2 className="font-display text-4xl flex items-center gap-3"><Gift className="text-gold" size={32}/> Current offers &amp; deals</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map(o => (
              <div key={o.id} className="glass rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition-transform border-l-4 border-gold">
                {o.image
                  ? <img src={o.image} alt={o.title} className="h-44 w-full object-cover"/>
                  : <div className="h-44 w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e8472b,#ff7a45)' }}><Gift className="text-white/90" size={44}/></div>}
                <div className="p-6 flex flex-col flex-1">
                  {o.discount && <span className="self-start bg-night text-sun font-display text-lg px-3 py-1 rounded-lg mb-3">{o.discount}</span>}
                  <h3 className="font-display text-2xl mb-1">{o.title}</h3>
                  {o.description && <p className="text-cream/70 text-sm leading-relaxed flex-1">{o.description}</p>}
                  <div className="flex items-center gap-3 flex-wrap mt-4">
                    {o.code && <span className="inline-flex items-center gap-1.5 border-2 border-dashed border-gold/50 text-gold font-semibold tracking-wide px-3 py-1.5 rounded-lg text-sm"><Tag size={14}/> {o.code}</span>}
                    {o.endDate && <span className="text-cream/50 text-xs">Valid till {fmtDate(o.endDate)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BRANDS */}
      <section className="shell py-20">
        <div className="kicker mono"><span className="l"></span>Authorized dealer</div>
        <h2 className="font-display text-4xl mb-10">Trusted names we carry</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map(b => (
            <div key={b.id} className="glass rounded-2xl p-6 border-l-4" style={{ borderLeftColor: BRAND_COLORS[b.brandName] || '#e8472b' }}>
              <h3 className="font-display text-2xl" style={{ color: BRAND_COLORS[b.brandName] || '#e8472b' }}>{b.brandName}</h3>
              {b.category && <span className="inline-block mt-1 text-xs font-semibold tracking-wide uppercase text-cream/50">{b.category}</span>}
              <p className="text-cream/70 text-sm mt-3 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="shell pb-4">
        <div className="kicker mono"><span className="l"></span>Categories</div>
        <h2 className="font-display text-4xl mb-10">Shop by type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map(c => (
            <Link key={c} href={`/products?category=${encodeURIComponent(c)}`}
              className="group glass rounded-2xl p-7 hover:-translate-y-1 transition-transform">
              <Sparkles className="text-gold mb-3 group-hover:scale-110 transition-transform"/>
              <h3 className="font-display text-xl">{c}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="shell py-20">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="kicker mono"><span className="l"></span>The catalogue</div>
            <h2 className="font-display text-4xl">Latest products</h2>
          </div>
          <Link href="/products" className="text-gold font-semibold border-b-2 border-gold/40 pb-1 hover:border-gold">View all 62 →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(p => <ProductCard key={p.id} p={p}/>)}
        </div>
      </section>

      {/* PAINTING SERVICES */}
      <section id="services" className="shell py-20">
        <div className="kicker mono"><span className="l"></span>Painting services</div>
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <h2 className="font-display text-4xl">We don’t just sell paint — we get it done.</h2>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi Hariom Enterprises, I need a painting service quote.')}`} target="_blank" rel="noreferrer" className="btn-gold px-6 py-2.5 rounded-full text-sm font-semibold">Book a free site visit</a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(([Icon, t, d, href], i) => {
            const inner = (
              <>
                <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#f4ecdd] text-gold mb-4"><Icon size={22}/></span>
                <h3 className="font-display text-xl mb-1">{t}</h3>
                <p className="text-cream/65 text-sm leading-relaxed">{d}</p>
                {href && <span className="inline-flex items-center gap-1 text-gold text-sm font-semibold mt-3">Learn more →</span>}
              </>
            );
            return href ? (
              <Link key={i} href={href} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform block">{inner}</Link>
            ) : (
              <div key={i} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform">{inner}</div>
            );
          })}
        </div>
      </section>

      {/* PAINTING TOOLS */}
      <section id="tools" className="bg-[#f4ecdd] py-20">
        <div className="shell">
          <div className="kicker mono"><span className="l"></span>Painting tools & accessories</div>
          <h2 className="font-display text-4xl mb-3">Everything you need to paint.</h2>
          <p className="text-cream/60 max-w-xl mb-10">Brushes, rollers, putties, abrasives and sundries — all in stock alongside our paints.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {TOOLS.map(([Icon, t, d], i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <Icon className="text-gold mb-3" size={26}/>
                <h3 className="font-display text-lg mb-1">{t}</h3>
                <p className="text-cream/65 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi Hariom Enterprises, I want to ask about painting tools & accessories.')}`} target="_blank" rel="noreferrer" className="btn-wa inline-block px-6 py-3 rounded-full text-sm font-semibold">Ask about tools on WhatsApp</a>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="bg-[#f4ecdd] py-20">
        <div className="shell">
          <div className="kicker mono"><span className="l"></span>Why Hariom Enterprises</div>
          <h2 className="font-display text-4xl mb-12">A name your neighbourhood paints with.</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[[ShieldCheck, '100%', 'Genuine, sealed stock — never repacked.'],
              [Sparkles, '2,000', 'Shades across every colour family.'],
              [Award, '3-in-1', 'Nerolac, MRF & Kamdhenu under one roof.'],
              [Truck, 'Free', 'Site visits, estimates & shade matching.']].map(([Icon, big, d], i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <Icon className="text-gold mb-4" size={30}/>
                <b className="font-display text-3xl text-gold block">{big}</b>
                <p className="text-cream/70 text-sm mt-1">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN INSPIRATION GALLERY */}
      <section className="shell py-20">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-10">
          <div>
            <div className="kicker mono"><span className="l"></span>Design inspiration</div>
            <h2 className="font-display text-4xl">Spaces brought to life with colour.</h2>
          </div>
          <Link href="/visualizer" className="text-gold font-semibold border-b-2 border-gold/40 pb-1 hover:border-gold">Try the visualizer →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {GALLERY.map(([src, label], i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl aspect-[4/5]">
              <img src={src} alt={label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"/>
              <span className="absolute bottom-3 left-4 right-4 text-white font-display text-lg leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="shell py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <div className="kicker mono"><span className="l"></span>Customer love · Mandla</div>
            <h2 className="font-display text-4xl">Trusted across Mandla.</h2>
          </div>
          <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4">
            <b className="font-display text-4xl text-gold leading-none">4.9</b>
            <div>
              <div className="text-sun flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={15} fill="currentColor"/>)}</div>
              <small className="text-cream/50 text-xs">Based on happy local customers</small>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <figure key={i} className="glass rounded-2xl p-6 flex flex-col gap-3">
              <div className="text-sun flex gap-0.5">{[...Array(5)].map((_, k) => <Star key={k} size={15} fill="currentColor"/>)}</div>
              <Quote className="text-gold" size={18}/>
              <blockquote className="text-cream/80 leading-relaxed flex-1">{r.text}</blockquote>
              <figcaption className="flex items-center gap-3 mt-1">
                <span className="w-10 h-10 rounded-full text-white font-display font-bold flex items-center justify-center" style={{ background: r.color }}>{r.name[0]}</span>
                <span><b className="font-display block">{r.name}</b><small className="text-cream/50 text-xs">{r.area}</small></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* BRANCHES */}
      <section id="visit" className="shell py-10">
        <div className="kicker mono"><span className="l"></span>Come say hello</div>
        <h2 className="font-display text-4xl mb-3">Our branches.</h2>
        <p className="text-cream/60 max-w-xl mb-8">Two locations to serve you better. Call, message on WhatsApp, or get directions to the branch nearest you.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {BRANCHES.map((br, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden flex flex-col">
              <div className="p-6">
                <span className="inline-block bg-[#f4ecdd] text-gold text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full mb-3">{br.tag}</span>
                <h3 className="font-display text-2xl mb-3">{br.name}</h3>
                <p className="flex items-start gap-2 text-cream/75 text-sm mb-3"><MapPin size={18} className="text-nerolac mt-0.5 shrink-0"/> {br.address}</p>
                <p className="flex items-center gap-2 text-cream/75 text-sm"><Phone size={16} className="text-mrf shrink-0"/> <a href={`tel:${br.phone}`} className="font-semibold hover:text-gold">{br.phone}</a> · {br.hours}</p>
                <div className="flex gap-2.5 flex-wrap mt-5">
                  <a href={`tel:${br.phone}`} className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold">Call</a>
                  <a href={`https://wa.me/${br.whatsapp || SITE.whatsapp}?text=Hi%20Hariom%20Enterprises%20(${encodeURIComponent(br.tag)})`} target="_blank" rel="noreferrer" className="btn-wa px-5 py-2.5 rounded-full text-sm font-semibold">WhatsApp</a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${br.coords}`} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-2.5 rounded-full text-sm font-semibold">Get directions →</a>
                </div>
              </div>
              <iframe title={br.tag} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${br.coords}&z=16&output=embed`}
                className="w-full h-56 border-0 mt-auto"/>
            </div>
          ))}
        </div>

        {/* QUOTE / CONTRACTOR BAND */}
        <div className="rounded-3xl p-8 md:p-12 mt-8 text-white" style={{ background: 'linear-gradient(135deg,#e8472b,#ff7a45)' }}>
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-2">Request a free quote or site visit</h2>
              <p className="text-white/90 max-w-md mb-5">Tell us about your project — we'll recommend the right brand and product and give a clear estimate.</p>
              <Link href="/contractor" className="inline-block bg-night text-white font-semibold px-6 py-3 rounded-full hover:bg-black transition-colors">Are you a contractor? Open an account →</Link>
            </div>
            <QuoteForm/>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="shell py-20">
        <div className="kicker mono"><span className="l"></span>Helpful tools</div>
        <h2 className="font-display text-4xl mb-10">Plan your project</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[['Colour Palettes', 'Browse 2,000+ curated shades and find your perfect colour.', '/colours'],
            ['3D AI Visualizer', 'Paint a 3D room or your own photo with 2,000+ shades.', '/visualizer'],
            ['Calculators', 'Estimate paint & waterproofing quantity and cost.', '/calculators']].map(([t, d, h]) => (
            <Link key={h} href={h} className="group glass rounded-2xl p-8 hover:-translate-y-1 transition-transform">
              <Sparkles className="text-gold mb-3 group-hover:scale-110 transition-transform"/>
              <h3 className="font-display text-2xl">{t}</h3>
              <p className="text-cream/60 text-sm mt-2">{d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ADMIN ACCESS */}
      <div className="shell pb-12 text-center">
        <Link href="/admin/login" className="btn-ghost inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold">
          <Lock size={15}/> Admin Login
        </Link>
      </div>

      <Footer />
    </>
  );
}
