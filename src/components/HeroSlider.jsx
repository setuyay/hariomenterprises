import Link from 'next/link';
import { ShieldCheck, MessageCircle, IndianRupee, Truck } from 'lucide-react';

const FEATS = [
  [ShieldCheck, 'Genuine products'],
  [MessageCircle, 'Trusted advice'],
  [IndianRupee, 'Transparent pricing'],
  [Truck, 'Doorstep delivery'],
];

const MENU = [
  ['🎨', 'Colours', 'Explore a wide range of beautiful colours.', '/colours'],
  ['🛋️', 'Visualizer', 'See how colours look in your space.', '/visualizer'],
  ['🧮', 'Calculators', 'Estimate paint quantity and project cost.', '/calculators'],
  ['👷', 'Find a Contractor', 'Connect with trusted painting professionals.', '/find-contractor'],
  ['🏷️', 'Offers', 'Discover exciting offers and deals.', '/#offers'],
  ['🛡️', 'Waterproofing', 'Protect your walls from dampness and leaks.', '/waterproofing'],
];

export default function HeroSlider() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden border-b border-line"
      style={{ background: 'linear-gradient(135deg,#1a1414 0%,#2a1714 48%,#3a1d18 100%)' }}>
      {/* subtle brand glows */}
      <div className="pointer-events-none absolute -right-40 top-0 w-[42rem] h-[42rem] rounded-full bg-gold/15 blur-3xl"/>
      <div className="pointer-events-none absolute -left-32 bottom-0 w-[34rem] h-[34rem] rounded-full bg-gold/10 blur-3xl"/>

      <div className="shell relative z-10 w-full py-28 lg:py-20 text-white">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          {/* LEFT — copy */}
          <div>
            <span className="inline-block text-[.66rem] font-semibold tracking-[.16em] uppercase bg-white/12 text-white border border-white/25 backdrop-blur px-4 py-2 rounded-full mb-5">Authorized Dealer · Nerolac · MRF · Kamdhenu</span>
            <h1 className="font-display fluid-hero">Har Deewar Se Jude<br/>Jazbaat Aur Rang.<br/><em className="not-italic text-sun">Hariom Enterprises<br/>Bharose Ke Sang.</em></h1>
            <p className="mt-5 max-w-[46ch] text-white/80 leading-relaxed text-base md:text-lg">Genuine paints, expert shade matching and honest pricing — everything your project needs, under one roof.</p>
            <div className="flex gap-x-5 gap-y-4 flex-wrap mt-7">
              {FEATS.map(([Icon, label], k) => (
                <div key={k} className="flex items-center gap-2.5 max-w-[170px]">
                  <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-gold shrink-0"><Icon size={18}/></span>
                  <span className="text-sm font-medium leading-tight text-white/90">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 flex-wrap mt-8">
              <Link href="/products" className="btn-gold inline-block font-semibold px-7 py-3.5 rounded-full">Explore products</Link>
              <Link href="/contact" className="inline-block border border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white hover:text-night transition-colors">Get a quote</Link>
            </div>
          </div>

          {/* RIGHT — floating glass menu panel (right-aligned) */}
          <div className="lg:justify-self-end w-full max-w-lg bg-white/[0.07] backdrop-blur-md rounded-[1.75rem] border border-white/15 p-4 sm:p-6 shadow-[0_30px_80px_-22px_rgba(0,0,0,.55)]">
            <h2 className="font-display text-2xl sm:text-3xl leading-tight mb-4 sm:mb-5"><span className="text-gold">Transform</span> <span className="text-white">your space</span></h2>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3.5">
              {MENU.map(([emoji, title, desc, href]) => (
                <Link key={href} href={href}
                  className="group bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl p-3 flex flex-col items-center text-center transition-all hover:-translate-y-1">
                  <span className="text-2xl sm:text-3xl mb-1.5" aria-hidden>{emoji}</span>
                  <h3 className="font-display text-sm text-gold leading-tight">{title}</h3>
                  <p className="text-white/70 text-[11px] mt-1 leading-snug flex-1">{desc}</p>
                  <span className="mt-2.5 w-7 h-7 rounded-full border border-white/50 text-white flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-colors text-sm">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
