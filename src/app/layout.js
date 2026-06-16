import './globals.css';
import { Bricolage_Grotesque, Inter_Tight } from 'next/font/google';
import { SITE } from '@/lib/config';

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500','700','800'], variable: '--font-display' });
const body = Inter_Tight({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-body' });

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: 'Hariom Enterprises offers premium paints and coatings from India\u2019s top brands. Interior, exterior, wood, metal and waterproofing solutions.',
  keywords: ['paint shop', 'Nerolac', 'MRF Paints', 'Kamdhenu', 'paint dealer', 'waterproofing', 'colour shades', 'Hariom Enterprises'],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: 'Premium paints and coatings from India\u2019s top brands.',
    url: SITE.url, siteName: SITE.name, type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="grain" suppressHydrationWarning>{children}</body>
    </html>
  );
}
