import { z } from 'zod';

const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public — participate (get a scratch card)
export const participateSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name'),
  mobile: z.string().trim().regex(MOBILE_RE, 'Enter a valid 10-digit mobile number'),
  // Email is optional — accept blank, but validate when provided.
  email: z
    .string()
    .trim()
    .optional()
    .default('')
    .refine((v) => v === '' || EMAIL_RE.test(v), 'Enter a valid email address'),
});

// Admin — redeem a coupon
export const redeemSchema = z.object({
  couponCode: z.string().trim().min(3, 'Coupon code is required'),
  invoiceNumber: z.string().trim().optional().default(''),
  purchaseAmount: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v === undefined || v === null ? null : Number(v)))
    .refine((v) => v === null || (!Number.isNaN(v) && v >= 0), 'Enter a valid amount'),
  redeemedBy: z.string().trim().optional().default(''),
});

export const SCRATCH_STATUSES = ['ISSUED', 'SCRATCHED', 'REDEEMED', 'EXPIRED'];

export const STATUS_META = {
  ISSUED: { label: 'Issued', color: '#0a5ad6', bg: 'rgba(10,90,214,.12)' },
  SCRATCHED: { label: 'Scratched', color: '#159e54', bg: 'rgba(21,158,84,.12)' },
  REDEEMED: { label: 'Redeemed', color: '#b88a2e', bg: 'rgba(184,138,46,.14)' },
  EXPIRED: { label: 'Expired', color: '#9a3b3b', bg: 'rgba(154,59,59,.12)' },
};

// Default reward catalogue — seeded automatically the first time the module runs.
// `probability` values are relative weights (they need not sum to 100).
export const REWARD_DEFAULTS = [
  { title: 'Flat 5% OFF', description: 'Flat 5% off your next paint purchase.', couponPrefix: 'FIVE', probability: 12 },
  { title: 'Flat 7% OFF', description: 'Flat 7% off your next paint purchase.', couponPrefix: 'SEVEN', probability: 10 },
  { title: 'Flat 10% OFF', description: 'Flat 10% off your next paint purchase.', couponPrefix: 'TEN', probability: 6 },
  { title: 'Free Premium Paint Brush', description: 'Claim a free premium paint brush.', couponPrefix: 'BRUSH', probability: 12 },
  { title: 'Free Paint Roller', description: 'Claim a free paint roller.', couponPrefix: 'ROLLER', probability: 12 },
  { title: 'Free Paint Tray', description: 'Claim a free paint tray.', couponPrefix: 'TRAY', probability: 10 },
  { title: 'Free Masking Tape', description: 'Claim a free roll of masking tape.', couponPrefix: 'TAPE', probability: 12 },
  { title: 'Free Sandpaper Kit', description: 'Claim a free sandpaper kit.', couponPrefix: 'SAND', probability: 8 },
  { title: 'Waterproofing Discount', description: 'Special discount on waterproofing solutions.', couponPrefix: 'WPROOF', probability: 8 },
  { title: '₹500 OFF on purchases above ₹10,000', description: 'Flat ₹500 off when you buy for ₹10,000 or more.', couponPrefix: 'RS500', probability: 6 },
  { title: '₹1000 OFF on purchases above ₹25,000', description: 'Flat ₹1000 off when you buy for ₹25,000 or more.', couponPrefix: 'RS1000', probability: 4 },
];

// Turn a ZodError into a { field: message } map for inline display.
export function fieldErrors(zodError) {
  const out = {};
  for (const issue of zodError.issues) {
    const key = issue.path[0];
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
