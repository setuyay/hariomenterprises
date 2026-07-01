'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Lock, ChevronDown } from 'lucide-react';
import { SITE, BRANDS } from '@/lib/config';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  // On the homepage hero / dark visualizer (and not scrolled), use light text for contrast.
  const overHero = (pathname === '/' || pathname === '/visualizer') && !scrolled;
  const linkCls = `text-sm font-medium transition-colors whitespace-nowrap hover:text-gold ${overHero ? 'text-white/90' : 'text-cream/75'}`;
  const links = [['Home','/'],['Products','/products'],['Services','/#services'],['Painting Tools','/painting-tools'],['How To Paint','/how-to-paint'],['Contractor Account','/contractor'],['Warranty','/warranty-registration'],['Scratch & Win','/scratch-win'],['About','/about'],['Contact','/contact']];
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? 'bg-ink/90 backdrop-blur border-b border-line py-3' : 'py-5 bg-transparent'}`}>
      <nav className="shell flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide">
          <span className="gold-text">Hariom</span> <span className="gold-text">Enterprises</span>
        </Link>
        <div className="hidden lg:flex items-center gap-5">
          {links.map(([l,h]) => l === 'Products' ? (
            <div key={h} className="relative group">
              <Link href="/products" className={`${linkCls} inline-flex items-center gap-1`}>Products <ChevronDown size={13}/></Link>
              <div className="absolute left-0 top-full pt-3 hidden group-hover:block z-50">
                <div className="bg-ink-2 border border-line rounded-xl p-2 min-w-[200px] shadow-xl">
                  <Link href="/products" className="block px-3 py-2 rounded-lg text-sm text-cream/75 hover:bg-gold/10 hover:text-gold">All Products</Link>
                  {BRANDS.map(b => (
                    <Link key={b.slug} href={`/brands/${b.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cream/75 hover:bg-gold/10 hover:text-gold">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }}/> {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
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
          {links.map(([l,h]) => l === 'Products' ? (
            <div key={h}>
              <Link href="/products" onClick={() => setOpen(false)} className="text-cream/80 hover:text-gold">Products</Link>
              <div className="flex flex-col gap-2 mt-2 ml-4 border-l border-line pl-4">
                {BRANDS.map(b => (
                  <Link key={b.slug} href={`/brands/${b.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm text-cream/65 hover:text-gold">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }}/> {b.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link key={h} href={h} onClick={() => setOpen(false)} className="text-cream/80 hover:text-gold">{l}</Link>
          ))}
          <Link href="/admin/login" onClick={() => setOpen(false)} className="text-cream/80 hover:text-gold flex items-center gap-1.5"><Lock size={14}/> Admin</Link>
          <a href={`tel:${SITE.phone}`} className="btn-gold px-5 py-2 rounded-full text-sm font-semibold text-center">Call Now</a>
        </div>
      )}
    </header>
  );
}
