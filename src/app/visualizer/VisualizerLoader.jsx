'use client';
import dynamic from 'next/dynamic';

// R3F can't render on the server — load the canvas client-only.
const Visualizer3D = dynamic(() => import('./Visualizer3D'), {
  ssr: false,
  loading: () => (
    <div className="h-[100svh] w-full bg-[#15171c] flex flex-col items-center justify-center text-white/60 gap-3">
      <div className="w-8 h-8 border-2 border-white/20 border-t-gold rounded-full animate-spin" />
      <p className="text-sm">Loading 3D visualizer…</p>
    </div>
  ),
});

export default function VisualizerLoader() {
  return <Visualizer3D />;
}
