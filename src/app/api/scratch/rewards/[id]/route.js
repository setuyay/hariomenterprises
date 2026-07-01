import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

async function guard() {
  try { await requireAuth(); return null; }
  catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
}

export async function PATCH(req, { params }) {
  const denied = await guard(); if (denied) return denied;
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const data = {};
  if (b.title !== undefined) data.title = String(b.title).trim();
  if (b.description !== undefined) data.description = b.description?.trim() || null;
  if (b.couponPrefix !== undefined) data.couponPrefix = String(b.couponPrefix).trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (b.probability !== undefined && Number(b.probability) >= 0) data.probability = Number(b.probability);
  if (b.isActive !== undefined) data.isActive = !!b.isActive;
  const item = await prisma.scratchReward.update({ where: { id: Number(id) }, data });
  return NextResponse.json(item);
}

export async function DELETE(req, { params }) {
  const denied = await guard(); if (denied) return denied;
  const { id } = await params;
  // Block deletion if coupons were already issued for this reward (keep history intact).
  const used = await prisma.scratchCard.count({ where: { rewardId: Number(id) } });
  if (used > 0) {
    return NextResponse.json({ error: 'This reward has issued coupons. Disable it instead of deleting.' }, { status: 409 });
  }
  await prisma.scratchReward.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
