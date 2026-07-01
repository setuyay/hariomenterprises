import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const esc = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const fmt = (d) => (d ? new Date(d).toLocaleString('en-IN') : '');

// ADMIN — export all participants/coupons as a CSV (opens directly in Excel).
export async function GET() {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  const cards = await prisma.scratchCard.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, reward: true, campaign: true, redemption: true },
  });

  const headers = [
    'Full Name', 'Mobile', 'Email', 'Coupon Code', 'Reward', 'Campaign', 'Status',
    'Issued At', 'Scratched At', 'Expires At', 'Redeemed At', 'Invoice No.', 'Purchase Amount', 'Redeemed By',
  ];
  const rows = cards.map((c) => [
    c.user.fullName, c.user.mobile, c.user.email, c.couponCode, c.reward.title, c.campaign.title, c.status,
    fmt(c.createdAt), fmt(c.scratchedAt), fmt(c.expiresAt), fmt(c.redeemedAt),
    c.redemption?.invoiceNumber, c.redemption?.purchaseAmount, c.redemption?.redeemedBy,
  ]);

  const csv = '﻿' + [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="scratch-win-participants.csv"',
    },
  });
}
