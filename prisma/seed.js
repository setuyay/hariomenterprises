const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// ---- HSL -> HEX helper (for generated shades) ----
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Colour families with hue ranges + saturation/lightness bands used for generation.
const FAMILIES = [
  { family: 'Whites & Neutrals', hue: [25, 50], sat: [4, 22], words: ['Ivory', 'Pearl', 'Linen', 'Sand', 'Almond', 'Vanilla', 'Cream', 'Bisque', 'Chalk', 'Oat'] },
  { family: 'Yellows & Oranges', hue: [30, 55], sat: [45, 92], words: ['Saffron', 'Amber', 'Marigold', 'Honey', 'Mango', 'Sunlit', 'Tangerine', 'Apricot', 'Gold', 'Citrus'] },
  { family: 'Reds & Pinks', hue: [340, 372], sat: [40, 88], words: ['Coral', 'Rose', 'Crimson', 'Blush', 'Ruby', 'Cherry', 'Carmine', 'Punch', 'Petal', 'Brick'] },
  { family: 'Greens', hue: [85, 160], sat: [25, 78], words: ['Sage', 'Forest', 'Mint', 'Olive', 'Fern', 'Moss', 'Jade', 'Basil', 'Meadow', 'Pine'] },
  { family: 'Blues', hue: [185, 240], sat: [30, 85], words: ['Sky', 'Ocean', 'Indigo', 'Cobalt', 'Teal', 'Azure', 'Denim', 'Lagoon', 'Sapphire', 'Mist'] },
  { family: 'Purples', hue: [250, 305], sat: [25, 75], words: ['Lavender', 'Plum', 'Violet', 'Orchid', 'Mauve', 'Amethyst', 'Lilac', 'Grape', 'Iris', 'Wine'] },
  { family: 'Greys & Darks', hue: [200, 260], sat: [0, 12], words: ['Charcoal', 'Slate', 'Graphite', 'Ash', 'Smoke', 'Pewter', 'Stone', 'Steel', 'Shadow', 'Onyx'] },
  { family: 'Browns & Earth', hue: [18, 38], sat: [25, 60], words: ['Mocha', 'Walnut', 'Chestnut', 'Cocoa', 'Umber', 'Clay', 'Hazel', 'Coffee', 'Caramel', 'Earth'] },
];
const MODIFIERS = ['Soft', 'Deep', 'Pale', 'Rich', 'Muted', 'Bright', 'Dusky', 'Warm', 'Cool', 'Velvet', 'Misty', 'Royal', 'Antique', 'Frosted', 'Bold'];

const TOTAL_SHADES = 2000;

