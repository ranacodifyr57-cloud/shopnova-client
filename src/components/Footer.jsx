import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ position: 'relative', background: 'linear-gradient(180deg, rgba(13,13,28,0.6), rgba(6,6,17,0.95))', borderTop: '1px solid var(--border)', padding: '60px 24px 32px' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--aurora)', opacity: 0.8 }} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, background: 'var(--aurora)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow)' }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 18, color: '#fff' }}>S</span>
              </div>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20, color: '#fff' }}>Shop<span className="gradient-text">Nova</span></span>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.7 }}>Your one-stop shop for everything. Quality products, best prices, fast delivery.</p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Quick Links</h4>
            {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], ['/login', 'Login']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Categories</h4>
            {['Electronics', 'Clothing', 'Home & Living', 'Beauty', 'Sports', 'Books'].map(c => (
              <Link key={c} to={`/products?category=${c}`} style={{ display: 'block', color: '#94a3b8', fontSize: 14, marginBottom: 8 }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}
              >{c}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Contact</h4>
            {[
              { icon: <Mail size={14} />, text: 'rana.codifyr57@gmail.com' },
              { icon: <Phone size={14} />, text: '+92 324 7352486' },
              { icon: <MapPin size={14} />, text: 'Rawalpindi, Pakistan' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: '#94a3b8', fontSize: 14 }}>
                <span style={{ color: 'var(--accent)' }}>{c.icon}</span>
                {c.text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#64748b', fontSize: 13 }}>© {year} ShopNova. All rights reserved.</p>
          <p style={{ color: '#64748b', fontSize: 13 }}>Made with ❤️ by Muhammad Amir</p>
        </div>
      </div>
    </footer>
  )
}