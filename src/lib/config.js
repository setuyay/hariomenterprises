export const SITE = {
  name: 'Hariom Enterprises',
  tagline: 'Authorized Nerolac · MRF · Kamdhenu Dealer',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '919630717173',
  phone: process.env.NEXT_PUBLIC_PHONE || '+919630717173',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@hariomenterprises.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  address: 'Heera Colony, Near Ashirwad Hotel, Katra Jabalpur Road, Mandla Road, Mandla – 481661, Madhya Pradesh',
  mapEmbed: 'https://maps.google.com/maps?q=22.625118349303794,80.36633211127504&z=16&output=embed',
};

export const CATEGORIES = ['Interior', 'Exterior', 'Wood Finish', 'Metal & Enamel', 'Waterproofing', 'Primer'];

// Brand accent colours
export const BRAND_COLORS = { 'Nerolac Paints': '#e8472b', 'Kamdhenu Paints': '#159e54', 'MRF Paints': '#0a5ad6' };

export const BRANCHES = [
  {
    tag: 'Branch 1 · Katra',
    name: 'Hariom Enterprises',
    address: 'Heera Colony, Near Ashirwad Hotel, Katra Jabalpur Road, Mandla Road, Mandla – 481661, Madhya Pradesh',
    phone: '+919630717173',
    whatsapp: '919630717173',
    hours: '10:00 AM – 8:00 PM · Friday Off',
    coords: '22.625118349303794,80.36633211127504',
  },
  {
    tag: 'Branch 2 · Binjhiya',
    name: 'Hariom Enterprises',
    address: 'Binjhiya Teraha, in front of Mahesh Medical, Mandla, Madhya Pradesh',
    phone: '+917974545900',
    whatsapp: '917974545900',
    hours: '10:00 AM – 8:00 PM · Friday Off',
    coords: '22.608972,80.370028',
  },
];

export const STATS = [
  { value: '15+', label: 'Years serving Mandla' },
  { value: '10,000+', label: 'Homes & projects painted' },
  { value: '62', label: 'Products across 3 brands' },
  { value: '2,000', label: 'Colour shades in stock' },
  { value: '2', label: 'Branches in Mandla' },
  { value: '4.9★', label: 'Average customer rating' },
];

export const REVIEWS = [
  { name: 'Rakesh Yadav', area: 'Mandla Road, Mandla', color: '#e8472b', text: 'Best paint shop in Mandla, hands down. They matched the exact shade I wanted from a photo and the Nerolac exterior is still looking fresh after the monsoon. Honest pricing too.' },
  { name: 'Sunita Patel', area: 'Binjhiya, Mandla', color: '#159e54', text: 'We painted our whole house with their help. The owner guided us on which Kamdhenu interior to pick for each room. Delivery came the same day. Very happy with the service.' },
  { name: 'Amit Sahu', area: 'Civil Lines, Mandla', color: '#0a5ad6', text: "I'm a contractor and I buy in bulk from here. Genuine sealed stock every time and the best rates in the area for MRF and Nerolac. They never disappoint." },
  { name: 'Priya Tiwari', area: 'Ashirwad area, Mandla', color: '#7b3fa0', text: 'The free site visit saved us so much money — they calculated exactly how much paint we needed, no wastage. Friendly staff who actually know their products.' },
  { name: 'Deepak Marskole', area: 'Maharajpur, Mandla', color: '#e8902b', text: 'Got waterproofing done for my terrace before the rains. No leakage this season at all. Highly recommend Hariom Enterprises to everyone in Mandla.' },
  { name: 'Neha Uikey', area: 'Mandla', color: '#159e54', text: 'Loved the Kamdhenu Velvety finish in our bedroom — looks premium and was reasonably priced. The whole experience from choosing colours to delivery was smooth.' },
];
