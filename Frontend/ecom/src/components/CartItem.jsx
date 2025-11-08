import PropTypes from 'prop-types'

function CartItem({ item, currency, onUpdateQuantity, onRemove }) {
  return (
    <li className="cart-item">
      <div>
        <h3>{item.product.title}</h3>
        <p className="muted">{currency.format(item.product.price)} each</p>
      </div>
      <div className="cart-controls">
        <label>
          Qty
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
          />
        </label>
        <span className="line-total">{currency.format(item.lineTotal)}</span>
        <button className="remove" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </li>
  )
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    lineTotal: PropTypes.number.isRequired,
    product: PropTypes.shape({
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  currency: PropTypes.object.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default CartItem

