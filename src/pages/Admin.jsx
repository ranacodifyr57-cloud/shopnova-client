import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, Plus, Trash2, Pencil, LogOut, Eye, X, Home, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = 'https://shopnova-server.vercel.app'

const emptyProduct = { name: '', description: '', price: '', oldPrice: '', category: '', stock: '', images: '', featured: false }

export default function Admin() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newProduct, setNewProduct] = useState(emptyProduct)
  const { token, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token || !isAdmin) { navigate('/login'); return }
    Promise.all([
      axios.get(`${API}/api/orders`, { headers }),
      axios.get(`${API}/api/products`),
    ]).then(([o, p]) => {
      setOrders(Array.isArray(o.data) ? o.data : [])
      setProducts(Array.isArray(p.data) ? p.data : [])
    }).catch(() => navigate('/login'))
    .finally(() => setLoading(false))
  }, [])

  const deleteProduct = async id => {
    if (!confirm('Delete this product?')) return
    await axios.delete(`${API}/api/products/${id}`, { headers })
    setProducts(products.filter(p => p._id !== id))
  }

  const updateOrderStatus = async (id, status) => {
    await axios.put(`${API}/api/orders/${id}/status`, { status }, { headers })
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o))
  }

  // Open the modal in ADD mode
  const openAdd = () => {
    setEditingId(null)
    setNewProduct(emptyProduct)
    setShowProductModal(true)
  }

  // Open the modal in EDIT mode, pre-filled with the product's current values
  const openEdit = p => {
    setEditingId(p._id)
    setNewProduct({
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      oldPrice: p.oldPrice ?? '',
      category: p.category || '',
      stock: p.stock ?? '',
      images: p.images?.[0] || '',
      featured: p.featured || false,
    })
    setShowProductModal(true)
  }

  const closeModal = () => {
    setShowProductModal(false)
    setEditingId(null)
    setNewProduct(emptyProduct)
  }

  // Handles BOTH adding (POST) and editing (PUT)
  const saveProduct = async e => {
    e.preventDefault()
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        stock: Number(newProduct.stock),
        images: newProduct.images ? [newProduct.images] : [],
      }
      if (editingId) {
        const { data } = await axios.put(`${API}/api/products/${editingId}`, productData, { headers })
        setProducts(products.map(p => p._id === editingId ? data : p))
      } else {
        const { data } = await axios.post(`${API}/api/products`, productData, { headers })
        setProducts([data, ...products])
      }
      closeModal()
    } catch (err) {
      alert('Error saving product: ' + err.message)
    }
  }

  const statusColors = { pending: '#fbbf24', processing: '#60a5fa', shipped: '#c084fc', delivered: '#34d399', cancelled: '#f87171' }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  const inputStyle = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 14, background: 'var(--surface)', color: 'var(--text)' }

  // Derived metrics
  const validOrders = orders.filter(o => o.status !== 'cancelled')
  const revenue = validOrders.reduce((s, o) => s + o.totalAmount, 0)
  const avgOrder = validOrders.length ? Math.round(revenue / validOrders.length) : 0
  const pending = orders.filter(o => o.status === 'pending').length
  const delivered = orders.filter(o => o.status === 'delivered').length
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning 👋' : hour < 18 ? 'Good afternoon 👋' : 'Good evening 👋'

  const smallStats = [
    { icon: <ShoppingBag size={20} />, label: 'Total Orders', value: orders.length, color: '#ff7a1a' },
    { icon: <Package size={20} />, label: 'Products', value: products.length, color: '#60a5fa' },
    { icon: <Clock size={20} />, label: 'Pending', value: pending, color: '#fbbf24' },
    { icon: <CheckCircle size={20} />, label: 'Delivered', value: delivered, color: '#34d399' },
  ]

  const navItems = [['orders', 'Orders', <ShoppingBag size={18} />, orders.length], ['products', 'Products', <Package size={18} />, products.length]]

  return (
    <main style={{ minHeight: '100vh' }}>
      <div className="admin-shell" style={{ display: 'grid', gridTemplateColumns: '256px 1fr', alignItems: 'start' }}>
        {/* Sidebar */}
        <aside className="admin-side" style={{ position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', display: 'flex', flexDirection: 'column', padding: '26px 16px', borderRight: '1px solid var(--border)', background: 'var(--nav-bg)', backdropFilter: 'blur(16px) saturate(150%)', WebkitBackdropFilter: 'blur(16px) saturate(150%)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 8px 22px' }}>
            <div style={{ width: 40, height: 40, background: 'var(--aurora)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow)', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 20, color: '#fff' }}>S</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: 16, lineHeight: 1 }}>Shop<span className="gradient-text">Nova</span></div>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>Admin Console</div>
            </div>
          </Link>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navItems.map(([key, label, icon, count]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 12, textAlign: 'left', width: '100%',
                border: '1px solid ' + (tab === key ? 'rgba(255,122,26,0.4)' : 'transparent'),
                background: tab === key ? 'var(--accent-light)' : 'transparent',
                color: tab === key ? 'var(--accent)' : 'var(--text2)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'var(--transition)',
              }}>
                <span style={{ display: 'flex' }}>{icon}</span>{label}
                <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, padding: '1px 8px', borderRadius: 999, background: tab === key ? 'rgba(255,122,26,0.18)' : 'var(--surface-2)' }}>{count}</span>
              </button>
            ))}
          </nav>

          <div className="admin-side-foot" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 16 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, color: 'var(--text2)', fontWeight: 600, fontSize: 14 }}>
              <Home size={18} /> View Store
            </Link>
            <button onClick={() => { logout(); navigate('/') }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, color: '#f87171', fontWeight: 600, fontSize: 14, cursor: 'pointer', background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <section style={{ padding: '34px 40px', minWidth: 0 }}>
          {/* Greeting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 26 }}>
            <div>
              <p style={{ color: 'var(--text2)', fontSize: 13, fontWeight: 600 }}>{greeting}</p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,32px)', fontWeight: 700 }}>{tab === 'orders' ? 'Orders' : 'Products'} <span className="gradient-text">overview</span></h1>
            </div>
            {tab === 'products' && (
              <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 22px', borderRadius: 12, background: 'var(--aurora)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: 'var(--glow)' }}>
                <Plus size={16} /> Add Product
              </button>
            )}
          </div>

          {/* Bento stats */}
          <div className="admin-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
            <div className="admin-hero" style={{ gridColumn: 'span 2', gridRow: 'span 2', position: 'relative', overflow: 'hidden', borderRadius: 22, padding: 28, background: 'var(--aurora)', boxShadow: 'var(--glow-pink)', minHeight: 196, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(70% 90% at 100% 0%, rgba(255,255,255,0.28), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.22)', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', animation: 'pulse 2s infinite' }} /> Live revenue
                </span>
                <TrendingUp size={22} color="#fff" />
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,46px)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>Rs. {revenue.toLocaleString()}</div>
                <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 14, marginTop: 10 }}>From {validOrders.length} valid orders · avg Rs. {avgOrder.toLocaleString()}</p>
              </div>
            </div>
            {smallStats.map((s, i) => (
              <div key={i} className="glass" style={{ borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: 'var(--shadow)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: `${s.color}26`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: 'var(--text2)', fontSize: 12.5, marginTop: 4 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="glass" style={{ textAlign: 'center', padding: '60px', borderRadius: 20 }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
                <p style={{ color: 'var(--text2)' }}>No orders yet</p>
              </div>
            ) : orders.map(o => (
              <div key={o._id} className="glass" style={{ padding: 20, borderRadius: 18, marginBottom: 12, boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>#{o._id?.slice(-8).toUpperCase()}</span>
                      <span style={{ padding: '3px 12px', borderRadius: 100, background: `${statusColors[o.status]}26`, border: `1px solid ${statusColors[o.status]}55`, color: statusColors[o.status], fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{o.status}</span>
                    </div>
                    <p style={{ color: 'var(--text2)', fontSize: 13 }}>{o.customerInfo?.name} • {o.customerInfo?.phone} • {o.customerInfo?.city}</p>
                    <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 2 }}>{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="gradient-text" style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800 }}>Rs. {o.totalAmount?.toLocaleString()}</span>
                    <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} style={{ padding: '7px 10px', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, background: 'var(--surface-solid)', color: 'var(--text)', cursor: 'pointer' }}>
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                {/* Order items */}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {o.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', borderRadius: 8, background: 'var(--surface-2)', fontSize: 13 }}>
                      <span>{item.name}</span>
                      <span style={{ color: 'var(--text2)' }}>x{item.quantity}</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent)' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            {/* Add / Edit Product Modal */}
            {showProductModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ background: 'var(--surface-solid)', border: '1px solid var(--border-2)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={closeModal} style={{ padding: 8, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}><X size={18} /></button>
                  </div>
                  <form onSubmit={saveProduct}>
                    {[
                      { name: 'name', label: 'Product Name *', placeholder: 'Samsung Galaxy S24' },
                      { name: 'description', label: 'Description *', placeholder: 'Product description...' },
                      { name: 'price', label: 'Price (Rs.) *', placeholder: '25000', type: 'number' },
                      { name: 'oldPrice', label: 'Old Price (Rs.) - Optional', placeholder: '30000', type: 'number' },
                      { name: 'stock', label: 'Stock *', placeholder: '50', type: 'number' },
                      { name: 'images', label: 'Image URL', placeholder: 'https://example.com/image.jpg' },
                    ].map(f => (
                      <div key={f.name} style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.label}</label>
                        {f.name === 'description' ? (
                          <textarea name={f.name} value={newProduct[f.name]} onChange={e => setNewProduct({ ...newProduct, [f.name]: e.target.value })} required={f.name !== 'oldPrice' && f.name !== 'images'} placeholder={f.placeholder} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                        ) : (
                          <input name={f.name} type={f.type || 'text'} value={newProduct[f.name]} onChange={e => setNewProduct({ ...newProduct, [f.name]: e.target.value })} required={f.name !== 'oldPrice' && f.name !== 'images'} placeholder={f.placeholder} style={inputStyle} />
                        )}
                      </div>
                    ))}
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Category *</label>
                      <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} required style={inputStyle}>
                        <option value="">Select category</option>
                        {['Electronics', 'Clothing', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" id="featured" checked={newProduct.featured} onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })} style={{ width: 16, height: 16 }} />
                      <label htmlFor="featured" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Mark as Featured Product</label>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'var(--aurora)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: 'var(--glow)' }}>
                      {editingId ? 'Save Changes' : 'Add Product'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {products.length === 0 ? (
              <div className="glass" style={{ textAlign: 'center', padding: '60px', borderRadius: 20 }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
                <p style={{ color: 'var(--text2)' }}>No products yet. Add your first product!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {products.map(p => (
                  <div key={p._id} className="glass" style={{ borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                    <div style={{ height: 140, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40 }}>📦</span>}
                    </div>
                    <div style={{ padding: 16 }}>
                      <p style={{ color: 'var(--text2)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.category}</p>
                      <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{p.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="gradient-text" style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 800 }}>Rs. {p.price?.toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 6, background: 'var(--surface-2)', fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Stock: {p.stock}</span>
                          <button onClick={() => openEdit(p)} style={{ padding: '5px 9px', borderRadius: 8, background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)', cursor: 'pointer' }} title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => deleteProduct(p._id)} style={{ padding: '5px 9px', borderRadius: 8, background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)', cursor: 'pointer' }} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </section>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .admin-shell { grid-template-columns: 1fr !important; }
          .admin-side { position: static !important; height: auto !important; flex-direction: row !important; align-items: center; flex-wrap: wrap; gap: 10px; border-right: none !important; border-bottom: 1px solid var(--border); }
          .admin-side nav { flex-direction: row !important; flex-wrap: wrap; }
          .admin-side-foot { margin-top: 0 !important; margin-left: auto; flex-direction: row !important; padding-top: 0 !important; }
        }
        @media (max-width: 620px) {
          .admin-bento { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-hero { grid-column: span 2 !important; grid-row: auto !important; }
        }
      `}</style>
    </main>
  )
}