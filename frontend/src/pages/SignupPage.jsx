import { Link } from 'react-router-dom'

function SignupPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gray-800 px-16">
        <h1 className="text-4xl font-bold mb-4">LeadGateway</h1>
        <p className="text-gray-400 text-lg text-center max-w-sm">
          Create your account and start reaching out to leads in minutes.
        </p>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-2">Get started</h2>
          <p className="text-gray-400 mb-8">Create your free account</p>

          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Smith"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage