'use client';
import { useState } from 'react';
import { SITE } from '@/lib/config';

const inp = 'w-full bg-ink-2 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold outline-none';

function PaintCalc() {
  const [f, setF] = useState({ length: '', height: '', walls: '4', doors: '1', windows: '2', coats: '2', coverage: '120', price: '' });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const num = v => parseFloat(v) || 0;

  const wallArea = num(f.length) * num(f.height) * num(f.walls);
  const openings = num(f.doors) * 21 + num(f.windows) * 15; // sq ft, rough
  const paintable = Math.max(0, wallArea - openings);
  const totalArea = paintable * num(f.coats);
  const litres = num(f.coverage) > 0 ? totalArea / num(f.coverage) : 0;
  const cost = litres * num(f.price);

  return (
    <div className="glass rounded-3xl p-7">
      <h2 className="font-display text-3xl mb-1">Paint Calculator</h2>
      <p className="text-cream/50 text-sm mb-6">Estimate how much paint your walls need.</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-cream/50 col-span-2">Per-wall dimensions (feet)</label>
        <input className={inp} type="number" placeholder="Wall length (ft)" value={f.length} onChange={set('length')}/>
        <input className={inp} type="number" placeholder="Wall height (ft)" value={f.height} onChange={set('height')}/>
        <input className={inp} type="number" placeholder="No. of walls" value={f.walls} onChange={set('walls')}/>
        <input className={inp} type="number" placeholder="Coats" value={f.coats} onChange={set('coats')}/>
        <input className={inp} type="number" placeholder="Doors" value={f.doors} onChange={set('doors')}/>
        <input className={inp} type="number" placeholder="Windows" value={f.windows} onChange={set('windows')}/>
        <input className={inp} type="number" placeholder="Coverage (sq ft / litre)" value={f.coverage} onChange={set('coverage')}/>
        <input className={inp} type="number" placeholder="Price per litre (₹) optional" value={f.price} onChange={set('price')}/>
      </div>
      <div className="mt-6 space-y-2 text-sm">
        <Row label="Net paintable area" value={`${paintable.toFixed(0)} sq ft`}/>
        <Row label="Total area (incl. coats)" value={`${totalArea.toFixed(0)} sq ft`}/>
        <Row label="Paint required" value={`${litres.toFixed(1)} litres`} highlight/>
        {num(f.price) > 0 && <Row label="Estimated cost" value={`₹ ${cost.toFixed(0)}`} highlight/>}
      </div>
      <EnquireBtn text={`Paint estimate: approx ${litres.toFixed(1)} litres for ${paintable.toFixed(0)} sq ft. Please advise products.`}/>
    </div>
  );
}

function WaterproofCalc() {
  const [f, setF] = useState({ area: '', coats: '2', coverage: '40', price: '' });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const num = v => parseFloat(v) || 0;
  const total = num(f.area) * num(f.coats);
  const litres = num(f.coverage) > 0 ? total / num(f.coverage) : 0;
  const cost = litres * num(f.price);
  return (
    <div className="glass rounded-3xl p-7">
      <h2 className="font-display text-3xl mb-1">Waterproofing Calculator</h2>
      <p className="text-cream/50 text-sm mb-6">Estimate coating for terraces, walls and roofs.</p>
      <div className="grid grid-cols-2 gap-3">
        <input className={`${inp} col-span-2`} type="number" placeholder="Surface area (sq ft)" value={f.area} onChange={set('area')}/>
        <input className={inp} type="number" placeholder="Coats" value={f.coats} onChange={set('coats')}/>
        <input className={inp} type="number" placeholder="Coverage (sq ft / litre)" value={f.coverage} onChange={set('coverage')}/>
        <input className={`${inp} col-span-2`} type="number" placeholder="Price per litre (₹) optional" value={f.price} onChange={set('price')}/>
      </div>
      <div className="mt-6 space-y-2 text-sm">
        <Row label="Total area (incl. coats)" value={`${total.toFixed(0)} sq ft`}/>
        <Row label="Coating required" value={`${litres.toFixed(1)} litres`} highlight/>
        {num(f.price) > 0 && <Row label="Estimated cost" value={`₹ ${cost.toFixed(0)}`} highlight/>}
      </div>
      <EnquireBtn text={`Waterproofing estimate: approx ${litres.toFixed(1)} litres for ${num(f.area).toFixed(0)} sq ft. Please advise products.`}/>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className={`flex justify-between px-4 py-3 rounded-xl ${highlight?'bg-gold/10 text-gold':'bg-white/5'}`}>
      <span className="text-cream/60">{label}</span><span className="font-semibold">{value}</span>
    </div>
  );
}
function EnquireBtn({ text }) {
  return (
    <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer"
      className="btn-gold block text-center py-3 rounded-xl mt-6 font-semibold text-sm">Send estimate on WhatsApp</a>
  );
}

export default function CalculatorsClient() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <PaintCalc/>
      <WaterproofCalc/>
      <p className="lg:col-span-2 text-cream/40 text-xs text-center">Estimates are approximate. Actual coverage varies by surface, product and application. Confirm with our team before purchase.</p>
    </div>
  );
}
