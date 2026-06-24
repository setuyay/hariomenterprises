import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import WarrantyStatusClient from './WarrantyStatusClient';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const metadata = {
  title: 'Track Warranty Status',
  description: 'Check the status of your Hariom Enterprises paint warranty registration using your Warranty ID or mobile number.',
};

export default async function WarrantyStatusPage({ searchParams }) {
  const sp = await searchParams;
  const initialWarrantyId = (sp?.warrantyId || '').toString();

  return (
    <>
      <Navbar />
      <FloatingActions />
      <section className="relative shell pt-36 pb-20">
        <div className="pointer-events-none absolute -right-32 top-24 w-[34rem] h-[34rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[.66rem] font-semibold tracking-[.16em] uppercase bg-gold/10 text-gold border border-gold/25 px-4 py-2 rounded-full mb-5">
            <Search size={14} /> Warranty tracking
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Track your warranty.</h1>
          <p className="text-cream/65">Enter your Warranty ID or registered mobile number to check your registration status.</p>
          <p className="text-cream/50 text-sm mt-4">Not registered yet? <Link href="/warranty-registration" className="text-gold font-semibold hover:underline">Register your warranty →</Link></p>
        </div>
        <div className="relative z-10">
          <WarrantyStatusClient initialWarrantyId={initialWarrantyId} />
        </div>
      </section>
      <Footer />
    </>
  );
}
