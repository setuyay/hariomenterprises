import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ContractorRequestForm from './ContractorRequestForm';
import { BadgeCheck, Clock, ShieldCheck, IndianRupee } from 'lucide-react';

export const metadata = {
  title: 'Find a Contractor',
  description: 'Need a painting contractor? Share your name, mobile number and address — Hariom Enterprises will connect you with a trusted, verified contractor near you.',
};

const PERKS = [
  [BadgeCheck, 'Verified contractors', 'Trusted painters we work with regularly.'],
  [Clock, 'Quick callback', 'We reach out within 1 business day.'],
  [ShieldCheck, 'Genuine paints', 'Authentic Nerolac, MRF & Kamdhenu products.'],
  [IndianRupee, 'Fair pricing', 'Transparent estimates, no surprises.'],
];

export default function FindContractorPage() {
  return (
    <>
      <Navbar />
      <FloatingActions />
      <section className="shell pt-36 pb-20">
        <div className="kicker mono"><span className="l"></span>Need a painter?</div>
        <h1 className="font-display text-4xl md:text-5xl mb-4 max-w-2xl">Find a contractor.</h1>
        <p className="text-cream/60 max-w-xl mb-12">Tell us your name, mobile number and address — we&apos;ll connect you with a trusted, verified contractor near you and call you back shortly.</p>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div className="grid sm:grid-cols-2 gap-5">
            {PERKS.map(([Icon, t, d], i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <Icon className="text-gold mb-3" size={28} />
                <h3 className="font-display text-lg mb-1">{t}</h3>
                <p className="text-cream/60 text-sm">{d}</p>
              </div>
            ))}
          </div>
          <ContractorRequestForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
