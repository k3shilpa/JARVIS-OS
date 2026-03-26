import { useState } from 'react'
import { useChat } from '../hooks/useChat'

// ─── Sidebar ──────────────────────────────────────────────────────────────────
// Your Phase 1 design is fully preserved:
//   ✓ Right-edge glow line
//   ✓ NEW SESSION button (same styles)
//   ✓ Search box
//   ✓ Grouped list with TODAY / YESTERDAY / EARLIER labels
//   ✓ ▶ / ◈ icons, hover states, delete ✕ button
//   ✓ Context window meter at the bottom
//
// Phase 2 changes (minimal):
//   - useChat() replaces the hardcoded CONVOS array
//   - NEW SESSION calls newConversation()
//   - Clicking a row calls selectConversation()
//   - ✕ calls deleteConversation() instead of alert()

export default function Sidebar() {
  const {
    conversations,
    activeConversationId,
    selectConversation,
    newConversation,
    deleteConversation,
  } = useChat()

  const [search, setSearch] = useState('')

  // Filter by search term
  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  // Assign each conversation to a group based on its createdAt timestamp
  const todayStr = new Date().toDateString()
  const yestStr  = new Date(Date.now() - 86400000).toDateString()

  function getGroup(convo) {
    const d = new Date(convo.createdAt).toDateString()
    if (d === todayStr) return 'today'
    if (d === yestStr)  return 'yesterday'
    return 'earlier'
  }

  function getTimeLabel(convo) {
    const d     = new Date(convo.createdAt)
    const group = getGroup(convo)
    if (group === 'today') {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString([], { weekday: 'short' })
  }

  const GROUPS = ['today', 'yesterday', 'earlier']

  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      background: 'var(--bg-panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Subtle right-edge glow line */}
      <div style={{
        position: 'absolute', top: 0, right: '-1px', bottom: 0, width: '1px',
        background: 'linear-gradient(180deg, transparent, var(--cyan-dim) 30%, var(--cyan-dim) 70%, transparent)',
        opacity: 0.25, pointerEvents: 'none',
      }} />

      {/* New session button */}
      <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--border)' }}>
        <NewSessionBtn onClick={newConversation} />
      </div>

      {/* Search box */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search sessions..."
          style={{
            width: '100%', background: 'var(--bg-input)',
            border: '1px solid var(--border)', borderRadius: '5px',
            padding: '6px 10px', color: 'var(--text-2)',
            fontFamily: 'var(--mono)', fontSize: '11px', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--cyan-dim)')}
          onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Conversation list — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>

        {GROUPS.map(group => {
          const items = filtered.filter(c => getGroup(c) === group)
          if (!items.length) return null
          return (
            <div key={group}>
              {/* Section label: TODAY / YESTERDAY / EARLIER */}
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '9px',
                color: 'var(--text-muted)', letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '8px 8px 4px',
              }}>
                {group}
              </div>

              {items.map(c => (
                <ConvoItem
                  key={c.id}
                  convo={{ ...c, time: getTimeLabel(c) }}
                  active={activeConversationId === c.id}
                  onClick={() => selectConversation(c.id)}
                  onDelete={() => deleteConversation(c.id)}
                />
              ))}
            </div>
          )
        })}

        {/* Empty search result */}
        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '32px 16px',
            fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--text-muted)',
          }}>
            no sessions found
          </div>
        )}

      </div>

      {/* Footer: context window meter */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '9px',
          color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '4px',
        }}>
          context used — 34%
        </div>
        <div style={{ height: '2px', background: 'var(--border)', borderRadius: '1px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '34%',
            background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
            boxShadow: '0 0 6px var(--cyan)',
          }} />
        </div>
      </div>

    </aside>
  )
}

// ─── New Session Button ────────────────────────────────────────────────────────
// Exact Phase 1 styles — now receives onClick prop

function NewSessionBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '9px 14px',
        background: hov ? 'linear-gradient(135deg, var(--blue-dim), var(--border-glow))' : 'transparent',
        border: '1px solid var(--cyan-dim)', borderRadius: '6px',
        color: 'var(--cyan)', fontFamily: 'var(--mono)',
        fontSize: '12px', letterSpacing: '0.1em', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px',
        boxShadow: hov ? '0 0 16px rgba(0,212,255,0.2)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <span>+</span>
      <span style={{ flex: 1, textAlign: 'left' }}>NEW SESSION</span>
    </button>
  )
}

// ─── Individual Conversation Row ───────────────────────────────────────────────
// Exact Phase 1 styles — delete now calls real onDelete() instead of alert()

function ConvoItem({ convo, active, onClick, onDelete }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 10px', borderRadius: '6px',
        cursor: 'pointer', marginBottom: '2px',
        transition: 'all 0.15s',
        border: `1px solid ${active ? 'var(--border-glow)' : hov ? 'var(--border)' : 'transparent'}`,
        background: active ? 'var(--cyan-faint)' : hov ? 'var(--bg-card)' : 'transparent',
      }}
    >
      {/* Icon: ▶ = active, ◈ = inactive */}
      <span style={{ fontSize: '12px', opacity: active ? 1 : 0.4, flexShrink: 0 }}>
        {active ? '▶' : '◈'}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px', fontWeight: 600,
          color: active ? 'var(--text-1)' : 'var(--text-2)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          letterSpacing: '0.01em',
        }}>
          {convo.title}
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '10px',
          color: 'var(--text-muted)', marginTop: '2px',
        }}>
          {convo.time}
        </div>
      </div>

      {/* Delete — only visible on hover */}
      <button
        onClick={e => { e.stopPropagation(); onDelete() }}
        style={{
          opacity: hov ? 0.6 : 0,
          background: 'none', border: 'none',
          color: 'var(--red)', fontSize: '12px',
          cursor: 'pointer', padding: '2px',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = hov ? '0.6' : '0')}
        title="Delete session"
      >
        ✕
      </button>
    </div>
  )
}