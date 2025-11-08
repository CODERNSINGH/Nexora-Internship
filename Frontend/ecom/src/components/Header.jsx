import PropTypes from 'prop-types'

function Header({ cartCount, onCheckoutClick, isCartEmpty }) {
  return (
    <header className="app-header">
      <div>
        <h1> Vibe Commerce</h1>
        <p className="tagline">Your one-stop shopping destination</p>
      </div>
      <button
        className="checkout-button"
        onClick={onCheckoutClick}
        disabled={isCartEmpty}
      >
        🛒 Cart ({cartCount})
      </button>
    </header>
  )
}

Header.propTypes = {
  cartCount: PropTypes.number.isRequired,
  onCheckoutClick: PropTypes.func.isRequired,
  isCartEmpty: PropTypes.bool.isRequired,
}

export default Header

