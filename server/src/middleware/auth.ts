import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request { userId?: number }
  }
}

export function authRequired(req: Request, res: Response, next: NextFunction){
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Missing auth header' })
  const token = header.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'dev_secret') as any
    req.userId = payload.userId
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
