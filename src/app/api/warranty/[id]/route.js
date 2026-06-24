import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { WARRANTY_STATUSES } from '@/lib/warrantySchema';

// ADMIN — update status
export async function PATCH(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  const { status } = await req.json();
  if (!WARRANTY_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const rec = await prisma.warrantyRegistration.update({ where: { id: Number(id) }, data: { status } });
  return NextResponse.json(rec);
}

// ADMIN — delete
export async function DELETE(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  await prisma.warrantyRegistration.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
