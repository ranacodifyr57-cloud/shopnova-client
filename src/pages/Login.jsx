import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, X, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = 'https://shopnova-server.vercel.app'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submitForgot = e => {
    e.preventDefault()
    if (!forgotEmail.trim()) return
    // Simulated reset flow (no backend endpoint) — show confirmation
    setForgotSent(true)
  }

  const closeForgot = () => {
    setShowForgot(false)
    setForgotSent(false)
    setForgotEmail('')
  }

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, form)
      login(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px',
    borderRadius: 12, border: '1px solid var(--border)',
    fontSize: 14, color: 'var(--text)', background: 'var(--surface)',
    transition: 'var(--transition)',
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'radial-gradient(60% 50% at 50% 0%, rgba(255,122,26,0.12), transparent 60%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, background: 'var(--aurora)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--glow)' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 26, color: '#fff' }}>S</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Welcome <span className="gradient-text">back!</span></h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Login to your ShopNova account</p>
        </div>

        <div className="glass" style={{ padding: 32, borderRadius: 24, boxShadow: 'var(--shadow)' }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: 16, position: 'relative' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
              <Mail size={16} style={{ position: 'absolute', left: 12, bottom: 14, color: 'var(--text2)' }} />
              <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@example.com" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div style={{ marginBottom: 24, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Password</label>
                <button type="button" onClick={() => setShowForgot(true)} style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
              </div>
              <Lock size={16} style={{ position: 'absolute', left: 12, bottom: 14, color: 'var(--text2)' }} />
              <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle} required placeholder="Your password" style={{ ...inputStyle, paddingRight: 42 }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, bottom: 12, color: 'var(--text2)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'var(--aurora)', opacity: loading ? 0.6 : 1, color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: 'var(--glow)' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Register</Link>
          </p>
        </div>
      </div>

      {/* Forgot password modal */}
      {showForgot && (
        <div onClick={closeForgot} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface-solid)', border: '1px solid var(--border-2)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 420, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>Reset <span className="gradient-text">password</span></h2>
              <button onClick={closeForgot} aria-label="Close" style={{ padding: 8, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '16px 0 4px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.25), rgba(52,211,153,0.06))', border: '1px solid rgba(52,211,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px auto 18px', boxShadow: '0 0 40px -8px rgba(52,211,153,0.5)' }}>
                  <CheckCircle size={34} color="#34d399" />
                </div>
                <p style={{ fontSize: 15, color: 'var(--text)', fontWeight: 600, marginBottom: 6 }}>Check your inbox</p>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>If an account exists for <b style={{ color: 'var(--text)' }}>{forgotEmail}</b>, we've sent a password reset link.</p>
                <button onClick={closeForgot} style={{ width: '100%', marginTop: 22, padding: '13px', borderRadius: 14, border: 'none', background: 'var(--aurora)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--glow)' }}>Done</button>
              </div>
            ) : (
              <form onSubmit={submitForgot}>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 18 }}>Enter the email linked to your account and we'll send you a reset link.</p>
                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
                  <input type="email" required autoFocus value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@example.com" style={{ ...inputStyle, paddingTop: 12, paddingBottom: 12 }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: 14, border: 'none', background: 'var(--aurora)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--glow)' }}>Send reset link</button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  )
}