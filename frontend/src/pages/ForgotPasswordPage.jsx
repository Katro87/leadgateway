import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [resetToken, setResetToken] = useState('');
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
      
      if (data.require2FA) {
        setRequire2FA(true);
      } else {
        setMessage('If an account exists, a reset link has been sent.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://api.leadgateway.tech/api/users/verify-reset-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: twoFactorCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetToken(data.resetToken);
      navigate(`/reset-password/${data.resetToken}`);
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
          {!require2FA 
            ? "Enter your email and we'll send you a reset link." 
            : "Enter your authenticator code to reset your password."}
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {message && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>
        )}

        {!require2FA ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-5">
            <p className="text-sm text-gray-400">Account: {email}</p>
            <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="Enter 6-digit code" maxLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-center tracking-widest" />
            <button type="submit" disabled={loading || twoFactorCode.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
            <button type="button" onClick={() => setRequire2FA(false)}
              className="text-sm text-blue-500 hover:text-blue-400 cursor-pointer">
              ← Back
            </button>
          </form>
        )}

        <p className="text-sm text-gray-400 mt-6">
          <Link to="/login" className="text-blue-500 hover:text-blue-400">Back to Log In</Link>
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;