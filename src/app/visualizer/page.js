import Navbar from '@/components/Navbar';
import VisualizerLoader from './VisualizerLoader';

export const metadata = {
  title: '3D Paint Visualizer',
  description: 'Paint an interactive 3D room — Living Room, Bedroom, Kitchen or Exterior. Rotate, zoom, click any wall and apply Nerolac, Kamdhenu or MRF shades with matte, satin and gloss finishes. By Hariom Enterprises.',
};

export default function VisualizerPage() {
  return (
    <>
      <Navbar />
      <VisualizerLoader />
    </>
  );
}
