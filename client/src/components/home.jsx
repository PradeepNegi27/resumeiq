import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!name || !jobRole || !jobDescription || !resume) {
      setError('Please fill all fields and upload your resume!')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('job_description', jobDescription)

      const res = await axios.post('https://resumeiq-31bx.onrender.com/api/upload', formData)

      if (res.data.success) {
        localStorage.setItem('questions', JSON.stringify(res.data.questions))
        localStorage.setItem('candidateName', name)
        localStorage.setItem('jobRole', jobRole)
        navigate('/interview')
      } else {
        setError(res.data.error || 'Something went wrong!')
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running!')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>

      {/* HERO */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          🎯 ResumeIQ
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem' }}>
          Upload your resume + job description and get personalized AI interview questions
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '40px'
      }}>
        {[
          { icon: '📄', title: 'Upload Resume', desc: 'Upload your PDF resume' },
          { icon: '🤖', title: 'AI Generates Questions', desc: 'Based on your projects & skills' },
          { icon: '📊', title: 'Get Feedback', desc: 'Instant score and improvement tips' }
        ].map((item, i) => (
          <div key={i} style={{
            background: '#1e1e3a',
            border: '1px solid #2a2a4a',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>{item.title}</h3>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div style={{
        background: '#1e1e3a',
        border: '1px solid #2a2a4a',
        borderRadius: '16px',
        padding: '36px'
      }}>
        <h2 style={{ marginBottom: '24px', fontSize: '1.4rem' }}>
          🚀 Start Your Interview
        </h2>

        {error && (
          <div style={{
            background: '#ff475720',
            border: '1px solid #ff4757',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#ff4757',
            fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>
            👤 Your Name
          </label>
          <input
            type="text"
            placeholder="e.g. Pradeep Singh Negi"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f0f1a',
              border: '1px solid #2a2a4a',
              borderRadius: '10px',
              color: '#e0e0e0',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Job Role */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>
            💼 Job Role Applying For
          </label>
          <input
            type="text"
            placeholder="e.g. Frontend Developer, Python Developer"
            value={jobRole}
            onChange={e => setJobRole(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f0f1a',
              border: '1px solid #2a2a4a',
              borderRadius: '10px',
              color: '#e0e0e0',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Job Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>
            📋 Job Description
          </label>
          <textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            rows={5}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f0f1a',
              border: '1px solid #2a2a4a',
              borderRadius: '10px',
              color: '#e0e0e0',
              fontSize: '0.95rem',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'Segoe UI, sans-serif'
            }}
          />
        </div>

        {/* Resume Upload */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', color: '#888', marginBottom: '8px', fontSize: '0.9rem' }}>
            📄 Upload Resume (PDF only)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setResume(e.target.files[0])}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#0f0f1a',
              border: '1px solid #2a2a4a',
              borderRadius: '10px',
              color: '#e0e0e0',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          />
          {resume && (
            <p style={{ color: '#00d4aa', fontSize: '0.85rem', marginTop: '8px' }}>
              ✅ {resume.name} selected
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: loading ? '#2a2a4a' : 'linear-gradient(135deg, #6C63FF, #5548e0)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading ? (
            <span>⏳ Generating Questions... (takes 10-15 seconds)</span>
          ) : (
            <span>🚀 Generate Interview Questions</span>
          )}
        </button>
      </div>
    </div>
  )
}
