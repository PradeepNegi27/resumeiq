import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Result() {
  const navigate = useNavigate()
  const [evaluations, setEvaluations] = useState([])
  const [avgScore, setAvgScore] = useState(0)
  const [candidateName, setCandidateName] = useState('')
  const [jobRole, setJobRole] = useState('')

  useEffect(() => {
    const e = localStorage.getItem('evaluations')
    const score = localStorage.getItem('avgScore')
    const name = localStorage.getItem('candidateName')
    const role = localStorage.getItem('jobRole')
    if (!e) { navigate('/'); return }
    setEvaluations(JSON.parse(e))
    setAvgScore(parseFloat(score))
    setCandidateName(name || 'Candidate')
    setJobRole(role || 'Unknown')
  }, [])

  const getScoreColor = (score) => {
    if (score >= 7) return '#00d4aa'
    if (score >= 5) return '#ffa502'
    return '#ff4757'
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return '🏆 Excellent!'
    if (score >= 6) return '👍 Good'
    if (score >= 4) return '📈 Average'
    return '💪 Need Practice'
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Score Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1e3a, #2a2050)',
        border: '1px solid #6C63FF',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#e0e0e0' }}>
          Interview Complete! 🎉
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          {candidateName} — {jobRole}
        </p>

        {/* Big Score */}
        <div style={{
          fontSize: '5rem',
          fontWeight: 800,
          color: getScoreColor(avgScore),
          marginBottom: '10px',
          lineHeight: 1
        }}>
          {avgScore}
        </div>
        <div style={{ fontSize: '1.2rem', color: '#888', marginBottom: '20px' }}>
          out of 10
        </div>
        <div style={{
          display: 'inline-block',
          background: `${getScoreColor(avgScore)}20`,
          color: getScoreColor(avgScore),
          padding: '8px 24px',
          borderRadius: '20px',
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '30px'
        }}>
          {getScoreLabel(avgScore)}
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginTop: '10px'
        }}>
          {[
            { label: 'Questions', value: evaluations.length },
            { label: 'Avg Score', value: `${avgScore}/10` },
            { label: 'Status', value: avgScore >= 6 ? 'Pass ✅' : 'Practice More 💪' }
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#0f0f1a',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#6C63FF' }}>
                {stat.value}
              </div>
              <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Feedback */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>
        📋 Detailed Feedback
      </h2>

      {evaluations.map((e, i) => (
        <div key={i} style={{
          background: '#1e1e3a',
          border: '1px solid #2a2a4a',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '20px'
        }}>
          {/* Question Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                background: '#6C63FF20',
                color: '#6C63FF',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                Q{i + 1} — {e.question.type?.toUpperCase()}
              </span>
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: getScoreColor(e.evaluation.score)
            }}>
              {e.evaluation.score}/10
            </span>
          </div>

          {/* Question */}
          <p style={{
            color: '#e0e0e0',
            fontSize: '1rem',
            marginBottom: '12px',
            fontWeight: 600,
            lineHeight: 1.5
          }}>
            {e.question.question}
          </p>

          {/* Your Answer */}
          <div style={{
            background: '#0f0f1a',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '16px'
          }}>
            <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '6px' }}>
              YOUR ANSWER:
            </p>
            <p style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {e.answer}
            </p>
          </div>

          {/* Feedback */}
          <div style={{
            background: '#6C63FF10',
            border: '1px solid #6C63FF30',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '12px'
          }}>
            <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '6px' }}>
              💬 FEEDBACK:
            </p>
            <p style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {e.evaluation.feedback}
            </p>
          </div>

          {/* Strength & Improvement */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              background: '#00d4aa10',
              border: '1px solid #00d4aa30',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <p style={{ color: '#00d4aa', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>
                ✅ STRENGTH
              </p>
              <p style={{ color: '#e0e0e0', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {e.evaluation.strength}
              </p>
            </div>
            <div style={{
              background: '#ff475710',
              border: '1px solid #ff475730',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <p style={{ color: '#ff4757', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 600 }}>
                📈 IMPROVE
              </p>
              <p style={{ color: '#e0e0e0', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {e.evaluation.improvement}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
        <button
          onClick={() => {
            localStorage.clear()
            navigate('/')
          }}
          style={{
            flex: 1,
            padding: '16px',
            background: 'linear-gradient(135deg, #6C63FF, #5548e0)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          🔄 Try Again
        </button>
        <Link
          to="/history"
          style={{
            flex: 1,
            padding: '16px',
            background: 'transparent',
            color: '#6C63FF',
            border: '2px solid #6C63FF',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'none',
            textAlign: 'center'
          }}
        >
          📊 View History
        </Link>
      </div>
    </div>
  )
}