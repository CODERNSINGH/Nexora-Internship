import { useState, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function useCart() {
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 })
  const [error, setError] = useState('')

  const updateCart = useCallback((data) => {
    setCart({
      items: data.items || [],
      subtotal: data.subtotal || 0,
      total: data.total || data.subtotal || 0,
    })
  }, [])

  const addToCart = useCallback(
    async (productId) => {
      try {
        const res = await fetch(`${API_URL}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, qty: 1 }),
        })
        if (!res.ok) throw new Error('Unable to add item to cart')
        updateCart(await res.json())
      } catch (err) {
        setError(err.message)
      }
    },
    [updateCart]
  )

  const removeFromCart = useCallback(
    async (cartItemId) => {
      try {
        const res = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
          method: 'DELETE',
        })
        if (!res.ok) throw new Error('Unable to remove item from cart')
        updateCart(await res.json())
      } catch (err) {
        setError(err.message)
      }
    },
    [updateCart]
  )

  const updateQuantity = useCallback(
    async (cartItemId, qty) => {
      if (!Number.isInteger(qty) || qty <= 0) return
      try {
        const res = await fetch(`${API_URL}/api/cart/${cartItemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qty }),
        })
        if (!res.ok) throw new Error('Unable to update quantity')
        updateCart(await res.json())
      } catch (err) {
        setError(err.message)
      }
    },
    [updateCart]
  )

  const checkout = useCallback(
    async (name, email) => {
      try {
        const res = await fetch(`${API_URL}/api/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim() }),
        })
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}))
          throw new Error(payload.message || 'Checkout failed')
        }
        const payload = await res.json()
        updateCart({ items: [], subtotal: 0, total: 0 })
        return payload.receipt
      } catch (err) {
        setError(err.message)
        throw err
      }
    },
    [updateCart]
  )

  return {
    cart,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    updateCart,
  }
}

