import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { SITE } from '@/lib/config';
import {
  Search, Sparkles, Layers, Droplets, Container, PaintRoller, Timer, CheckCircle2,
  Palette, Lightbulb, Star, Check, X, MessageCircle, Phone,
} from 'lucide-react';

export const metadata = {
  title: 'Home Painting Guide — How To Paint',
  description: 'Hariom Enterprises expert home painting guide. Step-by-step (Hindi + English) — wall check, cleaning, putty, primer, painting, drying and final touch-up, plus do’s, don’ts and expert tips.',
};

const STEPS = [
  {
    icon: Search, emoji: '🧱', title: 'Step 1 – Wall Check Karein',
    intro: 'Painting shuru karne se pehle deewar ko dhyan se inspect karein.',
    points: ['Cracks ya holes check karein', 'Dampness ya seepage dekhein', 'Purana paint peel ho raha ho to remove karein'],
    tip: 'Agar wall damaged hai, to pehle repair karein aur phir painting shuru karein.',
  },
  {
    icon: Sparkles, emoji: '🧹', title: 'Step 2 – Wall Clean Karein',
    intro: 'Ek clean surface hi perfect finish deti hai.',
    points: ['Dust aur dirt remove karein', 'Grease aur oil stains saaf karein', 'Loose paint ko scraper se hata dein'],
    tip: 'Clean wall par paint zyada achhe se chipakta hai aur finish bhi smooth aati hai.',
  },
  {
    icon: Layers, emoji: '🛠', title: 'Step 3 – Crack Repair & Putty',
    intro: 'Wall ko perfectly smooth banane ke liye:',
    points: ['Cracks ko crack filler se fill karein', 'Wall Putty apply karein (agar zarurat ho)', 'Putty dry hone ke baad sanding karein'],
  },
  {
    icon: Droplets, emoji: '🎨', title: 'Step 4 – Primer Lagayein',
    intro: 'Primer lagana ek important step hai. Benefits:',
    points: ['Paint ki grip strong hoti hai', 'Paint zyada durable hota hai', 'Better colour coverage milti hai', 'Paint ki consumption kam hoti hai'],
  },
  {
    icon: Container, emoji: '🪣', title: 'Step 5 – Paint Mix Karein',
    points: ['Paint ko achhi tarah stir karein', 'Sirf manufacturer ke instructions ke hisaab se hi water add karein'],
  },
  {
    icon: PaintRoller, emoji: '🖌', title: 'Step 6 – Painting Start Karein',
    points: ['Sabse pehle corners aur edges brush se paint karein', 'Uske baad roller ki help se poori wall paint karein'],
    tip: 'Best finish ke liye minimum 2 coats paint karein.',
  },
  {
    icon: Timer, emoji: '⏳', title: 'Step 7 – Dry Hone Dein',
    intro: 'Har coat ko completely dry hone dein. Uske baad hi second coat apply karein.',
    points: ['Jaldi karne se finish kharab ho sakti hai'],
  },
  {
    icon: CheckCircle2, emoji: '✨', title: 'Step 8 – Final Touch-up',
    intro: 'Painting complete hone ke baad wall inspect karein:',
    points: ['Missed spots', 'Uneven colour', 'Roller marks'],
    tip: 'Agar zarurat ho to final touch-up karein.',
  },
];

const DOS = [
  'Surface ko properly prepare karein.',
  'High-quality paint aur primer use karein.',
  'Premium quality brushes aur rollers use karein.',
  'Furniture aur flooring ko cover karein.',
  'Masking tape ka use karein.',
  'Proper ventilation rakhein.',
  'Gloves, goggles aur mask pehnein.',
  'Same batch number ka paint kharidein.',
  'Paint quantity pehle calculate karein.',
  'Manufacturer ke drying time ko follow karein.',
];

const DONTS = [
  'Wet ya damp wall par paint na karein.',
  'Primer skip na karein.',
  'Dirty surface par paint apply na karein.',
  'Ek hi coat me bahut thick paint na lagayein.',
  'Different paint brands ko mix na karein.',
  'Direct dhoop ya baarish me exterior painting na karein.',
  'Coat dry hone se pehle second coat na lagayein.',
  'Gande roller ya brush reuse na karein.',
  'Paint can ko khula na chhodein.',
  'Leftover paint ko drain me dispose na karein.',
];

