import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import ProductsClient from './ProductsClient';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/lib/config';

export const metadata = {
  title: 'Products — Premium Paints & Coatings',
  description: 'Browse our full catalog of premium interior, exterior, wood, metal and waterproofing paints from top brands.',
  openGraph: { title: 'Products | Hariom Enterprises', description: 'Browse premium paints and coatings.' },
};
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { brandName: 'asc' } });
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="max-w-7xl mx-auto px-5 pt-36 pb-20">
        <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Catalog</p>
        <h1 className="font-display text-5xl mb-10">Our Products</h1>
        <Suspense fallback={<p className="text-cream/40">Loading...</p>}>
          <ProductsClient brands={brands} categories={CATEGORIES}/>
        </Suspense>
      </section>
      <Footer/>
    </>
  );
}
