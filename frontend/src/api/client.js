// frontend/src/api/client.js
// ─── API Client ───────────────────────────────────────────────────────────────
//
// All communication with the Express backend goes through this file.
// This means if the backend URL ever changes, you only update ONE place.
//
// How auth works:
//   - On login, we get a JWT token back from the server
//   - We store it in localStorage under the key 'jarvis_token'
//   - Every request after that sends it in the Authorization header
//   - The backend middleware reads it and identifies the user

const BASE_URL = 'http://localhost:5000/api'

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem('jarvis_token')
}

export function setToken(token) {
  localStorage.setItem('jarvis_token', token)
}

export function removeToken() {
  localStorage.removeItem('jarvis_token')
}

export function isLoggedIn() {
  return !!getToken()
}

// ── Base fetch wrapper ────────────────────────────────────────────────────────
// Adds the Authorization header automatically on every request

async function request(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Attach the JWT if we have one
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Allow caller to override headers
      ...options.headers,
    },
  })

  const data = await response.json()

  // If the server returns 401, the token is expired or invalid
  if (response.status === 401) {
    removeToken()
    // Reload to show the login page again
    window.location.reload()
    return
  }

  // For any other non-OK response, throw an error with the server's message
  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`)
  }

  return data
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authApi = {

  // Register a new account
  // Returns: { token, user: { id, email } }
  async register(email, password) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(data.token)
    return data
  },

  // Login with existing account
  // Returns: { token, user: { id, email } }
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(data.token)
    return data
  },

  // Logout — just removes the token
  logout() {
    removeToken()
  },
}

// ── Chat API ──────────────────────────────────────────────────────────────────

export const chatApi = {

  // Send a message and get a response
  // Phase 3: returns plain JSON { reply, conversationId }
  // Phase 4: this switches to EventSource for SSE streaming
  async sendMessage(message, conversationId) {
    return request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    })
  },
}

// ── Conversations API ─────────────────────────────────────────────────────────

export const conversationsApi = {

  // Get all conversations for the logged-in user
  // Returns: { conversations: [...] }
  async getAll() {
    return request('/conversations')
  },

  // Create a new conversation
  // Returns: { conversation: { id, title, createdAt } }
  async create(title = 'New Conversation') {
    return request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    })
  },

  // Delete a conversation by id
  // Returns: { success: true }
  async delete(id) {
    return request(`/conversations/${id}`, {
      method: 'DELETE',
    })
  },
}