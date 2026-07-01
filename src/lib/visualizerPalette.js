// Curated brand colour libraries for the 3D visualizer.
// (Works immediately; the full 2,000-shade per-brand library can be wired in later.)

export const VIS_BRANDS = [
  { slug: 'nerolac', name: 'Nerolac Paints', short: 'NEROLAC', color: '#e8472b', prefix: 'NL' },
  { slug: 'kamdhenu', name: 'Kamdhenu Paints', short: 'KAMDHENU', color: '#159e54', prefix: 'KD' },
  { slug: 'mrf', name: 'MRF Paints', short: 'MRF', color: '#0a5ad6', prefix: 'MRF' },
];

const build = (prefix, list) =>
  list.map((s, i) => ({ name: s[0], hex: s[1], family: s[2], code: `${prefix}-${1001 + i}` }));

export const PALETTES = {
  nerolac: build('NL', [
    ['Morning Ivory', '#f4ece0', 'Whites'], ['Soft Almond', '#ece0cf', 'Neutrals'],
    ['Sunlit Cream', '#f6e7c4', 'Yellows'], ['Golden Wheat', '#e8c987', 'Yellows'],
    ['Terracotta Glow', '#c96a4a', 'Reds'], ['Coral Blush', '#e58a72', 'Reds'],
    ['Spiced Clay', '#a8553e', 'Reds'], ['Sage Whisper', '#bcc6a8', 'Greens'],
    ['Olive Grove', '#7d8a5c', 'Greens'], ['Teal Serenity', '#3f8f8a', 'Blues'],
    ['Sky Lullaby', '#bcd6e6', 'Blues'], ['Royal Indigo', '#3b4a78', 'Blues'],
    ['Lavender Mist', '#c3b6d8', 'Purples'], ['Warm Greige', '#cabfb0', 'Neutrals'],
    ['Stone Grey', '#9a9690', 'Greys'], ['Charcoal Velvet', '#3a3a3c', 'Greys'],
  ]),
  kamdhenu: build('KD', [
    ['Pearl White', '#f2efe8', 'Whites'], ['Linen Beige', '#e6dccb', 'Neutrals'],
    ['Lemon Zest', '#f0dd7e', 'Yellows'], ['Amber Honey', '#e2b257', 'Yellows'],
    ['Fresh Mint', '#bfe3cf', 'Greens'], ['Meadow Green', '#7fbf6f', 'Greens'],
    ['Emerald Deep', '#1f7a4d', 'Greens'], ['Forest Pine', '#2f5d44', 'Greens'],
    ['Aqua Breeze', '#9fd4d0', 'Blues'], ['Ocean Teal', '#2f8f9d', 'Blues'],
    ['Cornflower', '#7d97d8', 'Blues'], ['Blush Rose', '#e8b8bf', 'Reds'],
    ['Coral Sunset', '#e57f5e', 'Reds'], ['Mauve Dusk', '#b59bb0', 'Purples'],
    ['Dove Grey', '#b6b2ab', 'Greys'], ['Graphite', '#44464a', 'Greys'],
  ]),
  mrf: build('MRF', [
    ['Crisp White', '#f4f3ef', 'Whites'], ['Cool Sand', '#e3dccd', 'Neutrals'],
    ['Butter Yellow', '#f3e2a0', 'Yellows'], ['Marigold', '#e8b94e', 'Yellows'],
    ['Powder Blue', '#cfe0ee', 'Blues'], ['Azure Sky', '#74a8de', 'Blues'],
    ['Cobalt Deep', '#1f4ea1', 'Blues'], ['Navy Eclipse', '#23314f', 'Blues'],
    ['Teal Wave', '#2f9fa6', 'Blues'], ['Mint Frost', '#cfe8db', 'Greens'],
    ['Sage Calm', '#aab79a', 'Greens'], ['Coral Reef', '#e5775f', 'Reds'],
    ['Rosewood', '#9c4f4a', 'Reds'], ['Plum Velvet', '#6e4a6e', 'Purples'],
    ['Silver Mist', '#c3c1bc', 'Greys'], ['Slate Storm', '#4a5560', 'Greys'],
  ]),
};

export const FINISHES = [
  { id: 'matte', label: 'Matte', roughness: 0.92 },
  { id: 'satin', label: 'Satin', roughness: 0.45 },
  { id: 'gloss', label: 'Gloss', roughness: 0.08 },
];
