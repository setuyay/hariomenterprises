import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function guard() {
  try { await requireAuth(); return null; }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

export async function GET() {
  const denied = await guard(); if (denied) return denied;
  const items = await prisma.scratchCampaign.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { cards: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  const denied = await guard(); if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  if (!b.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const item = await prisma.scratchCampaign.create({
    data: {
      title: b.title.trim(),
      startDate: b.startDate ? new Date(b.startDate) : null,
      endDate: b.endDate ? new Date(b.endDate) : null,
      couponValidityDays: Number(b.couponValidityDays) > 0 ? Number(b.couponValidityDays) : 30,
      isActive: b.isActive !== false,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
