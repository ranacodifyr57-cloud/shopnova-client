import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = 'https://shopnova-server.vercel.app'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post(`${API}/api/auth/register`, form)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px',
    borderRadius: 10, border: '1.5px solid var(--border)',
    fontSize: 14, color: 'var(--text)', background: '#fff',
    transition: 'var(--transition)',
  }

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'var(--bg2)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'var(--accent)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 24, color: '#fff' }}>S</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Join ShopNova today!</p>
        </div>

        <div style={{ padding: 32, borderRadius: 24, border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow)' }}>
          <form onSubmit={submit}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Muhammad Ali', icon: <User size={16} style={{ position: 'absolute', left: 12, bottom: 14, color: 'var(--text2)' }} /> },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: <Mail size={16} style={{ position: 'absolute', left: 12, bottom: 14, color: 'var(--text2)' }} /> },
              { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+92 300 0000000', icon: <Phone size={16} style={{ position: 'absolute', left: 12, bottom: 14, color: 'var(--text2)' }} /> },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', icon: <Lock size={16} style={{ position: 'absolute', left: 12, bottom: 14, color: 'var(--text2)' }} /> },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 16, position: 'relative' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.label}</label>
                {f.icon}
                <input name={f.name} type={f.type} value={form[f.name]} onChange={handle} required placeholder={f.placeholder} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            ))}
            {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </main>
  )
}