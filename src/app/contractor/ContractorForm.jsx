'use client';
import { useState } from 'react';
import { SITE } from '@/lib/config';
import { CheckCircle2 } from 'lucide-react';

const WORK = ['Painting Contractor', 'Builder / Developer', 'Interior Designer', 'Waterproofing Applicator', 'Other'];

export default function ContractorForm() {
  const [f, setF] = useState({ name: '', businessName: '', phone: '', email: '', city: '', workType: '', message: '' });
  const [status, setStatus] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const inp = 'w-full bg-ink-2 border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold transition-colors';

  async function submit(e) {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/contractors', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    setStatus(res.ok ? 'success' : 'error');
  }

  if (status === 'success') {
    const txt = `Hi Hariom Enterprises, I'd like to open a contractor account.%0AName: ${f.name}%0ABusiness: ${f.businessName || '-'}%0APhone: ${f.phone}%0ACity: ${f.city || '-'}%0AType: ${f.workType || '-'}`;
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 size={44} className="text-kamdhenu mx-auto mb-4"/>
        <h3 className="font-display text-2xl mb-2">Application received!</h3>
        <p className="text-cream/70 mb-6">Thanks, {f.name.split(' ')[0]}. Our team will review your details and call you within 1 business day to set up your contractor account &amp; bulk rates.</p>
        <a href={`https://wa.me/${SITE.whatsapp}?text=${txt}`} target="_blank" rel="noreferrer" className="btn-wa inline-block px-6 py-3 rounded-full font-semibold text-sm">Message us on WhatsApp to fast-track</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass rounded-2xl p-6 md:p-8 grid sm:grid-cols-2 gap-3">
      <input className={inp} required placeholder="Your name *" value={f.name} onChange={set('name')}/>
      <input className={inp} placeholder="Business / firm name" value={f.businessName} onChange={set('businessName')}/>
      <input className={inp} required placeholder="Phone *" value={f.phone} onChange={set('phone')}/>
      <input className={inp} type="email" placeholder="Email" value={f.email} onChange={set('email')}/>
      <input className={inp} placeholder="City / area" value={f.city} onChange={set('city')}/>
      <select className={inp} value={f.workType} onChange={set('workType')}>
        <option value="">Type of work</option>
        {WORK.map(w => <option key={w} value={w}>{w}</option>)}
      </select>
      <textarea className={`${inp} sm:col-span-2`} rows={3} placeholder="Tell us about your typical orders / monthly volume" value={f.message} onChange={set('message')}/>
      <button disabled={status === 'loading'} className="btn-gold sm:col-span-2 py-3.5 rounded-xl font-semibold">
        {status === 'loading' ? 'Submitting…' : 'Apply for a contractor account'}
      </button>
      {status === 'error' && <p className="sm:col-span-2 text-nerolac text-sm">Something went wrong. Please try again or call us.</p>}
    </form>
  );
}
