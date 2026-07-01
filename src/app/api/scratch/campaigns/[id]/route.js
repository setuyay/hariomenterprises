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
  if (b.startDate !== undefined) data.startDate = b.startDate ? new Date(b.startDate) : null;
  if (b.endDate !== undefined) data.endDate = b.endDate ? new Date(b.endDate) : null;
  if (b.couponValidityDays !== undefined && Number(b.couponValidityDays) > 0) data.couponValidityDays = Number(b.couponValidityDays);
  if (b.isActive !== undefined) data.isActive = !!b.isActive;
  const item = await prisma.scratchCampaign.update({ where: { id: Number(id) }, data });
  return NextResponse.json(item);
}

export async function DELETE(req, { params }) {
  const denied = await guard(); if (denied) return denied;
  const { id } = await params;
  await prisma.scratchCampaign.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
