import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login2FAPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.hash.split('?')[1]);
  const email = params.get('email') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://api.leadgateway.tech/api/2fa/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: code }),
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
        <h2 className="text-3xl font-bold mb-3">Two-Factor Authentication</h2>
        <p className="text-gray-400 mb-8">
          Enter the 6-digit code from your authenticator app for {email}
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
            placeholder="000000" maxLength={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-center tracking-widest text-2xl" />
          <button type="submit" disabled={loading || code.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6">
          <Link to="/login" className="text-blue-500 hover:text-blue-400">Back to Log In</Link>
        </p>
      </div>
    </div>
  )
}

export default Login2FAPage;