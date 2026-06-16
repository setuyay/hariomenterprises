import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  const data = await req.json();
  const offer = await prisma.offer.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description || null,
      discount: data.discount || null,
      code: data.code || null,
      image: data.image || null,
      active: data.active ?? true,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  });
  return NextResponse.json(offer);
}

export async function DELETE(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  await prisma.offer.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
