'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UploadCloud, Check, CheckCircle2, Download, MessageCircle, ShieldCheck } from 'lucide-react';
import { warrantySchema, fieldErrors, PROPERTY_TYPES, BRANDS } from '@/lib/warrantySchema';
import { downloadWarrantyCertificate } from '@/lib/warrantyCertificate';
import WarrantyStatusBadge from '@/components/WarrantyStatusBadge';
import { SITE } from '@/lib/config';

const INITIAL = {
  customerName: '', mobile: '', email: '', address: '', city: '', district: '', pincode: '',
  brandName: '', productName: '', shadeName: '', batchNumber: '', purchaseDate: '', quantityPurchased: '', invoiceNumber: '',
  propertyType: '', paintedArea: '', contractorName: '', applicationDate: '',
  invoiceFile: '', productPhoto: '', wallPhoto: '',
  declaration: false,
};

const inp = 'w-full bg-white/70 backdrop-blur border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-gold focus:bg-white transition-colors';

function Field({ label, error, required, children, full }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-cream/55 mb-1.5">{label}{required && <span className="text-gold"> *</span>}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function Section({ title, step, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: step * 0.06 }}
      className="glass backdrop-blur-md rounded-2xl p-6 md:p-7 border border-line">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-full btn-gold flex items-center justify-center text-sm font-bold">{step}</span>
        <h2 className="font-display text-2xl">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-cream/50">{k}</span>
      <span className="text-cream/90 text-right">{v}</span>
    </div>
  );
}

