import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header'
import ErrorBanner from './components/ErrorBanner'
import ProductGrid from './components/ProductGrid'
import Cart from './components/Cart'
import CheckoutModal from './components/CheckoutModal'
import ReceiptModal from './components/ReceiptModal'
import { useCart } from './hooks/useCart'
import { createCurrencyFormatter } from './utils/currency'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)

  const {
    cart,
    error: cartError,
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    updateCart,
  } = useCart()

  const currency = useMemo(() => createCurrencyFormatter(), [])

  useEffect(() => {
    async function bootstrap() {
      setLoading(true)
      try {
        const [productsRes, cartRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/cart`),
        ])

        if (!productsRes.ok || !cartRes.ok) {
          throw new Error('Failed to load data')
        }

        const [productsData, cartData] = await Promise.all([
          productsRes.json(),
          cartRes.json(),
        ])

        setProducts(productsData)
        updateCart(cartData)
      } catch (err) {
        console.error('Bootstrap error:', err)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [updateCart])

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const receiptData = await checkout(form.name, form.email)
      setReceipt(receiptData)
      setForm({ name: '', email: '' })
      setCheckoutOpen(false)
    } catch (err) {

    } finally {
      setSubmitting(false)
    }
  }

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="app-shell">
      <Header
        cartCount={cartCount}
        onCheckoutClick={() => setCheckoutOpen(true)}
        isCartEmpty={cart.items.length === 0}
      />

      <ErrorBanner message={cartError} />

      {loading ? (
        <div className="loading">Loading storefront…</div>
      ) : (
        <main className="content">
          <ProductGrid
            products={products}
            currency={currency}
            onAddToCart={addToCart}
          />
          <Cart
            cart={cart}
            currency={currency}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        </main>
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        form={form}
        onFormChange={setForm}
        onSubmit={handleCheckoutSubmit}
        submitting={submitting}
        cartTotal={cart.total}
        currency={currency}
      />

      <ReceiptModal
        receipt={receipt}
        currency={currency}
        onClose={() => setReceipt(null)}
      />
    </div>
  )
}

export default App
