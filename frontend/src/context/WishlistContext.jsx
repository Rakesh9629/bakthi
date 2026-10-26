/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bakthi_wishlist')) || [] } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('bakthi_wishlist', JSON.stringify(items)) }, [items])

  const toggle = product => {
    setItems(prev =>
      prev.find(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)
        : [...prev, product]
    )
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, has: id => items.some(i => i.id === id), count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
