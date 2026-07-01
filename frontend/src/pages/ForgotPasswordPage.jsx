import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Shield } from 'lucide-react';

function ForgotPasswordPage() {
  const [mode, setMode] = useState('choose'); // 'choose' | 'email' | 'authenticator'
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const navigate = useNavigate();

  const resetState = () => {
    setMessage(''); setError(''); setLoading(false);
    setAwaitingCode(false); setTwoFactorCode(''); setEmail('');
  };

  // --- Flow 1: Send email reset link ---
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      const res = await fetch('https://api.leadgateway.tech/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('If an account exists with that email, a reset link has been sent.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Flow 2a: Check email has 2FA enabled, then request code ---
  const handleAuthenticatorEmailSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('https://api.leadgateway.tech/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, via2FA: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (data.require2FA) {
        setAwaitingCode(true);
      } else {
        setError('This account does not have an authenticator app enabled.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Flow 2b: Verify the 6-digit code and redirect to reset page ---
  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('https://api.leadgateway.tech/api/users/verify-reset-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: twoFactorCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate(`/reset-password/${data.resetToken}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">

        {/* CHOOSE MODE */}
        {mode === 'choose' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
            <p className="text-gray-400 mb-10">Choose how you'd like to reset your password.</p>
            <div className="space-y-4">
              <button
                onClick={() => { resetState(); setMode('email'); }}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 px-6 py-4 rounded-xl text-left flex items-center gap-4 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30 transition-colors">
                  <Mail size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Send reset link</p>
                  <p className="text-gray-400 text-sm mt-0.5">We'll email you a link to reset your password</p>
                </div>
              </button>

              <button
                onClick={() => { resetState(); setMode('authenticator'); }}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 px-6 py-4 rounded-xl text-left flex items-center gap-4 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30 transition-colors">
                  <Shield size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Use authenticator app</p>
                  <p className="text-gray-400 text-sm mt-0.5">Verify with your 2FA code to reset instantly</p>
                </div>
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-8">
              <Link to="/login" className="text-blue-500 hover:text-blue-400">← Back to Log In</Link>
            </p>
          </div>
        )}

        {/* EMAIL RESET FLOW */}
        {mode === 'email' && (
          <div>
            <button onClick={() => { resetState(); setMode('choose'); }} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition-colors cursor-pointer">
              <ArrowLeft size={16} /> Back
            </button>
            <h2 className="text-3xl font-bold mb-2">Reset via email</h2>
            <p className="text-gray-400 mb-8">Enter your email and we'll send you a reset link.</p>

            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {message && <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>}

            {!message && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com" required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* AUTHENTICATOR FLOW */}
        {mode === 'authenticator' && (
          <div>
            <button onClick={() => { resetState(); setMode('choose'); }} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition-colors cursor-pointer">
              <ArrowLeft size={16} /> Back
            </button>

            {!awaitingCode ? (
              <>
                <h2 className="text-3xl font-bold mb-2">Reset via authenticator</h2>
                <p className="text-gray-400 mb-8">Enter your email — we'll ask for your 2FA code next.</p>

                {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleAuthenticatorEmailSubmit} className="space-y-4">
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com" required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
                    {loading ? 'Checking...' : 'Continue'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-2">Enter your code</h2>
                <p className="text-gray-400 mb-2">Open your authenticator app and enter the 6-digit code for</p>
                <p className="text-white font-medium mb-8">{email}</p>

                {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleVerify2FA} className="space-y-4">
                  <input
                    type="text" value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" maxLength={6}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-[0.5em] font-mono"
                  />
                  <button type="submit" disabled={loading || twoFactorCode.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify & Reset Password'}
                  </button>
                  <button type="button" onClick={() => setAwaitingCode(false)}
                    className="w-full text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                    ← Use a different email
                  </button>
                </form>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPasswordPage;