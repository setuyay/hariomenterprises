import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  const { status } = await req.json();
  const inquiry = await prisma.inquiry.update({ where: { id: Number(id) }, data: { status } });
  return NextResponse.json(inquiry);
}

export async function DELETE(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  await prisma.inquiry.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
