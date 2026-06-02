import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Package, Home } from 'lucide-react'
import axios from 'axios'

const API = 'http://localhost:5000'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => {})
  }, [id])

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={48} color="#16a34a" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Order Placed!</h1>
        <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 32 }}>
          Thank you for your order! We'll contact you soon to confirm delivery.
        </p>

        {order && (
          <div style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border)', background: '#fff', marginBottom: 32, textAlign: 'left', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>Order ID</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>#{order._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>Name</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{order.customerInfo?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>Total</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>Rs. {order.totalAmount?.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text2)', fontSize: 14 }}>Payment</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Cash on Delivery</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'var(--accent)', color: '#fff', fontWeight: 700 }}>
            <Home size={16} /> Go Home
          </Link>
          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: '2px solid var(--border)', color: 'var(--text)', fontWeight: 600 }}>
            <Package size={16} /> Shop More
          </Link>
        </div>
      </div>
    </main>
  )
}