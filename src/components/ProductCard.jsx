import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="glass" style={{
      borderRadius: 18, overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      transition: 'var(--transition)',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--glow)'; e.currentTarget.style.borderColor = 'rgba(255,122,26,0.4)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {/* Image */}
      <Link to={`/products/${product._id}`}>
        <div style={{ height: 200, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ fontSize: 48 }}>📦</div>
          )}
          {product.oldPrice && (
            <div style={{ position: 'absolute', top: 10, left: 10, padding: '4px 9px', borderRadius: 8, background: 'var(--aurora)', color: '#fff', fontSize: 11, fontWeight: 700, boxShadow: 'var(--glow-pink)' }}>
              {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
            </div>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <p style={{ color: 'var(--text2)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{product.category}</p>
        <Link to={`/products/${product._id}`}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{product.rating || '4.5'}</span>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>({product.reviews || 0})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="gradient-text" style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800 }}>Rs. {product.price?.toLocaleString()}</span>
            {product.oldPrice && <span style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'line-through', marginLeft: 6 }}>Rs. {product.oldPrice?.toLocaleString()}</span>}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: product.stock === 0 ? 'var(--surface-2)' : 'var(--aurora)',
              color: product.stock === 0 ? 'var(--text2)' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              boxShadow: product.stock === 0 ? 'none' : 'var(--glow)',
              transition: 'var(--transition)',
            }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}