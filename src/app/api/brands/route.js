import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { brandName: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(brands);
}

export async function POST(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const data = await req.json();
  const brand = await prisma.brand.create({
    data: { brandName: data.brandName, brandLogo: data.brandLogo || null, description: data.description || null, category: data.category || null },
  });
  return NextResponse.json(brand, { status: 201 });
}
