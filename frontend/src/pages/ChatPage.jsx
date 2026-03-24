import { useState } from 'react'

// ─── Quick command buttons shown at the top of the chat ───────────────────────
const COMMANDS = [
  { label: '🐛 Debug',      color: '#ff3e6c' },
  { label: '♻ Refactor',   color: '#1a6fff' },
  { label: '✓ Write Tests', color: '#00ff9d' },
  { label: '◉ Explain',    color: '#ff8c42' },
]

// ─── Starter chips shown on the welcome screen ────────────────────────────────
const STARTERS = [
  'Why is my useEffect running twice?',
  'Explain async/await vs promises',
  'How do I set up Prisma with SQLite?',
  'What is a JWT and how does it work?',
]

export default function ChatPage() {
  return (
    <main style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Subtle dot-grid background */}
      <GridBackground />

      {/* Quick commands row */}
      <QuickCommands />

      {/* Welcome screen — this gets replaced by the message list in Phase 2 */}
      <WelcomeScreen />

      {/* Input bar at the bottom */}
      <InputBar />

    </main>
  )
}

// ─── Grid background ───────────────────────────────────────────────────────────

function GridBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: `
        linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }} />
  )
}

// ─── Quick Commands Bar ────────────────────────────────────────────────────────

function QuickCommands() {
  return (
    <div style={{
      padding: '10px 20px',
      display: 'flex', gap: '8px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(3,8,16,0.7)',
      backdropFilter: 'blur(4px)',
      flexShrink: 0, zIndex: 2,
    }}>
      {COMMANDS.map(cmd => <QBtn key={cmd.label} cmd={cmd} />)}
    </div>
  )
}

function QBtn({ cmd }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '5px 12px', borderRadius: '4px',
        background: hov ? 'var(--cyan-faint)' : 'var(--bg-card)',
        border: `1px solid ${hov ? 'var(--cyan-dim)' : 'var(--border)'}`,
        color: hov ? 'var(--cyan)' : 'var(--text-2)',
        fontFamily: 'var(--mono)', fontSize: '11px',
        letterSpacing: '0.05em', cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: hov ? '0 0 10px rgba(0,212,255,0.1)' : 'none',
      }}
    >
      {/* Coloured indicator dot */}
      <span style={{
        display: 'inline-block', width: '5px', height: '5px',
        borderRadius: '50%', background: cmd.color,
        boxShadow: `0 0 6px ${cmd.color}`, flexShrink: 0,
      }} />
      {cmd.label}
    </button>
  )
}

// ─── Welcome Screen ────────────────────────────────────────────────────────────
// Shown when there are no messages yet.
// In Phase 2 this area gets replaced by the <ChatWindow> message list.

function WelcomeScreen() {
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 20px', position: 'relative', zIndex: 1,
    }}>

      <SpinningLogo />

      <div style={{
        fontFamily: 'var(--mono)', fontSize: '22px',
        letterSpacing: '0.3em', color: 'var(--cyan)',
        textShadow: '0 0 30px var(--cyan)', marginBottom: '8px',
      }}>
        JARVIS
      </div>

      <div style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '32px' }}>
        AI Developer OS — ready for input
      </div>

      {/* Clickable starter prompts */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '500px' }}>
        {STARTERS.map(s => <StarterChip key={s} text={s} />)}
      </div>

    </div>
  )
}

function StarterChip({ text }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '8px 16px',
        background: 'var(--bg-card)',
        border: `1px solid ${hov ? 'var(--cyan-dim)' : 'var(--border)'}`,
        borderRadius: '20px', fontSize: '12px',
        color: hov ? 'var(--cyan)' : 'var(--text-2)',
        cursor: 'pointer', fontFamily: 'var(--mono)',
        transition: 'all 0.2s',
        boxShadow: hov ? '0 0 12px rgba(0,212,255,0.15)' : 'none',
      }}
    >
      {text}
    </div>
  )
}

// ─── Spinning JARVIS logo for the welcome screen ───────────────────────────────

function SpinningLogo() {
  return (
    <div style={{ width: '100px', height: '100px', position: 'relative', marginBottom: '24px' }}>
      <style>{`
        .ring-a { animation: spin  8s linear infinite; }
        .ring-b { animation: spinR 3s linear infinite; }
        .ring-j { animation: spin  8s linear infinite; }
      `}</style>

      {/* Outer ring (slow clockwise) */}
      <div className="ring-a" style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '1px solid var(--border-glow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Inner ring (fast counter-clockwise) */}
        <div className="ring-b" style={{
          width: '70px', height: '70px', borderRadius: '50%',
          border: '1px solid var(--cyan)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* J stays upright by rotating the same direction as the outer ring */}
          <span className="ring-j" style={{
            fontFamily: 'var(--mono)', fontSize: '24px',
            color: 'var(--cyan)', textShadow: '0 0 16px var(--cyan)',
          }}>
            J
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Input Bar ─────────────────────────────────────────────────────────────────
// Static for Phase 1 — wired up to state in Phase 2.

function InputBar() {
  const [value, setValue]   = useState('')
  const [focused, setFocused] = useState(false)

  // Auto-resize the textarea as the user types
  const handleChange = e => {
    setValue(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div style={{
      padding: '14px 20px 18px',
      background: 'rgba(6,15,26,0.97)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      flexShrink: 0, zIndex: 5, position: 'relative',
    }}>

      {/* Top glow accent */}
      <div style={{
        position: 'absolute', top: '-1px', left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--cyan-dim), transparent)',
        opacity: 0.35,
      }} />

      {/* Text input wrapper */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '10px',
        background: 'var(--bg-input)',
        border: `1px solid ${focused ? 'var(--cyan-dim)' : 'var(--border)'}`,
        borderRadius: '10px', padding: '10px 12px',
        boxShadow: focused ? '0 0 20px rgba(0,212,255,0.08)' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="ask JARVIS anything... paste code, describe errors, request refactors"
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-1)', fontFamily: 'var(--ui)',
            fontSize: '14px', lineHeight: 1.5,
            resize: 'none', minHeight: '24px', maxHeight: '160px',
            overflowY: 'auto',
          }}
        />
        <SendBtn hasText={value.trim().length > 0} />
      </div>

      {/* Keyboard hints + character count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 5px', fontFamily: 'var(--mono)' }}>Enter</kbd>
          {' '}to send ·{' '}
          <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 5px', fontFamily: 'var(--mono)' }}>Shift+Enter</kbd>
          {' '}for newline
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          {value.length} / 4096
        </span>
      </div>
    </div>
  )
}

function SendBtn({ hasText }) {
  const [hov, setHov] = useState(false)
  const active = hasText && hov
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '36px', height: '36px', borderRadius: '7px', flexShrink: 0,
        background: active
          ? 'linear-gradient(135deg, var(--blue), var(--cyan-dim))'
          : 'linear-gradient(135deg, var(--blue-dim), var(--border-glow))',
        border: '1px solid var(--cyan-dim)',
        color: active ? 'var(--bg-void)' : 'var(--cyan)',
        cursor: hasText ? 'pointer' : 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        opacity: hasText ? 1 : 0.5,
        boxShadow: active ? '0 0 16px rgba(0,212,255,0.3)' : 'none',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}