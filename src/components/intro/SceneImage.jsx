'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useTransform } from 'framer-motion';

// Camera-move presets. Each returns Framer `animate`/`initial` transforms that
// only ever touch opacity + transform, so they stay on the GPU compositor.
function cameraVariants(anim, reduced) {
  if (reduced) return { initial: { scale: 1, x: '0%', y: '0%' }, animate: { scale: 1, x: '0%', y: '0%' } };
  switch (anim) {
    case 'kenburns-in':
      return { initial: { scale: 1.06, x: '-1%', y: '0%' }, animate: { scale: 1.2, x: '1%', y: '-1.5%' } };
    case 'kenburns-out':
      return { initial: { scale: 1.22, x: '1%', y: '-1%' }, animate: { scale: 1.05, x: '0%', y: '0%' } };
    case 'pan-left':
      return { initial: { scale: 1.16, x: '4%', y: '0%' }, animate: { scale: 1.16, x: '-4%', y: '0%' } };
    case 'pan-right':
      return { initial: { scale: 1.16, x: '-4%', y: '0%' }, animate: { scale: 1.16, x: '4%', y: '0%' } };
    case 'parallax':
      return { initial: { scale: 1.14, x: '0%', y: '1.5%' }, animate: { scale: 1.14, x: '0%', y: '-1.5%' } };
    default: // fade
      return { initial: { scale: 1.1, x: '0%', y: '0%' }, animate: { scale: 1.12, x: '0%', y: '0%' } };
  }
}

export default function SceneImage({ scene, reduced, duration, px, py }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  // If the image was already decoded (preloaded/cached), onLoad may not refire.
  useEffect(() => { if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true); }, []);
  const cam = cameraVariants(scene.anim, reduced);
  const isParallax = scene.anim === 'parallax' && !reduced;

  // Pointer parallax — gentle ±14px shift on the parallax scene only.
  const tx = useTransform(px, [-1, 1], [14, -14]);
  const ty = useTransform(py, [-1, 1], [10, -10]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* pointer-parallax wrapper (no-op transforms when not parallax) */}
      <motion.div className="absolute inset-0" style={isParallax ? { x: tx, y: ty } : undefined}>
        {/* slow cinematic camera move */}
        <motion.div
          className="absolute inset-[-4%]"
          style={{ background: scene.bg, willChange: 'transform' }}
          initial={cam.initial}
          animate={cam.animate}
          transition={{ duration: duration / 1000 + 1, ease: 'linear' }}
        >
          {/* photo fades in over the gradient once it has decoded */}
          <motion.img
            ref={imgRef}
            src={scene.src}
            alt={scene.title}
            loading="eager"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(false)}
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* soft cinematic scrims — light, never heavy */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/15" />
      <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 180px 40px rgba(0,0,0,.35)' }} />
    </div>
  );
}
