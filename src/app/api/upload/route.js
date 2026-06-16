import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  try { await requireAuth(); } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  const formData = await req.formData();
  const files = formData.getAll('files');
  const dir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(dir, { recursive: true });
  const urls = [];
  for (const file of files) {
    if (!file || typeof file === 'string') continue;
    const bytes = Buffer.from(await file.arrayBuffer());
    const safe = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
    const filename = `${Date.now()}-${safe}`;
    await writeFile(path.join(dir, filename), bytes);
    urls.push(`/uploads/${filename}`);
  }
  return NextResponse.json({ urls });
}