const EXPERT_TIPS = [
  'Paint kharidne se pehle Paint Calculator ka use karein.',
  'Colour final karne se pehle wall ke ek chhote area par test karein.',
  'Better colour consistency ke liye same batch number ka paint kharidein.',
  'Premium smooth finish ke liye microfiber roller use karein.',
  'Interior aur exterior ke liye hamesha recommended primer aur paint system choose karein.',
  'Colour selection ya paint quantity me confusion ho, to Hariom Enterprises ki expert team se free consultation lein.',
];

export default function HowToPaintPage() {
  const waText = 'Hi Hariom Enterprises, mujhe painting ke liye advice chahiye.';
  return (
    <>
      <Navbar />
      <FloatingActions />

      {/* HERO */}
      <section className="shell pt-36 pb-14">
        <div className="kicker mono"><span className="l"></span>Hariom Enterprises Expert Guide</div>
        <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-5 max-w-2xl">🏠 Home Painting Guide</h1>
        <p className="text-cream/65 max-w-xl mb-7 md:text-lg leading-relaxed">Transform your home with a long-lasting and premium paint finish by following these simple steps.</p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/visualizer" className="btn-gold inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full"><Palette size={17} /> Try the Visualizer</Link>
          <Link href="/calculators" className="btn-ghost inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full">Paint Calculator</Link>
        </div>
      </section>

      {/* STEPS */}
      <section className="shell pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="glass rounded-2xl p-6 relative hover:-translate-y-1 transition-transform">
                <span className="absolute top-5 right-5 font-display text-4xl text-gold/15">0{i + 1}</span>
                <span className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#f4ecdd] text-gold mb-4 text-2xl">{s.emoji}</span>
                <h3 className="font-display text-xl mb-2 pr-8">{s.title}</h3>
                {s.intro && <p className="text-cream/65 text-sm mb-3 leading-relaxed">{s.intro}</p>}
                <ul className="space-y-1.5">
                  {s.points.map((p, k) => (
                    <li key={k} className="flex items-start gap-2 text-sm text-cream/75"><Check size={15} className="text-kamdhenu mt-0.5 shrink-0" /> {p}</li>
                  ))}
                </ul>
                {s.tip && <p className="mt-3 text-xs bg-gold/10 text-gold border border-gold/20 rounded-lg px-3 py-2 leading-relaxed"><b>Tip:</b> {s.tip}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* DO'S & DON'TS */}
      <section className="bg-[#f4ecdd] py-20">
        <div className="shell grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-7">
            <h2 className="font-display text-2xl mb-5 flex items-center gap-2 text-kamdhenu"><Check size={22} /> Do&rsquo;s</h2>
            <ul className="space-y-2.5">
              {DOS.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-cream/80"><Check size={16} className="text-kamdhenu mt-0.5 shrink-0" /> {d}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-7">
            <h2 className="font-display text-2xl mb-5 flex items-center gap-2 text-nerolac"><X size={22} /> Don&rsquo;ts</h2>
            <ul className="space-y-2.5">
              {DONTS.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-cream/80"><X size={16} className="text-nerolac mt-0.5 shrink-0" /> {d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* EXPERT TIPS */}
      <section className="shell py-20">
        <div className="kicker mono"><span className="l"></span>Hariom Enterprises Expert Tips</div>
        <h2 className="font-display text-4xl mb-10">💡 Pro tips for a premium finish.</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPERT_TIPS.map((tip, i) => (
            <div key={i} className="glass rounded-2xl p-5 flex items-start gap-3">
              <Star size={20} className="text-sun mt-0.5 shrink-0" />
              <p className="text-cream/75 text-sm leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="shell pb-20">
        <div className="rounded-3xl p-8 md:p-12 text-white" style={{ background: 'linear-gradient(135deg,#e8472b,#ff7a45)' }}>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl mb-2">Confusion ho? Hamse poochein.</h2>
              <p className="text-white/90 max-w-md">Colour selection ya paint quantity ke liye Hariom Enterprises ki expert team se free consultation lein.</p>
            </div>
            <div className="flex gap-3 flex-wrap lg:justify-end">
              <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noreferrer" className="btn-wa inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full"><MessageCircle size={16} /> WhatsApp us</a>
              <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-2 bg-night text-white font-semibold px-6 py-3 rounded-full hover:bg-black transition-colors"><Phone size={16} /> Call now</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
