'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { SITE } from '@/lib/config';
import { Search, Upload, RotateCcw, Box, Image as ImageIcon } from 'lucide-react';

// Room box dimensions (px) for the CSS-3D scene.
const W = 600, H = 360, D = 460;

// Paintable surfaces of the 3D room.
const SURFACES = [
  { key: 'back',    label: 'Back Wall' },
  { key: 'left',    label: 'Left Wall' },
  { key: 'right',   label: 'Right Wall' },
  { key: 'floor',   label: 'Floor' },
];

// Per-surface 3D transform + size + base shading.
const FACE_STYLE = {
  back:  { width: W, height: H, transform: `translate(-50%,-50%) rotateY(180deg) translateZ(${D / 2}px)`, brightness: 1 },
  left:  { width: D, height: H, transform: `translate(-50%,-50%) rotateY(-90deg) translateZ(${W / 2}px)`, brightness: 0.8 },
  right: { width: D, height: H, transform: `translate(-50%,-50%) rotateY(90deg) translateZ(${W / 2}px)`, brightness: 0.85 },
  floor: { width: W, height: D, transform: `translate(-50%,-50%) rotateX(-90deg) translateZ(${H / 2}px)`, brightness: 0.7 },
  ceil:  { width: W, height: D, transform: `translate(-50%,-50%) rotateX(90deg) translateZ(${H / 2}px)`, brightness: 1.1 },
};

const FINISHES = [
  { key: 'matte',  label: 'Matte',  sheen: 0 },
  { key: 'satin',  label: 'Satin',  sheen: 0.12 },
  { key: 'gloss',  label: 'Gloss',  sheen: 0.28 },
];

const DEFAULT_ROOM = { back: '#E4D5B7', left: '#D8C9AB', right: '#DCCDB0', floor: '#9A8666', ceil: '#F4EFE6' };
const PAGE_SIZE = 48;

