import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const requests = await prisma.contractorRequest.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(requests);
}

export async function POST(req) {
  const d = await req.json();
  if (!d.name || !d.phone || !d.address) {
    return NextResponse.json({ error: 'Name, mobile number and address are required' }, { status: 400 });
  }
  const request = await prisma.contractorRequest.create({
    data: { name: d.name, phone: d.phone, address: d.address },
  });
  return NextResponse.json(request, { status: 201 });
}
