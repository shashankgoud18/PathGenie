import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

const getTokenFromCookie = (cookieHeader) => {
  if (!cookieHeader) return null;

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('auth_token='));

  if (!cookie) return null;
  return decodeURIComponent(cookie.split('=')[1]);
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = getTokenFromCookie(req.headers.cookie);
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : cookieToken;

    if (!token) {
      return res.status(401).json({ error: 'Missing or malformed authorization header' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Authentication middleware error:', err);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

