// backend/src/routes/conversations.js
// ─── Conversations Routes ─────────────────────────────────────────────────────
//
// GET    /api/conversations      — list all conversations for the logged-in user
// DELETE /api/conversations/:id  — delete a specific conversation
//
// Phase 3: returns mock data so the frontend sidebar works end-to-end.
// Phase 5: replaces mock data with real Prisma DB queries.

import { Router }   from 'express'
import authenticate from '../middleware/auth.js'

const router = Router()

// All conversation routes require a valid JWT
router.use(authenticate)

// ── Temporary in-memory store (replaced by Prisma in Phase 5) ────────────────
// Keyed by userId so each user sees only their own conversations
const conversationStore = {}

function getUserConvos(userId) {
  if (!conversationStore[userId]) {
    // Seed some mock conversations on first load so the sidebar isn't empty
    conversationStore[userId] = [
      {
        id:        crypto.randomUUID(),
        title:     'Welcome to JARVIS',
        userId,
        createdAt: new Date(),
      },
    ]
  }
  return conversationStore[userId]
}

// ── GET /api/conversations ────────────────────────────────────────────────────
//
// Returns: { conversations: Array<{ id, title, createdAt }> }
// Sorted newest first

router.get('/', (req, res) => {
  try {
    const convos = getUserConvos(req.user.userId)

    // Sort newest first
    const sorted = [...convos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json({ conversations: sorted })

  } catch (err) {
    console.error('[CONVERSATIONS] GET error:', err)
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
})

// ── POST /api/conversations ───────────────────────────────────────────────────
//
// Creates a new conversation
// Body:    { title?: string }
// Returns: { conversation: { id, title, createdAt } }

router.post('/', (req, res) => {
  try {
    const { title = 'New Conversation' } = req.body
    const userId = req.user.userId

    const conversation = {
      id:        crypto.randomUUID(),
      title,
      userId,
      createdAt: new Date(),
    }

    if (!conversationStore[userId]) conversationStore[userId] = []
    conversationStore[userId].unshift(conversation)

    res.status(201).json({ conversation })

  } catch (err) {
    console.error('[CONVERSATIONS] POST error:', err)
    res.status(500).json({ error: 'Failed to create conversation' })
  }
})

// ── DELETE /api/conversations/:id ─────────────────────────────────────────────
//
// Deletes a conversation — only if it belongs to the logged-in user
// Returns: { success: true }

router.delete('/:id', (req, res) => {
  try {
    const { id }     = req.params
    const userId     = req.user.userId
    const convos     = getUserConvos(userId)
    const index      = convos.findIndex(c => c.id === id)

    if (index === -1) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    conversationStore[userId].splice(index, 1)

    console.log(`[CONVERSATIONS] Deleted ${id} for user ${userId}`)

    res.json({ success: true })

  } catch (err) {
    console.error('[CONVERSATIONS] DELETE error:', err)
    res.status(500).json({ error: 'Failed to delete conversation' })
  }
})

export default router