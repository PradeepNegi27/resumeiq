import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Interview() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluations, setEvaluations] = useState([])
  const [loading, setLoading] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const q = localStorage.getItem('questions')
    const name = localStorage.getItem('candidateName')
    if (!q) { navigate('/'); return }
    setQuestions(JSON.parse(q))
    setCandidateName(name || 'Candidate')
  }, [])

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0

  // ── READ QUESTION ALOUD ──
  const speakText = (text) => {
    if (!text) return
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } catch (err) {
      setIsSpeaking(false)
    }
  }

  // ── START MIC ──
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Use Chrome browser for voice input!'); return }

    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setAnswer(transcript)
    }

    recognition.onerror = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  // ── STOP MIC ──
  const stopListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
        recognitionRef.current = null
      }
    } catch (err) {}
    setIsListening(false)
  }

  // ── SUBMIT ANSWER ──
  const handleSubmitAnswer = async () => {
    console.log("BUTTON CLICKED", answer, loading)
    if (!answer.trim() || loading) return
    // Stop mic and speech first
    stopListening()
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('question', currentQuestion.question)
      formData.append('answer', answer)
      formData.append('candidate_name', candidateName)

      const res = await axios.post('https://resumeiq-31bx.onrender.com/api/evaluate', formData)

      if (res.data.success) {
        const newEvaluations = [...evaluations, {
          question: currentQuestion,
          answer: answer,
          evaluation: res.data.evaluation
        }]
        setEvaluations(newEvaluations)

        if (currentIndex + 1 >= questions.length) {
          // Last question - go to result
          const totalScore = newEvaluations.reduce((sum, e) => sum + e.evaluation.score, 0)
          const avgScore = totalScore / newEvaluations.length

          await axios.post('https://resumeiq-31bx.onrender.com/api/save-session', {
            name: candidateName,
            job_role: localStorage.getItem('jobRole') || 'Unknown',
            total_score: avgScore,
            total_questions: newEvaluations.length
          })

          localStorage.setItem('evaluations', JSON.stringify(newEvaluations))
          localStorage.setItem('avgScore', avgScore.toFixed(1))
          setLoading(false)
          navigate('/result')
        } else {
          // Next question
          setCurrentIndex(prev => prev + 1)
          setAnswer('')
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div className="loading-spinner" />
        <p style={{ color: '#888' }}>Loading questions...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>

      {/* Progress */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: '#888', fontSize: '0.9rem' }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span style={{ color: '#6C63FF', fontWeight: 600, fontSize: '0.9rem' }}>
            {currentQuestion?.type?.toUpperCase()} QUESTION
          </span>
        </div>
        <div style={{
          width: '100%', height: '6px',
          background: '#2a2a4a', borderRadius: '3px', overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            borderRadius: '3px', transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Question Card */}
      <div style={{
        background: '#1e1e3a',
        border: '1px solid #2a2a4a',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <span style={{
            background: '#6C63FF20',
            color: '#6C63FF',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            {currentQuestion?.type === 'project' ? '🚀 Project' :
             currentQuestion?.type === 'skill' ? '⚡ Skill' : '🧑‍💼 HR'}
          </span>

          <button
            onClick={() => speakText(currentQuestion?.question)}
            disabled={isSpeaking}
            style={{
              background: isSpeaking ? '#2a2a4a' : '#6C63FF20',
              color: isSpeaking ? '#888' : '#6C63FF',
              border: '1px solid #6C63FF50',
              borderRadius: '10px',
              padding: '8px 16px',
              cursor: isSpeaking ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {isSpeaking ? '🔊 Speaking...' : '🔊 Read Question'}
          </button>
        </div>

        <h2 style={{ fontSize: '1.3rem', lineHeight: 1.6, color: '#e0e0e0' }}>
          {currentQuestion?.question}
        </h2>
      </div>

      {/* Answer Box */}
      <div style={{
        background: '#1e1e3a',
        border: '1px solid #2a2a4a',
        borderRadius: '16px',
        padding: '32px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <label style={{ color: '#888', fontSize: '0.9rem' }}>✍️ Your Answer</label>
          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              background: isListening
                ? 'linear-gradient(135deg, #ff4757, #ff2d3b)'
                : 'linear-gradient(135deg, #6C63FF, #5548e0)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            {isListening ? '⏹️ Stop Recording' : '🎤 Voice Answer'}
          </button>
        </div>

        {isListening && (
          <div style={{
            background: '#ff475710',
            border: '1px solid #ff4757',
            borderRadius: '10px',
            padding: '10px 16px',
            marginBottom: '12px',
            color: '#ff4757',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            🔴 Listening... Speak your answer clearly
          </div>
        )}

        <textarea
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer or use 🎤 mic to speak..."
          rows={6}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: '#0f0f1a',
            border: isListening ? '1px solid #ff4757' : '1px solid #2a2a4a',
            borderRadius: '10px',
            color: '#e0e0e0',
            fontSize: '0.95rem',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'Segoe UI, sans-serif',
            marginBottom: '20px'
          }}
        />

        <button
          onClick={handleSubmitAnswer}
          disabled={loading || !answer.trim()}
          style={{
            width: '100%',
            padding: '16px',
            background: loading || !answer.trim()
              ? '#2a2a4a'
              : 'linear-gradient(135deg, #6C63FF, #5548e0)',
            color: loading || !answer.trim() ? '#888' : 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading || !answer.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Evaluating...' :
           currentIndex + 1 === questions.length ? '🏁 Finish Interview' : '➡️ Next Question'}
        </button>
      </div>

      {/* Completed Questions */}
      {evaluations.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#888', fontSize: '0.9rem', marginBottom: '16px' }}>
            ✅ Completed Questions
          </h3>
          {evaluations.map((e, i) => (
            <div key={i} style={{
              background: '#1e1e3a',
              border: '1px solid #2a2a4a',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>
                Q{i + 1}: {e.question.question.substring(0, 60)}...
              </span>
              <span style={{
                color: e.evaluation.score >= 7 ? '#00d4aa' :
                       e.evaluation.score >= 5 ? '#ffa502' : '#ff4757',
                fontWeight: 700
              }}>
                {e.evaluation.score}/10
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
