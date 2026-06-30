import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Truck, Shield, RefreshCw, Star } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { dummyFeatured } from '../data/products'

const API = 'https://shopnova-server.vercel.app'

const categories = [
  { name: 'Electronics', emoji: '📱', color: '#60a5fa' },
  { name: 'Clothing', emoji: '👕', color: '#c084fc' },
  { name: 'Home & Living', emoji: '🏠', color: '#22d3ee' },
  { name: 'Beauty', emoji: '💄', color: '#f472b6' },
  { name: 'Sports', emoji: '⚽', color: '#34d399' },
  { name: 'Books', emoji: '📚', color: '#fbbf24' },
]

const features = [
  { icon: <Truck size={24} />, title: 'Free Delivery', desc: 'On orders above Rs. 2000', color: '#60a5fa' },
  { icon: <Shield size={24} />, title: 'Secure Payment', desc: 'Cash on delivery available', color: '#34d399' },
  { icon: <RefreshCw size={24} />, title: 'Easy Returns', desc: '7 days return policy', color: '#c084fc' },
  { icon: <ShoppingBag size={24} />, title: 'Quality Products', desc: '100% genuine products', color: '#fbbf24' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    axios.get(`${API}/api/products?featured=true`)
      .then(r => {
        const list = Array.isArray(r.data) ? r.data.slice(0, 8) : []
        setFeatured(list.length ? list : dummyFeatured)
      })
      .catch(() => setFeatured(dummyFeatured))
      .finally(() => setLoading(false))
  }, [])

  // Auto-rotating hero carousel (no buttons — advances on its own)
  const slides = (featured.length ? featured : dummyFeatured).slice(0, 5)
  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 3500)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: 'radial-gradient(120% 100% at 50% -20%, rgba(255,122,26,0.10), transparent 55%)',
        padding: '90px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(177,92,255,0.22), transparent 70%)', filter: 'blur(20px)', animation: 'float 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: -140, left: -100, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,120,0.18), transparent 70%)', filter: 'blur(20px)', animation: 'float 11s ease-in-out infinite' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', position: 'relative' }}>
          <div>
            <div className="fade-up glass" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>New arrivals every week!</span>
            </div>
            <h1 className="fade-up-1" style={{ fontSize: 'clamp(38px, 5.4vw, 70px)', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.03 }}>
              Shop Everything<br />
              <span className="gradient-text">You Love</span>
            </h1>
            <p className="fade-up-2" style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 480, marginBottom: 36, lineHeight: 1.7 }}>
              Discover thousands of products at the best prices. Fast delivery, easy returns, and 100% genuine products guaranteed.
            </p>
            <div className="fade-up-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/products" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 30px', borderRadius: 14,
                background: 'var(--aurora)', color: '#fff',
                fontWeight: 700, fontSize: 15,
                boxShadow: 'var(--glow)',
              }}>
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/products?featured=true" className="glass" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 30px', borderRadius: 14,
                color: 'var(--text)',
                fontWeight: 600, fontSize: 15,
              }}>
                Featured Products
              </Link>
            </div>
          </div>

          {/* Auto-rotating carousel */}
          <div className="fade-up-2" style={{ position: 'relative', animation: 'float 8s ease-in-out infinite' }}>
            <div className="glass" style={{ position: 'relative', borderRadius: 28, padding: 16, boxShadow: 'var(--shadow-lg)', aspectRatio: '4 / 3.4', overflow: 'hidden' }}>
              {slides.map((p, i) => (
                <Link
                  key={p._id || i}
                  to={p._id ? `/products/${p._id}` : '/products'}
                  style={{
                    position: 'absolute', inset: 16, borderRadius: 20, overflow: 'hidden',
                    opacity: i === slide ? 1 : 0,
                    transform: i === slide ? 'scale(1)' : 'scale(1.04)',
                    transition: 'opacity 0.9s ease, transform 0.9s ease',
                    pointerEvents: i === slide ? 'auto' : 'none',
                    display: 'block',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'var(--bg2)' }}>
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🛍️</div>}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.78) 100%)' }} />
                  {p.oldPrice && (
                    <span style={{ position: 'absolute', top: 14, left: 14, padding: '5px 11px', borderRadius: 999, background: 'var(--aurora)', color: '#fff', fontSize: 12, fontWeight: 700, boxShadow: 'var(--glow-pink)' }}>
                      {Math.round((1 - p.price / p.oldPrice) * 100)}% OFF
                    </span>
                  )}
                  <span style={{ position: 'absolute', top: 14, right: 14, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                    <Star size={12} fill="#fbbf24" color="#fbbf24" /> {p.rating || '4.5'}
                  </span>
                  <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, color: '#fff' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.8, marginBottom: 4 }}>{p.category}</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>{p.name}</h3>
                    <p style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800 }}>Rs. {p.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
            {/* progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 14, height: 14 }}>
              {slides.map((_, i) => (
                <span key={i} style={{
                  height: 7, borderRadius: 999,
                  width: i === slide ? 28 : 7,
                  background: i === slide ? 'var(--aurora)' : 'var(--text2)',
                  opacity: i === slide ? 1 : 0.45,
                  cursor: 'pointer',
                  transition: 'all 0.5s ease',
                }} onClick={() => setSlide(i)} />
              ))}
            </div>
          </div>
        </div>

        <style>{`@media (max-width: 768px) { section > div { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="glass" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 20, borderRadius: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}24`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text2)' }}>{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p className="gradient-text" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, display: 'inline-block' }}>Browse</p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>Shop by Category</h2>
            </div>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {categories.map((c, i) => (
              <Reveal key={i} delay={i * 70}>
              <Link to={`/products?category=${c.name}`} className="glass" style={{
                padding: '28px 16px', borderRadius: 20,
                boxShadow: 'var(--shadow)',
                textAlign: 'center',
                transition: 'var(--transition)',
                display: 'block',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 18px 50px -16px ${c.color}66` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{c.emoji}</div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{c.name}</p>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div>
              <p className="gradient-text" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, display: 'inline-block' }}>Hand Picked</p>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text)' }}>Featured Products</h2>
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
              {featured.map((p, i) => <Reveal key={p._id} delay={(i % 4) * 80}><ProductCard product={p} /></Reveal>)}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '40px 24px 90px' }}>
        <Reveal style={{
          maxWidth: 1100, margin: '0 auto', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          padding: '70px 32px', borderRadius: 32,
          background: 'var(--aurora)',
          boxShadow: 'var(--glow-pink)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 120% at 50% -20%, rgba(255,255,255,0.25), transparent 60%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: 16, position: 'relative' }}>
            Start Shopping Today!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 17, marginBottom: 32, position: 'relative' }}>
            Thousands of products waiting for you. Best prices guaranteed!
          </p>
          <Link to="/products" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '16px 36px', borderRadius: 14,
            background: '#0a0a16', color: '#fff',
            fontWeight: 700, fontSize: 16, position: 'relative',
            boxShadow: '0 10px 30px -8px rgba(0,0,0,0.5)',
          }}>
            Browse All Products <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </main>
  )
}