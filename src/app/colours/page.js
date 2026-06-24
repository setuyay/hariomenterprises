import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ColoursClient from './ColoursClient';

export const metadata = {
  title: 'Colour Palettes',
  description: 'Explore 2,000+ colour shades for interiors and exteriors. Search and find the perfect shade for your space.',
};
export const dynamic = 'force-dynamic';

export default function ColoursPage() {
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="shell pt-36 pb-20">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Colour Palettes</p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Find Your Perfect Shade</h1>
        <p className="text-cream/60 max-w-xl mb-10">Browse over 2,000 curated colours. Search by name or hex, filter by family, and tap any shade to enquire.</p>
        <ColoursClient/>
      </section>
      <Footer/>
    </>
  );
}
