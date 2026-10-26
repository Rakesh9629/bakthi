/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useReducer } from 'react'
import { COUPONS } from '../data'

const CartContext = createContext(null)

const SHIPPING_THRESHOLD = 999
const SHIPPING_CHARGE = 99

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.id}-${action.item.selectedSize}`
      const existing = state.items.find(i => `${i.id}-${i.selectedSize}` === key)
      if (existing) {
        return { ...state, items: state.items.map(i => `${i.id}-${i.selectedSize}` === key ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => `${i.id}-${i.selectedSize}` !== action.key) }
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => `${i.id}-${i.selectedSize}` === action.key ? { ...i, qty: Math.max(1, action.qty) } : i) }
    case 'CLEAR':
      return { items: [], coupon: null }
    case 'SET_COUPON':
      return { ...state, coupon: action.coupon }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null }, init => {
    try { return JSON.parse(localStorage.getItem('bakthi_cart')) || init } catch { return init }
  })

  useEffect(() => { localStorage.setItem('bakthi_cart', JSON.stringify(state)) }, [state])

  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const couponDiscount = state.coupon
    ? state.coupon.type === 'percent'
      ? Math.round(subtotal * state.coupon.discount / 100)
      : state.coupon.discount
    : 0
  const shipping = subtotal - couponDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE
  const total = subtotal - couponDiscount + shipping

  function applyCoupon(code) {
    const c = COUPONS.find(c => c.code === code.toUpperCase())
    if (!c) return { ok: false, message: 'Invalid coupon code' }
    if (subtotal < c.minOrder) return { ok: false, message: `Minimum order ₹${c.minOrder} required` }
    dispatch({ type: 'SET_COUPON', coupon: c })
    return { ok: true, message: `Coupon applied! ${c.description}` }
  }

  return (
    <CartContext.Provider value={{
      items: state.items,
      coupon: state.coupon,
      subtotal, couponDiscount, shipping, total,
      count: state.items.reduce((s, i) => s + i.qty, 0),
      add: item => dispatch({ type: 'ADD', item }),
      remove: key => dispatch({ type: 'REMOVE', key }),
      updateQty: (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty }),
      clear: () => dispatch({ type: 'CLEAR' }),
      applyCoupon,
      removeCoupon: () => dispatch({ type: 'REMOVE_COUPON' }),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
