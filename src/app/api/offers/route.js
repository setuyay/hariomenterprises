import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const where = searchParams.get('active') === '1' ? { active: true } : {};
  const offers = await prisma.offer.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(offers);
}

export async function POST(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const data = await req.json();
  const offer = await prisma.offer.create({
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
  return NextResponse.json(offer, { status: 201 });
}
