import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('admin_token')?.value;
    const valid = token && (await verifyToken(token));
    if (!valid) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
