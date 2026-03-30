import React, { useState, useEffect, useRef } from 'react';
import { authStore } from '../services/authService';
import { dataService, Profile, OperationType, handleDataError } from '../services/dataService';
import { User, Mail, Phone, Shield, Save, CheckCircle, Camera, X } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const [profile, setProfile] = useState<Partial<Profile>>({
    displayName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSizeError(null);
    if (file.size > 2 * 1024 * 1024) {
      setSizeError('ไฟล์ต้องไม่เกิน 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreviewUrl(dataUrl);
      setProfile(prev => ({ ...prev, photoURL: dataUrl }));
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setPreviewUrl(null);
    setUploadedFileName(null);
    setProfile(prev => ({ ...prev, photoURL: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (!authStore.currentUser) return;
    dataService.getProfile(authStore.currentUser.uid)
      .then(p => { if (p) setProfile(p); })
      .catch(e => handleDataError(e, OperationType.GET, 'profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authStore.currentUser) return;
    setSaving(true);
    setSuccess(false);
    const displayName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.displayName || '';
    try {
      await dataService.updateProfile(authStore.currentUser.uid, {
        displayName,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        photoURL: profile.photoURL,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleDataError(error, OperationType.UPDATE, 'profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-zinc-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm">
        <div className="relative group flex-shrink-0">
          <img 
            src={previewUrl || profile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent((profile.firstName || profile.displayName || 'User') + (profile.lastName ? '+' + profile.lastName : ''))}&background=10b981&color=fff&bold=true`} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-zinc-50"
            referrerPolicy="no-referrer"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Camera className="w-5 h-5 text-white" />
            <span className="text-white text-[10px] font-bold mt-0.5">เปลี่ยนรูป</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-zinc-900">
            {(profile.firstName || profile.lastName)
              ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
              : (profile.displayName || 'Your Profile')}
          </h3>
          <p className="text-zinc-500 text-sm">{profile.email}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            <Shield className="w-3 h-3" />
            Verified Account
          </div>
          {uploadedFileName ? (
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 rounded-xl px-3 py-1.5 w-fit max-w-xs">
              <Camera className="w-3 h-3 flex-shrink-0 text-emerald-500" />
              <span className="truncate">{uploadedFileName}</span>
              <button type="button" onClick={handleClearPhoto} className="ml-1 text-zinc-400 hover:text-rose-500 transition-colors flex-shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 text-xs font-semibold text-emerald-600 hover:underline"
            >
              อัปโหลดรูปโปรไฟล์
            </button>
          )}
          {sizeError && <p className="mt-1 text-xs text-rose-500 font-medium">{sizeError}</p>}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" />
              ชื่อจริง
            </label>
            <input 
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              placeholder="ชื่อจริง"
              value={profile.firstName || ''}
              onChange={e => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" />
              นามสกุล
            </label>
            <input 
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              placeholder="นามสกุล"
              value={profile.lastName || ''}
              onChange={e => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" />
              Email Address
            </label>
            <input 
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed"
              value={profile.email}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400" />
              Phone Number
            </label>
            <input 
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all"
              placeholder="+1 (555) 000-0000"
              value={profile.phoneNumber}
              onChange={e => setProfile({ ...profile, phoneNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
              <Camera className="w-4 h-4 text-zinc-400" />
              รูปโปรไฟล์
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-zinc-200 hover:border-emerald-400 hover:bg-emerald-50/40 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-zinc-100">
                <img
                  src={previewUrl || profile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent((profile.firstName || profile.displayName || 'U') + (profile.lastName ? '+' + profile.lastName : ''))}&background=10b981&color=fff&bold=true`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                {uploadedFileName ? (
                  <p className="text-sm font-semibold text-zinc-800 truncate">{uploadedFileName}</p>
                ) : (
                  <p className="text-sm text-zinc-400 group-hover:text-emerald-600 transition-colors">คลิกเพื่อเลือกไฟล์ภาพ</p>
                )}
                <p className="text-xs text-zinc-400">PNG, JPG, WEBP — ไม่เกิน 2 MB</p>
              </div>
              <Camera className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
            </div>
            {sizeError && <p className="text-xs text-rose-500 font-medium">{sizeError}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
          {success && (
            <div className="flex items-center gap-2 text-emerald-600 font-medium animate-in fade-in slide-in-from-left-2">
              <CheckCircle className="w-5 h-5" />
              Profile updated successfully
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
