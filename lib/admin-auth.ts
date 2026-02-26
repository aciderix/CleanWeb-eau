import { createHmac } from 'crypto';

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) throw new Error('ADMIN_PASSWORD not set');
  return pass;
}

export function createToken(): string {
  const timestamp = Date.now().toString();
  const hmac = createHmac('sha256', getSecret()).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

export function verifyToken(token: string): boolean {
  try {
    const [timestamp, hmac] = token.split('.');
    if (!timestamp || !hmac) return false;
    const ts = parseInt(timestamp);
    if (Date.now() - ts > TOKEN_EXPIRY_MS) return false;
    const expectedHmac = createHmac('sha256', getSecret()).update(timestamp).digest('hex');
    return hmac === expectedHmac;
  } catch {
    return false;
  }
}

export function verifyRequest(authHeader: string | null): boolean {
  if (!authHeader?.startsWith('Bearer ')) return false;
  return verifyToken(authHeader.slice(7));
}
