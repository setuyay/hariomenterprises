import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { SITE } from '@/lib/config';
import {
  Droplets, CloudRain, Bath, Building2, Layers, Container, Wrench,
  Search, Brush, PaintRoller, ShieldCheck, CheckCircle2, Phone, MessageCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Waterproofing Solutions',
  description: 'Professional waterproofing in Mandla — terrace, bathroom, exterior walls, basement and water-tank waterproofing with genuine Nerolac, MRF & Kamdhenu products. Free site inspection.',
};

const TYPES = [
  [CloudRain, 'Terrace & Roof', 'Stop monsoon leakage and ponding with durable, crack-bridging membrane coatings.'],
  [Bath, 'Bathroom & Wet Areas', 'Seal sunken portions, floors and walls before tiling to prevent seepage to rooms below.'],
  [Building2, 'Exterior Walls', 'Weatherproof elastomeric coatings that resist rain, damp and efflorescence.'],
  [Layers, 'Basement & Foundation', 'Negative & positive-side treatments against rising damp and ground water.'],
  [Container, 'Water Tanks & Sumps', 'Food-safe, non-toxic linings for overhead tanks, underground sumps and reservoirs.'],
  [Wrench, 'Cracks & Joints', 'Targeted repair of structural cracks, construction joints and leaking pipe inlets.'],
];

const STEPS = [
  [Search, 'Free Site Inspection', 'We visit, find the source of leakage and assess the surface — no charge, no obligation.'],
  [Brush, 'Surface Preparation', 'Cleaning, crack-filling and priming so the coating bonds and lasts.'],
  [PaintRoller, 'Waterproof Coating', 'Application of the right membrane / coating system in correct coats and thickness.'],
  [ShieldCheck, 'Testing & Warranty', 'Water-ponding test to confirm a dry result, backed by a service warranty.'],
];

const BENEFITS = [
  'Stops leakage, seepage and damp patches',
  'Protects the structure & steel from corrosion',
  'Monsoon-ready, long-lasting protection',
  'Genuine Nerolac, MRF & Kamdhenu systems',
  'Trained applicators & honest estimates',
  'Service warranty on completed work',
];

export default function WaterproofingPage() {
  const waText = 'Hi Hariom Enterprises, I would like a free waterproofing inspection.';
  return (
    <>
      <Navbar />
      <FloatingActions />

      {/* HERO */}
      <section className="shell pt-36 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="kicker mono"><span className="l"></span>Waterproofing services</div>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-5">Keep every wall and terrace <span className="text-gold">leak-free.</span></h1>
            <p className="text-cream/65 max-w-xl mb-7 md:text-lg leading-relaxed">From terraces and bathrooms to exterior walls and water tanks — professional waterproofing with genuine products and trained applicators. Built to survive the Mandla monsoon.</p>
            <div className="flex gap-4 flex-wrap">
              <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="btn-gold inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full"><MessageCircle size={17} /> Get a free inspection</a>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-2 border border-night/30 text-night font-semibold px-7 py-3.5 rounded-full hover:bg-night hover:text-white transition-colors"><Phone size={16} /> Call now</a>
            </div>
          </div>
          {/* visual */}
          <div className="hidden lg:block">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-night/20"
              style={{ background: 'linear-gradient(160deg,#0a3d6b 0%,#0a5ad6 55%,#4d96ff 100%)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 85% 12%, rgba(255,255,255,.35), transparent 55%)' }} />
              <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
                <Droplets size={42} className="opacity-90" />
                <div>
                  <p className="font-display text-3xl leading-tight">Dry walls. Dry terraces.<br />Every monsoon.</p>
                  <p className="text-white/75 text-sm mt-3 max-w-[34ch]">Trusted waterproofing across Mandla with a written service warranty.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TYPES */}
      <section className="shell pb-20">
        <div className="kicker mono"><span className="l"></span>What we waterproof</div>
        <h2 className="font-display text-4xl mb-10">Solutions for every wet problem.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TYPES.map(([Icon, t, d], i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:-translate-y-1 transition-transform">
              <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-mrf/10 text-mrf mb-4"><Icon size={22} /></span>
              <h3 className="font-display text-xl mb-1">{t}</h3>
              <p className="text-cream/65 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-[#f4ecdd] py-20">
        <div className="shell">
          <div className="kicker mono"><span className="l"></span>How it works</div>
          <h2 className="font-display text-4xl mb-10">A clear, four-step process.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(([Icon, t, d], i) => (
              <div key={i} className="glass rounded-2xl p-6 relative">
                <span className="absolute top-5 right-5 font-display text-3xl text-gold/20">0{i + 1}</span>
                <Icon className="text-gold mb-4" size={28} />
                <h3 className="font-display text-lg mb-1">{t}</h3>
                <p className="text-cream/65 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="shell py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="kicker mono"><span className="l"></span>Why Hariom</div>
            <h2 className="font-display text-4xl mb-6">Waterproofing done right, the first time.</h2>
            <ul className="space-y-3">
              {BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-cream/80">
                  <CheckCircle2 size={20} className="text-kamdhenu mt-0.5 shrink-0" /> {b}
                </li>
              ))}
            </ul>
          </div>
          {/* CTA card */}
          <div className="rounded-3xl p-8 md:p-10 text-white" style={{ background: 'linear-gradient(135deg,#e8472b,#ff7a45)' }}>
            <h3 className="font-display text-3xl mb-2">Book a free inspection.</h3>
            <p className="text-white/90 mb-6 max-w-md">Tell us where it leaks — terrace, bathroom or walls. Our team will inspect, find the cause and give you a clear estimate. No charge for the visit.</p>
            <div className="flex gap-3 flex-wrap">
              <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="btn-wa inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full"><MessageCircle size={16} /> WhatsApp us</a>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-night text-white font-semibold px-6 py-3 rounded-full hover:bg-black transition-colors">Contact us →</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
