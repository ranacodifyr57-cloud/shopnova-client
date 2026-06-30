import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart()

  if (cart.length === 0) return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: '40px 24px' }}>
      <ShoppingBag size={80} color="var(--accent)" strokeWidth={1} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>Your cart is empty</h2>
      <p style={{ color: 'var(--text2)', fontSize: 16 }}>Add some products to get started!</p>
      <Link to="/products" style={{ padding: '14px 28px', borderRadius: 14, background: 'var(--aurora)', color: '#fff', fontWeight: 700, fontSize: 15, boxShadow: 'var(--glow)' }}>
        Browse Products
      </Link>
    </main>
  )

  return (
    <main style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, marginBottom: 32 }}>
          Shopping Cart <span className="gradient-text">({totalItems} items)</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
          {/* Cart items */}
          <div>
            {cart.map(item => (
              <div key={item._id} className="glass" style={{
                display: 'flex', gap: 16, padding: 20,
                borderRadius: 18, marginBottom: 16,
                boxShadow: 'var(--shadow)',
              }}>
                <div style={{ width: 90, height: 90, borderRadius: 12, overflow: 'hidden', background: 'var(--bg2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>📦</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text2)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{item.category}</p>
                  <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>{item.name}</h3>
                  {item.selectedSize && item.selectedSize !== 'One Size' && (
                    <span style={{ display: 'inline-block', marginBottom: 8, padding: '3px 10px', borderRadius: 999, background: 'var(--accent-light)', border: '1px solid rgba(255,122,26,0.3)', color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>Size: {item.selectedSize}</span>
                  )}
                  <p className="gradient-text" style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800 }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                  <button onClick={() => removeFromCart(item._id)} style={{ color: '#f87171', padding: 7, borderRadius: 10, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                  <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 0, borderRadius: 10, overflow: 'hidden' }}>
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
                      <Minus size={14} />
                    </button>
                    <span style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass" style={{ padding: 28, borderRadius: 22, boxShadow: 'var(--shadow)', position: 'sticky', top: 96 }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, marginBottom: 24 }}>Order Summary</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: 'var(--text2)' }}>
              <span>Subtotal ({totalItems} items)</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: 'var(--text2)' }}>
              <span>Delivery</span>
              <span style={{ color: totalPrice >= 2000 ? '#34d399' : 'var(--text)', fontWeight: 600 }}>
                {totalPrice >= 2000 ? 'FREE' : 'Rs. 150'}
              </span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800 }}>
                <span>Total</span>
                <span className="gradient-text">Rs. {(totalPrice + (totalPrice >= 2000 ? 0 : 150)).toLocaleString()}</span>
              </div>
            </div>
            {totalPrice < 2000 && (
              <div style={{ padding: 12, borderRadius: 12, background: 'var(--accent-light)', border: '1px solid rgba(255,122,26,0.25)', marginBottom: 16, fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>
                🚚 Add Rs. {(2000 - totalPrice).toLocaleString()} more for free delivery!
              </div>
            )}
            <Link to="/checkout" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '15px', borderRadius: 14,
              background: 'var(--aurora)', color: '#fff',
              fontWeight: 700, fontSize: 16, boxShadow: 'var(--glow)',
            }}>
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--text2)', fontSize: 14, fontWeight: 500 }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){main>div>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </main>
  )
}