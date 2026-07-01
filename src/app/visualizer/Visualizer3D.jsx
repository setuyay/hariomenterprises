'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Undo2, Redo2, Download, Eye, Home as HomeIcon, BedDouble, ChefHat, Building2, X, Palette } from 'lucide-react';
import { VIS_BRANDS, PALETTES, FINISHES } from '@/lib/visualizerPalette';

const DEFAULT_WALL = '#ece7df';
const FAV_KEY = 'he_vis_favs';
const roughOf = (finish) => (FINISHES.find((f) => f.id === finish) || FINISHES[0]).roughness;

const ROOMS = [
  { id: 'living', label: 'Living Room', icon: HomeIcon, cam: [4.6, 2.6, 5.6], target: [0, 1.4, 0] },
  { id: 'bedroom', label: 'Bedroom', icon: BedDouble, cam: [4.4, 2.6, 5.4], target: [0, 1.4, 0] },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat, cam: [4.8, 2.6, 5.6], target: [0, 1.4, 0] },
  { id: 'exterior', label: 'Exterior', icon: Building2, cam: [7, 4, 8], target: [0, 1.8, 0] },
];

/* ---------------- 3D primitives ---------------- */

function Wall({ id, position, rotation, args, paint, hex, finish }) {
  const [hover, setHover] = useState(false);
  return (
    <mesh
      position={position} rotation={rotation} receiveShadow
      onClick={(e) => { e.stopPropagation(); paint(id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
    >
      <planeGeometry args={args} />
      <meshStandardMaterial
        color={hex} roughness={roughOf(finish)} metalness={0} side={THREE.DoubleSide}
        emissive={'#ffffff'} emissiveIntensity={hover ? 0.08 : 0}
      />
    </mesh>
  );
}

function Slab({ position, rotation, args, color, rough = 0.9 }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={args} />
      <meshStandardMaterial color={color} roughness={rough} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Furniture({ position, size, color, radius = 0.06, rough = 0.7 }) {
  return (
    <RoundedBox args={size} radius={radius} smoothness={3} position={position} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={rough} />
    </RoundedBox>
  );
}

function InteriorRoom({ room, getWall, paint }) {
  const wall = (id) => getWall(room, id);
  return (
    <group>
      {/* floor + ceiling */}
      <Slab position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} args={[6, 6]} color="#b9966b" rough={0.8} />
      <Slab position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} args={[6, 6]} color="#f5f3ee" />
      {/* paintable walls */}
      <Wall id="back" position={[0, 1.5, -3]} rotation={[0, 0, 0]} args={[6, 3]} paint={paint} {...wall('back')} />
      <Wall id="left" position={[-3, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} args={[6, 3]} paint={paint} {...wall('left')} />
      <Wall id="right" position={[3, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} args={[6, 3]} paint={paint} {...wall('right')} />

      {/* furniture per room */}
      {room === 'living' && (<>
        <Furniture position={[0, 0.45, -2.1]} size={[3, 0.8, 1]} color="#6b7a86" radius={0.12} />
        <Furniture position={[0, 0.95, -2.55]} size={[3, 0.5, 0.25]} color="#5d6b76" radius={0.1} />
        <Furniture position={[0, 0.25, -0.7]} size={[1.4, 0.45, 0.7]} color="#3a3a3c" />
        <Slab position={[0, 0.02, -1.2]} rotation={[-Math.PI / 2, 0, 0]} args={[2.6, 2.2]} color="#cdbfa6" rough={0.95} />
      </>)}
      {room === 'bedroom' && (<>
        <Furniture position={[0, 0.35, -1.8]} size={[3.2, 0.6, 2.2]} color="#c9bfae" radius={0.08} />
        <Furniture position={[0, 0.95, -2.7]} size={[3.2, 1, 0.2]} color="#7c5b43" radius={0.06} />
        <Furniture position={[1.8, 0.3, -1.1]} size={[0.6, 0.5, 0.6]} color="#3a3a3c" />
        <Furniture position={[-1.8, 0.3, -1.1]} size={[0.6, 0.5, 0.6]} color="#3a3a3c" />
      </>)}
      {room === 'kitchen' && (<>
        <Furniture position={[0, 0.45, -2.55]} size={[5.4, 0.9, 0.7]} color="#2f3a44" radius={0.04} />
        <Furniture position={[0, 2.3, -2.7]} size={[5.4, 0.7, 0.4]} color="#d9d2c6" radius={0.04} />
        <Furniture position={[0, 0.45, -0.6]} size={[2.4, 0.9, 1.2]} color="#e0d8c8" radius={0.04} />
        <Furniture position={[0, 0.92, -0.6]} size={[2.5, 0.06, 1.3]} color="#3a3a3c" radius={0.02} />
      </>)}
    </group>
  );
}

function ExteriorScene({ getWall, paint }) {
  const wall = (id) => getWall('exterior', id);
  return (
    <group>
      {/* ground */}
      <Slab position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} args={[24, 24]} color="#7f9b5e" rough={1} />
      {/* path */}
      <Slab position={[0, 0.01, 3]} rotation={[-Math.PI / 2, 0, 0]} args={[1.6, 5]} color="#cdbfa6" rough={1} />
      {/* house body — two visible paintable walls */}
      <Wall id="front" position={[0, 1.6, 1.6]} rotation={[0, 0, 0]} args={[4.4, 3.2]} paint={paint} {...wall('front')} />
      <Wall id="side" position={[-2.2, 1.6, -0.2]} rotation={[0, Math.PI / 2, 0]} args={[3.6, 3.2]} paint={paint} {...wall('side')} />
      {/* hidden back/right to close the box */}
      <Slab position={[0, 1.6, -2]} rotation={[0, 0, 0]} args={[4.4, 3.2]} color="#d8d2c6" />
      <Slab position={[2.2, 1.6, -0.2]} rotation={[0, Math.PI / 2, 0]} args={[3.6, 3.2]} color="#d8d2c6" />
      {/* pyramid roof */}
      <mesh position={[0, 3.7, -0.2]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.6, 1.5, 4]} />
        <meshStandardMaterial color="#7c4a39" roughness={0.85} />
      </mesh>
      {/* door + windows */}
      <Furniture position={[0, 0.95, 1.62]} size={[0.9, 1.9, 0.08]} color="#5b3b2a" radius={0.02} />
      <Furniture position={[-1.4, 1.9, 1.62]} size={[0.8, 0.8, 0.06]} color="#9fc7e0" radius={0.02} />
      <Furniture position={[1.4, 1.9, 1.62]} size={[0.8, 0.8, 0.06]} color="#9fc7e0" radius={0.02} />
    </group>
  );
}

function Scene({ roomId, getWall, paint }) {
  return roomId === 'exterior'
    ? <ExteriorScene getWall={getWall} paint={paint} />
    : <InteriorRoom room={roomId} getWall={getWall} paint={paint} />;
}

function CameraRig({ targetPos, lookAt, controlsRef }) {
  const pending = useRef(true);
  const dest = useRef(new THREE.Vector3(...targetPos));
  const look = useRef(new THREE.Vector3(...lookAt));
  useEffect(() => { dest.current.set(...targetPos); look.current.set(...lookAt); pending.current = true; }, [targetPos, lookAt]);
  useFrame(({ camera }) => {
    if (!pending.current || !controlsRef.current) return;
    camera.position.lerp(dest.current, 0.08);
    controlsRef.current.target.lerp(look.current, 0.08);
    controlsRef.current.update();
    if (camera.position.distanceTo(dest.current) < 0.06) pending.current = false;
  });
  return null;
}

/* ---------------- main component ---------------- */

export default function Visualizer3D() {
  const [roomId, setRoomId] = useState('living');
  const [brand, setBrand] = useState('nerolac');
  const [shade, setShade] = useState(PALETTES.nerolac[0]);
  const [finish, setFinish] = useState('matte');
  const [search, setSearch] = useState('');
  const [wallColors, setWallColors] = useState({});
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [compare, setCompare] = useState(false);
  const [favs, setFavs] = useState([]);
  const [showFavs, setShowFavs] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false); // mobile sheet
  const glRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => { try { setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); } catch {} }, []);
  const favKey = (s) => `${s.code}`;
  const isFav = (s) => favs.some((f) => favKey(f) === favKey(s));
  const toggleFav = (s) => setFavs((prev) => {
    const ex = prev.some((f) => favKey(f) === favKey(s));
    const next = ex ? prev.filter((f) => favKey(f) !== favKey(s)) : [...prev, { ...s, brand }];
    try { localStorage.setItem(FAV_KEY, JSON.stringify(next)); } catch {}
    return next;
  });

  const room = ROOMS.find((r) => r.id === roomId);

  function getWall(rId, wId) {
    if (compare) return { hex: DEFAULT_WALL, finish: 'matte' };
    const w = wallColors[`${rId}:${wId}`];
    return w ? { hex: w.hex, finish: w.finish } : { hex: DEFAULT_WALL, finish: 'matte' };
  }

  function paint(wId) {
    if (!shade) return;
    setPast((p) => [...p, wallColors]);
    setFuture([]);
    setWallColors((w) => ({ ...w, [`${roomId}:${wId}`]: { hex: shade.hex, finish, name: shade.name, code: shade.code } }));
  }
  function undo() {
    if (!past.length) return;
    setFuture((f) => [wallColors, ...f]);
    setWallColors(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
  }
  function redo() {
    if (!future.length) return;
    setPast((p) => [...p, wallColors]);
    setWallColors(future[0]);
    setFuture((f) => f.slice(1));
  }
  function download() {
    const gl = glRef.current;
    if (!gl) return;
    const url = gl.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = `hariom-visualizer-${roomId}.png`; a.click();
  }

  const brandInfo = VIS_BRANDS.find((b) => b.slug === brand);
  const list = (showFavs ? favs.filter((f) => f.brand === brand) : PALETTES[brand]).filter((s) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return s.name.toLowerCase().includes(q) || s.hex.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
  });

  return (
    <div className="relative h-[100svh] w-full bg-[#15171c] overflow-hidden text-white">
      {/* 3D CANVAS */}
      <Canvas
        shadows dpr={[1, 2]} className="absolute inset-0"
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: room.cam, fov: 45 }}
        onCreated={({ gl }) => { glRef.current = gl; gl.toneMapping = THREE.ACESFilmicToneMapping; }}
      >
        <color attach="background" args={['#15171c']} />
        <ambientLight intensity={0.65} />
        <hemisphereLight args={['#ffffff', '#444444', 0.5]} />
        <directionalLight position={[6, 9, 5]} intensity={1.15} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-far={30} />
        <Suspense fallback={null}>
          <Scene roomId={roomId} getWall={getWall} paint={paint} />
          <ContactShadows position={[0, 0.01, 0]} opacity={0.35} blur={2.6} far={8} resolution={512} />
        </Suspense>
        <OrbitControls ref={controlsRef} makeDefault enablePan enableZoom
          minDistance={2.5} maxDistance={16} maxPolarAngle={Math.PI / 2.04} target={room.target} />
        <CameraRig targetPos={room.cam} lookAt={room.target} controlsRef={controlsRef} />
      </Canvas>

      {/* ROOM SWITCHER (top-left) */}
      <div className="absolute top-20 left-4 z-10 flex flex-col gap-2">
        {ROOMS.map((r) => {
          const Icon = r.icon;
          return (
            <button key={r.id} onClick={() => setRoomId(r.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm backdrop-blur border transition-all ${roomId === r.id ? 'bg-gold border-gold text-white' : 'bg-black/40 border-white/15 text-white/80 hover:border-gold'}`}>
              <Icon size={16} /> <span className="hidden sm:inline">{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* HINT + SELECTED (top-center) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-2 bg-black/40 backdrop-blur border border-white/15 rounded-full px-4 py-2 text-xs">
        <span className="w-4 h-4 rounded-full border border-white/30" style={{ background: shade?.hex }} />
        <span className="text-white/85">{shade?.name} · {shade?.code}</span>
        <span className="text-white/40">— click a wall to paint</span>
      </div>

      {/* TOOLBAR (bottom-center) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur border border-white/15 rounded-full px-2 py-2">
        <Tool onClick={undo} disabled={!past.length} icon={Undo2} label="Undo" />
        <Tool onClick={redo} disabled={!future.length} icon={Redo2} label="Redo" />
        <button onMouseDown={() => setCompare(true)} onMouseUp={() => setCompare(false)} onMouseLeave={() => setCompare(false)}
          onTouchStart={() => setCompare(true)} onTouchEnd={() => setCompare(false)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs ${compare ? 'bg-gold text-white' : 'text-white/80 hover:bg-white/10'}`}>
          <Eye size={15} /> <span className="hidden sm:inline">Before/After</span>
        </button>
        <Tool onClick={download} icon={Download} label="Download" />
        <button onClick={() => setPanelOpen(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-full text-xs bg-gold text-white">
          <Palette size={15} /> Colours
        </button>
      </div>

      {/* COLOUR PANEL (right on desktop, bottom-sheet on mobile) */}
      <AnimatePresence>
        {(panelOpen || true) && (
          <motion.aside
            initial={false}
            className={`z-20 bg-[#1b1e25]/95 backdrop-blur-xl border border-white/10 flex flex-col
              lg:absolute lg:top-20 lg:right-4 lg:bottom-4 lg:w-[330px] lg:rounded-2xl lg:translate-y-0
              fixed inset-x-0 bottom-0 max-h-[78vh] rounded-t-3xl transition-transform duration-300
              ${panelOpen ? 'translate-y-0' : 'translate-y-full'} lg:!translate-y-0`}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display text-lg">Colour Library</h3>
              <button onClick={() => setPanelOpen(false)} className="lg:hidden text-white/60"><X size={18} /></button>
            </div>

            {/* brand tabs */}
            <div className="px-4 pt-3 flex gap-1.5">
              {VIS_BRANDS.map((b) => (
                <button key={b.slug} onClick={() => { setBrand(b.slug); setShade(PALETTES[b.slug][0]); }}
                  className={`flex-1 text-[11px] font-bold tracking-wide py-2 rounded-lg border transition-colors ${brand === b.slug ? 'text-white border-transparent' : 'text-white/55 border-white/10 hover:text-white'}`}
                  style={brand === b.slug ? { background: b.color } : {}}>
                  {b.short}
                </button>
              ))}
            </div>

            {/* search + favs */}
            <div className="px-4 pt-3 flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search shade / code"
                  className="w-full bg-black/30 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-gold" />
              </div>
              <button onClick={() => setShowFavs((v) => !v)}
                className={`px-2.5 rounded-lg border text-xs inline-flex items-center gap-1 ${showFavs ? 'bg-gold border-gold' : 'border-white/10 text-white/70'}`}>
                <Heart size={13} className={showFavs ? 'fill-white' : ''} />
              </button>
            </div>

            {/* finish */}
            <div className="px-4 pt-3 flex gap-1.5">
              {FINISHES.map((f) => (
                <button key={f.id} onClick={() => setFinish(f.id)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border ${finish === f.id ? 'bg-white/15 border-gold text-white' : 'border-white/10 text-white/55'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* shades */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-2.5">
              {list.map((s) => (
                <button key={s.code} onClick={() => setShade(s)} title={`${s.name} · ${s.code}`}
                  className={`group relative aspect-square rounded-xl border-2 transition-transform hover:scale-105 ${shade?.code === s.code ? 'border-gold' : 'border-white/10'}`}
                  style={{ background: s.hex }}>
                  <span onClick={(e) => { e.stopPropagation(); toggleFav(s); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart size={10} className={isFav(s) ? 'fill-nerolac text-nerolac' : 'text-white/70'} />
                  </span>
                </button>
              ))}
              {list.length === 0 && <p className="col-span-4 text-center text-white/40 text-xs py-8">{showFavs ? 'No favourites yet.' : 'No shades match.'}</p>}
            </div>

            {/* selected shade footer */}
            {shade && (
              <div className="p-4 border-t border-white/10 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg border border-white/15 shrink-0" style={{ background: shade.hex }} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{shade.name}</p>
                  <p className="text-white/45 text-xs">{shade.code} · {shade.hex} · <span style={{ color: brandInfo.color }}>{brandInfo.short}</span></p>
                </div>
                <button onClick={() => toggleFav(shade)} className="shrink-0">
                  <Heart size={18} className={isFav(shade) ? 'fill-nerolac text-nerolac' : 'text-white/50'} />
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tool({ onClick, disabled, icon: Icon, label }) {
  return (
    <button onClick={onClick} disabled={disabled} title={label}
      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-white/80 hover:bg-white/10 disabled:opacity-30">
      <Icon size={15} /> <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
