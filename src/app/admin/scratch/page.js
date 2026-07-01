'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Gift, Search, Download, Plus, Trash2, Ticket, Users, Percent, BarChart3,
  Check, X, Loader2, BadgeCheck, Calendar,
} from 'lucide-react';
import { STATUS_META } from '@/lib/scratchSchema';

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const inp = 'bg-ink-2 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-gold';
const TABS = [['overview', 'Overview', BarChart3], ['participants', 'Participants', Users], ['campaigns', 'Campaigns', Calendar], ['rewards', 'Rewards', Percent]];

export default function AdminScratch() {
  const [tab, setTab] = useState('overview');
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="font-display text-4xl flex items-center gap-3"><Gift className="text-gold" /> Scratch &amp; Win</h1>
        <a href="/scratch-win" target="_blank" rel="noreferrer" className="text-sm text-gold hover:underline">View public page →</a>
      </div>

      <div className="flex gap-1 mb-8 border-b border-line overflow-x-auto">
        {TABS.map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === id ? 'border-gold text-gold' : 'border-transparent text-cream/55 hover:text-cream'}`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <Overview />}
      {tab === 'participants' && <Participants />}
      {tab === 'campaigns' && <Campaigns />}
      {tab === 'rewards' && <Rewards />}
    </div>
  );
}

/* ───────────────── Overview / analytics ───────────────── */
function Overview() {
  const [s, setS] = useState(null);
  useEffect(() => { fetch('/api/scratch/stats').then((r) => r.json()).then(setS).catch(() => {}); }, []);
  if (!s) return <p className="text-cream/40 text-sm">Loading analytics…</p>;
  const cards = [
    ['Participants', s.totalParticipants, Users],
    ['Coupons issued', s.totalCards, Ticket],
    ['Scratched', s.scratched, Gift],
    ['Redeemed', s.redeemed, BadgeCheck],
    ['Redemption rate', `${s.redemptionRate}%`, BarChart3],
    ['Sales from coupons', `₹${Number(s.totalPurchaseValue).toLocaleString('en-IN')}`, Percent],
  ];
  const max = Math.max(1, ...s.rewardBreakdown.map((r) => r.count));
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(([label, value, Icon]) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between"><span className="text-cream/50 text-sm">{label}</span><Icon size={18} className="text-gold/70" /></div>
            <p className="font-display text-3xl mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-display text-xl mb-4">Rewards won</h3>
        {s.rewardBreakdown.length === 0 ? <p className="text-cream/40 text-sm">No coupons issued yet.</p> : (
          <div className="space-y-3">
            {s.rewardBreakdown.map((r) => (
              <div key={r.title} className="flex items-center gap-3">
                <span className="w-48 shrink-0 text-sm text-cream/70 truncate">{r.title}</span>
                <div className="flex-1 bg-ink-2 rounded-full h-3 overflow-hidden"><div className="h-full btn-gold rounded-full" style={{ width: `${(r.count / max) * 100}%` }} /></div>
                <span className="w-8 text-right text-sm text-cream/60">{r.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────── Participants ───────────────── */
function Participants() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (q.trim()) p.set('q', q.trim());
      if (status !== 'All') p.set('status', status);
      const res = await fetch(`/api/scratch?${p}`);
      setItems(res.ok ? await res.json() : []);
    } catch { setItems([]); } finally { setLoading(false); }
  }, [q, status]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
            <input className={`${inp} pl-9 w-64`} placeholder="Search mobile, name, coupon…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className={inp} value={status} onChange={(e) => setStatus(e.target.value)}>
            {['All', 'ISSUED', 'SCRATCHED', 'REDEEMED', 'EXPIRED'].map((s) => <option key={s} value={s}>{s === 'All' ? 'All statuses' : STATUS_META[s]?.label || s}</option>)}
          </select>
        </div>
        <a href="/api/scratch/export" className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><Download size={15} /> Export Excel</a>
      </div>

      {loading && <p className="text-cream/40 text-sm mb-3">Loading…</p>}
      {!loading && items.length === 0 && <p className="text-cream/40">No participants found.</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cream/45 border-b border-line">
              {['Customer', 'Mobile', 'Coupon', 'Reward', 'Status', 'Expires', 'Action'].map((h) => <th key={h} className="py-3 px-3 font-medium whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((c) => {
              const meta = STATUS_META[c.status] || {};
              return (
                <tr key={c.id} className="border-b border-line/50 hover:bg-white/[.02]">
                  <td className="py-3 px-3">
                    <p className="font-medium">{c.user.fullName}</p>
                    {c.user.email && <p className="text-cream/40 text-xs">{c.user.email}</p>}
                  </td>
                  <td className="py-3 px-3"><a href={`tel:${c.user.mobile}`} className="text-gold hover:underline">{c.user.mobile}</a></td>
                  <td className="py-3 px-3 font-mono text-cream/80">{c.couponCode}</td>
                  <td className="py-3 px-3 text-cream/70">{c.reward.title}</td>
                  <td className="py-3 px-3"><span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ color: meta.color, background: meta.bg }}>{meta.label || c.status}</span></td>
                  <td className="py-3 px-3 text-cream/50 whitespace-nowrap">{fmt(c.expiresAt)}</td>
                  <td className="py-3 px-3">
                    {c.status === 'REDEEMED' ? (
                      <span className="text-kamdhenu text-xs flex items-center gap-1"><Check size={13} /> Redeemed</span>
                    ) : c.status === 'EXPIRED' ? (
                      <span className="text-cream/40 text-xs">Expired</span>
                    ) : (
                      <button onClick={() => setRedeeming(c)} className="text-xs px-3 py-1.5 rounded-lg btn-gold font-semibold">Redeem</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {redeeming && <RedeemModal card={redeeming} onClose={() => setRedeeming(null)} onDone={() => { setRedeeming(null); load(); }} />}
    </div>
  );
}

function RedeemModal({ card, onClose, onDone }) {
  const [invoiceNumber, setInvoice] = useState('');
  const [purchaseAmount, setAmount] = useState('');
  const [redeemedBy, setBy] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const res = await fetch('/api/scratch/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: card.couponCode, invoiceNumber, purchaseAmount, redeemedBy }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Could not redeem'); return; }
      onDone();
    } catch { setErr('Network error'); } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-ink-2 border border-line rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl">Redeem coupon</h3>
          <button type="button" onClick={onClose} className="text-cream/50 hover:text-cream"><X size={20} /></button>
        </div>
        <div className="bg-ink rounded-xl p-3 mb-4 text-sm">
          <p className="font-mono font-bold text-gold">{card.couponCode}</p>
          <p className="text-cream/60 mt-0.5">{card.user.fullName} · {card.user.mobile}</p>
          <p className="text-cream/50 text-xs mt-0.5">Reward: {card.reward.title}</p>
        </div>
        <div className="space-y-3">
          <input className={`${inp} w-full`} placeholder="Invoice number (optional)" value={invoiceNumber} onChange={(e) => setInvoice(e.target.value)} />
          <input className={`${inp} w-full`} type="number" min="0" placeholder="Purchase amount ₹ (optional)" value={purchaseAmount} onChange={(e) => setAmount(e.target.value)} />
          <input className={`${inp} w-full`} placeholder="Redeemed by / staff name (optional)" value={redeemedBy} onChange={(e) => setBy(e.target.value)} />
        </div>
        {err && <p className="text-red-400 text-sm mt-3">{err}</p>}
        <button disabled={busy} className="btn-gold w-full mt-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />} Confirm redemption
        </button>
      </form>
    </div>
  );
}

/* ───────────────── Campaigns ───────────────── */
function Campaigns() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', startDate: '', endDate: '', couponValidityDays: 30, isActive: true });
  const [show, setShow] = useState(false);
  const load = async () => setItems(await (await fetch('/api/scratch/campaigns')).json());
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault();
    await fetch('/api/scratch/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShow(false); setForm({ title: '', startDate: '', endDate: '', couponValidityDays: 30, isActive: true }); load();
  }
  async function toggle(c) {
    await fetch(`/api/scratch/campaigns/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !c.isActive }) });
    load();
  }
  async function del(id) {
    if (!confirm('Delete this campaign? Issued coupons under it will also be removed.')) return;
    await fetch(`/api/scratch/campaigns/${id}`, { method: 'DELETE' }); load();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShow((v) => !v)} className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><Plus size={15} /> New campaign</button>
      </div>
      {show && (
        <form onSubmit={save} className="glass rounded-2xl p-5 mb-6 grid sm:grid-cols-2 gap-4">
          <input className={`${inp} sm:col-span-2`} placeholder="Campaign title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <label className="text-xs text-cream/55">Start date<input type="date" className={`${inp} w-full mt-1`} value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} /></label>
          <label className="text-xs text-cream/55">End date<input type="date" className={`${inp} w-full mt-1`} value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} /></label>
          <label className="text-xs text-cream/55">Coupon validity (days)<input type="number" min="1" className={`${inp} w-full mt-1`} value={form.couponValidityDays} onChange={(e) => setForm((f) => ({ ...f, couponValidityDays: e.target.value }))} /></label>
          <label className="flex items-center gap-2 text-sm text-cream/70 mt-6"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active</label>
          <button className="btn-gold px-5 py-2 rounded-lg text-sm font-semibold sm:col-span-2">Save campaign</button>
        </form>
      )}
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-display text-xl">{c.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${c.isActive ? 'text-kamdhenu bg-kamdhenu/10' : 'text-cream/40 bg-white/5'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="text-cream/50 text-xs mt-1">{fmt(c.startDate)} → {fmt(c.endDate)} · validity {c.couponValidityDays}d · {c._count?.cards ?? 0} coupons</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(c)} className="text-xs px-3 py-1.5 rounded-lg glass hover:border-gold">{c.isActive ? 'Disable' : 'Enable'}</button>
              <button onClick={() => del(c.id)} className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-400/10 flex items-center gap-1"><Trash2 size={13} /> Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-cream/40">No campaigns yet.</p>}
      </div>
    </div>
  );
}

