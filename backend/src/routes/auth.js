// backend/src/routes/auth.js
// ─── Auth Routes ─────────────────────────────────────────────────────────────
//
// POST /api/auth/register  — create a new user account
// POST /api/auth/login     — verify credentials, return a JWT
//
// Phase 3: passwords stored as bcrypt hashes, JWT issued on login.
// Phase 5: will connect to real database via Prisma.
// For now, uses an in-memory users array so you can test without a DB.

import { Router } from 'express'
import bcrypt      from 'bcrypt'
import jwt         from 'jsonwebtoken'

const router = Router()

// ── Temporary in-memory store (replaced by Prisma in Phase 5) ────────────────
// This resets every time the server restarts — that's fine for Phase 3.
const users = []

// ── Helper: sign a JWT for a user ────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },  // payload
    process.env.JWT_SECRET,                   // secret from .env
    { expiresIn: '7d' }                       // token valid for 7 days
  )
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
//
// Body:    { email: string, password: string }
// Returns: { token: string, user: { id, email } }
// Errors:  400 if email already taken, 400 if fields missing

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if email already taken
    const existing = users.find(u => u.email === email.toLowerCase())
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash the password — bcrypt cost factor 10 is standard
    // Never store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user object
    const user = {
      id:        crypto.randomUUID(),
      email:     email.toLowerCase(),
      password:  hashedPassword,  // only the hash is stored
      createdAt: new Date(),
    }

    users.push(user)

    // Issue JWT
    const token = signToken(user)

    console.log(`[AUTH] Registered: ${user.email}`)

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
    })

  } catch (err) {
    console.error('[AUTH] Register error:', err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────
//
// Body:    { email: string, password: string }
// Returns: { token: string, user: { id, email } }
// Errors:  401 if email not found or password wrong

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user by email
    const user = users.find(u => u.email === email.toLowerCase())
    if (!user) {
      // Use a vague error — don't reveal whether the email exists
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Compare the submitted password against the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Issue JWT
    const token = signToken(user)

    console.log(`[AUTH] Logged in: ${user.email}`)

    res.json({
      token,
      user: { id: user.id, email: user.email },
    })

  } catch (err) {
    console.error('[AUTH] Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router