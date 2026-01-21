import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const email = decodedToken.email?.toLowerCase();

    if (!email || !ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
