import PropTypes from 'prop-types'

function CheckoutModal({ isOpen, onClose, form, onFormChange, onSubmit, submitting, cartTotal, currency }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal>
      <div className="modal">
        <header className="modal-header">
          <h2>Checkout</h2>
          <button onClick={onClose} className="close">
            ×
          </button>
        </header>
        <form onSubmit={onSubmit} className="modal-body">
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => onFormChange({ ...form, email: e.target.value })}
              required
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Processing…' : `Pay ${currency.format(cartTotal)}`}
          </button>
        </form>
      </div>
    </div>
  )
}

CheckoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  cartTotal: PropTypes.number.isRequired,
  currency: PropTypes.object.isRequired,
}

export default CheckoutModal

