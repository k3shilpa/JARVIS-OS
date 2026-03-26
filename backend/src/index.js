// backend/src/index.js
// ─── Entry point for the JARVIS Express server ───────────────────────────────
//
// What this file does:
//   1. Loads environment variables from .env
//   2. Creates the Express app
//   3. Adds middleware: JSON parsing, CORS (so React on :3000 can talk to us)
//   4. Mounts all route files under /api
//   5. Adds a catch-all 404 handler
//   6. Starts listening on PORT (default 5000)

import 'dotenv/config'
import express  from 'express'
import cors     from 'cors'

import authRoutes          from './routes/auth.js'
import chatRoutes          from './routes/chat.js'
import conversationRoutes  from './routes/conversations.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────────

// Parse incoming JSON bodies — required for req.body to work
app.use(express.json())

// Allow requests from the React dev server on port 3000
// In production this will be your Vercel domain
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}))

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/auth/register  — create new account
// POST /api/auth/login     — login, returns JWT
app.use('/api/auth', authRoutes)

// POST /api/chat           — send message, get AI response (Phase 4 adds streaming)
app.use('/api/chat', chatRoutes)

// GET    /api/conversations         — list all conversations for logged-in user
// DELETE /api/conversations/:id     — delete a conversation
app.use('/api/conversations', conversationRoutes)

// ── Health check ─────────────────────────────────────────────────────────────
// Visit http://localhost:5000/api/health to confirm the server is running

app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    message: 'JARVIS backend is online',
    time:    new Date().toISOString(),
  })
})

// ── 404 handler ──────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ── Global error handler ─────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('[ERROR]', err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   JARVIS Backend — ONLINE            ║
  ║   http://localhost:${PORT}              ║
  ║   Health: /api/health                ║
  ╚══════════════════════════════════════╝
  `)
})