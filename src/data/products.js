// Local demo catalog. Used as a graceful fallback whenever the API
// returns nothing (or is unreachable) so the storefront always looks
// populated and product detail / cart keep working end-to-end.

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`

export const dummyProducts = [
  {
    _id: 'demo-1', name: 'Aurora Wireless Headphones', category: 'Electronics',
    price: 8999, oldPrice: 12999, stock: 24, rating: 4.8, reviews: 312, featured: true,
    description: 'Immersive over-ear headphones with adaptive noise cancellation, 40-hour battery life and spatial audio. Engineered for all-day comfort.',
    images: [img('1505740420928-5e560c06d30e')],
  },
  {
    _id: 'demo-2', name: 'Nebula Smart Watch Pro', category: 'Electronics',
    price: 15499, oldPrice: 19999, stock: 18, rating: 4.7, reviews: 208, featured: true,
    description: 'AMOLED always-on display, health & sleep tracking, GPS and 7-day battery. Your wrist, upgraded.',
    images: [img('1523275335684-37898b6baf30')],
  },
  {
    _id: 'demo-3', name: 'Midnight Running Sneakers', category: 'Sports',
    price: 6499, oldPrice: 8999, stock: 40, rating: 4.6, reviews: 154, featured: true,
    description: 'Featherlight knit upper with responsive foam cushioning for effortless miles. Breathable, durable, ready to fly.',
    images: [img('1542291026-7eec264c27ff')],
  },
  {
    _id: 'demo-4', name: 'Classic Denim Jacket', category: 'Clothing',
    price: 4299, oldPrice: 5999, stock: 33, rating: 4.5, reviews: 98, featured: true,
    description: 'Timeless washed denim jacket with a relaxed fit. The layering staple that goes with absolutely everything.',
    images: [img('1551028719-00167b16eac5')],
  },
  {
    _id: 'demo-5', name: 'Glow Serum Skincare Set', category: 'Beauty',
    price: 3599, oldPrice: 4999, stock: 52, rating: 4.9, reviews: 421, featured: true,
    description: 'Vitamin-C brightening serum, hydrating moisturizer and SPF in one ritual. Visibly radiant skin in two weeks.',
    images: [img('1556228720-195a672e8a03')],
  },
  {
    _id: 'demo-6', name: 'Minimalist Ceramic Lamp', category: 'Home & Living',
    price: 5299, oldPrice: 6999, stock: 21, rating: 4.4, reviews: 67, featured: true,
    description: 'Warm dimmable LED table lamp with a hand-finished ceramic base. Soft light for cozy evenings.',
    images: [img('1507473885765-e6ed057f782c')],
  },
  {
    _id: 'demo-7', name: 'Pro Mechanical Keyboard', category: 'Electronics',
    price: 7299, oldPrice: 9499, stock: 29, rating: 4.8, reviews: 276, featured: true,
    description: 'Hot-swappable switches, per-key RGB and an aluminium frame. Tactile, satisfying, built to last.',
    images: [img('1587829741301-dc798b83add3')],
  },
  {
    _id: 'demo-8', name: 'Everyday Leather Backpack', category: 'Clothing',
    price: 5899, oldPrice: 7999, stock: 17, rating: 4.6, reviews: 143, featured: true,
    description: 'Full-grain leather backpack with a padded 15" laptop sleeve and water-resistant lining. Commute in style.',
    images: [img('1553062407-98eeb64c6a62')],
  },
  {
    _id: 'demo-9', name: 'Smart Home Speaker', category: 'Electronics',
    price: 4999, oldPrice: 6499, stock: 36, rating: 4.5, reviews: 189,
    description: 'Room-filling 360° sound with built-in voice assistant and multi-room sync. The heart of a connected home.',
    images: [img('1589003077984-894e133dabab')],
  },
  {
    _id: 'demo-10', name: 'Yoga & Fitness Mat', category: 'Sports',
    price: 2499, oldPrice: 3499, stock: 60, rating: 4.7, reviews: 230,
    description: 'Extra-thick non-slip mat with alignment markers. Cushioned support for yoga, pilates and stretching.',
    images: [img('1591291621164-2c6367723315')],
  },
  {
    _id: 'demo-11', name: 'Bestseller Novel Collection', category: 'Books',
    price: 1999, oldPrice: 2999, stock: 45, rating: 4.9, reviews: 512,
    description: 'A curated box-set of three award-winning contemporary novels. Stories that stay with you long after the last page.',
    images: [img('1512820790803-83ca734da794')],
  },
  {
    _id: 'demo-12', name: 'Aromatic Scented Candle', category: 'Home & Living',
    price: 1499, oldPrice: 2199, stock: 70, rating: 4.6, reviews: 176,
    description: 'Hand-poured soy wax candle with notes of sandalwood and amber. 50 hours of calm, golden glow.',
    images: [img('1602874801006-e26c4c5b5e8a')],
  },
]

export const dummyFeatured = dummyProducts.filter(p => p.featured)

export function filterDummy({ category, search, sort }) {
  let list = [...dummyProducts]
  if (category && category !== 'All') list = list.filter(p => p.category === category)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }
  if (sort === 'price_low') list.sort((a, b) => a.price - b.price)
  else if (sort === 'price_high') list.sort((a, b) => b.price - a.price)
  else if (sort === 'popular') list.sort((a, b) => b.reviews - a.reviews)
  return list
}

export const findDummy = (id) => dummyProducts.find(p => p._id === id) || null
