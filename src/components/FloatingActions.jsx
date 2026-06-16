'use client';
import { Phone, MessageCircle } from 'lucide-react';
import { SITE } from '@/lib/config';

export default function FloatingActions({ productName }) {
  const msg = encodeURIComponent(productName ? `Hi, I'm interested in ${productName}.` : 'Hi, I would like an inquiry about your paints.');
  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
      <a href={`https://wa.me/${SITE.whatsapp}?text=${msg}`} target="_blank" rel="noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="WhatsApp">
        <MessageCircle className="text-white" />
      </a>
      <a href={`tel:${SITE.phone}`} className="w-14 h-14 rounded-full btn-gold flex items-center justify-center shadow-lg" aria-label="Call">
        <Phone />
      </a>
    </div>
  );
}
