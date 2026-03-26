// frontend/src/App.jsx
// ─── Phase 3 update ───────────────────────────────────────────────────────────
// isLoggedIn now reads from localStorage so if you already have a token
// (e.g. you logged in earlier and refreshed the page), you skip the login screen.
// authApi.logout() removes the token and returns to login.

import { useState }       from 'react'
import { isLoggedIn, authApi } from './api/client.js'
import Sidebar            from './components/Sidebar'
import ChatPage           from './pages/ChatPage'
import LoginPage          from './pages/LoginPage'

export default function App() {
  // Initialize from localStorage — if a token exists, skip login
  const [loggedIn, setLoggedIn] = useState(() => isLoggedIn())

  const handleLogin = () => setLoggedIn(true)

  const handleLogout = () => {
    authApi.logout()       // removes token from localStorage
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      <Header onLogout={handleLogout} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <ChatPage />
      </div>

    </div>
  )
}

// ─── Header — kept exactly from Phase 1, logout button added ─────────────────

function Header({ onLogout }) {
  return (
    <header style={{
      height: '56px',
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: '16px',
      flexShrink: 0, position: 'relative', zIndex: 10,
    }}>
      <GlowLine />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '260px', flexShrink: 0 }}>
        <LogoIcon />
        <div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '18px', letterSpacing: '0.3em',
            color: 'var(--cyan)', textShadow: '0 0 20px var(--cyan), 0 0 40px rgba(0,212,255,0.3)',
          }}>JARVIS</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'var(--mono)' }}>
            AI DEVELOPER OS v0.1.0
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <StatusDot />
        <ModelBadge />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconBtn title="Settings">⚙</IconBtn>
        <UserChip onLogout={onLogout} />
      </div>
    </header>
  )
}

function GlowLine() {
  return (
    <div style={{
      position: 'absolute', bottom: '-1px', left: 0, right: 0, height: '1px',
      background: 'linear-gradient(90deg, transparent, var(--cyan-dim), transparent)',
      opacity: 0.5,
    }} />
  )
}

function LogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
      <circle cx="16" cy="16" r="10" stroke="#00d4ff" strokeWidth="0.5" opacity="0.5" />
      <circle cx="16" cy="16" r="5"  fill="#00d4ff" opacity="0.8" />
      <circle cx="16" cy="16" r="3"  fill="#00d4ff" />
      <line x1="16" y1="2"  x2="16" y2="6"  stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
      <line x1="16" y1="26" x2="16" y2="30" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
      <line x1="2"  y1="16" x2="6"  y2="16" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
      <line x1="26" y1="16" x2="30" y2="16" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
    </svg>
  )
}

function StatusDot() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
      <span style={{
        display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
        background: 'var(--green)', boxShadow: '0 0 8px var(--green)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />
      <span style={{ color: 'var(--green)' }}>ONLINE</span>
      <span>·</span>
      <span>Llama 3.3 70B</span>
    </div>
  )
}

function ModelBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      background: 'var(--cyan-faint)', border: '1px solid var(--border-glow)',
      borderRadius: '4px', padding: '3px 10px',
      fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--cyan-dim)',
      letterSpacing: '0.05em',
    }}>
      ⚡ GROQ · 280 tok/s
    </div>
  )
}

function IconBtn({ children, title }) {
  return (
    <button title={title} style={{
      width: '32px', height: '32px', borderRadius: '6px',
      background: 'transparent', border: '1px solid var(--border)',
      color: 'var(--text-2)', cursor: 'pointer', fontSize: '14px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--cyan-dim)'
        e.currentTarget.style.color = 'var(--cyan)'
        e.currentTarget.style.background = 'var(--cyan-faint)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--text-2)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}

function UserChip({ onLogout }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onLogout}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title="Sign out"
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'var(--bg-card)', border: `1px solid ${hov ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: '20px', padding: '4px 12px 4px 4px', cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--blue), var(--cyan))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 700, color: 'var(--bg-void)',
      }}>D</div>
      <span style={{ fontSize: '12px', fontWeight: 600, color: hov ? 'var(--red)' : 'var(--text-2)', letterSpacing: '0.02em', transition: 'color 0.2s' }}>
        {hov ? 'sign out' : 'dev@jarvis'}
      </span>
    </div>
  )
}