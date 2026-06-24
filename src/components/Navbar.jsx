'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Lock } from 'lucide-react';
import { SITE } from '@/lib/config';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  // On the homepage hero (dark banner image) and not scrolled, use light text for contrast.
  const overHero = pathname === '/' && !scrolled;
  const linkCls = `text-sm font-medium transition-colors whitespace-nowrap hover:text-gold ${overHero ? 'text-white/90' : 'text-cream/75'}`;
  const links = [['Home','/'],['Products','/products'],['Services','/#services'],['Painting Tools','/painting-tools'],['Contractor Account','/contractor'],['Warranty','/warranty-registration'],['About','/about'],['Contact','/contact']];
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'bg-ink/90 backdrop-blur border-b border-line py-3' : 'py-5 bg-transparent'}`}>
      <nav className="shell flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide">
          <span className="gold-text">Hariom</span> <span className="gold-text">Enterprises</span>
        </Link>
        <div className="hidden lg:flex items-center gap-5">
          {links.map(([l,h]) => (
            <Link key={h} href={h} className={linkCls}>{l}</Link>
          ))}
          <Link href="/admin/login" className={`${linkCls} flex items-center gap-1.5`}>
            <Lock size={14}/> Admin
          </Link>
          <a href={`tel:${SITE.phone}`} className="btn-gold px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Phone size={15}/> Call Now
          </a>
        </div>
        <button className={`lg:hidden ${overHero ? 'text-white' : 'text-cream'}`} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </nav>
      {open && (
        <div className="lg:hidden glass mx-4 mt-3 rounded-2xl p-5 flex flex-col gap-4">
          {links.map(([l,h]) => (
            <Link key={h} href={h} onClick={() => setOpen(false)} className="text-ink/75 hover:text-gold">{l}</Link>
          ))}
          <Link href="/admin/login" onClick={() => setOpen(false)} className="text-ink/75 hover:text-gold flex items-center gap-1.5"><Lock size={14}/> Admin</Link>
          <a href={`tel:${SITE.phone}`} className="btn-gold px-5 py-2 rounded-full text-sm font-semibold text-center">Call Now</a>
        </div>
      )}
    </header>
  );
}
