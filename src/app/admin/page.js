import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { Package, Tag, Inbox, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  try { await requireAuth(); } catch { redirect('/admin/login'); }
  const [products, brands, inquiries, newInquiries, recent] = await Promise.all([
    prisma.product.count(),
    prisma.brand.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: 'new' } }),
    prisma.inquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { product: true } }),
  ]);
  const stats = [
    [Package, 'Products', products],
    [Tag, 'Brands', brands],
    [Inbox, 'Total Inquiries', inquiries],
    [TrendingUp, 'New Inquiries', newInquiries],
  ];
  return (
    <div>
      <h1 className="font-display text-4xl mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-5 mb-10">
        {stats.map(([Icon,l,v],i)=>(
          <div key={i} className="glass rounded-2xl p-6">
            <Icon className="text-gold mb-3"/>
            <p className="text-3xl font-display">{v}</p>
            <p className="text-cream/50 text-sm">{l}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h2 className="font-display text-2xl mb-4">Recent Inquiries</h2>
        {recent.length===0 ? <p className="text-cream/40 text-sm">No inquiries yet.</p> : (
          <div className="space-y-2">
            {recent.map(i=>(
              <div key={i.id} className="flex justify-between items-center border-b border-white/5 py-3 text-sm">
                <div>
                  <p className="font-medium">{i.customerName} <span className="text-cream/40">· {i.phone}</span></p>
                  <p className="text-cream/50 text-xs">{i.product?.productName || 'General'} — {new Date(i.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${i.status==='new'?'bg-gold/20 text-gold':'bg-white/10 text-cream/60'}`}>{i.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
