import PropTypes from 'prop-types'

function ProductCard({ product, currency, onAddToCart }) {
  return (
    <article className="product-card">
      {product.image && (
        <img src={product.image} alt={product.title} loading="lazy" />
      )}
      <div className="product-copy">
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        <h3>{product.title}</h3>
        {product.rating && (
          <div className="product-rating">
            <span>⭐ {product.rating.rate}</span>
            <span className="muted">({product.rating.count})</span>
          </div>
        )}
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
      </div>
      <div className="product-footer">
        <span>{currency.format(product.price)}</span>
        <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.string,
    rating: PropTypes.shape({
      rate: PropTypes.number,
      count: PropTypes.number,
    }),
  }).isRequired,
  currency: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
}

export default ProductCard

