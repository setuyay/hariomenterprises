import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import { ShieldCheck, Award, Users } from 'lucide-react';

export const metadata = { title: 'About Us', description: 'Learn about Hariom Enterprises — a trusted name in premium paints and coatings.' };

export default function About() {
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="max-w-4xl mx-auto px-5 pt-36 pb-20">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Our Story</p>
        <h1 className="font-display text-5xl mb-8">About Hariom Enterprises</h1>
        <p className="text-cream/70 leading-relaxed text-lg">
          For years, Hariom Enterprises has been a trusted destination for homeowners, designers and contractors seeking the finest paints and coatings. As an authorized dealer of India's leading paint brands, we combine premium products with expert guidance to help bring every vision to life.
        </p>
        <p className="text-cream/60 leading-relaxed mt-5">
          From luxurious interior emulsions to weather-resistant exterior coatings, wood finishes, enamels and waterproofing solutions, our curated catalog covers every need. We believe a great finish begins with the right product and the right advice — and that's exactly what we deliver.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[[ShieldCheck,'Authentic Products','Only genuine, warranty-backed paints.'],
            [Award,'Expert Guidance','Decades of combined colour expertise.'],
            [Users,'Customer First','Service that puts your project first.']].map(([Icon,t,d],i)=>(
            <div key={i} className="glass rounded-2xl p-6 text-center">
              <Icon className="mx-auto text-gold mb-3"/>
              <h3 className="font-display text-xl mb-2">{t}</h3>
              <p className="text-cream/60 text-sm">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </>
  );
}
