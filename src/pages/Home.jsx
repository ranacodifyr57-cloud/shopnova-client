import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const API = 'https://shopnova-server.vercel.app'

const categories = [
  { name: 'Electronics', emoji: '📱', color: '#1a56db' },
  { name: 'Clothing', emoji: '👕', color: '#7c3aed' },
  { name: 'Home & Living', emoji: '🏠', color: '#0891b2' },
  { name: 'Beauty', emoji: '💄', color: '#db2777' },
  { name: 'Sports', emoji: '⚽', color: '#16a34a' },
  { name: 'Books', emoji: '📚', color: '#d97706' },
]

const features = [
  { icon: <Truck size={24} />, title: 'Free Delivery', desc: 'On orders above Rs. 2000', color: '#1a56db' },
  { icon: <Shield size={24} />, title: 'Secure Payment', desc: 'Cash on delivery available', color: '#16a34a' },
  { icon: <RefreshCw size={24} />, title: 'Easy Returns', desc: '7 days return policy', color: '#7c3aed' },
  { icon: <ShoppingBag size={24} />, title: 'Quality Products', desc: '100% genuine products', color: '#d97706' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/products?featured=true`)
      .then(r => setFeatured(Array.isArray(r.data) ? r.data.slice(0, 8) : []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #fff4ed 0%, #fff 60%, #fef3c7 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(249,115,22,0.06)' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>New arrivals every week!</span>
            </div>
            <h1 className="fade-up-1" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontFamily: 'var(--font-head)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.05 }}>
              Shop Everything<br />
              <span style={{ color: 'var(--accent)' }}>You Love</span>
            </h1>
            <p className="fade-up-2" style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 480, marginBottom: 36, lineHeight: 1.7 }}>
              Discover thousands of products at the best prices. Fast delivery, easy returns, and 100% genuine products guaranteed.
            </p>
            <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/products" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12,
                background: 'var(--accent)', color: '#fff',
                fontWeight: 700, fontSize: 15,
                boxShadow: '0 8px 24px rgba(249,115,22,0.3)',
              }}>
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/products?featured=true" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12,
                border: '2px solid var(--border)', color: 'var(--text)',
                fontWeight: 600, fontSize: 15, background: '#fff',
              }}>
                Featured Products
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { emoji: '📱', label: 'Electronics', count: '500+', color: '#1a56db' },
              { emoji: '👕', label: 'Clothing', count: '1000+', color: '#7c3aed' },
              { emoji: '🏠', label: 'Home', count: '300+', color: '#0891b2' },
              { emoji: '💄', label: 'Beauty', count: '200+', color: '#db2777' },
            ].map((c, i) => (
              <div key={i} style={{
                padding: 24, borderRadius: 20,
                background: '#fff',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{c.emoji}</div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.label}</p>
                <p style={{ fontSize: 12, color: c.color, fontWeight: 600 }}>{c.count} items</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`@media (max-width: 768px) { section > div { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 24px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{f.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text2)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Browse</p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--text)' }}>Shop by Category</h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map((c, i) => (
              <Link key={i} to={`/products?category=${c.name}`} style={{
                padding: '28px 16px', borderRadius: 20,
                background: '#fff',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                textAlign: 'center',
                transition: 'var(--transition)',
                display: 'block',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{c.emoji}</div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Hand Picked</p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontFamily: 'var(--font-head)', fontWeight: 800, color: 'var(--text)' }}>Featured Products</h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
              Loading products...
            </div>
          ) : featured.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <p style={{ fontSize: 48, marginBottom: 16 }}>🛍️</p>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No products yet</h3>
              <p style={{ color: 'var(--text2)' }}>Add products from the admin dashboard!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 24px', background: 'var(--accent)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: 'var(--font-head)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Start Shopping Today!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 17, marginBottom: 32 }}>
            Thousands of products waiting for you. Best prices guaranteed!
          </p>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 36px', borderRadius: 14,
            background: '#fff', color: 'var(--accent)',
            fontWeight: 700, fontSize: 16,
          }}>
            Browse All Products <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}