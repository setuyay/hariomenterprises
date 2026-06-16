import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-5">
      <h1 className="font-display text-7xl gold-text">404</h1>
      <p className="text-cream/60 mt-4">The page you're looking for doesn't exist.</p>
      <Link href="/" className="btn-gold px-7 py-3 rounded-full mt-8 font-semibold text-sm">Back Home</Link>
    </div>
  );
}
