import { prisma } from '@/lib/prisma';
import { SITE } from '@/lib/config';

export default async function sitemap() {
  const products = await prisma.product.findMany({ select: { id: true, createdAt: true } });
  const staticRoutes = ['', '/products', '/about', '/contact'].map(r => ({
    url: `${SITE.url}${r}`, lastModified: new Date(), changeFrequency: 'weekly', priority: r === '' ? 1 : 0.8,
  }));
  const productRoutes = products.map(p => ({
    url: `${SITE.url}/products/${p.id}`, lastModified: p.createdAt, changeFrequency: 'weekly', priority: 0.7,
  }));
  return [...staticRoutes, ...productRoutes];
}