export default function VisualizerClient() {
  const [mode, setMode] = useState('3d'); // '3d' | 'photo'
  const [surface, setSurface] = useState('back');
  const [roomColors, setRoomColors] = useState(DEFAULT_ROOM);
  const [finish, setFinish] = useState('satin');
  const [yaw, setYaw] = useState(-12);

  // Photo mode
  const [photo, setPhoto] = useState(null);
  const [photoColor, setPhotoColor] = useState('#9CAF88');
  const [intensity, setIntensity] = useState(0.45);

  // Palette (live from the 20k-shade API)
  const [families, setFamilies] = useState([]);
  const [activeFamily, setActiveFamily] = useState('All');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [shades, setShades] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  useEffect(() => { const t = setTimeout(() => setDebounced(query.trim()), 300); return () => clearTimeout(t); }, [query]);

  const fetchPalette = useCallback(async (pageNum, replace) => {
    const id = ++reqId.current;
    setLoading(true);
    const params = new URLSearchParams({ page: String(pageNum), pageSize: String(PAGE_SIZE) });
    if (activeFamily !== 'All') params.set('family', activeFamily);
    if (debounced) params.set('q', debounced);
    const data = await (await fetch(`/api/colors?${params}`)).json();
    if (id !== reqId.current) return;
    setTotal(data.total);
    if (data.families?.length) setFamilies(data.families);
    setShades(prev => replace ? data.items : [...prev, ...data.items]);
    setLoading(false);
  }, [activeFamily, debounced]);

  useEffect(() => { setPage(1); fetchPalette(1, true); }, [activeFamily, debounced, fetchPalette]);

  // Apply a chosen colour to whatever is currently being edited.
  function applyColor(hex) {
    if (mode === 'photo') setPhotoColor(hex);
    else setRoomColors(c => ({ ...c, [surface]: hex }));
  }

  function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhoto(url);
    setMode('photo');
  }

  const activeFinish = FINISHES.find(f => f.key === finish);
  const currentColor = mode === 'photo' ? photoColor : roomColors[surface];

  // Build a WhatsApp enquiry summarising the chosen scheme.
  const enquiryText = mode === 'photo'
    ? `Hi, I used the visualizer on my room photo with colour ${photoColor} (${activeFinish.label} finish). Please advise matching products.`
    : `Hi, I designed a room in the 3D visualizer — Back: ${roomColors.back}, Left: ${roomColors.left}, Right: ${roomColors.right}, Floor: ${roomColors.floor} (${activeFinish.label} finish). Please advise matching products.`;

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8">
      {/* ---------- STAGE ---------- */}
      <div className="glass rounded-3xl p-4">
        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setMode('3d')}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${mode==='3d'?'btn-gold font-semibold':'glass hover:border-gold'}`}>
            <Box size={15}/> 3D Room
          </button>
          <button onClick={() => setMode('photo')}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${mode==='photo'?'btn-gold font-semibold':'glass hover:border-gold'}`}>
            <ImageIcon size={15}/> My Photo
          </button>
          <label className="px-4 py-2 rounded-full text-sm flex items-center gap-2 glass hover:border-gold cursor-pointer ml-auto">
            <Upload size={15}/> Upload room
            <input type="file" accept="image/*" onChange={onUpload} className="hidden"/>
          </label>
        </div>

        {mode === '3d' ? (
          <>
            <div className="relative rounded-2xl overflow-hidden bg-ink-2 h-[26rem]"
              style={{ perspective: '1100px', perspectiveOrigin: '50% 42%' }}>
              <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${D/2}px) rotateY(${yaw}deg)` }}>
                {['back','left','right','floor','ceil'].map(key => {
                  const f = FACE_STYLE[key];
                  const editable = SURFACES.some(s => s.key === key);
                  const color = roomColors[key];
                  const selected = mode==='3d' && surface===key;
                  return (
                    <div key={key}
                      onClick={() => editable && setSurface(key)}
                      className={`absolute top-0 left-0 transition-[box-shadow] ${editable?'cursor-pointer':''}`}
                      style={{
                        width: f.width, height: f.height, transform: f.transform,
                        background: color, filter: `brightness(${f.brightness})`,
                        boxShadow: selected ? 'inset 0 0 0 4px #c9a24b' : 'inset 0 0 60px rgba(0,0,0,0.25)',
                      }}>
                      {/* finish sheen */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6), transparent 55%)', opacity: activeFinish.sheen }}/>
                    </div>
                  );
                })}
              </div>
              <p className="absolute bottom-3 left-4 text-xs text-cream/40">Tap a surface to select, then pick a colour →</p>
            </div>

            {/* Surface selector + rotate */}
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              {SURFACES.map(s => (
                <button key={s.key} onClick={() => setSurface(s.key)}
                  className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${surface===s.key?'btn-gold font-semibold':'glass hover:border-gold'}`}>
                  <span className="w-3 h-3 rounded-full border border-white/30" style={{ background: roomColors[s.key] }}/>
                  {s.label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <RotateCcw size={15} className="text-cream/40"/>
                <input type="range" min="-35" max="35" step="1" value={yaw} onChange={e=>setYaw(+e.target.value)} className="w-28 accent-gold"/>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-ink-2">
              {photo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt="Your room" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 mix-blend-multiply transition-colors" style={{ background: photoColor, opacity: intensity }}/>
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.5), transparent 55%)', opacity: activeFinish.sheen }}/>
                </>
              ) : (
                <label className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer text-cream/50">
                  <Upload size={32}/>
                  <span className="text-sm">Upload a photo of your room to preview colours</span>
                  <input type="file" accept="image/*" onChange={onUpload} className="hidden"/>
                </label>
              )}
            </div>
            {photo && (
              <div className="mt-4">
                <label className="block text-sm text-cream/60 mb-2">Colour strength</label>
                <input type="range" min="0.15" max="0.8" step="0.05" value={intensity} onChange={e=>setIntensity(+e.target.value)} className="w-full accent-gold"/>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------- PALETTE PANEL ---------- */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-2xl mb-1">Colour Palette</h3>
        <p className="text-cream/50 text-xs mb-4">
          {mode === 'photo' ? 'Pick a colour for your photo' : `Painting: ${SURFACES.find(s=>s.key===surface)?.label}`}
        </p>

        {/* Current selection */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-xl border-2 border-gold" style={{ background: currentColor }}/>
          <span className="text-sm text-cream/70">{currentColor}</span>
          <label className="ml-auto text-xs glass px-3 py-1.5 rounded-full hover:border-gold cursor-pointer">
            Custom
            <input type="color" value={currentColor} onChange={e=>applyColor(e.target.value)} className="hidden"/>
          </label>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search shades…"
            className="w-full bg-ink-2 border border-white/10 rounded-full pl-9 pr-3 py-2 text-sm focus:border-gold outline-none"/>
        </div>

        {/* Family filter */}
        <div className="flex gap-1.5 flex-wrap mb-4 max-h-20 overflow-y-auto">
          <button onClick={()=>setActiveFamily('All')}
            className={`px-3 py-1 rounded-full text-xs ${activeFamily==='All'?'btn-gold font-semibold':'glass hover:border-gold'}`}>All</button>
          {families.map(f => (
            <button key={f.family} onClick={()=>setActiveFamily(f.family)}
              className={`px-3 py-1 rounded-full text-xs ${activeFamily===f.family?'btn-gold font-semibold':'glass hover:border-gold'}`}>{f.family}</button>
          ))}
        </div>

        {/* Swatches */}
        <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
          {shades.map(s => (
            <button key={s.id} title={`${s.name} · ${s.hex}`} onClick={()=>applyColor(s.hex)}
              className={`aspect-square rounded-lg border-2 ${currentColor===s.hex?'border-gold':'border-transparent hover:border-white/40'}`}
              style={{ background: s.hex }}/>
          ))}
        </div>
        {shades.length < total && (
          <button onClick={()=>{ const n=page+1; setPage(n); fetchPalette(n,false); }} disabled={loading}
            className="w-full glass mt-3 py-2 rounded-xl text-xs hover:border-gold disabled:opacity-50">
            {loading ? 'Loading…' : `Load more (${shades.length.toLocaleString()} / ${total.toLocaleString()})`}
          </button>
        )}

        {/* Finish */}
        <label className="block text-sm text-cream/60 mt-5 mb-2">Finish</label>
        <div className="flex gap-2">
          {FINISHES.map(f => (
            <button key={f.key} onClick={()=>setFinish(f.key)}
              className={`flex-1 px-3 py-2 rounded-xl text-xs ${finish===f.key?'btn-gold font-semibold':'glass hover:border-gold'}`}>{f.label}</button>
          ))}
        </div>

        <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(enquiryText)}`}
          target="_blank" rel="noreferrer" className="btn-gold block text-center py-3 rounded-xl mt-6 font-semibold text-sm">Enquire about this scheme</a>
      </div>
    </div>
  );
}
