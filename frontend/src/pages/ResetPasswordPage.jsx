import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 const { token } = useParams();
  const handleReset = async (e) => {
    e.preventDefault();
    if (!token) { setError('Invalid reset link'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`https://api.leadgateway.tech/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      // Auto-login after reset
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setMessage('Password reset successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage('Password reset successful!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-gray-400 mb-8 text-center">
          {token ? 'Enter your new password' : 'Invalid or expired reset link'}
        </p>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {message && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>
        )}

        {token && !message && (
          <form onSubmit={handleReset} className="space-y-5">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min. 6 characters)" required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link to="/login" className="text-blue-500 hover:text-blue-400">Back to Log In</Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPasswordPage;