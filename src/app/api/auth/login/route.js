import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json();
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const token = await createToken({ id: admin.id, email: admin.email, name: admin.name });
  const res = NextResponse.json({ success: true, name: admin.name });
  res.cookies.set('admin_token', token, {
    httpOnly: true, sameSite: 'lax', path: '/',
    secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
