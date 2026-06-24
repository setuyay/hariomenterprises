import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { warrantySchema, fieldErrors } from '@/lib/warrantySchema';

// PUBLIC — create a warranty registration
export async function POST(req) {
  const body = await req.json();
  const parsed = warrantySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', errors: fieldErrors(parsed.error) }, { status: 400 });
  }
  const d = parsed.data;

  const year = new Date().getFullYear();
  const prefix = `HE-${year}-`;

  // Generate the next sequential warranty id, retrying on the (rare) unique collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const last = await prisma.warrantyRegistration.findFirst({
      where: { warrantyId: { startsWith: prefix } },
      orderBy: { warrantyId: 'desc' },
      select: { warrantyId: true },
    });
    let next = 1;
    if (last) {
      const n = parseInt(last.warrantyId.slice(prefix.length), 10);
      if (!Number.isNaN(n)) next = n + 1;
    }
    const warrantyId = `${prefix}${String(next).padStart(5, '0')}`;

    try {
      const rec = await prisma.warrantyRegistration.create({
        data: {
          warrantyId,
          customerName: d.customerName,
          mobile: d.mobile,
          email: d.email,
          address: d.address,
          city: d.city,
          district: d.district,
          pincode: d.pincode,
          brandName: d.brandName,
          productName: d.productName,
          shadeName: d.shadeName || null,
          batchNumber: d.batchNumber || null,
          purchaseDate: new Date(d.purchaseDate),
          quantityPurchased: d.quantityPurchased || null,
          invoiceNumber: d.invoiceNumber || null,
          propertyType: d.propertyType || null,
          paintedArea: d.paintedArea || null,
          contractorName: d.contractorName || null,
          applicationDate: d.applicationDate ? new Date(d.applicationDate) : null,
          invoiceFile: d.invoiceFile,
          productPhoto: d.productPhoto || null,
          wallPhoto: d.wallPhoto || null,
        },
      });
      return NextResponse.json(rec, { status: 201 });
    } catch (e) {
      if (e.code === 'P2002') continue; // warrantyId collided, retry
      throw e;
    }
  }
  return NextResponse.json({ error: 'Could not generate a warranty ID, please try again' }, { status: 500 });
}

// ADMIN — list with optional search + status filter
export async function GET(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const q = (searchParams.get('q') || '').trim();

  const where = {};
  if (status && status !== 'All') where.status = status;
  if (q) {
    where.OR = [
      { warrantyId: { contains: q, mode: 'insensitive' } },
      { customerName: { contains: q, mode: 'insensitive' } },
      { mobile: { contains: q } },
      { productName: { contains: q, mode: 'insensitive' } },
      { city: { contains: q, mode: 'insensitive' } },
    ];
  }
  const items = await prisma.warrantyRegistration.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(items);
}
