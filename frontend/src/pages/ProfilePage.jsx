import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, FileText, Pencil, Check, X, AlertCircle, Camera, Globe, Users, EyeOff, Maximize2, Crop } from 'lucide-react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  // Must use 'px', not '%'. Percent-based aspect-locked crops drift into
  // ovals during drag due to float rounding. Pixel units are literal
  // identical numbers, so the square never drifts.
  const side = Math.min(mediaWidth, mediaHeight) * 0.8;
  return centerCrop(
    makeAspectCrop({ unit: 'px', width: side }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [name, setName] = useState(storedUser.name || '');
  const [bio, setBio] = useState(localStorage.getItem('bio') || '');
  const [phone, setPhone] = useState(localStorage.getItem('phone') || '');
  const [avatar, setAvatar] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.avatar || '';
  });
  const [photoVisibility, setPhotoVisibility] = useState(storedUser.photoVisibility || 'everyone');
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // --- Crop modal state ---
  const [cropMode, setCropMode] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const fileRef = useRef(null);

  const updateLocalUser = (updates) => {
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...current, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    setStoredUser(updated);
    if (updates.avatar) setAvatar(updates.avatar);
  };

  // Step 1: user picks a file -> open crop modal, do NOT upload yet
  const onSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImgSrc(reader.result);
      setCrop(null);
      setCompletedCrop(null);
      setCropMode(true);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // allow re-selecting the same file again later
  };

  // Step 2: image element inside the crop modal has loaded -> set initial square crop
  const onImageLoad = useCallback((e) => {
    const img = e.target;
    imgRef.current = img;
    const { width, height } = img; // rendered size, not natural size
    const initialCrop = centerAspectCrop(width, height, 1);
    setCrop(initialCrop);
    setCompletedCrop(initialCrop);
  }, []);

  // Step 3: build a 400x400 cropped canvas from the current selection
  const getCroppedCanvas = () => {
    if (!completedCrop || !imgRef.current) return null;
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0, 400, 400
    );
    return canvas;
  };

  // Step 4: "Add Profile Pic" inside the crop modal -> upload the cropped square
  const handleUploadCropped = async () => {
    const canvas = getCroppedCanvas();
    if (!canvas) return;
    setUploading(true);
    canvas.toBlob(async (blob) => {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.jpg');
        const res = await fetch('https://api.leadgateway.tech/api/upload/avatar', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        updateLocalUser({ avatar: data.avatar }); // backend already returns a full URL
        setCropMode(false);
        setImgSrc('');
        setCrop(null);
        setCompletedCrop(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.92);
  };

  const handleCancelCrop = () => {
    setCropMode(false);
    setImgSrc('');
    setCrop(null);
    setCompletedCrop(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (!name || name.trim().length < 2) { setError('Name must be at least 2 characters'); return; }
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
      await fetch('https://api.leadgateway.tech/api/upload/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ photoVisibility }),
      });
      updateLocalUser({ name: data.name, photoVisibility });
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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setName(user.name || '');
    setBio(localStorage.getItem('bio') || '');
    setPhone(localStorage.getItem('phone') || '');
    setAvatar(user.avatar || '');
    setPhotoVisibility(user.photoVisibility || 'everyone');
    setEditing(false);
    setError('');
    setMsg('');
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

      {/* Crop Modal */}
      {cropMode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-white mb-4">Crop Profile Photo</h3>
            <div className="flex justify-center">
              {/* Gated on imgSrc, NOT on crop — crop only exists after onImageLoad fires,
                  and onImageLoad only fires if this img actually renders. Gating on crop
                  here would mean the img never mounts, onLoad never fires, crop stays
                  null forever, and the modal shows nothing. */}
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  circularCrop
                  aspect={1}
                  locked
                  ruleOfThirds
                >
                  <img
                    src={imgSrc}
                    onLoad={onImageLoad}
                    alt="Crop preview"
                    style={{ maxWidth: '100%', maxHeight: '70vh', display: 'block' }}
                  />
                </ReactCrop>
              )}
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">Drag the image to position it. The circle stays fixed.</p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleUploadCropped}
                disabled={uploading || !completedCrop}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Crop size={16} /> {uploading ? 'Uploading...' : 'Add Profile Pic'}
              </button>
              <button
                onClick={handleCancelCrop}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && avatar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"><X size={28} /></button>
          <img src={avatar} alt="Profile" className="max-w-[90vw] max-h-[90vh] rounded-2xl object-cover object-center" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 text-center">
        <div className="relative inline-block group">
          {avatar ? (
            <>
              <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover object-center mx-auto border-2 border-gray-600 cursor-pointer" onClick={() => setLightboxOpen(true)} />
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
        {uploading && !cropMode && <p className="text-xs text-gray-400 mt-2">Uploading...</p>}
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