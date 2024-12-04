import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Shield, ArrowLeft, Eye, EyeOff, Camera, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { uploadAvatar } from '../utils/avatar';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignupPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser, signUp } = useAuth();

  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

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
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Sign up user
      await signUp(formData.email, formData.password, formData.name);

      // Upload avatar if provided
      if (avatar && currentUser) {
        try {
          const avatarUrl = await uploadAvatar(currentUser.uid, avatar);
          if (avatarUrl) {
            // Update user profile with avatar URL
            await currentUser.updateProfile({
              photoURL: avatarUrl
            });
          }
        } catch (avatarError: any) {
          console.error('Avatar upload failed:', avatarError);
          // Show error but don't prevent account creation
          setError(`Account created but avatar upload failed: ${avatarError.message}`);
          // Wait a bit to show the error before redirecting
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
      }

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white flex">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/20 
              flex items-center justify-center border border-[#4F46E5]/20">
              <Shield className="w-6 h-6 text-[#4F46E5]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-sm text-gray-400">Begin your journey to greatness</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                {avatarPreview && (
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

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                  text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                  text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                    text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                    hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                    text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                  placeholder="Confirm your password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] 
                hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-medium transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0E] to-transparent z-10" />
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=3270&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
      </div>
    </div>
  );
}