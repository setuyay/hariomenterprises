import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { redeemSchema, fieldErrors } from '@/lib/scratchSchema';

// ADMIN — redeem a coupon once (records invoice + amount).
export async function POST(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const parsed = redeemSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', errors: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { couponCode, invoiceNumber, purchaseAmount, redeemedBy } = parsed.data;

  const card = await prisma.scratchCard.findUnique({
    where: { couponCode: couponCode.toUpperCase() },
    include: { redemption: true, reward: true, user: true },
  });
  if (!card) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
  if (card.status === 'REDEEMED' || card.redemption) {
    return NextResponse.json({ error: 'This coupon has already been redeemed.' }, { status: 409 });
  }
  if (card.expiresAt && card.expiresAt < new Date()) {
    await prisma.scratchCard.update({ where: { id: card.id }, data: { status: 'EXPIRED' } });
    return NextResponse.json({ error: 'This coupon has expired.' }, { status: 409 });
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.couponRedemption.create({
      data: {
        cardId: card.id,
        invoiceNumber: invoiceNumber || null,
        purchaseAmount: purchaseAmount,
        redeemedBy: redeemedBy || null,
        redeemedAt: now,
      },
    }),
    prisma.scratchCard.update({ where: { id: card.id }, data: { status: 'REDEEMED', redeemedAt: now } }),
  ]);

  return NextResponse.json({ ok: true, reward: card.reward.title, customer: card.user.fullName });
}
