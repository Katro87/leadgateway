import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api/auth';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus } from 'lucide-react';
import GoogleButton from '../components/GoogleButton';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signupUser(name, email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch('https://api.leadgateway.tech/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex relative">
      <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm flex items-center gap-1 z-10 transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gray-800 px-16">
        <h1 className="text-4xl font-bold mb-4">LeadGateway</h1>
        <p className="text-gray-400 text-lg text-center max-w-sm">
          Create your account and start reaching out to leads in minutes.
        </p>
      </div>

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-2">Get started</h2>
          <p className="text-gray-400 mb-8">Create your free account</p>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="mb-5">
            <GoogleButton onSuccess={handleGoogleLogin} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User size={14} /> Full Name
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Mail size={14} /> Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              <UserPlus size={18} /> {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage