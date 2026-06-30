import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search, User, LogOut, Sun, Moon, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navCategories = ['Electronics', 'Clothing', 'Home & Living', 'Beauty', 'Sports', 'Books']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { totalItems } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const { isDark, toggleTheme } = useTheme()
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
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(18px) saturate(150%)',
      WebkitBackdropFilter: 'blur(18px) saturate(150%)',
      boxShadow: '0 8px 32px -16px rgba(0,0,0,0.5)',
    }}>
      {/* Top bar */}
      <div style={{ background: 'var(--aurora)', padding: '8px 24px', textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '0.01em' }}>🚚 Free delivery on orders above Rs. 2000 &nbsp;·&nbsp; Cash on Delivery Available</p>
      </div>

      <nav style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, background: 'var(--aurora)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow)' }}>
            <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 19, color: '#fff' }}>S</span>
          </div>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>
            Shop<span className="gradient-text">Nova</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', width: 340, marginLeft: 'auto' }} className="search-form">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1, padding: '11px 16px',
              border: '1px solid var(--border)',
              borderRight: 'none',
              borderRadius: '12px 0 0 12px',
              fontSize: 14, background: 'var(--surface)',
              color: 'var(--text)',
            }}
          />
          <button type="submit" style={{
            padding: '11px 18px',
            background: 'var(--aurora)',
            borderRadius: '0 12px 12px 0',
            color: '#fff', border: 'none',
          }}>
            <Search size={18} />
          </button>
        </form>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }} className="nav-actions">
          <button onClick={toggleTheme} aria-label="Toggle theme" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', transition: 'var(--transition)' }}>
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isAdmin && (
                <Link to="/admin" style={{ padding: '9px 16px', borderRadius: 10, background: 'var(--aurora)', color: '#fff', fontSize: 13, fontWeight: 700, boxShadow: 'var(--glow-pink)' }}>
                  Admin
                </Link>
              )}
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 13, color: 'var(--text2)' }}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              <User size={16} /> Login
            </Link>
          )}

          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 999, background: 'var(--aurora)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-pink)' }}>
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="mobile-toggle" style={{ display: 'none', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          <button onClick={toggleTheme} aria-label="Toggle theme" style={{ color: 'var(--text)', padding: 8 }}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setOpen(!open)} style={{ color: 'var(--text)', padding: 8 }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Category nav row (desktop) */}
      <div className="cat-bar" style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 46, display: 'flex', alignItems: 'center', gap: 4 }}>
          <NavLink to="/products" end style={({ isActive }) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, color: isActive ? 'var(--accent)' : 'var(--text2)', background: isActive ? 'var(--accent-light)' : 'transparent', transition: 'var(--transition)' })}>
            <Sparkles size={14} /> All
          </NavLink>
          {navCategories.map(c => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="cat-link" style={{ padding: '6px 14px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, color: 'var(--text2)', transition: 'var(--transition)' }}>
              {c}
            </Link>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} /> Free COD across Pakistan
          </span>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'var(--nav-solid)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderTop: '1px solid var(--border)', padding: '16px 24px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', marginBottom: 16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ flex: 1, padding: '11px 16px', border: '1px solid var(--border)', borderRight: 'none', borderRadius: '12px 0 0 12px', fontSize: 14, background: 'var(--surface)', color: 'var(--text)' }} />
            <button type="submit" style={{ padding: '11px 16px', background: 'var(--aurora)', borderRadius: '0 12px 12px 0', color: '#fff', border: 'none' }}><Search size={18} /></button>
          </form>
          {[['/', 'Home'], ['/products', 'Products'], ['/cart', `Cart (${totalItems})`]].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--text)' }}>{label}</Link>
          ))}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            {navCategories.map(c => (
              <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} onClick={() => setOpen(false)} style={{ padding: '7px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--text2)', background: 'var(--surface)', border: '1px solid var(--border)' }}>{c}</Link>
            ))}
          </div>
          {!user && <Link to="/login" onClick={() => setOpen(false)} style={{ display: 'block', marginTop: 14, padding: '12px', textAlign: 'center', background: 'var(--aurora)', borderRadius: 12, color: '#fff', fontWeight: 700 }}>Login</Link>}
        </div>
      )}

      <style>{`
        .nav-actions { display: flex !important; }
        .search-form { display: flex !important; }
        .mobile-toggle { display: none !important; }
        .cat-bar { display: block; }
        .cat-link:hover { color: var(--accent) !important; background: var(--accent-light) !important; }
        @media (max-width: 768px) {
          .nav-actions { display: none !important; }
          .search-form { display: none !important; }
          .mobile-toggle { display: flex !important; }
          .cat-bar { display: none !important; }
        }
      `}</style>
    </header>
  )
}