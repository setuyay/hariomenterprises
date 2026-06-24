import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUBLIC — track a warranty by Warranty ID or mobile number.
// Returns only safe, non-sensitive fields.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const warrantyId = (searchParams.get('warrantyId') || '').trim();
  const mobile = (searchParams.get('mobile') || '').replace(/\D/g, '').slice(-10);

  if (!warrantyId && !mobile) {
    return NextResponse.json({ error: 'Enter a Warranty ID or mobile number' }, { status: 400 });
  }

  const where = warrantyId ? { warrantyId } : { mobile };
  const items = await prisma.warrantyRegistration.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      warrantyId: true,
      customerName: true,
      brandName: true,
      productName: true,
      status: true,
      createdAt: true,
      purchaseDate: true,
    },
  });
  return NextResponse.json(items);
}
