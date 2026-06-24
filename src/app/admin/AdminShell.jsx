'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tag, Inbox, LogOut, Palette, HardHat, Percent, UserSearch, ShieldCheck } from 'lucide-react';

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === '/admin/login') return children;

  const nav = [
    ['/admin', 'Dashboard', LayoutDashboard],
    ['/admin/products', 'Products', Package],
    ['/admin/brands', 'Brands', Tag],
    ['/admin/colours', 'Colours', Palette],
    ['/admin/offers', 'Offers', Percent],
    ['/admin/inquiries', 'Inquiries', Inbox],
    ['/admin/contractors', 'Contractors', HardHat],
    ['/admin/contractor-requests', 'Contractor Requests', UserSearch],
    ['/admin/warranty', 'Warranty Registrations', ShieldCheck],
  ];
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 glass border-r border-white/10 p-6 flex flex-col fixed h-full">
        <Link href="/" className="font-display text-2xl mb-10"><span className="gold-text">Hariom</span></Link>
        <nav className="space-y-1 flex-1">
          {nav.map(([h,l,Icon])=>{
            const active = pathname === h;
            return (
              <Link key={h} href={h} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${active?'btn-gold font-semibold':'text-cream/70 hover:bg-white/5'}`}>
                <Icon size={18}/> {l}
              </Link>
            );
          })}
        </nav>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-white/5">
          <LogOut size={18}/> Logout
        </button>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
