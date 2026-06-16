import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req, { params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) }, include: { brand: true } });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  const d = await req.json();
  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      productName: d.productName, brandId: Number(d.brandId), category: d.category,
      image: d.image || (d.images?.[0] ?? null),
      images: JSON.stringify(d.images || []),
      description: d.description || null,
      features: JSON.stringify(d.features || []),
      specs: JSON.stringify(d.specs || {}),
    },
  });
  return NextResponse.json(product);
}

export async function DELETE(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
