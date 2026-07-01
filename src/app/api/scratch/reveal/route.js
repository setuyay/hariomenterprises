import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUBLIC — mark a card as scratched once the customer reveals it.
export async function POST(req) {
  const body = await req.json().catch(() => null);
  const couponCode = body?.couponCode?.trim();
  if (!couponCode) return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });

  const card = await prisma.scratchCard.findUnique({ where: { couponCode } });
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

  // Only record the first scratch; don't disturb redeemed/expired states.
  if (card.status === 'ISSUED') {
    await prisma.scratchCard.update({
      where: { couponCode },
      data: { status: 'SCRATCHED', scratchedAt: new Date() },
    });
  }
  return NextResponse.json({ ok: true });
}
