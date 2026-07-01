import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function guard() {
  try { await requireAuth(); return null; }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

export async function GET() {
  const denied = await guard(); if (denied) return denied;
  const items = await prisma.scratchReward.findMany({
    orderBy: { id: 'asc' },
    include: { _count: { select: { cards: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  const denied = await guard(); if (denied) return denied;
  const b = await req.json().catch(() => ({}));
  if (!b.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!b.couponPrefix?.trim()) return NextResponse.json({ error: 'Coupon prefix is required' }, { status: 400 });
  const item = await prisma.scratchReward.create({
    data: {
      title: b.title.trim(),
      description: b.description?.trim() || null,
      couponPrefix: b.couponPrefix.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''),
      probability: Number(b.probability) >= 0 ? Number(b.probability) : 1,
      isActive: b.isActive !== false,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
