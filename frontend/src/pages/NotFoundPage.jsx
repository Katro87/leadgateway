import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-8">Page not found</p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage