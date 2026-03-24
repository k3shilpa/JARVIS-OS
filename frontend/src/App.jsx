import Sidebar from './components/Sidebar'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    // Outer shell: column layout so header sits on top of the body row
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      <Header />

      {/* Body row: sidebar on the left, chat on the right */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <ChatPage />
      </div>

    </div>
  )
}

// ─── Header ────────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header style={{
      height: '56px',
      background: 'var(--bg-panel)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: '16px',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
    }}>

      {/* Decorative cyan glow line along the bottom of the header */}
      <GlowLine />

      {/* Left: logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '260px', flexShrink: 0 }}>
        <LogoIcon />
        <div>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: '18px',
            letterSpacing: '0.3em',
            color: 'var(--cyan)',
            textShadow: '0 0 20px var(--cyan), 0 0 40px rgba(0,212,255,0.3)',
          }}>
            JARVIS
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em', fontFamily: 'var(--mono)' }}>
            AI DEVELOPER OS v0.1.0
          </div>
        </div>
      </div>

      {/* Center: status + model badge */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <StatusDot />
        <ModelBadge />
      </div>

      {/* Right: icon buttons + user chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconBtn title="Settings">⚙</IconBtn>
        <UserChip />
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
      {/* Pulsing green dot — "ONLINE" indicator */}
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
    <button
      title={title}
      style={{
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

function UserChip() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '20px', padding: '4px 12px 4px 4px', cursor: 'pointer',
    }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--blue), var(--cyan))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10px', fontWeight: 700, color: 'var(--bg-void)',
      }}>
        D
      </div>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.02em' }}>
        dev@jarvis
      </span>
    </div>
  )
}