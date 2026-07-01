import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { participateSchema, fieldErrors } from '@/lib/scratchSchema';
import { ensureSeed, getActiveCampaign, pickReward, generateCouponCode } from '@/lib/scratchServer';

// PUBLIC — participate: issue a guaranteed-reward scratch card for a mobile number.
export async function POST(req) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const parsed = participateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', errors: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { fullName, mobile, email } = parsed.data;

  await ensureSeed();

  const campaign = await getActiveCampaign();
  if (!campaign) {
    return NextResponse.json({ error: 'No active campaign right now. Please check back soon.' }, { status: 409 });
  }

  // Upsert the participant by mobile (keep their latest name/email on file).
  const user = await prisma.scratchUser.upsert({
    where: { mobile },
    update: { fullName, email: email || null },
    create: { fullName, mobile, email: email || null },
  });

  // One scratch card per mobile number — return the existing one if they already played.
  const existing = await prisma.scratchCard.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { reward: true },
  });
  if (existing) {
    return NextResponse.json(serializeCard(existing, existing.reward, true));
  }

  // Pick a guaranteed reward (weighted) and mint a unique coupon.
  const rewards = await prisma.scratchReward.findMany();
  const reward = pickReward(rewards);
  const couponCode = await generateCouponCode(reward.couponPrefix);

  const expiresAt = new Date(Date.now() + campaign.couponValidityDays * 24 * 60 * 60 * 1000);

  let card;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      card = await prisma.scratchCard.create({
        data: {
          userId: user.id,
          campaignId: campaign.id,
          rewardId: reward.id,
          couponCode: attempt === 0 ? couponCode : await generateCouponCode(reward.couponPrefix),
          status: 'ISSUED',
          expiresAt,
        },
      });
      break;
    } catch (e) {
      if (e.code === 'P2002') continue; // coupon collided, retry
      if (e.code === 'P2003') {
        // race: another request created a card for this user first — return that one
        const other = await prisma.scratchCard.findFirst({ where: { userId: user.id }, include: { reward: true } });
        if (other) return NextResponse.json(serializeCard(other, other.reward, true));
      }
      throw e;
    }
  }
  if (!card) return NextResponse.json({ error: 'Could not generate a coupon, please try again.' }, { status: 500 });

  return NextResponse.json(serializeCard(card, reward, false), { status: 201 });
}

// ADMIN — list participants / cards with search + status filter.
export async function GET(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const q = (searchParams.get('q') || '').trim();

  const where = {};
  if (status && status !== 'All') where.status = status;
  if (q) {
    where.OR = [
      { couponCode: { contains: q, mode: 'insensitive' } },
      { user: { mobile: { contains: q } } },
      { user: { fullName: { contains: q, mode: 'insensitive' } } },
    ];
  }
  const cards = await prisma.scratchCard.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: true, reward: true, campaign: true, redemption: true },
    take: 1000,
  });
  return NextResponse.json(cards);
}

function serializeCard(card, reward, alreadyParticipated) {
  return {
    alreadyParticipated,
    couponCode: card.couponCode,
    status: card.status,
    scratchedAt: card.scratchedAt,
    expiresAt: card.expiresAt,
    reward: { title: reward.title, description: reward.description },
  };
}
