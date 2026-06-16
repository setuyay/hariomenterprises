import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const family = searchParams.get('family') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(120, Math.max(1, parseInt(searchParams.get('pageSize') || '60', 10)));

  const where = {};
  if (family && family !== 'All') where.family = family;
  if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { hex: { contains: q, mode: 'insensitive' } }];

  const [items, total, grouped] = await Promise.all([
    prisma.colorShade.findMany({
      where,
      orderBy: [{ family: 'asc' }, { name: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.colorShade.count({ where }),
    prisma.colorShade.groupBy({ by: ['family'], _count: { _all: true } }),
  ]);

  const families = grouped
    .map(g => ({ family: g.family, count: g._count._all }))
    .sort((a, b) => a.family.localeCompare(b.family));

  return NextResponse.json({ items, total, page, pageSize, families });
}

export async function POST(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const d = await req.json();
  const shade = await prisma.colorShade.create({
    data: { name: d.name, hex: d.hex, family: d.family || 'Other' },
  });
  return NextResponse.json(shade, { status: 201 });
}
