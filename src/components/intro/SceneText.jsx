'use client';
import { motion } from 'framer-motion';

// Floating, blur-in luxury caption for each scene. The glassmorphism chip is
// kept subtle to honour the "no heavy overlays" brief.
export default function SceneText({ title, subtitle, reduced }) {
  const rise = reduced ? 0 : 22;
  return (
    <div className="absolute inset-x-0 bottom-[14vh] md:bottom-[12vh] flex flex-col items-center px-6 text-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: rise, filter: reduced ? 'blur(0px)' : 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: reduced ? 0 : -14, filter: reduced ? 'blur(0px)' : 'blur(6px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex flex-col items-center gap-2 rounded-3xl px-7 py-5 backdrop-blur-md"
        style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)' }}
      >
        <h2
          className="font-display text-white text-3xl md:text-5xl lg:text-6xl tracking-tight"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.45)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-white/85 text-sm md:text-base lg:text-lg font-light tracking-wide max-w-xl"
            style={{ textShadow: '0 1px 16px rgba(0,0,0,.5)' }}
          >
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}
