// Generate and download a printable colour card (PNG) for a shade — client only.
export function downloadColourCard(shade, brandName) {
  const W = 800, H = 1040;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // paper background
  ctx.fillStyle = '#fcf6ee';
  ctx.fillRect(0, 0, W, H);

  // colour block
  ctx.fillStyle = shade.hex;
  ctx.fillRect(40, 40, W - 80, 600);
  ctx.strokeStyle = 'rgba(0,0,0,.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, 600);

  // hex chip inside the block (auto-contrast text)
  const lum = hexLuminance(shade.hex);
  ctx.fillStyle = lum > 0.6 ? 'rgba(0,0,0,.65)' : 'rgba(255,255,255,.9)';
  ctx.font = '600 30px Georgia, serif';
  ctx.fillText((shade.hex || '').toUpperCase(), 70, 110);

  // shade name + family
  ctx.fillStyle = '#1a1414';
  ctx.font = 'bold 54px Georgia, serif';
  ctx.fillText(truncate(ctx, shade.name || 'Shade', W - 100), 50, 730);
  ctx.fillStyle = '#7a6f63';
  ctx.font = '28px Georgia, serif';
  ctx.fillText(`${shade.family || ''}  ·  ${(shade.hex || '').toUpperCase()}`, 50, 778);

  // divider
  ctx.strokeStyle = 'rgba(26,20,20,.12)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, 880); ctx.lineTo(W - 50, 880); ctx.stroke();

  // brand + dealer
  ctx.fillStyle = '#e8472b';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(brandName || 'Hariom Enterprises', 50, 940);
  ctx.fillStyle = '#7a6f63';
  ctx.font = '22px Georgia, serif';
  ctx.fillText('Hariom Enterprises · Authorized Dealer · Mandla, M.P.', 50, 978);

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `${(shade.name || 'shade').replace(/[^a-z0-9]+/gi, '-')}-${(shade.hex || '').replace('#', '')}.png`;
  a.click();
}

function hexLuminance(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!m) return 0;
  const [r, g, b] = [m[1], m[2], m[3]].map((h) => parseInt(h, 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function truncate(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
  return t + '…';
}
