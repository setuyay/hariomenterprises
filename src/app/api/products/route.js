import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const brand = searchParams.get('brand');
  const category = searchParams.get('category');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = parseInt(searchParams.get('limit') || '9');

  const where = {
    AND: [
      q ? { productName: { contains: q } } : {},
      brand ? { brandId: Number(brand) } : {},
      category ? { category } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where, include: { brand: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const d = await req.json();
  const product = await prisma.product.create({
    data: {
      productName: d.productName, brandId: Number(d.brandId), category: d.category,
      image: d.image || (d.images?.[0] ?? null),
      images: JSON.stringify(d.images || []),
      description: d.description || null,
      features: JSON.stringify(d.features || []),
      specs: JSON.stringify(d.specs || {}),
    },
  });
  return NextResponse.json(product, { status: 201 });
}