function generateShades(total) {
  const perFamily = Math.ceil(total / FAMILIES.length);
  const out = [];
  let serial = 1000;
  for (const fam of FAMILIES) {
    for (let i = 0; i < perFamily && out.length < total; i++) {
      const hue = fam.hue[0] + ((fam.hue[1] - fam.hue[0]) * (i % 24)) / 24;
      const sat = fam.sat[0] + ((fam.sat[1] - fam.sat[0]) * ((i * 7) % 20)) / 20;
      // Spread lightness so each family covers pale -> deep tones.
      const light = 22 + ((i * 13) % 56);
      const hex = hslToHex(hue % 360, sat, light);
      const word = fam.words[i % fam.words.length];
      const mod = MODIFIERS[(i * 3) % MODIFIERS.length];
      const name = `${mod} ${word} ${serial++}`;
      out.push({ name, hex, family: fam.family });
    }
  }
  return out.slice(0, total);
}

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@hariomenterprises.com' },
    update: {},
    create: { email: 'admin@hariomenterprises.com', password: hashed, name: 'Admin' },
  });

  // Fresh start so removed brands/shades don't linger.
  await prisma.inquiry.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.colorShade.deleteMany({});

  // Only these three brands, each classified by segment.
  const brandsData = [
    { brandName: 'Nerolac Paints', category: 'Premium Decorative', brandLogo: '/uploads/sample-brand.svg', description: 'Advanced decorative paint technology for beautiful, long-lasting interiors and exteriors.' },
    { brandName: 'Kamdhenu Paints', category: 'Decorative & Economy', brandLogo: '/uploads/sample-brand.svg', description: 'Vibrant, durable decorative paints offering excellent value across a wide colour range.' },
    { brandName: 'MRF Paints', category: 'Protective & Industrial', brandLogo: '/uploads/sample-brand.svg', description: 'Reliable protective coatings engineered for long-lasting finish and surface protection.' },
  ];
  const brands = [];
  for (const b of brandsData) {
    brands.push(await prisma.brand.create({ data: b }));
  }

  const sampleImg = '/uploads/sample-product.svg';
  const finishByCat = {
    'Interior': 'Smooth Matte',
    'Exterior': 'Matte',
    'Wood Finish': 'Glossy',
    'Metal & Enamel': 'High Gloss',
    'Waterproofing': 'Matte',
    'Primer': 'Flat',
  };
  // [name, brandIndex (0=Nerolac, 1=Kamdhenu, 2=MRF), category, description]
  const products = [
    // ---- Kansai Nerolac (24) ----
    ['Impressions 24 Carat', 0, 'Interior', 'Nerolac’s flagship luxury interior emulsion with a rich, gold-like sheen, superior smoothness and excellent washability for premium living spaces.'],
    ['Impressions Ultra HD', 0, 'Interior', 'High-definition luxury emulsion that delivers ultra-rich colours, a flawless soft finish and lasting depth on interior walls.'],
    ['Impressions Kashmir', 0, 'Interior', 'Premium acrylic emulsion offering a smooth matte finish, good coverage and long-lasting colour for elegant interiors.'],
    ['Impressions Ideaz', 0, 'Interior', 'Designer texture-finish range for creating decorative patterns and feature walls with a bespoke, artistic look.'],
    ['Pearls Lustre Finish', 0, 'Interior', 'Premium interior emulsion with a silky lustre sheen that adds a soft glow and an easy-clean surface to walls.'],
    ['Pearls Emulsion', 0, 'Interior', 'Premium soft-sheen interior emulsion giving smooth, washable walls with a gentle, refined reflectivity.'],
    ['Beauty Gold Washable+', 0, 'Interior', 'Premium washable interior emulsion engineered for excellent stain removal and durable, fresh-looking walls.'],
    ['Beauty Sheen', 0, 'Interior', 'Mid-range interior emulsion with a subtle sheen, good coverage and easy maintenance for everyday homes.'],
    ['Beauty Smooth Finish', 0, 'Interior', 'Smooth matte interior emulsion offering even coverage and a clean, refined wall finish at great value.'],
    ['Little Master', 0, 'Interior', 'Economy interior emulsion that brings bright, durable colour to budget-conscious projects without compromising coverage.'],
    ['Beauty Acrylic Distemper', 0, 'Interior', 'Water-based acrylic distemper for interiors — economical, quick-drying and smoother than traditional distempers.'],
    ['Excel Total All-in-One', 0, 'Exterior', 'Premium all-in-one exterior emulsion offering long-term protection against rain, dust, algae and fading.'],
    ['Excel Everlast', 0, 'Exterior', 'Durable exterior emulsion built for long-lasting colour and dependable weather resistance on outer walls.'],
    ['Excel Mica Marble', 0, 'Exterior', 'Textured exterior finish with mica-marble particles for a rich, decorative and rugged outdoor look.'],
    ['Excel Anti-Peel', 0, 'Exterior', 'Exterior emulsion formulated to resist peeling and flaking, keeping walls intact through harsh weather.'],
    ['Suraksha / Suraksha Plus', 0, 'Exterior', 'Weatherproof exterior emulsion delivering reliable protection and colour retention at an accessible price.'],
    ['Suraksha Dust Resist', 0, 'Exterior', 'Dust-resistant exterior emulsion that keeps walls cleaner for longer by repelling airborne dirt.'],
    ['Impressions Water Enamel', 0, 'Metal & Enamel', 'Low-odour, water-based enamel for wood and metal that gives a smooth, durable and non-yellowing finish.'],
    ['Synthetic Hi-Gloss Enamel', 0, 'Metal & Enamel', 'Solvent-based high-gloss enamel for wood and metal with a tough, glossy and long-lasting coat.'],
    ['Wonderwood 2K PU', 0, 'Wood Finish', 'Premium two-component polyurethane wood finish for a hard, scratch-resistant and richly glossy surface.'],
    ['Wonderwood Melamine', 0, 'Wood Finish', 'Melamine wood coating that enhances the natural grain while providing a smooth, durable protective layer.'],
    ['Perma Waterproofing', 0, 'Waterproofing', 'Complete waterproofing range for terraces, walls and wet areas, sealing out moisture and leaks.'],
    ['Excel Rain Guard', 0, 'Waterproofing', 'Waterproof exterior emulsion that combines decorative colour with strong rain and damp protection.'],
    ['Wall Putty & Primers', 0, 'Primer', 'Surface-preparation range of putties and primers that level walls and boost paint adhesion and finish.'],

    // ---- Kamdhenu Paints (19) ----
    ['Velvety Luxury Emulsion', 1, 'Interior', 'Luxury interior emulsion with a velvety silky-pearl finish for a soft, glowing and washable wall surface.'],
    ['Kamodual Gold', 1, 'Interior', 'Versatile dual-purpose emulsion usable on both interior and exterior walls with rich colour and durability.'],
    ['Renaissance Designer', 1, 'Interior', 'Designer wall-finish system for creating premium decorative effects and bespoke feature walls.'],
    ['Metallic Lustre', 1, 'Interior', 'Metallic designer finish that adds shimmering, luxurious metallic effects to accent walls.'],
    ['Lotus Touch Interior', 1, 'Interior', 'Premium interior emulsion offering a smooth, soft-touch finish with good washability and coverage.'],
    ['Star Interior Emulsion', 1, 'Interior', 'Economy interior emulsion delivering bright, even colour for value-focused home painting.'],
    ['Acrylic Distemper', 1, 'Interior', 'Water-based acrylic distemper providing a smooth, economical and quick-drying interior finish.'],
    ['Weather Supreme', 1, 'Exterior', 'Premium weatherproof exterior emulsion with strong resistance to rain, UV and algae for lasting walls.'],
    ['Weather Classic', 1, 'Exterior', 'Reliable exterior emulsion offering dependable weather protection and good colour retention.'],
    ['Kamoshield Exterior', 1, 'Exterior', 'Protective exterior emulsion that shields walls from moisture, fungus and harsh weather.'],
    ['Star Exterior Emulsion', 1, 'Exterior', 'Economy exterior emulsion giving durable, weather-resistant colour at a budget-friendly price.'],
    ['Cement Primer', 1, 'Primer', 'Water-based cement primer that seals masonry and creates a strong base for topcoats.'],
    ['Kamoprime Exterior', 1, 'Primer', 'Exterior primer designed to improve the adhesion and durability of exterior paint systems.'],
    ['Synthetic / GP Enamel', 1, 'Metal & Enamel', 'General-purpose synthetic enamel for wood and metal with a glossy, hard-wearing finish.'],
    ['PU Wood Finish', 1, 'Wood Finish', 'Polyurethane wood coating delivering a tough, glossy and scratch-resistant surface on timber.'],
    ['Aluminium Paint', 1, 'Metal & Enamel', 'Heat- and weather-resistant aluminium coating for metal surfaces, pipes and structures.'],
    ['Dampguard', 1, 'Waterproofing', 'Waterproofing coating that protects walls and surfaces from dampness, seepage and leakage.'],
    ['Wall Putty', 1, 'Primer', 'White cement-based wall putty that smooths surfaces and provides an even base for painting.'],
    ['Stainers & Colourants', 1, 'Primer', 'Concentrated stainers and colourants for tinting paints and putties to achieve custom shades.'],

    // ---- MRF Vapocure Paints (19) ----
    ['RUCA Super Luxury', 2, 'Interior', 'Super-luxury interior emulsion offering a rich, smooth, high-end finish with excellent washability and depth of colour.'],
    ['AquaFresh PU Interior', 2, 'Interior', 'Super-premium PU-fortified interior wall finish delivering a tough, washable and elegant surface.'],
    ['AquaFresh PU Exterior', 2, 'Exterior', 'Super-premium PU-fortified exterior finish built for outstanding durability and weather protection.'],
    ['Altura 2-in-1', 2, 'Interior', 'Versatile 2-in-1 emulsion suitable for both interior and exterior walls with strong colour and protection.'],
    ['Visa Interior Emulsion', 2, 'Interior', 'Everyday interior wall emulsion offering smooth coverage and easy maintenance at great value.'],
    ['Campus Exterior', 2, 'Exterior', 'Exterior emulsion engineered for reliable weather resistance and lasting colour on outer walls.'],
    ['Acrylic Superfine', 2, 'Interior', 'Multi-surface acrylic paint giving a fine, smooth and even finish across a variety of surfaces.'],
    ['Specta PU Enamel', 2, 'Metal & Enamel', 'PU-based enamel for wood and metal delivering a high-gloss, durable and chip-resistant coat.'],
    ['MetalCoat PU', 2, 'Metal & Enamel', 'Luxury PU coating for metal, wood and plastic surfaces with a premium, hard-wearing finish.'],
    ['Durothane', 2, 'Wood Finish', 'Multipurpose polyurethane finish offering a tough, glossy protective layer on multiple surfaces.'],
    ['WoodCoat', 2, 'Wood Finish', 'Wood finish that protects and enhances timber with a smooth, durable and attractive coat.'],
    ['WoodCoat Italia', 2, 'Wood Finish', 'Italian-style premium wood finish for a refined, rich and luxurious timber surface.'],
    ['FreshWood', 2, 'Wood Finish', 'Interior wood finish that brings out the natural grain while protecting against everyday wear.'],
    ['TreatWood', 2, 'Wood Finish', 'Wood treatment that protects timber from moisture, fungus and insects before finishing.'],
    ['EezeeWood 1K PU', 2, 'Wood Finish', 'Single-pack polyurethane wood coating for easy application and a hard, glossy finish.'],
    ['Melamine Wood Finish', 2, 'Wood Finish', 'Melamine coating that seals and enhances wood with a smooth, durable protective sheen.'],
    ['CoolRoof Terrace', 2, 'Waterproofing', 'Heat-reflective terrace coating that lowers roof temperature while waterproofing the surface.'],
    ['Floor & Concrete PU', 2, 'Waterproofing', 'Durable PU floor and concrete coating for pavers, floors and decks, resisting abrasion and water.'],
    ['Wall & Wood Primers', 2, 'Primer', 'Surface-preparation primers for walls and wood that boost adhesion and topcoat performance.'],
  ];
  for (const [name, bi, cat, desc] of products) {
    await prisma.product.create({
      data: {
        productName: name,
        brandId: brands[bi].id,
        category: cat,
        image: sampleImg,
        images: JSON.stringify([sampleImg]),
        description: desc,
        features: JSON.stringify(['Premium quality', 'Long lasting', 'Low VOC', 'Easy application']),
        specs: JSON.stringify({ Coverage: '140-160 sq.ft/litre', Finish: finishByCat[cat] || 'Matte', 'Drying Time': '30 min', Coats: '2 recommended' }),
      },
    });
  }
  console.log(`  ${products.length} products created`);

  // ---- 20,000 generated colour shades, inserted in batches ----
  const shades = generateShades(TOTAL_SHADES);
  const BATCH = 1000;
  for (let i = 0; i < shades.length; i += BATCH) {
    await prisma.colorShade.createMany({ data: shades.slice(i, i + BATCH) });
    console.log(`  shades ${Math.min(i + BATCH, shades.length)}/${shades.length}`);
  }

  console.log(`Seed complete. ${brands.length} brands, ${shades.length} shades. Admin: admin@hariomenterprises.com / admin123`);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
