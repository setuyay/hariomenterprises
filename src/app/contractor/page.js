import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ContractorForm from './ContractorForm';
import { IndianRupee, Truck, BadgeCheck, Headphones } from 'lucide-react';

export const metadata = {
  title: 'Contractor Account',
  description: 'Open a contractor account with Hariom Enterprises for the best bulk rates on Nerolac, MRF and Kamdhenu paints, priority delivery and dedicated support.',
};

const PERKS = [
  [IndianRupee, 'Best bulk rates', 'Special contractor pricing across all three brands.'],
  [Truck, 'Priority delivery', 'Same-day local delivery on stock items.'],
  [BadgeCheck, 'Genuine sealed stock', 'Authorized dealer — every tin is authentic.'],
  [Headphones, 'Dedicated support', 'A direct line for orders, shade matching & estimates.'],
];

export default function ContractorPage() {
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="shell pt-36 pb-20">
        <div className="kicker mono"><span className="l"></span>For the trade</div>
        <h1 className="font-display text-4xl md:text-5xl mb-4 max-w-2xl">Open a contractor account.</h1>
        <p className="text-cream/60 max-w-xl mb-12">Painters, builders and designers — get the best rates, priority delivery and dedicated support. Apply below and our team will set you up within one business day.</p>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div className="grid sm:grid-cols-2 gap-5">
            {PERKS.map(([Icon, t, d], i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <Icon className="text-gold mb-3" size={28}/>
                <h3 className="font-display text-lg mb-1">{t}</h3>
                <p className="text-cream/60 text-sm">{d}</p>
              </div>
            ))}
          </div>
          <ContractorForm/>
        </div>
      </section>
      <Footer/>
    </>
  );
}
