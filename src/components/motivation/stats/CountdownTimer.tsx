import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#1A1B23]/95 border border-[#2A2B35]/50 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#2C061F]/20 flex items-center justify-center
          border border-[#2C061F]/30">
          <Clock className="w-5 h-5 text-[#D89216]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Time Remaining</h3>
          <p className="text-sm text-gray-400">Until daily reset</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' }
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="bg-[#2A2B35]/30 rounded-lg p-4 border border-[#2A2B35]/50
              relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2C061F]/10 to-[#D89216]/10 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#2C061F] to-[#D89216]
                  bg-clip-text text-transparent">{value.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}