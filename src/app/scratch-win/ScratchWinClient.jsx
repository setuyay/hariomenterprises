'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Copy, Check, MessageCircle, Sparkles, Loader2, PartyPopper, Store } from 'lucide-react';
import ScratchCanvas from '@/components/ScratchCanvas';
import Confetti from '@/components/Confetti';
import { participateSchema, fieldErrors } from '@/lib/scratchSchema';
import { SITE } from '@/lib/config';

const inp = 'w-full bg-white/70 backdrop-blur border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold focus:bg-white transition-colors';

export default function ScratchWinClient() {
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [fireKey, setFireKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: '' }));
  };

  async function submit(e) {
    e.preventDefault();
    setServerError('');
    const parsed = participateSchema.safeParse(form);
    if (!parsed.success) { setErrors(fieldErrors(parsed.error)); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/scratch', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setResult(data);
      if (data.alreadyParticipated) {
        // they've played before — show their reward straight away, no scratch foil
        setRevealed(true);
        setFireKey((k) => k + 1);
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onScratchComplete() {
    setRevealed(true);
    setFireKey((k) => k + 1);
    fetch('/api/scratch/reveal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponCode: result.couponCode }),
    }).catch(() => {});
  }

  function copyCode() {
    navigator.clipboard?.writeText(result.couponCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  const waMessage = result
    ? encodeURIComponent(`Hi Hariom Enterprises! 🎉 I won "${result.reward.title}" on your Scratch & Win.\nMy coupon code is: ${result.couponCode}\nI'd like to claim it.`)
    : '';
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${waMessage}`;

  const expiryStr = result?.expiresAt
    ? new Date(result.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <>
      {revealed && <Confetti fire={fireKey} />}

      {!result ? (
        /* ── Entry form ── */
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="glass backdrop-blur-md rounded-2xl p-6 md:p-8 border border-line max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full btn-gold flex items-center justify-center"><Gift size={20} /></span>
            <div>
              <h2 className="font-display text-2xl leading-tight">Get your scratch card</h2>
              <p className="text-cream/55 text-xs">Every customer wins a guaranteed reward 🎁</p>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Full Name" required error={errors.fullName}>
              <input className={inp} placeholder="Your name" value={form.fullName} onChange={set('fullName')} />
            </Field>
            <Field label="Mobile Number" required error={errors.mobile}>
              <input className={inp} inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={form.mobile} onChange={set('mobile')} />
            </Field>
            <Field label="Email (optional)" error={errors.email}>
              <input className={inp} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </Field>
          </div>

          {serverError && <p className="text-red-500 text-sm mt-4">{serverError}</p>}

          <button type="submit" disabled={submitting}
            className="btn-gold w-full mt-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting ? <><Loader2 size={18} className="animate-spin" /> Preparing your card…</> : <><Sparkles size={18} /> Get Scratch Card</>}
          </button>
          <p className="text-cream/40 text-[.7rem] text-center mt-3">One scratch card per mobile number.</p>
        </motion.form>
      ) : (
        /* ── Scratch card ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}
          className="max-w-md mx-auto">
          <div className="glass backdrop-blur-md rounded-3xl p-5 md:p-6 border border-gold/30 relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold/15 blur-3xl" />
            <div className="text-center mb-4 relative z-10">
              <p className="text-[.66rem] font-semibold tracking-[.2em] uppercase text-gold">Hariom Enterprises</p>
              <h2 className="font-display text-2xl mt-1">{result.alreadyParticipated ? 'Your reward' : 'Scratch to reveal'}</h2>
            </div>

            {/* The reward sits underneath the gold foil */}
            <div className="relative h-[200px] rounded-2xl overflow-hidden">
              {!revealed && !result.alreadyParticipated ? (
                <ScratchCanvas onComplete={onScratchComplete} className="w-full h-full rounded-2xl">
                  <RewardFace reward={result.reward} revealed={revealed} />
                </ScratchCanvas>
              ) : (
                <RewardFace reward={result.reward} revealed />
              )}
            </div>

            {/* Coupon + actions appear once revealed */}
            {revealed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 relative z-10">
                <div className="flex items-center gap-2 text-kamdhenu justify-center mb-3 font-semibold">
                  <PartyPopper size={18} /> Congratulations{result.alreadyParticipated ? ' again' : ''}!
                </div>

                <div className="bg-white/70 border border-dashed border-gold rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[.62rem] uppercase tracking-wider text-cream/50">Coupon code</p>
                    <p className="font-mono font-bold text-lg text-cream truncate">{result.couponCode}</p>
                  </div>
                  <button onClick={copyCode} className="shrink-0 btn-gold px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>

                {expiryStr && <p className="text-center text-cream/45 text-xs mt-2">Valid until {expiryStr}. Redeem in store.</p>}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <a href={waLink} target="_blank" rel="noreferrer"
                    className="bg-[#25D366] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90">
                    <MessageCircle size={16} /> Share / Claim
                  </a>
                  <a href="/contact"
                    className="glass py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:border-gold">
                    <Store size={16} /> Visit Store
                  </a>
                </div>

                {result.alreadyParticipated && (
                  <p className="text-center text-cream/40 text-xs mt-3">You've already played — here's your reward again.</p>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

function RewardFace({ reward }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center px-6 rounded-2xl"
      style={{ background: 'radial-gradient(120% 120% at 50% 0%, #3a2a16 0%, #241a12 55%, #160f0a 100%)' }}
    >
      <Gift size={34} className="mb-2" style={{ color: '#ecc66a' }} />
      <p className="text-[.62rem] uppercase tracking-[.2em] mb-1" style={{ color: '#ecc66a' }}>You won</p>
      <p className="font-display text-2xl text-white leading-tight">{reward.title}</p>
      {reward.description && <p className="text-white/65 text-xs mt-2 max-w-xs">{reward.description}</p>}
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-cream/55 mb-1.5">{label}{required && <span className="text-gold"> *</span>}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
