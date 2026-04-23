import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function History() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const res = await axios.get('https://resumeiq-31bx.onrender.com/api/sessions')
      if (res.data.success) setSessions(res.data.sessions)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      try {
        await axios.delete('https://resumeiq-31bx.onrender.com/api/sessions')
        setSessions([])
      } catch (err) {
        console.error(err)
      }
    }
  }

  const getScoreColor = (score) => {
    if (score >= 7) return '#00d4aa'
    if (score >= 5) return '#ffa502'
    return '#ff4757'
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return '🏆 Excellent'
    if (score >= 6) return '👍 Good'
    if (score >= 4) return '📈 Average'
    return '💪 Need Practice'
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📊 Interview History</h1>
          <p style={{ color: '#888' }}>All your past interview sessions</p>
        </div>

        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={clearHistory}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#ff4757',
              border: '2px solid #ff4757',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear History
          </button>
          <Link
            to="/"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6C63FF, #5548e0)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            + New Interview
          </Link>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner" />
          <p style={{ color: '#888' }}>Loading sessions...</p>
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div style={{
          background: '#1e1e3a',
          border: '1px solid #2a2a4a',
          borderRadius: '16px',
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>No interviews yet!</h3>
          <p style={{ color: '#888', marginBottom: '24px' }}>
            Start your first AI-powered mock interview
          </p>
          <Link to="/" style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #6C63FF, #5548e0)',
            color: 'white',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 600
          }}>
            Start Interview →
          </Link>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '30px'
          }}>
            {[
              { label: 'Total Interviews', value: sessions.length, icon: '🎯' },
              {
                label: 'Avg Score',
                value: (sessions.reduce((s, e) => s + e.total_score, 0) / sessions.length).toFixed(1) + '/10',
                icon: '📊'
              },
              {
                label: 'Best Score',
                value: Math.max(...sessions.map(s => s.total_score)).toFixed(1) + '/10',
                icon: '🏆'
              }
            ].map((stat, i) => (
              <div key={i} style={{
                background: '#1e1e3a',
                border: '1px solid #2a2a4a',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#6C63FF',
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </div>
                <div style={{ color: '#888', fontSize: '0.85rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#1e1e3a',
            border: '1px solid #2a2a4a',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 2fr',
              padding: '16px 24px',
              background: '#16213e',
              borderBottom: '1px solid #2a2a4a'
            }}>
              {['Name', 'Job Role', 'Questions', 'Score', 'Date'].map((h, i) => (
                <span key={i} style={{
                  color: '#888',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {h}
                </span>
              ))}
            </div>

            {sessions.map((session, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 2fr',
                padding: '18px 24px',
                borderBottom: i < sessions.length - 1 ? '1px solid #2a2a4a' : 'none',
                alignItems: 'center'
              }}>
                <span style={{ color: '#e0e0e0', fontWeight: 600 }}>{session.name}</span>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>{session.job_role}</span>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>{session.total_questions}</span>
                <span style={{
                  color: getScoreColor(session.total_score),
                  fontWeight: 700
                }}>
                  {session.total_score.toFixed(1)}/10
                </span>
                <div>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>{session.created_at}</div>
                  <div style={{
                    color: getScoreColor(session.total_score),
                    fontSize: '0.8rem',
                    marginTop: '2px'
                  }}>
                    {getScoreLabel(session.total_score)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
