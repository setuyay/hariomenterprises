import { z } from 'zod';

export const PROPERTY_TYPES = ['Home', 'Shop', 'Office', 'Apartment', 'Commercial Building'];
export const WARRANTY_STATUSES = ['Pending', 'Approved', 'Rejected', 'Expired'];
export const BRANDS = ['Nerolac Paints', 'MRF Paints', 'Kamdhenu Paints', 'Other'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const PIN_RE = /^\d{6}$/;

// optional trimmed string that tolerates empty values
const opt = z.string().trim().optional().default('');

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

export const warrantySchema = z.object({
  // Customer
  customerName: z.string().trim().min(2, 'Full name is required'),
  mobile: z.string().trim().regex(MOBILE_RE, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().trim().regex(EMAIL_RE, 'Enter a valid email address'),
  address: z.string().trim().min(3, 'Address is required'),
  city: z.string().trim().min(1, 'City is required'),
  district: z.string().trim().min(1, 'District is required'),
  pincode: z.string().trim().regex(PIN_RE, 'Enter a valid 6-digit pincode'),

  // Product
  brandName: z.string().trim().min(1, 'Brand is required'),
  productName: z.string().trim().min(1, 'Product is required'),
  shadeName: opt,
  batchNumber: opt,
  purchaseDate: z.string().min(1, 'Purchase date is required')
    .refine((v) => new Date(v) <= endOfToday(), 'Purchase date cannot be in the future'),
  quantityPurchased: opt,
  invoiceNumber: opt,

  // Project
  propertyType: opt,
  paintedArea: opt,
  contractorName: opt,
  applicationDate: opt,

  // Uploads
  invoiceFile: z.string().min(1, 'Invoice upload is required'),
  productPhoto: opt,
  wallPhoto: opt,

  // Declaration
  declaration: z.boolean().refine((v) => v === true, 'Please confirm the declaration'),
});

// Turn a ZodError into a { field: message } map for inline display.
export function fieldErrors(zodError) {
  const out = {};
  for (const issue of zodError.issues) {
    const key = issue.path[0];
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
