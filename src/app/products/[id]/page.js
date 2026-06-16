import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import InquiryForm from '@/components/InquiryForm';
import Gallery from './Gallery';
import { prisma } from '@/lib/prisma';
import { SITE } from '@/lib/config';
import { Check } from 'lucide-react';
export const dynamic = 'force-dynamic';

async function getProduct(id) {
  const p = await prisma.product.findUnique({ where: { id: Number(id) }, include: { brand: true } });
  return p;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return { title: 'Product not found' };
  return {
    title: `${p.productName} — ${p.brand.brandName}`,
    description: p.description?.slice(0,160),
    openGraph: { title: p.productName, description: p.description?.slice(0,160), images: [p.image || '/uploads/sample-product.svg'] },
  };
}

export default async function ProductDetail({ params }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const images = JSON.parse(p.images || '[]');
  const features = JSON.parse(p.features || '[]');
  const specs = JSON.parse(p.specs || '{}');

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.productName, description: p.description, brand: { '@type': 'Brand', name: p.brand.brandName },
    category: p.category, image: p.image,
  };

  return (
    <>
      <Navbar/>
      <FloatingActions productName={p.productName}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      <section className="max-w-7xl mx-auto px-5 pt-36 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <Gallery images={images} name={p.productName}/>
          <div>
            <p className="text-gold tracking-[0.3em] uppercase text-xs">{p.brand.brandName} · {p.category}</p>
            <h1 className="font-display text-5xl mt-3">{p.productName}</h1>
            <p className="text-cream/70 mt-5 leading-relaxed">{p.description}</p>

            {features.length>0 && (
              <div className="mt-7">
                <h3 className="font-display text-2xl mb-3">Key Features</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {features.map((f,i)=>(
                    <li key={i} className="flex items-center gap-2 text-sm text-cream/70">
                      <Check size={16} className="text-gold"/> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Object.keys(specs).length>0 && (
              <div className="mt-7">
                <h3 className="font-display text-2xl mb-3">Specifications</h3>
                <div className="glass rounded-2xl overflow-hidden">
                  {Object.entries(specs).map(([k,v],i)=>(
                    <div key={i} className="flex justify-between px-5 py-3 border-b border-white/5 last:border-0 text-sm">
                      <span className="text-cream/50">{k}</span><span className="text-cream/90">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mt-16">
          <div className="glass rounded-2xl p-7">
            <h3 className="font-display text-2xl mb-3">About {p.brand.brandName}</h3>
            <p className="text-cream/60 text-sm leading-relaxed">{p.brand.description}</p>
          </div>
          <InquiryForm productId={p.id} productName={p.productName}/>
        </div>
      </section>
      <Footer/>
    </>
  );
}
