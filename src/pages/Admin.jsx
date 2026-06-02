import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, Users, Plus, Trash2, LogOut, Eye, X } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = 'https://shopnova-server.vercel.app'

export default function Admin() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', oldPrice: '', category: '', stock: '', images: '', featured: false })
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
    await axios.delete(`${API}/api/products/${id}`, { headers })
    setProducts(products.filter(p => p._id !== id))
  }

  const updateOrderStatus = async (id, status) => {
    await axios.put(`${API}/api/orders/${id}/status`, { status }, { headers })
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o))
  }

  const addProduct = async e => {
    e.preventDefault()
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        stock: Number(newProduct.stock),
        images: newProduct.images ? [newProduct.images] : [],
      }
      const { data } = await axios.post(`${API}/api/products`, productData, { headers })
      setProducts([data, ...products])
      setShowAddProduct(false)
      setNewProduct({ name: '', description: '', price: '', oldPrice: '', category: '', stock: '', images: '', featured: false })
    } catch (err) {
      alert('Error adding product: ' + err.message)
    }
  }

  const statusColors = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, background: '#fff' }

  return (
    <main style={{ padding: '40px 24px', minHeight: '80vh', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>ShopNova Management</p>
          </div>
          <button onClick={() => { logout(); navigate('/') }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: '1px solid var(--border)', background: '#fff', fontSize: 14, color: 'var(--text2)', cursor: 'pointer' }}>
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: <ShoppingBag size={22} />, label: 'Total Orders', value: orders.length, color: '#f97316' },
            { icon: <Package size={22} />, label: 'Total Products', value: products.length, color: '#1a56db' },
            { icon: <Users size={22} />, label: 'Pending Orders', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
            { icon: <ShoppingBag size={22} />, label: 'Total Revenue', value: `Rs. ${orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}`, color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{ padding: 24, borderRadius: 16, border: '1px solid var(--border)', background: '#fff', display: 'flex', gap: 16, alignItems: 'center', boxShadow: 'var(--shadow)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[['orders', 'Orders', <ShoppingBag size={15} />], ['products', 'Products', <Package size={15} />]].map(([key, label, icon]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10,
              border: `1px solid ${tab === key ? 'var(--accent)' : 'var(--border)'}`,
              background: tab === key ? 'var(--accent-light)' : '#fff',
              color: tab === key ? 'var(--accent)' : 'var(--text2)',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>{icon}{label}</button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 20, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
                <p style={{ color: 'var(--text2)' }}>No orders yet</p>
              </div>
            ) : orders.map(o => (
              <div key={o._id} style={{ padding: 20, borderRadius: 16, border: '1px solid var(--border)', background: '#fff', marginBottom: 12, boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>#{o._id?.slice(-8).toUpperCase()}</span>
                      <span style={{ padding: '2px 10px', borderRadius: 100, background: `${statusColors[o.status]}20`, color: statusColors[o.status], fontSize: 12, fontWeight: 700, textTransform: 'capitalize' }}>{o.status}</span>
                    </div>
                    <p style={{ color: 'var(--text2)', fontSize: 13 }}>{o.customerInfo?.name} • {o.customerInfo?.phone} • {o.customerInfo?.city}</p>
                    <p style={{ color: 'var(--text2)', fontSize: 12, marginTop: 2 }}>{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800, color: 'var(--accent)' }}>Rs. {o.totalAmount?.toLocaleString()}</span>
                    <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: '#fff', cursor: 'pointer' }}>
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                {/* Order items */}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {o.items?.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', borderRadius: 8, background: 'var(--bg2)', fontSize: 13 }}>
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <button onClick={() => setShowAddProduct(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800 }}>Add New Product</h2>
                    <button onClick={() => setShowAddProduct(false)} style={{ padding: 8, borderRadius: 8, background: 'var(--bg2)', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                  </div>
                  <form onSubmit={addProduct}>
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
                    <button type="submit" style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                      Add Product
                    </button>
                  </form>
                </div>
              </div>
            )}

            {products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: 20, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
                <p style={{ color: 'var(--text2)' }}>No products yet. Add your first product!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {products.map(p => (
                  <div key={p._id} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: '#fff', boxShadow: 'var(--shadow)' }}>
                    <div style={{ height: 140, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 40 }}>📦</span>}
                    </div>
                    <div style={{ padding: 16 }}>
                      <p style={{ color: 'var(--text2)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>{p.category}</p>
                      <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{p.name}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>Rs. {p.price?.toLocaleString()}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ padding: '3px 8px', borderRadius: 6, background: 'var(--bg2)', fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Stock: {p.stock}</span>
                          <button onClick={() => deleteProduct(p._id)} style={{ padding: '4px 8px', borderRadius: 6, background: '#fef2f2', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
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
      </div>
    </main>
  )
}