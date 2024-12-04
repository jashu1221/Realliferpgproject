import React, { useEffect } from 'react';
import { UserProfile } from '../components/UserProfile';
import { DailyProgress } from '../components/DailyProgress';
import { ActiveQuests } from '../components/ActiveQuests';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { TasksPanel } from '../components/TasksPanel';
import { useTopSections } from '../contexts/TopSectionsContext';
import { useAuth } from '../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setProfile } from '../store/slices/profileSlice';

export function Home() {
  const { isTopSectionsVisible } = useTopSections();
  const { currentUser, userProfile } = useAuth();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.profile);

  useEffect(() => {
    if (userProfile) {
      dispatch(setProfile(userProfile));
    }
  }, [userProfile, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400">Error loading profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Top Sections */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4
        transition-all duration-300 ease-in-out ${
        isTopSectionsVisible 
          ? 'opacity-100 translate-y-0 max-h-[800px]' 
          : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
      }`}>
        <div className="sm:col-span-2 xl:col-span-1">
          <UserProfile />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <DailyProgress />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <ActiveQuests />
        </div>
        <div className="sm:col-span-2 xl:col-span-1">
          <VoiceAssistant />
        </div>
      </div>

      {/* Tasks Panel */}
      <TasksPanel />
    </div>
  );
}