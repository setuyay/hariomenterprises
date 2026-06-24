import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import InquiryForm from '@/components/InquiryForm';
import { SITE, BRANCHES } from '@/lib/config';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export const metadata = { title: 'Contact Us', description: 'Visit Hariom Enterprises at our two Mandla branches. Address, phone, WhatsApp, directions and map.' };

export default function Contact() {
  return (
    <>
      <Navbar/>
      <FloatingActions/>
      <section className="shell pt-36 pb-20">
        <div className="kicker mono"><span className="l"></span>Get in touch</div>
        <h1 className="font-display text-4xl md:text-5xl mb-3">Contact Us</h1>
        <p className="text-cream/60 max-w-xl mb-10">Reach us by phone, WhatsApp or email — or visit either of our two branches in Mandla.</p>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          <div className="glass rounded-2xl p-6 space-y-4 text-cream/80 h-fit">
            <h3 className="font-display text-2xl">Quick contact</h3>
            <p className="flex items-center gap-3"><Phone className="text-gold shrink-0"/> <a href={`tel:${SITE.phone}`} className="hover:text-gold">{SITE.phone}</a></p>
            <p className="flex items-center gap-3"><Mail className="text-gold shrink-0"/> <a href={`mailto:${SITE.email}`} className="hover:text-gold">{SITE.email}</a></p>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#25D366] hover:underline"><MessageCircle/> Chat on WhatsApp</a>
          </div>
          <InquiryForm/>
        </div>

        {/* BRANCHES */}
        <div className="kicker mono"><span className="l"></span>Visit us</div>
        <h2 className="font-display text-4xl mb-8">Our branches</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {BRANCHES.map((br, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden flex flex-col">
              <div className="p-6">
                <span className="inline-block bg-[#f4ecdd] text-gold text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full mb-3">{br.tag}</span>
                <h3 className="font-display text-2xl mb-3">{br.name}</h3>
                <p className="flex items-start gap-2 text-cream/75 text-sm mb-3"><MapPin size={18} className="text-nerolac mt-0.5 shrink-0"/> {br.address}</p>
                <p className="flex items-center gap-2 text-cream/75 text-sm"><Phone size={16} className="text-mrf shrink-0"/> <a href={`tel:${br.phone}`} className="font-semibold hover:text-gold">{br.phone}</a> · {br.hours}</p>
                <div className="flex gap-2.5 flex-wrap mt-5">
                  <a href={`tel:${br.phone}`} className="btn-gold px-5 py-2.5 rounded-full text-sm font-semibold">Call</a>
                  <a href={`https://wa.me/${br.whatsapp || SITE.whatsapp}?text=Hi%20Hariom%20Enterprises%20(${encodeURIComponent(br.tag)})`} target="_blank" rel="noreferrer" className="btn-wa px-5 py-2.5 rounded-full text-sm font-semibold">WhatsApp</a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${br.coords}`} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-2.5 rounded-full text-sm font-semibold">Get directions →</a>
                </div>
              </div>
              <iframe title={br.tag} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${br.coords}&z=16&output=embed`}
                className="w-full h-56 border-0 mt-auto"/>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </>
  );
}
