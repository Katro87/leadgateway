import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.require2FA) {
        navigate(`/login-2fa?email=${encodeURIComponent(email)}`);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError('');
    // Google Identity Services will handle the popup
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    }
  };

  // Initialize Google on mount
  useState(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: '232273623767-rghiq4roq6d5sncuhn3ormobupdr3him.apps.googleusercontent.com',
        callback: async (response) => {
          try {
            const res = await fetch('https://api.leadgateway.tech/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: response.credential, action: 'login' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            if (data.isNewUser) {
              navigate('/profile?onboarding=true');
            } else {
              navigate('/dashboard');
            }
          } catch (err) {
            setError(err.message);
          } finally {
            setGoogleLoading(false);
          }
        },
      });
    }
  });

  return (
    <div className="bg-gray-900 text-white min-h-screen flex relative">
      <Link to="/" className="absolute top-6 left-6 text-gray-400 hover:text-white text-sm flex items-center gap-1 z-10 transition-colors">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gray-800 px-16">
        <h1 className="text-4xl font-bold mb-4">LeadGateway</h1>
        <p className="text-gray-400 text-lg text-center max-w-sm">
          Log in to your account and start connecting with your leads.
        </p>
      </div>

      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8">Enter your credentials to continue</p>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Custom Google Button */}
          <button onClick={handleGoogleLogin} disabled={googleLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-3 border border-gray-300 mb-5">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-gray-800 border-gray-600" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              <LogIn size={18} /> {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-400 transition-colors">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage