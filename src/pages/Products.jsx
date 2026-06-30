import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { filterDummy } from '../data/products'

const API = 'https://shopnova-server.vercel.app'

const categories = ['All', 'Electronics', 'Clothing', 'Home & Living', 'Beauty', 'Sports', 'Books']

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState('newest')
  const [showFilter, setShowFilter] = useState(false)

  const category = searchParams.get('category') || 'All'
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    let url = `${API}/api/products?`
    if (category && category !== 'All') url += `category=${category}&`
    if (search) url += `search=${search}&`
    if (sort === 'price_low') url += 'sort=price_low'
    if (sort === 'price_high') url += 'sort=price_high'
    if (sort === 'popular') url += 'sort=popular'

    axios.get(url)
      .then(r => {
        const list = Array.isArray(r.data) ? r.data : []
        setProducts(list.length ? list : filterDummy({ category, search, sort }))
      })
      .catch(() => setProducts(filterDummy({ category, search, sort })))
      .finally(() => setLoading(false))
  }, [category, search, sort])

  return (
    <main style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: 'var(--text)' }}>
              {search ? <>Search: <span className="gradient-text">"{search}"</span></> : category === 'All' ? 'All Products' : <span className="gradient-text">{category}</span>}
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>{products.length} products found</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select value={sort} onChange={e => setSort(e.target.value)} className="glass" style={{ padding: '11px 16px', borderRadius: 12, fontSize: 14, color: 'var(--text)', cursor: 'pointer' }}>
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
          {/* Sidebar */}
          <div>
            <div className="glass" style={{ padding: 24, borderRadius: 18, position: 'sticky', top: 96 }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Categories</h3>
              {categories.map(c => {
                const active = category === c || (c === 'All' && !searchParams.get('category'))
                return (
                <button key={c} onClick={() => setSearchParams(c === 'All' ? {} : { category: c })} style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', borderRadius: 10, marginBottom: 4,
                  background: active ? 'var(--accent-light)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text2)',
                  border: active ? '1px solid rgba(255,122,26,0.3)' : '1px solid transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: 14, cursor: 'pointer',
                  transition: 'var(--transition)',
                }}>{c}</button>
              )})}
            </div>
          </div>

          {/* Products */}
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No products found</h3>
                <p style={{ color: 'var(--text2)' }}>Try a different category or search term</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
                {products.map((p, i) => <Reveal key={p._id} delay={(i % 4) * 70}><ProductCard product={p} /></Reveal>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}