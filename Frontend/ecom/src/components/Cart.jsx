import PropTypes from 'prop-types'
import CartItem from './CartItem'

function Cart({ cart, currency, onUpdateQuantity, onRemove }) {
  return (
    <aside className="cart">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p className="empty-cart">Cart is empty. Add something nice!</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                currency={currency}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </ul>
          <div className="cart-summary">
            <div>
              <span>Subtotal</span>
              <strong>{currency.format(cart.subtotal)}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{currency.format(cart.total)}</strong>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}

Cart.propTypes = {
  cart: PropTypes.shape({
    items: PropTypes.array.isRequired,
    subtotal: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  currency: PropTypes.object.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default Cart

