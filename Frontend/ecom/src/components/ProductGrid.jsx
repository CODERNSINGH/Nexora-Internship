import PropTypes from 'prop-types'
import ProductCard from './ProductCard'

function ProductGrid({ products, currency, onAddToCart }) {
  return (
    <section className="products">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currency={currency}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  )
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      image: PropTypes.string,
      rating: PropTypes.object,
    })
  ).isRequired,
  currency: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
}

export default ProductGrid

