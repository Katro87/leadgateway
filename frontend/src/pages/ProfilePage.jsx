import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(localStorage.getItem('bio') || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.leadgateway.tech/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone, bio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('user', JSON.stringify({ ...user, name: data.name }));
      localStorage.setItem('bio', bio);
      localStorage.setItem('phone', phone);
      setMsg('✅ Profile updated!');
      setEditing(false);
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg('❌ ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
        ← Back to Dashboard
      </button>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-gray-400 text-sm mt-1">{bio || 'No bio yet'}</p>
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="mt-4 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Edit Profile</h3>
          {msg && <div className={`text-sm ${msg.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{msg}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="email" value={user.email} disabled
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" rows="3" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Save Changes
            </button>
            <button type="button" onClick={() => setEditing(false)}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfilePage