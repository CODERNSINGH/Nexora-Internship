import PropTypes from 'prop-types'

function ReceiptModal({ receipt, currency, onClose }) {
  if (!receipt) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal>
      <div className="modal">
        <header className="modal-header">
          <h2>Receipt</h2>
          <button onClick={onClose} className="close">
            ×
          </button>
        </header>
        <div className="modal-body receipt">
          <p>
            Thanks {receipt.customer.name}! We sent a confirmation to{' '}
            {receipt.customer.email}.
          </p>
          <ul>
            {receipt.items.map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.product.title} —{' '}
                {currency.format(item.lineTotal)}
              </li>
            ))}
          </ul>
          <div className="receipt-total">
            Total paid: {currency.format(receipt.total)}
          </div>
          <small className="muted">
            Order time: {new Date(receipt.issuedAt).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  )
}

ReceiptModal.propTypes = {
  receipt: PropTypes.shape({
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        lineTotal: PropTypes.number.isRequired,
        product: PropTypes.shape({
          title: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
    total: PropTypes.number.isRequired,
    issuedAt: PropTypes.string.isRequired,
  }),
  currency: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ReceiptModal

