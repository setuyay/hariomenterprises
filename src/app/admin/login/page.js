'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setErr('');
    const res = await fetch('/api/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) router.push('/admin');
    else setErr('Invalid email or password');
  }
  const inp = 'w-full bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none';
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <form onSubmit={submit} className="glass rounded-3xl p-10 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-gold transition-colors mb-6">
          <Home size={15}/> Back to Home
        </Link>
        <h1 className="font-display text-4xl text-center mb-2"><span className="gold-text">Admin</span> Login</h1>
        <p className="text-cream/50 text-sm text-center mb-8">Hariom Enterprises Dashboard</p>
        <div className="space-y-4">
          <input className={inp} type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input className={inp} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <button disabled={loading} className="btn-gold w-full py-3 rounded-xl font-semibold">{loading?'Signing in...':'Sign In'}</button>
        </div>
        <p className="text-cream/30 text-xs text-center mt-6">Default: admin@hariomenterprises.com / admin123</p>
      </form>
    </div>
  );
}
