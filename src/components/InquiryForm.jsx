'use client';
import { useState } from 'react';
import { SITE } from '@/lib/config';
import { MessageCircle, Phone } from 'lucide-react';

export default function InquiryForm({ productId, productName }) {
  const [form, setForm] = useState({ customerName: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setStatus('loading');
    const res = await fetch('/api/inquiries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, productId }),
    });
    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) setForm({ customerName: '', phone: '', email: '', message: '' });
  }

  const wa = encodeURIComponent(`Hi, I'm interested in ${productName || 'your products'}.`);
  const inp = 'w-full bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none transition-colors';

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display text-2xl mb-1">Enquire Now</h3>
      <p className="text-cream/50 text-sm mb-5">Get a quote or product details quickly.</p>
      <form onSubmit={submit} className="space-y-3">
        <input className={inp} placeholder="Your Name *" value={form.customerName} onChange={set('customerName')} required/>
        <input className={inp} placeholder="Phone *" value={form.phone} onChange={set('phone')} required/>
        <input className={inp} type="email" placeholder="Email" value={form.email} onChange={set('email')}/>
        <textarea className={inp} rows={3} placeholder="Message" value={form.message} onChange={set('message')}/>
        <button disabled={status==='loading'} className="btn-gold w-full py-3 rounded-xl font-semibold text-sm">
          {status==='loading' ? 'Sending...' : 'Send Inquiry'}
        </button>
        {status==='success' && <p className="text-green-400 text-sm">Thank you! We will contact you shortly.</p>}
        {status==='error' && <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>}
      </form>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <a href={`https://wa.me/${SITE.whatsapp}?text=${wa}`} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl text-sm font-semibold"><MessageCircle size={16}/> WhatsApp</a>
        <a href={`tel:${SITE.phone}`} className="flex items-center justify-center gap-2 glass py-3 rounded-xl text-sm font-semibold hover:border-gold"><Phone size={16}/> Call</a>
      </div>
    </div>
  );
}
