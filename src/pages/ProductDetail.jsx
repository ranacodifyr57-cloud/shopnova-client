import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, Plus, Minus } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const API = 'https://shopnova-server.vercel.app'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get(`${API}/api/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 48 }}>😕</p>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>Product not found</h2>
      <Link to="/products" style={{ color: 'var(--accent)', fontWeight: 600 }}>← Back to Products</Link>
    </div>
  )

  return (
    <main style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text2)', fontSize: 14, marginBottom: 32, fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Image */}
          <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg2)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 80 }}>📦</div>
            )}
          </div>

          {/* Details */}
          <div>
            <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{product.category}</p>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= (product.rating || 4) ? '#f59e0b' : '#e2e8f0'} color={i <= (product.rating || 4) ? '#f59e0b' : '#e2e8f0'} />)}
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>({product.reviews || 0} reviews)</span>
            </div>

            <div style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800, color: 'var(--accent)' }}>Rs. {product.price?.toLocaleString()}</span>
              {product.oldPrice && (
                <>
                  <span style={{ fontSize: 18, color: 'var(--text2)', textDecoration: 'line-through', marginLeft: 12 }}>Rs. {product.oldPrice?.toLocaleString()}</span>
                  <span style={{ marginLeft: 8, padding: '3px 8px', borderRadius: 6, background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                    {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', border: 'none', cursor: 'pointer' }}>
                  <Minus size={16} />
                </button>
                <span style={{ width: 48, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', border: 'none', cursor: 'pointer' }}>
                  <Plus size={16} />
                </button>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{product.stock} in stock</span>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart} disabled={product.stock === 0} style={{
              width: '100%', padding: '16px',
              borderRadius: 14, border: 'none',
              background: added ? '#16a34a' : product.stock === 0 ? 'var(--bg3)' : 'var(--accent)',
              color: product.stock === 0 ? 'var(--text2)' : '#fff',
              fontWeight: 700, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'var(--transition)',
              marginBottom: 16,
            }}>
              <ShoppingCart size={20} />
              {added ? '✅ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link to="/cart" style={{
              display: 'block', textAlign: 'center', padding: '14px',
              borderRadius: 14, border: '2px solid var(--accent)',
              color: 'var(--accent)', fontWeight: 700, fontSize: 15,
            }}>View Cart & Checkout</Link>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
              {[
                { icon: <Truck size={16} />, text: 'Free delivery above Rs. 2000' },
                { icon: <Shield size={16} />, text: '7 days easy return' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, borderRadius: 10, background: 'var(--bg2)', fontSize: 12, color: 'var(--text2)' }}>
                  <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){main>div>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </main>
  )
}