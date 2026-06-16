import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: 'desc' }, include: { product: true },
  });
  return NextResponse.json(inquiries);
}

export async function POST(req) {
  const d = await req.json();
  if (!d.customerName || !d.phone) {
    return NextResponse.json({ error: 'Name and phone required' }, { status: 400 });
  }
  const inquiry = await prisma.inquiry.create({
    data: {
      customerName: d.customerName, phone: d.phone, email: d.email || null,
      message: d.message || null, productId: d.productId ? Number(d.productId) : null,
    },
  });
  return NextResponse.json(inquiry, { status: 201 });
}
