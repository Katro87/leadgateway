import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gray-800 px-16">
        <h1 className="text-4xl font-bold mb-4">LeadGateway</h1>
        <p className="text-gray-400 text-lg text-center max-w-sm">
          Log in to your account and start connecting with your leads.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Enter your credentials to continue</p>

          <form className="space-y-5">
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
                placeholder="••••••••"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Log In
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage