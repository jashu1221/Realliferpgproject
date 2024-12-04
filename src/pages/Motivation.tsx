import React from 'react';
import { MotivationChat } from '../components/motivation/MotivationChat';
import { CharacterPanel } from '../components/motivation/CharacterPanel';
import { MotivationStats } from '../components/motivation/MotivationStats';
import { SettingsButton } from '../components/motivation/SettingsButton';

export function Motivation() {
  return (
    <div className="flex gap-6 p-6 min-h-screen">
      {/* Main Chat Section (2/3) */}
      <div className="flex-[2] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 
            bg-clip-text text-transparent"
          >
            System Motivation
          </h1>
          <SettingsButton />
        </div>
        <MotivationChat />
      </div>

      {/* Right Panel (1/3) */}
      <div className="flex-1 space-y-6">
        <CharacterPanel />
        <MotivationStats />
      </div>
    </div>
  );
}
