import { useState } from 'react'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('password')
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [notifications, setNotifications] = useState({
    email: true, calls: true, messages: true, marketing: false
  })
  const [preferences, setPreferences] = useState({
    blockUnknown: false, hideCallerId: false, defaultVoicemail: true
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const markChanged = () => setHasChanges(true);

  const handleSaveAll = async () => {
    setSaveMsg('');
    try {
      const token = localStorage.getItem('token');
      if (newPassword) {
        const res = await fetch('https://api.leadgateway.tech/api/users/profile', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ password: newPassword }),
        });
        if (!res.ok) throw new Error((await res.json()).message);
      }
      setSaveMsg('All changes saved!');
      setHasChanges(false);
      setNewPassword('');
      setCurrentPassword('');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg(err.message);
    }
  };

  const handleCancel = () => {
    setNewPassword('');
    setCurrentPassword('');
    setNotifications({ email: true, calls: true, messages: true, marketing: false });
    setPreferences({ blockUnknown: false, hideCallerId: false, defaultVoicemail: true });
    setHasChanges(false);
    setSaveMsg('Changes discarded');
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const tabs = [
    { id: 'password', name: 'Password', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'billing', name: 'Billing', icon: '💳' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your preferences</p>
      </div>

      <div className="flex gap-1 border-b border-gray-700">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${activeTab === tab.id ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
            <span>{tab.icon}</span>{tab.name}
          </button>
        ))}
      </div>

      {activeTab === 'password' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); markChanged(); }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); markChanged(); }}
              placeholder="Min. 6 characters" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')} notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={val} onChange={(e) => { setNotifications({ ...notifications, [key]: e.target.checked }); markChanged(); }}
                  className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Call Preferences</h3>
          {[
            { key: 'blockUnknown', label: 'Block unknown callers' },
            { key: 'hideCallerId', label: 'Hide caller ID on outgoing calls' },
            { key: 'defaultVoicemail', label: 'Use default voicemail greeting' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={preferences[key]} onChange={(e) => { setPreferences({ ...preferences, [key]: e.target.checked }); markChanged(); }}
                  className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold">Billing</h3>
          <p className="text-sm text-gray-400">Free Plan — No charges</p>
        </div>
      )}

      {hasChanges && (
        <div className="flex gap-3 items-center">
          <button onClick={handleSaveAll} className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            Save All Changes
          </button>
          <button onClick={handleCancel} className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            Cancel
          </button>
          {saveMsg && <span className={`text-sm ${saveMsg.includes('saved') ? 'text-green-400' : 'text-red-400'}`}>{saveMsg}</span>}
        </div>
      )}
    </div>
  )
}

export default SettingsPage