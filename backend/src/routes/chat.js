// backend/src/routes/chat.js
// ─── Chat Route ───────────────────────────────────────────────────────────────
//
// POST /api/chat   — receives a message, returns an AI response
//
// Phase 3: returns a hardcoded JSON response so we can test the full
//          frontend → backend → frontend data flow works correctly.
//
// Phase 4: replaces the fake response with real Groq SDK streaming via SSE.
//          Only the inside of the route handler changes — the route path,
//          auth middleware, and request shape all stay exactly the same.

import { Router }    from 'express'
import authenticate  from '../middleware/auth.js'

const router = Router()

// All chat routes require a valid JWT
router.use(authenticate)

// ── POST /api/chat ─────────────────────────────────────────────────────────────
//
// Body:    { message: string, conversationId?: string }
// Returns: { reply: string, conversationId: string }
//
// The frontend sends the user's message.
// We return the AI reply as plain JSON for now.
// Phase 4 switches this to Server-Sent Events (SSE) for streaming.

router.post('/', async (req, res) => {
  try {
    const { message, conversationId } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Log who is sending what (useful for debugging)
    console.log(`[CHAT] User ${req.user.email}: "${message.slice(0, 60)}${message.length > 60 ? '...' : ''}"`)

    // ── Phase 3: fake response ──────────────────────────────────────────────
    // This will be replaced in Phase 4 with:
    //   const stream = await groq.chat.completions.create({ stream: true, ... })
    //   for await (const chunk of stream) { res.write(...) }

    const fakeReply = getFakeReply(message)

    // Simulate a short processing delay so it feels real
    await new Promise(r => setTimeout(r, 400))

    res.json({
      reply:          fakeReply,
      conversationId: conversationId || crypto.randomUUID(),
    })

  } catch (err) {
    console.error('[CHAT] Error:', err)
    res.status(500).json({ error: 'Chat request failed' })
  }
})

// ── Fake reply generator (removed in Phase 4) ────────────────────────────────

function getFakeReply(message) {
  const m = message.toLowerCase()

  if (m.includes('debug') || m.includes('error') || m.includes('fix')) {
    return `I've analyzed the issue. The most common cause is a missing dependency in your useEffect array. Make sure every variable you use inside the effect is listed in the dependency array:\n\n\`\`\`javascript\nuseEffect(() => {\n  fetchData(userId);\n}, [userId]); // userId must be here\n\`\`\``
  }

  if (m.includes('refactor') || m.includes('clean') || m.includes('improve')) {
    return `Here's a cleaner version:\n\n\`\`\`javascript\n// Before\nfunction getName(user) {\n  if (user.first && user.last) return user.first + ' ' + user.last\n  return user.first || 'Anonymous'\n}\n\n// After\nconst getName = ({ first, last } = {}) =>\n  [first, last].filter(Boolean).join(' ') || 'Anonymous'\n\`\`\``
  }

  if (m.includes('test') || m.includes('spec')) {
    return `Here are unit tests using Vitest:\n\n\`\`\`javascript\nimport { describe, it, expect } from 'vitest'\nimport { getName } from './utils'\n\ndescribe('getName', () => {\n  it('returns full name', () => {\n    expect(getName({ first: 'Tony', last: 'Stark' })).toBe('Tony Stark')\n  })\n  it('returns Anonymous as fallback', () => {\n    expect(getName()).toBe('Anonymous')\n  })\n})\n\`\`\``
  }

  return `**JARVIS backend is connected!** ✅\n\nYour message reached the Express server, passed JWT authentication, and this response traveled back to your React frontend.\n\nIn Phase 4, this response will stream word-by-word from the real **Llama 3.3 70B** model via Groq.`
}

export default router