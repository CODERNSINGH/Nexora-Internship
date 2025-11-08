import PropTypes from 'prop-types'

function ErrorBanner({ message }) {
  if (!message) return null

  return <div className="banner banner-error">{message}</div>
}

ErrorBanner.propTypes = {
  message: PropTypes.string,
}

export default ErrorBanner

