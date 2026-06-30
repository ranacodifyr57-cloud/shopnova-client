import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const API = 'https://shopnova-server.vercel.app'

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', note: '' })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const delivery = totalPrice >= 2000 ? 0 : 150
  const total = totalPrice + delivery

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/api/orders`, {
        customerInfo: form,
        items: cart.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.images?.[0] })),
        totalAmount: total,
        paymentMethod: 'Cash on Delivery',
      })
      clearCart()
      navigate(`/order-success/${data._id}`)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    borderRadius: 12, border: '1px solid var(--border)',
    fontSize: 14, background: 'var(--surface)', color: 'var(--text)',
    transition: 'var(--transition)',
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <main style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, marginBottom: 32 }}>Check<span className="gradient-text">out</span></h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          {/* Form */}
          <form onSubmit={submit}>
            <div className="glass" style={{ padding: 28, borderRadius: 22, boxShadow: 'var(--shadow)', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Delivery Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handle} required placeholder="Muhammad Ali" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Phone *</label>
                  <input name="phone" value={form.phone} onChange={handle} required placeholder="+92 300 0000000" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>City *</label>
                  <input name="city" value={form.city} onChange={handle} required placeholder="Rawalpindi" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Full Address *</label>
                <input name="address" value={form.address} onChange={handle} required placeholder="House No, Street, Area" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Order Note (Optional)</label>
                <textarea name="note" value={form.note} onChange={handle} rows={3} placeholder="Any special instructions..." style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>

            {/* Payment */}
            <div className="glass" style={{ padding: 28, borderRadius: 22, boxShadow: 'var(--shadow)' }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Payment Method</h2>
              <div style={{ padding: 16, borderRadius: 14, border: '1px solid rgba(255,122,26,0.45)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Package size={20} color="var(--accent)" />
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>Cash on Delivery</p>
                  <p style={{ color: 'var(--text2)', fontSize: 13 }}>Pay when you receive your order</p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '16px', marginTop: 20,
              borderRadius: 14, border: 'none',
              background: 'var(--aurora)', opacity: loading ? 0.6 : 1,
              color: '#fff', fontWeight: 700, fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: 'var(--glow)',
            }}>
              {loading ? 'Placing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="glass" style={{ padding: 28, borderRadius: 22, boxShadow: 'var(--shadow)', position: 'sticky', top: 96 }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Order Summary</h2>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden', background: 'var(--bg2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>📦</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text2)' }}>x{item.quantity}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--text2)' }}>
                <span>Subtotal</span><span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: 'var(--text2)' }}>
                <span>Delivery</span>
                <span style={{ color: delivery === 0 ? '#34d399' : 'var(--text)' }}>{delivery === 0 ? 'FREE' : `Rs. ${delivery}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800 }}>
                <span>Total</span>
                <span className="gradient-text">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){main>div>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </main>
  )
}