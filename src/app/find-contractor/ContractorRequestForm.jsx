'use client';
import { useState } from 'react';
import { SITE } from '@/lib/config';
import { CheckCircle2 } from 'lucide-react';

export default function ContractorRequestForm() {
  const [f, setF] = useState({ name: '', phone: '', address: '' });
  const [status, setStatus] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const inp = 'w-full bg-ink-2 border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold transition-colors';

  async function submit(e) {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/contractor-requests', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    setStatus(res.ok ? 'success' : 'error');
  }

  if (status === 'success') {
    const txt = `Hi Hariom Enterprises, I need a contractor.%0AName: ${f.name}%0AMobile: ${f.phone}%0AAddress: ${f.address}`;
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 size={44} className="text-kamdhenu mx-auto mb-4" />
        <h3 className="font-display text-2xl mb-2">Request received!</h3>
        <p className="text-cream/70 mb-6">Thanks, {f.name.split(' ')[0]}. We&apos;ll connect you with a trusted contractor and call you on {f.phone} shortly.</p>
        <a href={`https://wa.me/${SITE.whatsapp}?text=${txt}`} target="_blank" rel="noreferrer" className="btn-wa inline-block px-6 py-3 rounded-full font-semibold text-sm">Message us on WhatsApp to fast-track</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 md:p-8 grid gap-3">
      <input className={inp} required placeholder="Your name *" value={f.name} onChange={set('name')} />
      <input className={inp} required type="tel" placeholder="Mobile number *" value={f.phone} onChange={set('phone')} />
      <textarea className={inp} required rows={3} placeholder="Address (where you need the work done) *" value={f.address} onChange={set('address')} />
      <button disabled={status === 'loading'} className="btn-gold py-3.5 rounded-xl font-semibold">
        {status === 'loading' ? 'Submitting…' : 'Request a contractor'}
      </button>
      {status === 'error' && <p className="text-nerolac text-sm">Something went wrong. Please try again or call us.</p>}
    </form>
  );
}
