import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, Plus, Minus, Ruler, X } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { findDummy } from '../data/products'

const API = 'https://shopnova-server.vercel.app'

// --- Sizing config (applied to every product) ---
const APPAREL = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const FOOTWEAR = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']

const APPAREL_CHART = {
  head: ['Size', 'Chest (in)', 'Waist (in)', 'Length (in)'],
  rows: [
    ['XS', '34', '28', '26'],
    ['S', '36', '30', '27'],
    ['M', '38', '32', '28'],
    ['L', '40', '34', '29'],
    ['XL', '42', '36', '30'],
    ['XXL', '44', '38', '31'],
  ],
}
const FOOTWEAR_CHART = {
  head: ['UK', 'EU', 'US', 'Foot (cm)'],
  rows: [
    ['UK 6', '39', '7', '24.5'],
    ['UK 7', '40', '8', '25.5'],
    ['UK 8', '42', '9', '26.5'],
    ['UK 9', '43', '10', '27.5'],
    ['UK 10', '44', '11', '28.5'],
    ['UK 11', '45', '12', '29.5'],
  ],
}

// Pick the right sizing for a product based on its name/category
function getSizing(product) {
  const name = (product?.name || '').toLowerCase()
  const cat = product?.category || ''
  if (/shoe|sneaker|boot|runner|trainer|footwear|sandal|heel/.test(name)) {
    return { type: 'footwear', sizes: FOOTWEAR, def: 'UK 9', chart: FOOTWEAR_CHART }
  }
  if (cat === 'Clothing' || cat === 'Sports' || /shirt|tee|t-shirt|jacket|hoodie|dress|pant|jean|trouser|sweater|coat|kurta|top|denim/.test(name)) {
    return { type: 'apparel', sizes: APPAREL, def: 'M', chart: APPAREL_CHART }
  }
  return { type: 'generic', sizes: ['One Size'], def: 'One Size', chart: null }
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    axios.get(`${API}/api/products/${id}`)
      .then(r => setProduct(r.data || findDummy(id)))
      .catch(() => setProduct(findDummy(id)))
      .finally(() => setLoading(false))
  }, [id])

  // Default the size selection once the product loads
  useEffect(() => {
    if (product) setSelectedSize(getSizing(product).def)
  }, [product])

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize }, quantity)
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

  const sizing = getSizing(product)

  return (
    <main style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--text2)', fontSize: 14, marginBottom: 32, fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* Image */}
          <div className="glass" style={{ borderRadius: 24, overflow: 'hidden', background: 'var(--bg2)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow)' }}>
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 80 }}>📦</div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="gradient-text" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'inline-block' }}>{product.category}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 16, lineHeight: 1.2 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= (product.rating || 4) ? '#fbbf24' : 'rgba(255,255,255,0.14)'} color={i <= (product.rating || 4) ? '#fbbf24' : 'rgba(255,255,255,0.14)'} />)}
              <span style={{ fontSize: 14, color: 'var(--text2)' }}>({product.reviews || 0} reviews)</span>
            </div>

            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <span className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700 }}>Rs. {product.price?.toLocaleString()}</span>
              {product.oldPrice && (
                <>
                  <span style={{ fontSize: 18, color: 'var(--text2)', textDecoration: 'line-through' }}>Rs. {product.oldPrice?.toLocaleString()}</span>
                  <span style={{ padding: '4px 9px', borderRadius: 8, background: 'var(--aurora)', color: '#fff', fontSize: 12, fontWeight: 700, boxShadow: 'var(--glow-pink)' }}>
                    {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>

            {/* Size selector */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {sizing.type === 'footwear' ? 'Select Size' : sizing.type === 'apparel' ? 'Select Size' : 'Size'}
                  {selectedSize && <span style={{ color: 'var(--accent)', fontWeight: 700 }}> · {selectedSize}</span>}
                </span>
                <button onClick={() => setShowSizeGuide(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <Ruler size={15} /> Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {sizing.sizes.map(s => {
                  const active = selectedSize === s
                  return (
                    <button key={s} onClick={() => setSelectedSize(s)} style={{
                      minWidth: 52, padding: '10px 16px', borderRadius: 12,
                      fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      color: active ? '#fff' : 'var(--text)',
                      background: active ? 'var(--aurora)' : 'var(--surface)',
                      border: '1px solid ' + (active ? 'transparent' : 'var(--border)'),
                      boxShadow: active ? 'var(--glow)' : 'none',
                      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                      transition: 'var(--transition)',
                    }}>{s}</button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Quantity:</span>
              <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
                  <Minus size={16} />
                </button>
                <span style={{ width: 48, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
                  <Plus size={16} />
                </button>
              </div>
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>{product.stock} in stock</span>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart} disabled={product.stock === 0} style={{
              width: '100%', padding: '16px',
              borderRadius: 14, border: 'none',
              background: added ? 'linear-gradient(120deg,#16a34a,#22c55e)' : product.stock === 0 ? 'var(--surface-2)' : 'var(--aurora)',
              color: product.stock === 0 ? 'var(--text2)' : '#fff',
              fontWeight: 700, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              boxShadow: product.stock === 0 ? 'none' : 'var(--glow)',
              transition: 'var(--transition)',
              marginBottom: 16,
            }}>
              <ShoppingCart size={20} />
              {added ? '✅ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link to="/cart" style={{
              display: 'block', textAlign: 'center', padding: '14px',
              borderRadius: 14, border: '1px solid rgba(255,122,26,0.45)',
              background: 'var(--accent-light)',
              color: 'var(--accent)', fontWeight: 700, fontSize: 15,
            }}>View Cart & Checkout</Link>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
              {[
                { icon: <Truck size={16} />, text: 'Free delivery above Rs. 2000' },
                { icon: <Shield size={16} />, text: '7 days easy return' },
              ].map((f, i) => (
                <div key={i} className="glass" style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, borderRadius: 12, fontSize: 12, color: 'var(--text2)' }}>
                  <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide modal */}
      {showSizeGuide && (
        <div onClick={() => setShowSizeGuide(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--surface-solid)', border: '1px solid var(--border-2)', borderRadius: 24, padding: 28, width: '100%', maxWidth: 460, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Ruler size={20} /> Size <span className="gradient-text">Guide</span></h2>
              <button onClick={() => setShowSizeGuide(false)} aria-label="Close" style={{ padding: 8, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>
              {sizing.type === 'footwear'
                ? 'Measure your foot from heel to longest toe, then match the length below. If between sizes, pick the larger.'
                : sizing.type === 'apparel'
                ? 'Measurements are body measurements in inches. For a relaxed fit, size up.'
                : 'This product comes in a standard one-size fit. See the description for exact dimensions.'}
            </p>

            {sizing.chart ? (
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)' }}>
                      {sizing.chart.head.map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizing.chart.rows.map((row, ri) => {
                      const isActive = row[0] === selectedSize
                      return (
                        <tr key={ri} style={{ background: isActive ? 'var(--accent-light)' : 'transparent' }}>
                          {row.map((cell, ci) => (
                            <td key={ci} style={{ padding: '11px 14px', borderBottom: ri < sizing.chart.rows.length - 1 ? '1px solid var(--border)' : 'none', color: ci === 0 ? (isActive ? 'var(--accent)' : 'var(--text)') : 'var(--text2)', fontWeight: ci === 0 ? 700 : 500 }}>{cell}</td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="glass" style={{ padding: 20, borderRadius: 14, textAlign: 'center', color: 'var(--text2)', fontSize: 14 }}>
                📦 One size fits all — no sizing needed for this item.
              </div>
            )}

            <button onClick={() => setShowSizeGuide(false)} style={{ width: '100%', marginTop: 22, padding: '13px', borderRadius: 14, border: 'none', background: 'var(--aurora)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--glow)' }}>Got it</button>
          </div>
        </div>
      )}

      <style>{`@media(max-width:768px){main>div>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </main>
  )
}