/* ───────────────── Rewards ───────────────── */
function Rewards() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', couponPrefix: '', probability: 5, isActive: true });
  const [show, setShow] = useState(false);
  const load = async () => setItems(await (await fetch('/api/scratch/rewards')).json());
  useEffect(() => { load(); }, []);

  const totalWeight = items.filter((r) => r.isActive).reduce((s, r) => s + (r.probability > 0 ? r.probability : 0), 0) || 1;

  async function save(e) {
    e.preventDefault();
    await fetch('/api/scratch/rewards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShow(false); setForm({ title: '', description: '', couponPrefix: '', probability: 5, isActive: true }); load();
  }
  async function patch(id, data) {
    await fetch(`/api/scratch/rewards/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    load();
  }
  async function del(id) {
    if (!confirm('Delete this reward?')) return;
    const res = await fetch(`/api/scratch/rewards/${id}`, { method: 'DELETE' });
    if (!res.ok) { const d = await res.json(); alert(d.error || 'Could not delete'); }
    load();
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <p className="text-cream/50 text-sm">Probability is a relative weight — every customer always wins one reward.</p>
        <button onClick={() => setShow((v) => !v)} className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><Plus size={15} /> New reward</button>
      </div>
      {show && (
        <form onSubmit={save} className="glass rounded-2xl p-5 mb-6 grid sm:grid-cols-2 gap-4">
          <input className={inp} placeholder="Reward title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          <input className={inp} placeholder="Coupon prefix e.g. BRUSH" value={form.couponPrefix} onChange={(e) => setForm((f) => ({ ...f, couponPrefix: e.target.value }))} required />
          <input className={`${inp} sm:col-span-2`} placeholder="Description (optional)" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <label className="text-xs text-cream/55">Probability weight<input type="number" min="0" step="0.5" className={`${inp} w-full mt-1`} value={form.probability} onChange={(e) => setForm((f) => ({ ...f, probability: e.target.value }))} /></label>
          <label className="flex items-center gap-2 text-sm text-cream/70 mt-6"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} /> Active</label>
          <button className="btn-gold px-5 py-2 rounded-lg text-sm font-semibold sm:col-span-2">Save reward</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cream/45 border-b border-line">
              {['Reward', 'Prefix', 'Weight', 'Win chance', 'Issued', 'Active', ''].map((h) => <th key={h} className="py-3 px-3 font-medium">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-b border-line/50">
                <td className="py-3 px-3">
                  <p className="font-medium">{r.title}</p>
                  {r.description && <p className="text-cream/40 text-xs">{r.description}</p>}
                </td>
                <td className="py-3 px-3 font-mono text-cream/70">{r.couponPrefix}</td>
                <td className="py-3 px-3">
                  <input type="number" min="0" step="0.5" defaultValue={r.probability} onBlur={(e) => e.target.value != r.probability && patch(r.id, { probability: e.target.value })} className={`${inp} w-20`} />
                </td>
                <td className="py-3 px-3 text-cream/60">{r.isActive ? `${Math.round((r.probability / totalWeight) * 100)}%` : '—'}</td>
                <td className="py-3 px-3 text-cream/60">{r._count?.cards ?? 0}</td>
                <td className="py-3 px-3">
                  <button onClick={() => patch(r.id, { isActive: !r.isActive })} className={`text-xs px-2.5 py-1 rounded-md font-semibold ${r.isActive ? 'text-kamdhenu bg-kamdhenu/10' : 'text-cream/40 bg-white/5'}`}>{r.isActive ? 'On' : 'Off'}</button>
                </td>
                <td className="py-3 px-3"><button onClick={() => del(r.id)} className="text-red-400 hover:bg-red-400/10 p-1.5 rounded-md"><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
