import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, FileText, Pencil, Check, X, AlertCircle, Camera, Globe, Users, EyeOff, Crop } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ProfilePage() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
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
  const [cropMode, setCropMode] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
const [crop, setCrop] = useState({ unit: '%', width: 80, height: 80, x: 10, y: 10 });  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);

  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImgSrc(reader.result); setCropMode(true); };
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback((img) => { imgRef.current = img; }, []);

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgRef.current, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, canvas.width, canvas.height);
    return canvas;
  };

  const handleUploadCropped = async () => {
    const canvas = getCroppedImg();
    if (!canvas) return;
    setUploading(true);
    canvas.toBlob(async (blob) => {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.jpg');
        const res = await fetch('https://api.leadgateway.tech/api/upload/avatar', {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const avatarUrl = `https://api.leadgateway.tech${data.avatar}`;
        setAvatar(avatarUrl);
        const updatedUser = { ...storedUser, avatar: avatarUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCropMode(false);
        setImgSrc('');
      } catch (err) { setError(err.message); }
      finally { setUploading(false); }
    }, 'image/jpeg');
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
      const updatedUser = { ...storedUser, name: data.name, avatar, photoVisibility };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('bio', bio); localStorage.setItem('phone', phone);
      setMsg('Profile updated successfully'); setEditing(false);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    setName(storedUser.name || ''); setBio(localStorage.getItem('bio') || ''); setPhone(localStorage.getItem('phone') || '');
    setPhotoVisibility(storedUser.photoVisibility || 'everyone'); setEditing(false); setError(''); setMsg('');
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

      {cropMode && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">Crop Profile Photo</h3>
            <div className="flex justify-center">
  <div className="w-[300px] h-[300px] relative">
    <ReactCrop 
      crop={crop} 
      onChange={c => setCrop(c)} 
      onComplete={c => setCompletedCrop(c)} 
      circularCrop 
      aspect={1}
      className="w-full h-full"
    >
      <img 
        src={imgSrc} 
        onLoad={(e) => onImageLoad(e.target)} 
        alt="Crop" 
        className="max-w-full max-h-full object-contain"
        style={{ minWidth: '300px', minHeight: '300px' }}
      />
    </ReactCrop>
  </div>
</div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleUploadCropped} disabled={uploading} className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Crop size={16} /> {uploading ? 'Uploading...' : 'Save Photo'}
              </button>
              <button onClick={() => { setCropMode(false); setImgSrc(''); }} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <div className="relative inline-block">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gray-600" />
          ) : (
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <User size={40} className="text-white" />
            </div>
          )}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="absolute bottom-0 right-0 bg-gray-700 hover:bg-gray-600 p-1.5 rounded-full transition-colors cursor-pointer">
            <Camera size={14} className="text-white" />
          </button>
          <input type="file" ref={fileRef} onChange={onSelectFile} accept="image/jpeg,image/png,image/webp" className="hidden" />
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><User size={14} /> Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Mail size={14} /> Email</label>
            <input type="email" value={storedUser.email} disabled className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><Phone size={14} /> Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"><FileText size={14} /> Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" rows="3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Photo Visibility</label>
            <div className="space-y-2">
              {visibilityOptions.map((opt) => { const Icon = opt.icon; return (
                <button key={opt.value} type="button" onClick={() => setPhotoVisibility(opt.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer text-left ${photoVisibility === opt.value ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}>
                  <Icon size={18} className={photoVisibility === opt.value ? 'text-blue-400' : 'text-gray-400'} />
                  <div><p className="text-sm font-medium text-white">{opt.label}</p><p className="text-xs text-gray-400">{opt.desc}</p></div>
                </button>
              )})}
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2">
              <Check size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-700 hover:bg-gray-600 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProfilePage