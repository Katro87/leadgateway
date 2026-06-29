import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, FileText, Pencil, Check, X, AlertCircle, Camera, Globe, Users, EyeOff, Maximize2 } from 'lucide-react';

function ProfilePage() {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [name, setName] = useState(storedUser.name || '');
  const [bio, setBio] = useState(localStorage.getItem('bio') || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
  const [avatar, setAvatar] = useState(storedUser.avatar || '');
  const [photoVisibility, setPhotoVisibility] = useState(storedUser.photoVisibility || 'everyone');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setAvatar(user.avatar || '');
    setStoredUser(user);
  }, []);

  const updateLocalUser = (updates) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...current, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setStoredUser(updated);
    if (updates.avatar) setAvatar(updates.avatar);
  };

  const onSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('https://api.leadgateway.tech/api/upload/avatar', {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      updateLocalUser({ avatar: data.avatar });
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (!name || name.trim().length < 2) { setError('Name must be at least 2 characters'); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://api.leadgateway.tech/api/users/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), phone, bio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      await fetch('https://api.leadgateway.tech/api/upload/privacy', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ photoVisibility }),
      });
      updateLocalUser({ name: data.name, photoVisibility });
      localStorage.setItem('bio', bio); localStorage.setItem('phone', phone);
      setMsg('Profile updated successfully'); setEditing(false);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setName(user.name || ''); setBio(localStorage.getItem('bio') || ''); setPhone(localStorage.getItem('phone') || '');
    setAvatar(user.avatar || ''); setPhotoVisibility(user.photoVisibility || 'everyone');
    setEditing(false); setError(''); setMsg('');
  };

  const visibilityOptions = [
    { value: 'everyone', label: 'Everyone', icon: Globe, desc: 'Anyone can see your photo' },
    { value: 'contacts', label: 'Saved Contacts', icon: Users, desc: 'Only your contacts' },
    { value: 'nobody', label: 'Nobody', icon: EyeOff, desc: 'Hidden from everyone' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {lightboxOpen && avatar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"><X size={28} /></button>
          <img src={avatar} alt="Profile" className="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <div className="relative inline-block group">
          {avatar ? (
            <>
              <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-600 cursor-pointer" onClick={() => setLightboxOpen(true)} />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer" onClick={() => setLightboxOpen(true)}>
                <Maximize2 size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </>
          ) : (
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <User size={40} className="text-white" />
            </div>
          )}
          {editing && (
            <>
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 p-1.5 rounded-full transition-colors cursor-pointer">
                <Camera size={14} className="text-white" />
              </button>
              <input type="file" ref={fileRef} onChange={onSelectFile} accept="image/jpeg,image/png,image/webp" className="hidden" />
            </>
          )}
        </div>
        {uploading && <p className="text-xs text-gray-400 mt-2">Uploading...</p>}
        <h2 className="text-xl font-bold text-white mt-3">{storedUser.name}</h2>
        <p className="text-gray-400 text-sm mt-1">{bio || 'No bio yet'}</p>
        {phone && <p className="text-gray-500 text-xs mt-1 flex items-center justify-center gap-1"><Phone size={12} /> {phone}</p>}
        {!editing && (
          <button onClick={() => setEditing(true)} className="mt-4 bg-gray-700 hover:bg-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 mx-auto">
            <Pencil size={14} /> Edit Profile
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Pencil size={18} /> Edit Profile</h3>
          {error && <div className="bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</div>}
          {msg && <div className="bg-green-900/30 border border-green-700/50 text-green-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2"><Check size={16} /> {msg}</div>}
          <div><label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><User size={14} /> Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Mail size={14} /> Email</label><input type="email" value={storedUser.email} disabled className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Phone size={14} /> Phone</label><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><FileText size={14} /> Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" rows="3" /></div>
          <div><label className="block text-sm font-medium text-gray-300 mb-3">Photo Visibility</label><div className="space-y-2">{visibilityOptions.map((opt) => { const Icon = opt.icon; return (<button key={opt.value} type="button" onClick={() => setPhotoVisibility(opt.value)} className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer text-left ${photoVisibility === opt.value ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}><Icon size={18} className={photoVisibility === opt.value ? 'text-blue-400' : 'text-gray-400'} /><div><p className="text-sm font-medium text-white">{opt.label}</p><p className="text-xs text-gray-400">{opt.desc}</p></div></button>)})}</div></div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"><Check size={16} /> {saving ? 'Saving...' : 'Save Profile'}</button>
            <button type="button" onClick={handleCancel} className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"><X size={16} /> Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfilePage