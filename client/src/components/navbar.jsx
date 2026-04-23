import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 40px',
      background: '#1a1a2e',
      borderBottom: '1px solid #2a2a4a',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{
        fontSize: '1.4rem',
        fontWeight: 700,
        color: '#6C63FF',
        textDecoration: 'none',
        letterSpacing: '1px'
      }}>
        🎯 ResumeIQ
      </Link>
      <div style={{ display: 'flex', gap: '28px' }}>
        {[['/', 'Home'], ['/history', 'History']].map(([path, label]) => (
          <Link key={path} to={path} style={{
            color: location.pathname === path ? '#6C63FF' : '#888',
            textDecoration: 'none',
            fontWeight: location.pathname === path ? 600 : 400,
            fontSize: '0.95rem'
          }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}