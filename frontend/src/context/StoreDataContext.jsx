/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import {
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES as INITIAL_CATEGORIES,
  DEMO_ORDERS as INITIAL_ORDERS,
  COUPONS as INITIAL_COUPONS,
  TESTIMONIALS as INITIAL_TESTIMONIALS
} from '../data'

const StoreDataContext = createContext(null)

export function StoreDataProvider({ children }) {
  // Products
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('bakthi_products')
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
    } catch {
      return INITIAL_PRODUCTS
    }
  })

  // Categories
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('bakthi_categories')
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
    } catch {
      return INITIAL_CATEGORIES
    }
  })

  // Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('bakthi_orders')
      return saved ? JSON.parse(saved) : INITIAL_ORDERS
    } catch {
      return INITIAL_ORDERS
    }
  })

  // Coupons
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('bakthi_coupons')
      return saved ? JSON.parse(saved) : INITIAL_COUPONS
    } catch {
      return INITIAL_COUPONS
    }
  })

  // Reviews
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('bakthi_reviews')
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS
    } catch {
      return INITIAL_TESTIMONIALS
    }
  })

  // Sync to local storage
  useEffect(() => { localStorage.setItem('bakthi_products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('bakthi_categories', JSON.stringify(categories)) }, [categories])
  useEffect(() => { localStorage.setItem('bakthi_orders', JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem('bakthi_coupons', JSON.stringify(coupons)) }, [coupons])
  useEffect(() => { localStorage.setItem('bakthi_reviews', JSON.stringify(reviews)) }, [reviews])

  // Helper to get admin headers
  const getAdminHeaders = () => {
    const token = localStorage.getItem('bhakthi_admin_token')
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }

  // Hydrate from FastAPI Backend when available
  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        }
      })
      .catch(() => {})

    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data)
        }
      })
      .catch(() => {})

    fetch('/api/coupons')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCoupons(data)
        }
      })
      .catch(() => {})

    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data)
        }
      })
      .catch(() => {})

    const token = localStorage.getItem('bhakthi_admin_token')
    if (token) {
      fetch('/api/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setOrders(data)
          }
        })
        .catch(() => {})
    }
  }, [])

  // --- Product actions ---
  const addProduct = (product) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    const newProduct = {
      ...product,
      id: newId,
      slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sku: product.sku || `BKT-${String(newId).padStart(4, '0')}`,
      rating: product.rating || 4.5,
      reviewCount: product.reviewCount || 0,
      discount: product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0,
      thumbnail: product.images?.[0] || 'https://picsum.photos/seed/newproduct/400/500',
      images: product.images?.length ? product.images : ['https://picsum.photos/seed/newproduct/400/500'],
      sizes: product.sizes || [
        { label: '6×8 in', value: '6x8', price: product.price },
        { label: '12×16 in', value: '12x16', price: product.price + 200 },
        { label: '18×24 in', value: '18x24', price: product.price + 500 },
      ],
      shapes: product.shapes || ['vertical', 'square'],
      isActive: product.isActive !== undefined ? product.isActive : true,
    }
    setProducts(prev => [newProduct, ...prev])

    // Sync to backend
    fetch('/api/products/admin', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(newProduct)
    }).catch(() => {})

    return newProduct
  }

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields }
        if (merged.mrp && merged.price) {
          merged.discount = Math.round(((merged.mrp - merged.price) / merged.mrp) * 100)
        }
        return merged
      }
      return p
    }))

    fetch(`/api/products/admin/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updatedFields)
    }).catch(() => {})
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    fetch(`/api/products/admin/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    }).catch(() => {})
  }

  const updateStock = (id, newStock) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
    fetch(`/api/products/admin/${id}/stock?stock=${Math.max(0, newStock)}`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
    }).catch(() => {})
  }

  // --- Category actions ---
  const addCategory = (category) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1
    const newCat = {
      ...category,
      id: newId,
      slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      count: 0
    }
    setCategories(prev => [...prev, newCat])

    fetch('/api/categories/admin', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(category)
    }).catch(() => {})

    return newCat
  }

  const updateCategory = (id, updatedFields) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c))
    fetch(`/api/categories/admin/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updatedFields)
    }).catch(() => {})
  }

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id))
    fetch(`/api/categories/admin/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    }).catch(() => {})
  }

  // --- Order actions ---
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: orderData.id || `BKT-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: orderData.status || 'processing',
      paymentStatus: orderData.paymentStatus || 'paid',
    }
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const tracking = o.tracking ? { ...o.tracking, status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), updatedAt: new Date().toISOString().split('T')[0] } : null
        return { ...o, status: newStatus, tracking }
      }
      return o
    }))

    fetch(`/api/orders/admin/${orderId}`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({ order_status: newStatus })
    }).catch(() => {})
  }

  const updateOrderTracking = (orderId, trackingInfo) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          tracking: {
            courier: trackingInfo.courier || o.tracking?.courier || 'Delhivery',
            trackingNo: trackingInfo.trackingNo || o.tracking?.trackingNo || `TRK${Date.now()}`,
            status: trackingInfo.status || o.tracking?.status || 'In Transit',
            updatedAt: new Date().toISOString().split('T')[0],
          }
        }
      }
      return o
    }))

    fetch(`/api/orders/admin/${orderId}`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({
        tracking_courier: trackingInfo.courier,
        tracking_number: trackingInfo.trackingNo,
        tracking_status: trackingInfo.status,
      })
    }).catch(() => {})
  }

  // --- Coupon actions ---
  const addCoupon = (coupon) => {
    const code = coupon.code.toUpperCase()
    setCoupons(prev => [...prev, { ...coupon, code }])
    fetch('/api/coupons/admin', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({
        code,
        discount: Number(coupon.discount),
        type: coupon.type || 'percent',
        minOrder: Number(coupon.minOrder || 500),
        description: coupon.description || ''
      })
    }).catch(() => {})
  }

  const deleteCoupon = (code) => {
    const upper = code.toUpperCase()
    setCoupons(prev => prev.filter(c => c.code !== upper))
    fetch(`/api/coupons/admin/${encodeURIComponent(upper)}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    }).catch(() => {})
  }

  // --- Review actions ---
  const addReview = (review) => {
    const newRev = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      verified: true
    }
    setReviews(prev => [newRev, ...prev])

    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: review.name,
        city: review.city || 'India',
        rating: Number(review.rating || 5),
        text: review.text,
        product: review.product || 'Bhakthi Divine Frame'
      })
    }).catch(() => {})

    return newRev
  }

  const deleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id))
    fetch(`/api/reviews/admin/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    }).catch(() => {})
  }

  // --- Reset data ---
  const resetToDefault = () => {
    localStorage.removeItem('bakthi_products')
    localStorage.removeItem('bakthi_categories')
    localStorage.removeItem('bakthi_orders')
    localStorage.removeItem('bakthi_coupons')
    localStorage.removeItem('bakthi_reviews')
    setProducts(INITIAL_PRODUCTS)
    setCategories(INITIAL_CATEGORIES)
    setOrders(INITIAL_ORDERS)
    setCoupons(INITIAL_COUPONS)
    setReviews(INITIAL_TESTIMONIALS)
  }

  return (
    <StoreDataContext.Provider value={{
      products,
      categories,
      orders,
      coupons,
      reviews,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      addCategory,
      updateCategory,
      deleteCategory,
      addOrder,
      updateOrderStatus,
      updateOrderTracking,
      addCoupon,
      deleteCoupon,
      addReview,
      deleteReview,
      resetToDefault,
    }}>
      {children}
    </StoreDataContext.Provider>
  )
}

export const useStoreData = () => {
  const context = useContext(StoreDataContext)
  if (!context) {
    throw new Error('useStoreData must be used within a StoreDataProvider')
  }
  return context
}
