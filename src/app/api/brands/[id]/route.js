import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  const data = await req.json();
  const brand = await prisma.brand.update({
    where: { id: Number(id) },
    data: { brandName: data.brandName, brandLogo: data.brandLogo || null, description: data.description || null, category: data.category || null },
  });
  return NextResponse.json(brand);
}

export async function DELETE(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  await prisma.brand.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
