'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, Lock } from 'lucide-react';
import { SITE } from '@/lib/config';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = [['Home','/'],['Offers','/#offers'],['Products','/products'],['Services','/#services'],['Tools','/#tools'],['Colours','/colours'],['Visualizer','/visualizer'],['Calculators','/calculators'],['Contractor Account','/contractor'],['About','/about'],['Contact','/contact']];
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'bg-ink/90 backdrop-blur border-b border-line py-3' : 'py-5 bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide">
          <span className="gold-text">Hariom</span> <span className="gold-text">Enterprises</span>
        </Link>
        <div className="hidden lg:flex items-center gap-5">
          {links.map(([l,h]) => (
            <Link key={h} href={h} className="text-sm font-medium text-cream/75 hover:text-gold transition-colors whitespace-nowrap">{l}</Link>
          ))}
          <Link href="/admin/login" className="text-sm font-medium text-cream/75 hover:text-gold transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <Lock size={14}/> Admin
          </Link>
          <a href={`tel:${SITE.phone}`} className="btn-gold px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Phone size={15}/> Call Now
          </a>
        </div>
        <button className="lg:hidden text-cream" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
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
