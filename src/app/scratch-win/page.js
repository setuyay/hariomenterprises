import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScratchWinClient from './ScratchWinClient';
import { Gift } from 'lucide-react';

export const metadata = {
  title: 'Scratch & Win — Guaranteed Rewards',
  description: 'Scratch & Win with Hariom Enterprises, Mandla. Every customer wins a guaranteed reward — discounts, free painting tools and more. Enter your details and scratch your premium gold card.',
};

export default function ScratchWinPage() {
  return (
    <>
      <Navbar />
      <section className="relative shell pt-36 pb-20 min-h-[80vh]">
        <div className="pointer-events-none absolute -right-32 top-24 w-[34rem] h-[34rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 w-[28rem] h-[28rem] rounded-full bg-kamdhenu/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-2 text-[.66rem] font-semibold tracking-[.16em] uppercase bg-gold/10 text-gold border border-gold/25 px-4 py-2 rounded-full mb-5">
            <Gift size={14} /> Scratch &amp; Win
          </span>
          <h1 className="font-display text-4xl md:text-5xl mb-4">Scratch &amp; win a guaranteed reward.</h1>
          <p className="text-cream/65 max-w-xl mx-auto">
            Enter your details, scratch your premium gold card, and claim your prize. Everyone wins — flat discounts, free painting tools, waterproofing offers and more.
          </p>
        </div>

        <div className="relative z-10">
          <ScratchWinClient />
        </div>
      </section>
      <Footer />
    </>
  );
}
