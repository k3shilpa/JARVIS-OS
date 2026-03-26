// frontend/src/hooks/useChat.js
// ─── Phase 3 update ───────────────────────────────────────────────────────────
// sendMessage() now calls the real Express backend via chatApi.sendMessage()
// instead of the local fakeStream() generator.
//
// Phase 4 will update sendMessage() again to use EventSource for SSE streaming.
// Everything else in this file stays the same.

import { useState, useCallback, useEffect } from 'react'
import { chatApi, conversationsApi }         from '../api/client.js'

function makeId() {
  return Math.random().toString(36).slice(2)
}

export function useChat() {
  const [conversations,         setConversations]         = useState([])
  const [activeConversationId,  setActiveConversationId]  = useState(null)
  const [messagesByConv,        setMessagesByConv]         = useState({})
  const [isStreaming,           setIsStreaming]            = useState(false)
  const [loadingConvos,         setLoadingConvos]          = useState(true)

  const messages = messagesByConv[activeConversationId] ?? []

  // ── Load conversations from backend on mount ────────────────────────────────
  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await conversationsApi.getAll()
        setConversations(data.conversations)

        if (data.conversations.length > 0) {
          setActiveConversationId(data.conversations[0].id)
        }
      } catch (err) {
        console.error('[useChat] Failed to load conversations:', err)
        // Fallback: start with one empty conversation so the UI isn't broken
        const fallback = { id: makeId(), title: 'New Conversation', createdAt: new Date() }
        setConversations([fallback])
        setActiveConversationId(fallback.id)
      } finally {
        setLoadingConvos(false)
      }
    }

    loadConversations()
  }, [])

  // ── Add a message to a conversation ────────────────────────────────────────
  const addMessage = useCallback((convId, msg) => {
    setMessagesByConv(prev => ({
      ...prev,
      [convId]: [...(prev[convId] ?? []), msg],
    }))
  }, [])

  // ── Update the last message (used while streaming in Phase 4) ──────────────
  const updateLastMessage = useCallback((convId, updater) => {
    setMessagesByConv(prev => {
      const msgs    = prev[convId] ?? []
      const updated = msgs.map((m, i) => i === msgs.length - 1 ? updater(m) : m)
      return { ...prev, [convId]: updated }
    })
  }, [])

  // ── Send a message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return

    const convId = activeConversationId

    // 1. Show user message immediately
    addMessage(convId, { id: makeId(), role: 'user', content: text })

    // 2. Show a "thinking" placeholder for the assistant
    const assistantMsgId = makeId()
    addMessage(convId, { id: assistantMsgId, role: 'assistant', content: '' })
    setIsStreaming(true)

    try {
      // 3. Call the real backend
      // Phase 4: this becomes an EventSource call for word-by-word streaming
      const data = await chatApi.sendMessage(text, convId)

      // 4. Put the full reply into the placeholder
      updateLastMessage(convId, m => ({ ...m, content: data.reply }))

      // 5. Update the conversation title from the first message
      setConversations(prev => prev.map(c =>
        c.id === convId && c.title === 'New Conversation'
          ? { ...c, title: text.slice(0, 42) + (text.length > 42 ? '…' : '') }
          : c
      ))

    } catch (err) {
      // Show the error inside the chat bubble
      updateLastMessage(convId, m => ({
        ...m,
        content: `⚠ Error: ${err.message}. Is the backend running on port 5000?`,
      }))
    } finally {
      setIsStreaming(false)
    }
  }, [activeConversationId, isStreaming, addMessage, updateLastMessage])

  // ── Select a conversation ───────────────────────────────────────────────────
  const selectConversation = useCallback((id) => {
    setActiveConversationId(id)
  }, [])

  // ── Create a new conversation ───────────────────────────────────────────────
  const newConversation = useCallback(async () => {
    try {
      const data = await conversationsApi.create('New Conversation')
      const conv = data.conversation

      setConversations(prev => [conv, ...prev])
      setMessagesByConv(prev => ({ ...prev, [conv.id]: [] }))
      setActiveConversationId(conv.id)

    } catch (err) {
      // Fallback: create local-only conversation if backend is unreachable
      const conv = { id: makeId(), title: 'New Conversation', createdAt: new Date() }
      setConversations(prev => [conv, ...prev])
      setMessagesByConv(prev => ({ ...prev, [conv.id]: [] }))
      setActiveConversationId(conv.id)
    }
  }, [])

  // ── Delete a conversation ───────────────────────────────────────────────────
  const deleteConversation = useCallback(async (id) => {
    try {
      await conversationsApi.delete(id)
    } catch (err) {
      console.warn('[useChat] Delete failed on server, removing locally:', err.message)
    }

    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== id)
      if (activeConversationId === id && remaining.length > 0) {
        setActiveConversationId(remaining[0].id)
      }
      return remaining
    })

    setMessagesByConv(prev => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [activeConversationId])

  return {
    conversations,
    activeConversationId,
    messages,
    isStreaming,
    loadingConvos,
    sendMessage,
    selectConversation,
    newConversation,
    deleteConversation,
  }
}