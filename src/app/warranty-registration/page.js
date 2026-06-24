import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import WarrantyForm from './WarrantyForm';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Register Your Paint Warranty',
  description: 'Register your Nerolac, MRF or Kamdhenu paint warranty online with Hariom Enterprises, Mandla. Quick, paperless warranty registration with a downloadable certificate.',
};

export default function WarrantyRegistrationPage() {
  return (
    <>
      <Navbar />
      <FloatingActions />
      <section className="relative shell pt-36 pb-20">
        {/* soft paint-inspired glows for the glassmorphism backdrop */}
        <div className="pointer-events-none absolute -right-32 top-24 w-[34rem] h-[34rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 w-[28rem] h-[28rem] rounded-full bg-kamdhenu/10 blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[.66rem] font-semibold tracking-[.16em] uppercase bg-gold/10 text-gold border border-gold/25 px-4 py-2 rounded-full mb-5">
            <ShieldCheck size={14} /> Paint warranty
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Register your paint warranty.</h1>
          <p className="text-cream/65 max-w-xl mx-auto">Protect your project. Register your purchase to activate your warranty and get a downloadable certificate — it only takes a minute.</p>
          <p className="text-cream/50 text-sm mt-4">Already registered? <Link href="/warranty-status" className="text-gold font-semibold hover:underline">Track your warranty status →</Link></p>
        </div>

        <div className="relative z-10">
          <WarrantyForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
