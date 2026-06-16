import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const apps = await prisma.contractorApplication.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(apps);
}

export async function POST(req) {
  const d = await req.json();
  if (!d.name || !d.phone) {
    return NextResponse.json({ error: 'Name and phone required' }, { status: 400 });
  }
  const app = await prisma.contractorApplication.create({
    data: {
      name: d.name,
      businessName: d.businessName || null,
      phone: d.phone,
      email: d.email || null,
      city: d.city || null,
      workType: d.workType || null,
      message: d.message || null,
    },
  });
  return NextResponse.json(app, { status: 201 });
}
