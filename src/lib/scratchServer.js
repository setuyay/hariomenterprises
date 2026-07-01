import { prisma } from '@/lib/prisma';
import { REWARD_DEFAULTS } from '@/lib/scratchSchema';

// Seed a default campaign + reward catalogue the first time the module is used,
// so Scratch & Win works out of the box. Only seeds when BOTH tables are empty,
// so an admin who deletes/disables everything is never silently overwritten.
export async function ensureSeed() {
  const [campaignCount, rewardCount] = await Promise.all([
    prisma.scratchCampaign.count(),
    prisma.scratchReward.count(),
  ]);

  if (rewardCount === 0) {
    await prisma.scratchReward.createMany({ data: REWARD_DEFAULTS });
  }
  if (campaignCount === 0) {
    await prisma.scratchCampaign.create({
      data: { title: 'Hariom Enterprises Scratch & Win', couponValidityDays: 30, isActive: true },
    });
  }
}

// Pick the currently running campaign (active, within its date window if set).
export async function getActiveCampaign(now = new Date()) {
  const campaigns = await prisma.scratchCampaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  return (
    campaigns.find(
      (c) => (!c.startDate || c.startDate <= now) && (!c.endDate || c.endDate >= now)
    ) || null
  );
}

// Weighted random selection across active rewards. Guarantees a reward —
// there is no "better luck next time".
export function pickReward(rewards) {
  const pool = rewards.filter((r) => r.isActive && r.probability > 0);
  const list = pool.length ? pool : rewards; // fall back to any reward, always win
  const total = list.reduce((s, r) => s + (r.probability > 0 ? r.probability : 1), 0);
  let roll = Math.random() * total;
  for (const r of list) {
    roll -= r.probability > 0 ? r.probability : 1;
    if (roll <= 0) return r;
  }
  return list[list.length - 1];
}

// Generate a unique coupon code like "BRUSH-7F3KQ" (prefix from the reward).
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no confusing 0/O/1/I
function randomSuffix(len = 5) {
  let out = '';
  for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}

export async function generateCouponCode(prefix) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = `${prefix}-${randomSuffix(5)}`;
    const existing = await prisma.scratchCard.findUnique({ where: { couponCode: code }, select: { id: true } });
    if (!existing) return code;
  }
  // extremely unlikely — widen the suffix as a last resort
  return `${prefix}-${randomSuffix(8)}`;
}
