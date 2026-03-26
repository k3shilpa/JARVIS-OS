// frontend/src/pages/LoginPage.jsx
// ─── Phase 3 update ───────────────────────────────────────────────────────────
// Now calls the real Express backend via authApi.login() and authApi.register()
// JWT token is stored in localStorage by the api client automatically.
// Error messages from the server are shown below the form.

import { useState }        from 'react'
import { authApi }         from '../api/client.js'

export default function LoginPage({ onLogin }) {
  const [mode,     setMode]     = useState('login')     // 'login' | 'register'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')           // server error message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await authApi.login(email, password)
      } else {
        await authApi.register(email, password)
      }
      // Token is now stored in localStorage by the api client
      onLogin()

    } catch (err) {
      // Show the server's error message (e.g. "Invalid email or password")
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: '100vh',
      background: 'var(--bg-void)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Center radial glow */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-glow)',
        borderRadius: '12px',
        padding: '48px 40px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 0 60px rgba(0,212,255,0.08), 0 24px 48px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* Logo SVG */}
        <svg width="52" height="52" viewBox="0 0 32 32" fill="none" style={{ marginBottom: '12px' }}>
          <circle cx="16" cy="16" r="14" stroke="#00d4ff" strokeWidth="1"   opacity="0.3" />
          <circle cx="16" cy="16" r="10" stroke="#00d4ff" strokeWidth="0.5" opacity="0.5" />
          <circle cx="16" cy="16" r="5"  fill="#00d4ff"  opacity="0.8" />
          <circle cx="16" cy="16" r="3"  fill="#00d4ff" />
          <line x1="16" y1="2"  x2="16" y2="6"  stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          <line x1="16" y1="26" x2="16" y2="30" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          <line x1="2"  y1="16" x2="6"  y2="16" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
          <line x1="26" y1="16" x2="30" y2="16" stroke="#00d4ff" strokeWidth="1" opacity="0.6" />
        </svg>

        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: '26px', letterSpacing: '0.3em',
          color: 'var(--cyan)',
          textShadow: '0 0 20px var(--cyan), 0 0 40px rgba(0,212,255,0.3)',
          marginBottom: '4px',
        }}>
          JARVIS
        </div>

        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px',
          color: 'var(--text-muted)', letterSpacing: '0.15em',
          marginBottom: '32px',
        }}>
          AI DEVELOPER OS — SECURE ACCESS
        </div>

        {/* Login / Register toggle */}
        <div style={{
          display: 'flex', width: '100%',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          marginBottom: '24px',
          overflow: 'hidden',
        }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1, padding: '8px',
                background: mode === m ? 'var(--border-glow)' : 'transparent',
                border: 'none',
                color: mode === m ? 'var(--cyan)' : 'var(--text-muted)',
                fontFamily: 'var(--mono)', fontSize: '11px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <Field label="EMAIL" type="email" value={email}
            placeholder="dev@example.com" onChange={e => setEmail(e.target.value)} />

          <Field label="PASSWORD" type="password" value={password}
            placeholder="••••••••" onChange={e => setPassword(e.target.value)} />

          {/* Error message from server */}
          {error && (
            <div style={{
              background: 'rgba(255,62,108,0.1)',
              border: '1px solid rgba(255,62,108,0.3)',
              borderRadius: '6px', padding: '8px 12px',
              fontFamily: 'var(--mono)', fontSize: '11px',
              color: 'var(--red)', letterSpacing: '0.03em',
            }}>
              ⚠ {error}
            </div>
          )}

          <SubmitButton loading={loading} label={mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'} />

        </form>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function Field({ label, type, value, placeholder, onChange }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={onChange} required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${focused ? 'var(--cyan-dim)' : 'var(--border)'}`,
          borderRadius: '6px', padding: '10px 14px',
          color: 'var(--text-1)', fontFamily: 'var(--mono)', fontSize: '13px',
          outline: 'none', width: '100%',
          boxShadow: focused ? '0 0 0 3px rgba(0,212,255,0.08)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />
    </div>
  )
}

function SubmitButton({ loading, label }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      type="submit" disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        marginTop: '8px', height: '44px', width: '100%',
        background: loading ? 'var(--bg-input)' : hov
          ? 'linear-gradient(135deg, #00b8d9, #1a5fdd)'
          : 'linear-gradient(135deg, var(--cyan-dim), var(--blue))',
        border: `1px solid ${loading ? 'var(--border)' : 'var(--cyan-dim)'}`,
        borderRadius: '6px',
        color: loading ? 'var(--text-muted)' : 'var(--bg-void)',
        fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: 700,
        letterSpacing: '0.15em', cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        boxShadow: hov && !loading ? '0 0 20px rgba(0,212,255,0.25)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '14px', height: '14px',
            border: '2px solid var(--border-glow)', borderTopColor: 'var(--cyan)',
            borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          }} />
          CONNECTING…
        </>
      ) : label}
    </button>
  )
}