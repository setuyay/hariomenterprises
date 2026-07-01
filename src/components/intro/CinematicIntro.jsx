'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { SkipForward } from 'lucide-react';
import { INTRO_SCENES, INTRO_BRAND, INTRO_STORAGE_KEY } from '@/lib/introScenes';
import SceneImage from './SceneImage';
import SceneText from './SceneText';

const LAST = INTRO_SCENES.length; // index of the final brand scene
const DURATIONS = [...INTRO_SCENES.map((s) => s.duration), INTRO_BRAND.duration];
const TOTAL = DURATIONS.reduce((a, b) => a + b, 0);

export default function CinematicIntro() {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const finishing = useRef(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // ── First-visit gate ──────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setReady(true);

    // Never interrupt the admin area.
    if (pathname && pathname.startsWith('/admin')) return;

    // `?intro=1` forces the intro to play even after it has been seen (handy for previews).
    const force = new URLSearchParams(window.location.search).has('intro');
    const seen = window.localStorage.getItem(INTRO_STORAGE_KEY) === 'true';
    if (seen && !force) return;

    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Preload scene images + prefetch the homepage for a seamless hand-off.
    INTRO_SCENES.forEach((s) => { const im = new window.Image(); im.src = s.src; });
    router.prefetch('/');

    document.body.style.overflow = 'hidden';
    setVisible(true);
    return () => { document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Scene timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      if (index >= LAST) finish();
      else setIndex((i) => i + 1);
    }, DURATIONS[index]);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, visible]);

  const finish = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    try { window.localStorage.setItem(INTRO_STORAGE_KEY, 'true'); } catch {}
    setVisible(false);
  }, []);

  // ── Keyboard: Escape skips ────────────────────────────────────────
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => { if (e.key === 'Escape') finish(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, finish]);

  const handleExitComplete = useCallback(() => {
    document.body.style.overflow = '';
    if (pathname !== '/') router.push('/');
  }, [pathname, router]);

  const onMove = useCallback((e) => {
    if (reduced) return;
    px.set((e.clientX / window.innerWidth) * 2 - 1);
    py.set((e.clientY / window.innerHeight) * 2 - 1);
  }, [reduced, px, py]);

  if (!ready) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="cinematic-intro"
          className="fixed inset-0 z-[100] bg-white overflow-hidden"
          exit={{ opacity: 0, filter: reduced ? 'blur(0px)' : 'blur(12px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          onMouseMove={onMove}
          role="dialog"
          aria-label="Hariom Enterprises introduction"
        >
          {/* slim cinematic progress bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[3px] origin-left z-20"
            style={{ background: 'linear-gradient(90deg,#e8472b,#ffb347)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: TOTAL / 1000, ease: 'linear' }}
          />

          {/* Skip button — top right, keyboard accessible, adapts to light/dark scenes */}
          <button
            type="button"
            onClick={finish}
            className={`absolute top-5 right-5 z-30 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 ${
              index >= LAST
                ? 'text-[#241c1c]/70 hover:text-[#241c1c] focus-visible:ring-[#241c1c]/40'
                : 'text-white/90 hover:text-white hover:bg-white/15 focus-visible:ring-white/70'
            }`}
            style={
              index >= LAST
                ? { background: 'rgba(20,16,16,.05)', border: '1px solid rgba(20,16,16,.15)' }
                : { background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.2)' }
            }
            aria-label="Skip intro and go to homepage"
          >
            Skip Intro <SkipForward size={15} />
          </button>

          {/* Scenes — synchronous AnimatePresence gives an overlapping crossfade */}
          <AnimatePresence>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, filter: reduced ? 'blur(0px)' : 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: reduced ? 'blur(0px)' : 'blur(10px)' }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            >
              {index < LAST ? (
                <>
                  <SceneImage scene={INTRO_SCENES[index]} reduced={reduced} duration={INTRO_SCENES[index].duration} px={px} py={py} />
                  <SceneText title={INTRO_SCENES[index].title} subtitle={INTRO_SCENES[index].subtitle} reduced={reduced} />
                </>
              ) : (
                <BrandScene reduced={reduced} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Final white, Apple-like brand reveal.
function BrandScene({ reduced }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white px-6 text-center">
      <motion.div
        className="pointer-events-none absolute w-[60vw] h-[60vw] max-w-[720px] max-h-[720px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(232,71,43,.10) 0%, rgba(255,255,255,0) 70%)' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.p
        className="text-[.7rem] md:text-xs font-semibold tracking-[.34em] uppercase text-gold mb-5"
        initial={{ opacity: 0, y: reduced ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        Mandla, Madhya Pradesh
      </motion.p>
      <motion.h1
        className="font-display text-[#241c1c] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]"
        initial={{ opacity: 0, y: reduced ? 0 : 26, filter: reduced ? 'blur(0px)' : 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        Hariom <span className="text-gold">Enterprises</span>
      </motion.h1>
      <motion.div
        className="h-px bg-gold/40 mt-7 mb-5"
        initial={{ width: 0 }}
        animate={{ width: reduced ? 160 : 220 }}
        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
      />
      <motion.p
        className="text-[#241c1c]/70 text-base md:text-xl lg:text-2xl font-light tracking-wide"
        initial={{ opacity: 0, y: reduced ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {INTRO_BRAND.tagline}
      </motion.p>
    </div>
  );
}
