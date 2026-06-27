import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, FileText, Pencil, Check, X, AlertCircle } from 'lucide-react';

function ProfilePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(localStorage.getItem('bio') || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (!name || name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.leadgateway.tech/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), phone, bio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('user', JSON.stringify({ ...user, name: data.name }));
      localStorage.setItem('bio', bio);
      localStorage.setItem('phone', phone);
      setMsg('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.name || '');
    setBio(localStorage.getItem('bio') || '');
    setPhone(localStorage.getItem('phone') || '');
    setEditing(false);
    setError('');
    setMsg('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/dashboard')}
        className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={40} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-gray-400 text-sm mt-1">{bio || 'No bio yet'}</p>
        {phone && <p className="text-gray-500 text-xs mt-1 flex items-center justify-center gap-1"><Phone size={12} /> {phone}</p>}
        {!editing && (
          <button onClick={() => setEditing(true)}
            className="mt-4 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 mx-auto">
            <Pencil size={14} /> Edit Profile
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Pencil size={18} /> Edit Profile</h3>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {msg && (
            <div className="bg-green-900/30 border border-green-700/50 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <Check size={16} /> {msg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><User size={14} /> Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Mail size={14} /> Email</label>
            <input type="email" value={user.email} disabled
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Phone size={14} /> Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><FileText size={14} /> Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" rows="3" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2">
              <Check size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfilePage