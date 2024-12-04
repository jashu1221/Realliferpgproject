import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { currentUser, login, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google');
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
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-sm text-gray-400">Continue your journey</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-400">Password</label>
                <Link to="/forgot-password" className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
                    text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50"
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] 
                hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-medium transition-all
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2B35]/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0A0B0E] text-gray-400">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full px-8 py-4 rounded-xl bg-[#2A2B35]/30 border border-[#2A2B35]/50
                hover:bg-[#2A2B35]/50 text-white font-medium transition-all flex items-center 
                justify-center gap-2"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Google
            </button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                Create account
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
            backgroundImage: `url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3270&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
      </div>
    </div>
  );
}