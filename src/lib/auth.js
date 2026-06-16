import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export async function createToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  const token = store.get('admin_token')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
  return session;
}
