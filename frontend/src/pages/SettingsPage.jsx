import { useState } from 'react'
import { getProfile } from '../api/auth'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setName(user.name || '');
    setEmail(user.email || '');
    setLoaded(true);
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.leadgateway.tech/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), name: data.name, email: data.email }));
      setProfileMsg('Profile updated!');
    } catch (err) {
      setProfileMsg(err.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.leadgateway.tech/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setNewPassword('');
      setPasswordMsg('Password updated!');
    } catch (err) {
      setPasswordMsg(err.message);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'password', name: 'Password', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'billing', name: 'Billing', icon: '💳' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your account</p>
      </div>

      <div className="flex gap-1 border-b border-gray-700">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === tab.id ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <span>{tab.icon}</span>{tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileUpdate} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          {profileMsg && <div className={`text-sm ${profileMsg.includes('updated') ? 'text-green-400' : 'text-red-400'}`}>{profileMsg}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Save Changes</button>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordUpdate} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Change Password</h3>
          {passwordMsg && <div className={`text-sm ${passwordMsg.includes('updated') ? 'text-green-400' : 'text-red-400'}`}>{passwordMsg}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Update Password</button>
        </form>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
          {['Email notifications', 'Call notifications', 'Message notifications', 'Marketing emails'].map((item) => (
            <div key={item} className="flex items-center justify-between py-2">
              <p className="text-sm font-medium">{item}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Integrations</h3>
          {['Twilio', 'Google Calendar', 'Slack', 'Zapier'].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
              <p className="text-sm font-medium">{item}</p>
              <button className="text-sm text-blue-500 hover:text-blue-400 cursor-pointer">Connect</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Billing</h3>
          <p className="text-sm text-gray-400">Free Plan</p>
        </div>
      )}
    </div>
  )
}

export default SettingsPage