export default function WarrantyForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [fileMeta, setFileMeta] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [result, setResult] = useState(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }));
  };

  async function pickFile(field, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileMeta((m) => ({ ...m, [field]: { name: file.name, uploading: true, error: '' } }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/warranty/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setForm((f) => ({ ...f, [field]: json.url }));
      setFileMeta((m) => ({ ...m, [field]: { name: file.name, uploading: false, error: '' } }));
      setErrors((er) => ({ ...er, [field]: '' }));
    } catch (err) {
      setForm((f) => ({ ...f, [field]: '' }));
      setFileMeta((m) => ({ ...m, [field]: { name: '', uploading: false, error: err.message } }));
    }
  }

  function resetForm() {
    setResult(null); setForm(INITIAL); setErrors({}); setFileMeta({}); setServerError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(e) {
    e.preventDefault();
    setServerError('');
    const payload = {
      ...form,
      mobile: form.mobile.replace(/\D/g, '').slice(-10),
      pincode: form.pincode.replace(/\D/g, ''),
    };
    const parsed = warrantySchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/warranty', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors || {});
        setServerError(json.error || 'Something went wrong. Please try again.');
        return;
      }
      setResult(json);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function Upload({ label, field, required }) {
    const meta = fileMeta[field];
    return (
      <div>
        <label className="block text-xs font-semibold text-cream/55 mb-1.5">{label}{required && <span className="text-gold"> *</span>}</label>
        <label className="flex items-center gap-3 cursor-pointer bg-white/60 border border-dashed border-line rounded-xl px-4 py-3 hover:border-gold transition-colors">
          <UploadCloud size={18} className="text-gold shrink-0" />
          <span className="text-sm text-cream/70 truncate flex-1">
            {meta?.uploading ? 'Uploading…' : meta?.name || 'Choose file · PDF/JPG/PNG · max 5MB'}
          </span>
          {form[field] && !meta?.uploading && <Check size={16} className="text-kamdhenu shrink-0" />}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*" className="hidden" onChange={(e) => pickFile(field, e)} />
        </label>
        {meta?.error && <p className="text-red-500 text-xs mt-1.5">{meta.error}</p>}
        {errors[field] && !meta?.error && <p className="text-red-500 text-xs mt-1.5">{errors[field]}</p>}
      </div>
    );
  }

  // ---------- SUCCESS STATE ----------
  if (result) {
    const waMsg = `Thank you for registering your paint warranty with Hariom Enterprises.\n\nWarranty ID: ${result.warrantyId}\n\nYour registration is under review.`;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-xl mx-auto glass rounded-3xl p-8 md:p-10 text-center border border-line">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-kamdhenu/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={44} className="text-kamdhenu" />
        </motion.div>
        <h2 className="font-display text-3xl mb-2">Warranty Registered!</h2>
        <p className="text-cream/60 mb-6">Thank you, {result.customerName.split(' ')[0]}. Your registration is under review.</p>

        <div className="rounded-2xl p-5 text-left space-y-2.5 mb-6 bg-white/60 border border-line">
          <Row k="Warranty ID" v={<span className="font-mono font-bold text-gold">{result.warrantyId}</span>} />
          <Row k="Customer" v={result.customerName} />
          <Row k="Product" v={`${result.brandName} — ${result.productName}`} />
          <Row k="Registration Date" v={new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
          <Row k="Status" v={<WarrantyStatusBadge status={result.status} />} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => downloadWarrantyCertificate(result)} className="btn-gold px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2">
            <Download size={16} /> Download Warranty Certificate
          </button>
          <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer" className="btn-wa px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2">
            <MessageCircle size={16} /> Confirm on WhatsApp
          </a>
        </div>
        <div className="mt-5 text-sm">
          <Link href="/warranty-status" className="text-gold hover:underline">Track status</Link>
          <span className="text-cream/30 mx-2">·</span>
          <button onClick={resetForm} className="text-cream/60 hover:text-gold">Register another</button>
        </div>
      </motion.div>
    );
  }

  // ---------- FORM ----------
  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto space-y-6">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl px-4 py-3 text-center">{serverError}</div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-xl px-4 py-3 text-center">Please fix the highlighted fields below.</div>
      )}

      {/* CUSTOMER */}
      <Section title="Customer Information" step={1}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" required error={errors.customerName}><input className={inp} value={form.customerName} onChange={set('customerName')} placeholder="e.g. Rakesh Yadav" /></Field>
          <Field label="Mobile Number" required error={errors.mobile}><input className={inp} type="tel" value={form.mobile} onChange={set('mobile')} placeholder="10-digit mobile" /></Field>
          <Field label="Email Address" required error={errors.email}><input className={inp} type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></Field>
          <Field label="Pincode" required error={errors.pincode}><input className={inp} value={form.pincode} onChange={set('pincode')} placeholder="481661" /></Field>
          <Field label="Complete Address" required error={errors.address} full><textarea rows={2} className={inp} value={form.address} onChange={set('address')} placeholder="House / street / area" /></Field>
          <Field label="City" required error={errors.city}><input className={inp} value={form.city} onChange={set('city')} placeholder="Mandla" /></Field>
          <Field label="District" required error={errors.district}><input className={inp} value={form.district} onChange={set('district')} placeholder="Mandla" /></Field>
        </div>
      </Section>

      {/* PRODUCT */}
      <Section title="Product Information" step={2}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Brand" required error={errors.brandName}>
            <select className={inp} value={form.brandName} onChange={set('brandName')}>
              <option value="">Select brand…</option>
              {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Product" required error={errors.productName}><input className={inp} value={form.productName} onChange={set('productName')} placeholder="e.g. Impressions 24 Carat" /></Field>
          <Field label="Shade Name / Code" error={errors.shadeName}><input className={inp} value={form.shadeName} onChange={set('shadeName')} placeholder="e.g. Ivory 7864" /></Field>
          <Field label="Batch Number" error={errors.batchNumber}><input className={inp} value={form.batchNumber} onChange={set('batchNumber')} placeholder="Batch no." /></Field>
          <Field label="Purchase Date" required error={errors.purchaseDate}><input className={inp} type="date" max={todayStr} value={form.purchaseDate} onChange={set('purchaseDate')} /></Field>
          <Field label="Quantity Purchased" error={errors.quantityPurchased}><input className={inp} value={form.quantityPurchased} onChange={set('quantityPurchased')} placeholder="e.g. 20 litres" /></Field>
          <Field label="Invoice Number" error={errors.invoiceNumber} full><input className={inp} value={form.invoiceNumber} onChange={set('invoiceNumber')} placeholder="Invoice / bill no." /></Field>
        </div>
      </Section>

      {/* PROJECT */}
      <Section title="Project Information" step={3}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Property Type" error={errors.propertyType}>
            <select className={inp} value={form.propertyType} onChange={set('propertyType')}>
              <option value="">Select type…</option>
              {PROPERTY_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Painted Area (sq.ft)" error={errors.paintedArea}><input className={inp} value={form.paintedArea} onChange={set('paintedArea')} placeholder="e.g. 1200" /></Field>
          <Field label="Painter / Contractor Name" error={errors.contractorName}><input className={inp} value={form.contractorName} onChange={set('contractorName')} placeholder="Contractor name" /></Field>
          <Field label="Application Date" error={errors.applicationDate}><input className={inp} type="date" max={todayStr} value={form.applicationDate} onChange={set('applicationDate')} /></Field>
        </div>
      </Section>

      {/* UPLOADS */}
      <Section title="Uploads" step={4}>
        <div className="grid sm:grid-cols-3 gap-4">
          <Upload label="Invoice (PDF/Image)" field="invoiceFile" required />
          <Upload label="Product Photo" field="productPhoto" />
          <Upload label="Painted Wall Photo" field="wallPhoto" />
        </div>
      </Section>

      {/* DECLARATION + SUBMIT */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="glass backdrop-blur-md rounded-2xl p-6 md:p-7 border border-line">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.declaration} onChange={(e) => { setForm((f) => ({ ...f, declaration: e.target.checked })); if (errors.declaration) setErrors((er) => ({ ...er, declaration: '' })); }} className="mt-1 w-4 h-4 accent-gold" />
          <span className="text-sm text-cream/75">I confirm that all the information provided above is accurate and complete.</span>
        </label>
        {errors.declaration && <p className="text-red-500 text-xs mt-2">{errors.declaration}</p>}

        <button disabled={submitting} className="btn-gold w-full mt-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
          {submitting ? 'Registering…' : <><ShieldCheck size={18} /> Register Warranty</>}
        </button>
      </motion.div>
    </form>
  );
}
