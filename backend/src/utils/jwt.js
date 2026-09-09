const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET || 'proptech-secret-key-2026';

const base64UrlEncode = (str) => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64').toString('utf8');
};

const signToken = (payload, expiresInSeconds = 86400) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const expPayload = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(expPayload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verifyToken = (token) => {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature !== expectedSig) throw new Error('Invalid token signature');

  const payload = JSON.parse(base64UrlDecode(encodedPayload));
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error('Token has expired');
  }

  return payload;
};

module.exports = { signToken, verifyToken };
