import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import CalculatorsClient from './CalculatorsClient';

export const metadata = {
  title: 'Paint & Waterproofing Calculators',
  description: 'Free paint quantity calculator and waterproofing coverage calculator. Estimate litres and cost for your project.',
};

export default function CalculatorsPage() {
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="shell pt-36 pb-20">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Tools</p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Project Calculators</h1>
        <p className="text-cream/60 max-w-xl mb-10">Plan your project with our quick estimators. Get litres and cost, then send it to us for exact product advice.</p>
        <CalculatorsClient/>
      </section>
      <Footer/>
    </>
  );
}
