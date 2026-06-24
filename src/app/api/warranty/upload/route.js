import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// PUBLIC upload endpoint for the warranty form (customers are not logged in).
// Validated by type + size to limit abuse.
const ALLOWED = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Only PDF, JPG, PNG or WEBP files are allowed' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 });
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', 'warranty');
  await mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
  await writeFile(path.join(dir, filename), bytes);

  return NextResponse.json({ url: `/uploads/warranty/${filename}` });
}
