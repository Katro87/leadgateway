import { useState } from 'react'
import { Key, Bell, Sliders, CreditCard, Check, X, AlertCircle, Eye, EyeOff, Globe, Clock, Shield, Loader2 } from 'lucide-react'
function Toast({ message, type, onClose }) {
  return (
    <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80"><X size={16} /></button>
    </div>
  )
}

function PasswordInput({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder}
          className={`w-full bg-gray-700 border rounded-lg px-4 py-2.5 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-600'
          }`} />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  )
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
]

const timezones = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Tokyo',
]

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('password')
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [notifications, setNotifications] = useState({ email: true, calls: true, messages: true, marketing: false })
  const [preferences, setPreferences] = useState({ blockUnknown: false, hideCallerId: false, defaultVoicemail: true })
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en')
  const [timezone, setTimezone] = useState(localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(localStorage.getItem('sessionTimeout') || '30')
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [show2FAModal, setShow2FAModal] = useState(false)
const [qrCode, setQrCode] = useState('')
const [twoFactorSecret, setTwoFactorSecret] = useState('')
const [twoFactorCode, setTwoFactorCode] = useState('')
const [twoFactorError, setTwoFactorError] = useState('')

  const showToast = (message, type) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const markChanged = () => setHasChanges(true)

  const validatePassword = () => {
    const newErrors = {}
    if (!currentPassword && newPassword) newErrors.currentPassword = 'Current password is required'
    if (newPassword && newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters'
    if (newPassword && newPassword === currentPassword) newErrors.newPassword = 'New password must be different from current'
    if (newPassword && newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveAll = async () => {
    if (newPassword && !validatePassword()) return
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      if (newPassword) {
        const res = await fetch('https://api.leadgateway.tech/api/users/profile', {
          method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ password: newPassword, currentPassword }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
      }
      localStorage.setItem('language', language)
      localStorage.setItem('timezone', timezone)
      localStorage.setItem('sessionTimeout', sessionTimeout)
      showToast('All settings saved', 'success')
      setHasChanges(false)
      setNewPassword(''); setCurrentPassword(''); setConfirmPassword(''); setErrors({})
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setNewPassword(''); setCurrentPassword(''); setConfirmPassword(''); setErrors({})
    setNotifications({ email: true, calls: true, messages: true, marketing: false })
    setPreferences({ blockUnknown: false, hideCallerId: false, defaultVoicemail: true })
    setLanguage(localStorage.getItem('language') || 'en')
    setTimezone(localStorage.getItem('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone)
    setHasChanges(false)
  }
 const setup2FA = async () => {
  setShow2FAModal(true);
  setQrCode('');
  setTwoFactorCode('');
  setTwoFactorError('');
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('https://api.leadgateway.tech/api/2fa/setup', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setQrCode(data.qrCode);
    setTwoFactorSecret(data.secret);
  } catch (err) {
    setTwoFactorError(err.message);
  }
};

const verify2FA = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('https://api.leadgateway.tech/api/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ token: twoFactorCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setTwoFactor(true);
    setShow2FAModal(false);
    showToast('2FA enabled successfully', 'success');
  } catch (err) {
    setTwoFactorError(err.message);
  }
};

const disable2FA = async () => {
  const code = prompt('Enter your 2FA code to disable:');
  if (!code) return;
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('https://api.leadgateway.tech/api/2fa/disable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ token: code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setTwoFactor(false);
    showToast('2FA disabled', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  }
};
  const tabs = [
    { id: 'password', name: 'Password', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: Sliders },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'timezone', name: 'Timezone', icon: Clock },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your preferences</p>
      </div>

      <div className="flex gap-1 border-b border-gray-700 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px ${
                activeTab === tab.id ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}><Icon size={16} />{tab.name}</button>
          )
        })}
      </div>

      {activeTab === 'password' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Change Password</h3>
          <PasswordInput label="Current Password" value={currentPassword} onChange={(e) => { setCurrentPassword(e.target.value); markChanged() }} error={errors.currentPassword} />
          <PasswordInput label="New Password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); markChanged() }} placeholder="Min. 6 characters" error={errors.newPassword} />
          <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); markChanged() }} placeholder="Re-enter new password" error={errors.confirmPassword} />
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')} notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={val} onChange={(e) => { setNotifications({ ...notifications, [key]: e.target.checked }); markChanged() }} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Call Preferences</h3>
          {[
            { key: 'blockUnknown', label: 'Block unknown callers' },
            { key: 'hideCallerId', label: 'Hide caller ID on outgoing calls' },
            { key: 'defaultVoicemail', label: 'Use default voicemail greeting' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-300">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={preferences[key]} onChange={(e) => { setPreferences({ ...preferences, [key]: e.target.checked }); markChanged() }} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-600 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'language' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Language</h3>
          <select value={language} onChange={(e) => { setLanguage(e.target.value); markChanged() }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
            {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
      )}

      {activeTab === 'timezone' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Timezone</h3>
          <select value={timezone} onChange={(e) => { setTimezone(e.target.value); markChanged() }}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
            {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
      )}

      {activeTab === 'security' && (
  <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
    <h3 className="text-lg font-semibold text-white">Security</h3>
    
    {/* 2FA Section */}
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm text-gray-300">Two-factor authentication</p>
          <p className="text-xs text-gray-500">Add an extra layer of security</p>
        </div>
        {!twoFactor ? (
          <button onClick={setup2FA}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            Enable
          </button>
        ) : (
          <button onClick={disable2FA}
            className="bg-red-600/30 hover:bg-red-600/50 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            Disable
          </button>
        )}
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShow2FAModal(false)}>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Setup Two-Factor Authentication</h3>
            
            {!qrCode ? (
              <div className="text-center py-4">
                <Loader2 size={24} className="animate-spin text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Generating QR code...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Scan this QR code with Google Authenticator or any TOTP app.</p>
                <img src={qrCode} alt="QR Code" className="mx-auto rounded-lg" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
                  <code className="text-xs text-blue-400 bg-gray-700 px-3 py-1 rounded break-all block">{twoFactorSecret}</code>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Enter 6-digit code</label>
                  <input type="text" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="000000" maxLength={6}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white text-center tracking-widest focus:outline-none focus:border-blue-500" />
                  {twoFactorError && <p className="text-red-400 text-xs mt-1">{twoFactorError}</p>}
                </div>
                <button onClick={verify2FA} disabled={twoFactorCode.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50">
                  Verify & Enable
                </button>
              </div>
            )}
            <button onClick={() => setShow2FAModal(false)}
              className="w-full mt-3 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Session Timeout */}
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">Session timeout (minutes)</label>
      <select value={sessionTimeout} onChange={(e) => { setSessionTimeout(e.target.value); markChanged() }}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500">
        {['15', '30', '60', '120'].map(t => <option key={t} value={t}>{t} minutes</option>)}
      </select>
    </div>
  </div>
)}

      {activeTab === 'billing' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-white">Billing</h3>
          <p className="text-sm text-gray-400">Free Plan — No charges</p>
        </div>
      )}

      {hasChanges && (
        <div className="flex gap-3 items-center">
          <button onClick={handleSaveAll} disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2">
            <Check size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
          <button onClick={handleCancel}
            className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            <X size={16} /> Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default SettingsPage