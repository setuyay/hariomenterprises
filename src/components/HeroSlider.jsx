import Link from 'next/link';
import { ShieldCheck, MessageCircle, IndianRupee, Truck } from 'lucide-react';

const FEATS = [
  [ShieldCheck, 'Genuine products'],
  [MessageCircle, 'Trusted advice'],
  [IndianRupee, 'Transparent pricing'],
  [Truck, 'Doorstep delivery'],
];

export default function HeroSlider() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-white border-b border-line">
      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full py-32 text-night">
        <span className="inline-block text-[.66rem] font-semibold tracking-[.16em] uppercase bg-gold/10 text-gold border border-gold/25 px-4 py-2 rounded-full mb-5">Authorized Dealer · Nerolac · MRF · Kamdhenu</span>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.08] max-w-[22ch]">Har Deewar Se Jude Jazbaat Aur Rang.<br/><em className="not-italic text-gold">Hariom Enterprises – Bharose Ke Sang.</em></h1>
        <p className="mt-5 max-w-[46ch] text-night/70 leading-relaxed md:text-lg">Genuine paints, expert shade matching and honest pricing — everything your project needs, under one roof.</p>
        <div className="flex gap-5 flex-wrap mt-7">
          {FEATS.map(([Icon, label], k) => (
            <div key={k} className="flex items-center gap-2.5 max-w-[170px]">
              <span className="w-10 h-10 rounded-full border border-night/15 flex items-center justify-center text-gold shrink-0"><Icon size={18}/></span>
              <span className="text-sm font-medium leading-tight text-night/80">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 flex-wrap mt-8">
          <Link href="/products" className="btn-gold inline-block font-semibold px-7 py-3.5 rounded-full">Explore products</Link>
          <Link href="/contact" className="inline-block border border-night/30 text-night font-semibold px-7 py-3.5 rounded-full hover:bg-night hover:text-white transition-colors">Get a quote</Link>
        </div>
      </div>
    </section>
  );
}
