// backend/src/middleware/auth.js
// ─── JWT Auth Middleware ──────────────────────────────────────────────────────
//
// This function runs BEFORE any protected route handler.
// It reads the Authorization header, verifies the JWT,
// and attaches the decoded user to req.user.
//
// Usage in routes:
//   import authenticate from '../middleware/auth.js'
//   router.get('/protected', authenticate, (req, res) => { ... })
//
// The token the frontend sends looks like:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

import jwt from 'jsonwebtoken'

export default function authenticate(req, res, next) {
  // 1. Read the Authorization header
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' })
  }

  // 2. Header format must be "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid authorization format. Use: Bearer <token>' })
  }

  const token = parts[1]

  // 3. Verify the token with our secret
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded = { userId: '...', email: '...', iat: ..., exp: ... }

    // 4. Attach user info to req so route handlers can use it
    req.user = decoded
    next()

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please log in again' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}