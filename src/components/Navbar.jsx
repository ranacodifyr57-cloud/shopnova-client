import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search, User, LogOut } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { totalItems } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSearch = e => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${search}`)
      setSearch('')
    }
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      {/* Top bar */}
      <div style={{ background: 'var(--accent)', padding: '8px 24px', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>🚚 Free delivery on orders above Rs. 2000 | Cash on Delivery Available</p>
      </div>

      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 18, color: '#fff' }}>S</span>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>
            Shop<span style={{ color: 'var(--accent)' }}>Nova</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: 500 }} className="search-form">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1, padding: '10px 16px',
              border: '1.5px solid var(--border)',
              borderRight: 'none',
              borderRadius: '10px 0 0 10px',
              fontSize: 14, background: 'var(--bg2)',
            }}
          />
          <button type="submit" style={{
            padding: '10px 16px',
            background: 'var(--accent)',
            borderRadius: '0 10px 10px 0',
            color: '#fff', border: 'none',
          }}>
            <Search size={18} />
          </button>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }} className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isAdmin && (
                <Link to="/admin" style={{ padding: '8px 14px', borderRadius: 8, background: 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                  Admin
                </Link>
              )}
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)' }}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              <User size={16} /> Login
            </Link>
          )}

          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text)' }}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="mobile-toggle" style={{ color: 'var(--text)', padding: 8 }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '16px 24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', marginBottom: 16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, padding: '10px 16px', border: '1.5px solid var(--border)', borderRight: 'none', borderRadius: '10px 0 0 10px', fontSize: 14 }} />
            <button type="submit" style={{ padding: '10px 16px', background: 'var(--accent)', borderRadius: '0 10px 10px 0', color: '#fff', border: 'none' }}><Search size={18} /></button>
          </form>
          {[['/', 'Home'], ['/products', 'Products'], ['/cart', `Cart (${totalItems})`]].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--text)' }}>{label}</Link>
          ))}
          {!user && <Link to="/login" onClick={() => setOpen(false)} style={{ display: 'block', marginTop: 12, padding: '12px', textAlign: 'center', background: 'var(--accent)', borderRadius: 10, color: '#fff', fontWeight: 700 }}>Login</Link>}
        </div>
      )}

      <style>{`
        .nav-actions { display: flex !important; }
        .search-form { display: flex !important; }
        .mobile-toggle { display: none !important; }
        @media (max-width: 768px) {
          .nav-actions { display: none !important; }
          .search-form { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  )
}