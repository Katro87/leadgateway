import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-3">Reset Password</h2>
        <p className="text-gray-400 mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <form className="space-y-5">
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Send Reset Link
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-6">
          <Link to="/login" className="text-blue-500 hover:text-blue-400">
            Back to Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage