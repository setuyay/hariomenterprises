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
  [IndianRupee, 'Best Bulk Rates', 'Teeno brands par special contractor pricing.'],
  [Truck, 'Priority Delivery', 'Stock items par same-day local delivery.'],
  [BadgeCheck, 'Genuine Sealed Stock', 'Authorized dealer — har tin original aur sealed.'],
  [Headphones, 'Dedicated Support', 'Orders, shade matching aur estimates ke liye direct line.'],
];

export default function ContractorPage() {
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="shell pt-36 pb-20">
        <div className="kicker mono"><span className="l"></span>Contractors ke liye</div>
        <h1 className="font-display text-4xl md:text-5xl mb-4 max-w-2xl">Contractor Account kholein.</h1>
        <p className="text-cream/60 max-w-xl mb-12">Painters, builders aur designers — best rates, priority delivery aur dedicated support paayein. Niche apply karein, hamari team 1 business day me aapko set up kar degi.</p>

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
