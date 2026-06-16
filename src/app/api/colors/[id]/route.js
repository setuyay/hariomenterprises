import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  const d = await req.json();
  const shade = await prisma.colorShade.update({
    where: { id: Number(id) },
    data: { name: d.name, hex: d.hex, family: d.family || 'Other' },
  });
  return NextResponse.json(shade);
}

export async function DELETE(req, { params }) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { id } = await params;
  await prisma.colorShade.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
