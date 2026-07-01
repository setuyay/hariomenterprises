import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// ADMIN — analytics summary for the dashboard.
export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const [totalParticipants, totalCards, byStatus, byReward, redemptions] = await Promise.all([
    prisma.scratchUser.count(),
    prisma.scratchCard.count(),
    prisma.scratchCard.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.scratchCard.groupBy({ by: ['rewardId'], _count: { _all: true } }),
    prisma.couponRedemption.aggregate({ _sum: { purchaseAmount: true }, _count: { _all: true } }),
  ]);

  const rewards = await prisma.scratchReward.findMany({ select: { id: true, title: true } });
  const rewardName = Object.fromEntries(rewards.map((r) => [r.id, r.title]));

  const statusCounts = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all]));
  const rewardBreakdown = byReward
    .map((r) => ({ title: rewardName[r.rewardId] || `Reward #${r.rewardId}`, count: r._count._all }))
    .sort((a, b) => b.count - a.count);

  const redeemed = statusCounts.REDEEMED || 0;
  const redemptionRate = totalCards ? Math.round((redeemed / totalCards) * 100) : 0;

  return NextResponse.json({
    totalParticipants,
    totalCards,
    issued: statusCounts.ISSUED || 0,
    scratched: statusCounts.SCRATCHED || 0,
    redeemed,
    expired: statusCounts.EXPIRED || 0,
    redemptionRate,
    totalPurchaseValue: redemptions._sum.purchaseAmount || 0,
    rewardBreakdown,
  });
}
