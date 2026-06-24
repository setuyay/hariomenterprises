// Client-side PDF warranty certificate generator (jsPDF + QR code).
// Dynamically imported so these libs never ship in the server bundle.

const GOLD = [232, 71, 43];
const INK = [26, 20, 20];
const MUTE = [120, 110, 100];

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export async function downloadWarrantyCertificate(w) {
  const { jsPDF } = await import('jspdf');
  const QRCode = (await import('qrcode')).default;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  // background + double border
  doc.setFillColor(252, 246, 238);
  doc.rect(0, 0, W, H, 'F');
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(3);
  doc.rect(28, 28, W - 56, H - 56);
  doc.setLineWidth(0.6);
  doc.rect(38, 38, W - 76, H - 76);

  // header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...GOLD);
  doc.text('Hariom Enterprises', W / 2, 100, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...MUTE);
  doc.text('Authorized Nerolac · MRF · Kamdhenu Dealer  ·  Mandla, Madhya Pradesh', W / 2, 120, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text('Warranty Certificate', W / 2, 172, { align: 'center' });
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2);
  doc.line(W / 2 - 64, 184, W / 2 + 64, 184);

  // details
  const rows = [
    ['Warranty ID', w.warrantyId],
    ['Customer Name', w.customerName],
    ['Product', [w.brandName, w.productName].filter(Boolean).join(' — ')],
    ['Registration Date', fmtDate(w.createdAt || new Date())],
    ['Warranty Duration', '5 Years from date of purchase'],
    ['Status', w.status || 'Pending'],
  ];
  let y = 234;
  doc.setFontSize(11.5);
  for (const [k, v] of rows) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...MUTE);
    doc.text(String(k).toUpperCase(), 84, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...INK);
    doc.text(String(v || '—'), 270, y);
    y += 34;
  }

  // QR verification
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const verifyUrl = `${origin}/warranty-status?warrantyId=${encodeURIComponent(w.warrantyId)}`;
  const qr = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 260, color: { dark: '#1a1414', light: '#fcf6ee' } });
  doc.addImage(qr, 'PNG', W - 188, H - 230, 112, 112);
  doc.setFontSize(8);
  doc.setTextColor(...MUTE);
  doc.text('Scan to verify', W - 132, H - 104, { align: 'center' });

  // signature area
  doc.setDrawColor(...MUTE);
  doc.setLineWidth(0.8);
  doc.line(84, H - 140, 250, H - 140);
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTE);
  doc.text('Authorized Signatory', 84, H - 124);
  doc.setTextColor(...INK);
  doc.text('Hariom Enterprises', 84, H - 110);

  // footer
  doc.setFontSize(8);
  doc.setTextColor(150, 140, 130);
  doc.text('This is a computer-generated certificate and is valid with the Warranty ID shown above.', W / 2, H - 64, { align: 'center' });

  doc.save(`Warranty-${w.warrantyId}.pdf`);
}
