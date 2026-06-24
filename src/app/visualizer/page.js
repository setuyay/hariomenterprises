import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import VisualizerClient from './VisualizerClient';

export const metadata = {
  title: '3D AI Colour Visualizer',
  description: 'Paint a 3D room or upload your own photo, then preview any of 2,000+ shades with realistic finishes before you buy.',
};

export default function VisualizerPage() {
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="shell pt-36 pb-20">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">3D AI Visualizer</p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Design It Before You Paint</h1>
        <p className="text-cream/60 max-w-xl mb-10">Paint each wall and floor of an interactive 3D room, or upload a photo of your own space. Pick from 2,000+ shades, try matte, satin and gloss finishes, then enquire in one tap.</p>
        <VisualizerClient/>
      </section>
      <Footer/>
    </>
  );
}
