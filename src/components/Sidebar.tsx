import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Brain, Crown, Eye, EyeOff, LogOut
} from 'lucide-react';
import { useTopSections } from '../contexts/TopSectionsContext';
import { useFocusMode } from '../contexts/FocusModeContext';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { label: 'Dashboard', icon: Home, path: '/dashboard' },
  { label: 'Motivation', icon: Brain, path: '/motivation' },
  { label: 'Power Ranks', icon: Crown, path: '/power-ranks' },
];

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isTopSectionsVisible, toggleTopSections } = useTopSections();
  const { isFocusMode, toggleFocusMode } = useFocusMode();
  const { signOut, userProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#1A1B23]/95 backdrop-blur-lg border-r 
        border-[#2A2B35]/50 transition-all duration-300 z-50 flex flex-col ${
        isExpanded ? 'w-64' : 'w-[68px]'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className={`h-[68px] border-b border-[#2A2B35]/50 flex items-center ${
        isExpanded ? 'px-5' : 'px-[14px]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] 
            flex items-center justify-center relative overflow-hidden shadow-lg shadow-indigo-500/20
            transition-all duration-300 ${isExpanded ? 'w-9 h-9' : 'w-10 h-10'}`}>
            <span className={`text-white font-bold relative z-10 transition-all duration-300 ${
              isExpanded ? 'text-base' : 'text-lg'
            }`}>L</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div 
              className="absolute inset-0 w-full h-full animate-shine"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
                transform: 'skewX(-20deg)',
              }}
            />
          </div>
          <h1 className={`text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text 
            text-transparent transition-all duration-300 origin-left whitespace-nowrap ${
            isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}>
            Life Quest
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex-1 py-3 ${isExpanded ? 'px-3' : 'px-[14px]'} space-y-1 overflow-y-auto`}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button 
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 transition-all duration-200
                group relative ${isExpanded ? 'px-3 py-2.5' : 'p-2.5'} rounded-xl ${
                isActive 
                  ? 'bg-[#4F46E5]/10 text-[#4F46E5]' 
                  : 'text-gray-400 hover:bg-[#2A2B35]/50 hover:text-gray-200'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 
                  bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded-r-full transition-opacity
                  duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} 
                />
              )}

              <div className={`rounded-xl flex items-center justify-center transition-all 
                duration-200 ${isExpanded ? 'w-9 h-9' : 'w-10 h-10'} ${
                isActive 
                  ? 'bg-[#4F46E5]/10' 
                  : 'bg-transparent group-hover:bg-[#2A2B35]/50'
              }`}>
                <item.icon className={`transition-all duration-200 ${
                  isExpanded ? 'w-[18px] h-[18px]' : 'w-5 h-5'
                } ${
                  isActive ? 'text-[#4F46E5]' : 'text-gray-400 group-hover:text-gray-200'
                }`} />
              </div>

              <span className={`text-sm font-medium transition-all duration-300 origin-left
                whitespace-nowrap ${
                isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}>
                {item.label}
              </span>

              {/* Hover Indicator */}
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-200
                opacity-0 group-hover:opacity-100 pointer-events-none ${
                isActive ? 'bg-[#4F46E5]/5' : 'bg-[#2A2B35]/20'
              }`} />
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#2A2B35]/50">
        {/* Toggle Buttons */}
        <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-1 p-2 px-4">
            {/* Focus Mode Toggle */}
            <button 
              onClick={toggleFocusMode}
              className={`flex-1 rounded-lg transition-all duration-200 p-2.5
                ${isFocusMode 
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                  : 'text-gray-400 hover:bg-[#2A2B35]/50 hover:text-gray-300'
                }`}
            >
              {isFocusMode ? (
                <EyeOff className="w-5 h-5 mx-auto" />
              ) : (
                <Eye className="w-5 h-5 mx-auto" />
              )}
            </button>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className={`p-4 ${isExpanded ? '' : 'p-[14px]'} space-y-2`}>
          <div className={`flex items-center gap-3 transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] 
              flex items-center justify-center text-sm font-bold relative overflow-hidden
              shadow-lg shadow-indigo-500/20">
              <span className="relative text-white">{userProfile?.name?.[0] || 'U'}</span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div 
                className="absolute inset-0 w-full h-full animate-shine"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
                  transform: 'skewX(-20deg)',
                }}
              />
            </div>
            <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-sm font-medium text-white">{userProfile?.name || 'User'}</div>
              <div className="text-xs text-gray-400">Level {userProfile?.level || 1}</div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-red-400 
              hover:bg-red-500/10 transition-all group ${isExpanded ? 'justify-start' : 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            <span className={`text-sm font-medium transition-all duration-300 ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              Sign Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}