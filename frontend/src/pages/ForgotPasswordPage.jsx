import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('https://api.leadgateway.tech/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage('If an account exists, a reset link has been sent.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://api.leadgateway.tech/api/2fa/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recoveryCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-3">Reset Password</h2>
        <p className="text-gray-400 mb-8">
          {!showRecovery ? "Enter your email and we'll send you a reset link." : "Enter your recovery code to regain access."}
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {message && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>
        )}

        {!showRecovery ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-4">
              Lost access to your authenticator?{' '}
              <button onClick={() => setShowRecovery(true)} className="text-blue-500 hover:text-blue-400 cursor-pointer">
                Use recovery code
              </button>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleRecovery} className="space-y-5">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
              <input type="text" value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                placeholder="Enter recovery code (e.g. A1B2C3D4)" maxLength={8}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 tracking-widest text-center" />
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
                {loading ? 'Verifying...' : 'Sign In with Recovery Code'}
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-4">
              <button onClick={() => setShowRecovery(false)} className="text-blue-500 hover:text-blue-400 cursor-pointer">
                ← Back to reset password
              </button>
            </p>
          </>
        )}

        <p className="text-sm text-gray-400 mt-6">
          <Link to="/login" className="text-blue-500 hover:text-blue-400">Back to Log In</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;