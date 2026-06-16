'use client';
import { useState } from 'react';
import { SITE } from '@/lib/config';

const BRANDS = ['Nerolac', 'MRF Paints', 'Kamdhenu', 'Not sure — advise me'];
const WORK = ['Interior', 'Exterior', 'Waterproofing', 'Wood & Metal'];

export default function QuoteForm() {
  const [f, setF] = useState({ name: '', phone: '', brand: '', work: '', message: '' });
  const [status, setStatus] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const inp = 'w-full px-4 py-3.5 rounded-xl border-0 bg-white/95 text-ink text-sm outline-none focus:ring-2 focus:ring-night/30';

  async function submit(e) {
    e.preventDefault();
    setStatus('loading');
    const message = `Quote request — Brand: ${f.brand || '-'}, Work: ${f.work || '-'}. ${f.message || ''}`.trim();
    try {
      await fetch('/api/inquiries', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: f.name, phone: f.phone, message }),
      });
    } catch { /* still open WhatsApp below */ }
    const txt = `Hi Hariom Enterprises, I'd like a quote.%0AName: ${f.name}%0APhone: ${f.phone}%0ABrand: ${f.brand || '-'}%0AWork: ${f.work || '-'}%0ADetails: ${f.message || '-'}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${txt}`, '_blank');
    setStatus('success');
    setF({ name: '', phone: '', brand: '', work: '', message: '' });
  }

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
      <input className={inp} required placeholder="Your name" value={f.name} onChange={set('name')}/>
      <input className={inp} required placeholder="Phone number" value={f.phone} onChange={set('phone')}/>
      <select className={inp} value={f.brand} onChange={set('brand')}>
        <option value="">Preferred brand (optional)</option>
        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <select className={inp} value={f.work} onChange={set('work')}>
        <option value="">Type of work</option>
        {WORK.map(w => <option key={w} value={w}>{w}</option>)}
      </select>
      <textarea className={`${inp} sm:col-span-2`} rows={3} placeholder="Approx. area / message" value={f.message} onChange={set('message')}/>
      <button disabled={status === 'loading'} className="sm:col-span-2 bg-night text-white font-semibold py-4 rounded-xl hover:bg-black transition-colors">
        {status === 'loading' ? 'Sending…' : 'Send enquiry on WhatsApp →'}
      </button>
      {status === 'success' && <p className="sm:col-span-2 text-white font-medium">Thanks! We’ve logged your request and opened WhatsApp — send the message to reach us instantly.</p>}
    </form>
  );
}
