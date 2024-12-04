import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Shield, Crown, Star, Target, Camera, 
  X, Save, Edit2, Eye, EyeOff, AlertCircle, Check 
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { uploadAvatar } from '../../utils/avatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.photoURL || null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    alterEgo: userProfile?.alter_ego || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(currentUser?.photoURL || null);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      if (!currentUser) throw new Error('No user found');

      // Upload avatar if changed
      let photoURL = currentUser.photoURL;
      if (avatar) {
        photoURL = await uploadAvatar(currentUser.uid, avatar);
      }

      // Update profile data
      await updateUserProfile({
        name: form.name.trim() || currentUser.displayName || '',
        alter_ego: form.alterEgo.trim() || null,
        photoURL,
      });

      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Profile Settings</DialogTitle>
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 
                flex items-center justify-center border border-[#4F46E5]/20">
                <User className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                <p className="text-sm text-gray-400">Update your personal information</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-[#2A2B35]/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'profile'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'security'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Security
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400 flex items-center gap-2">
              <Check className="w-4 h-4" />
              {success}
            </div>
          )}

          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full overflow-hidden border-2 
                    ${avatarPreview ? 'border-[#4F46E5]' : 'border-[#2A2B35]/50'}`}>
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#2A2B35]/30 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {avatarPreview && avatarPreview !== currentUser?.photoURL && (
                    <button
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500/20 
                        text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-[#4F46E5] 
                      text-white cursor-pointer hover:bg-[#4338CA] transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>
                <p className="text-xs text-gray-400">Upload your avatar (optional)</p>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email (required)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                      text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                    required
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Display Name (optional)</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                      text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                    placeholder="How should we call you?"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-400">Alter Ego (optional)</label>
                  <input
                    type="text"
                    value={form.alterEgo}
                    onChange={(e) => setForm({ ...form, alterEgo: e.target.value })}
                    className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                      text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                    placeholder="Your character's name"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] 
                    transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Security Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-gray-400">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={form.currentPassword}
                      onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                      className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                        text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                        hover:text-gray-300 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                        text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                        hover:text-gray-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                        text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                        hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-[#4F46E5] text-white hover:bg-[#4338CA] 
                    transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}