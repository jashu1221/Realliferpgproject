import React from 'react';
import { Star } from 'lucide-react';

export function MainQuest() {
  return (
    <div className="border border-gray-200 rounded p-6">
      <div className="space-y-4">
        <h2 className="text-xl">Work on side hustle for 1 hour everyday</h2>
        <p className="text-gray-600">
          Choose something that you want to work on to levelup and work on it for 30 days
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>800 XP</span>
            <span className="text-gray-600">1.2x</span>
          </div>
          <div className="text-gray-600">Expires in 10 days</div>
        </div>
      </div>
    </div>
  );
}