import Link from 'next/link';
import { SITE } from '@/lib/config';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-night text-white/70 mt-24">
      <div className="shell py-16 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-2xl text-white">Hariom <span className="text-sun">Enterprises</span></h3>
          <p className="mt-3 text-sm leading-relaxed text-white/60">Authorized dealer of Nerolac, MRF Paints &amp; Kamdhenu. {SITE.tagline}.</p>
        </div>
        <div className="text-sm">
          <h4 className="text-sun mb-3 tracking-widest uppercase text-xs">Explore</h4>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:text-sun">Products</Link></li>
            <li><Link href="/colours" className="hover:text-sun">Colour Shades</Link></li>
            <li><Link href="/visualizer" className="hover:text-sun">Visualizer</Link></li>
            <li><Link href="/contractor" className="hover:text-sun">Contractor Account</Link></li>
            <li><Link href="/admin/login" className="hover:text-sun">Admin</Link></li>
          </ul>
        </div>
        <div className="text-sm space-y-3">
          <h4 className="text-sun mb-3 tracking-widest uppercase text-xs">Reach Us</h4>
          <p className="flex items-start gap-2"><MapPin size={16} className="text-sun mt-0.5"/> {SITE.address}</p>
          <p className="flex items-center gap-2"><Phone size={16} className="text-sun"/> <a href={`tel:${SITE.phone}`} className="hover:text-sun">{SITE.phone}</a></p>
          <p className="flex items-center gap-2"><Mail size={16} className="text-sun"/> <a href={`mailto:${SITE.email}`} className="hover:text-sun">{SITE.email}</a></p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Hariom Enterprises · Authorized Paint Dealer
      </div>
    </footer>
  );
}
