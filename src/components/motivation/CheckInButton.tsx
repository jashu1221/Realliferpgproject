import React from 'react';
import { ClipboardCheck, Loader } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';

interface CheckInButtonProps {
  onCheckIn: (stats: ReturnType<typeof useProgress>) => void;
  isProcessing: boolean;
}

export function CheckInButton({ onCheckIn, isProcessing }: CheckInButtonProps) {
  const stats = useProgress();

  return (
    <button
      onClick={() => onCheckIn(stats)}
      disabled={isProcessing}
      className="px-4 py-2 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5] 
        hover:bg-[#4F46E5]/20 transition-all flex items-center gap-2
        border border-[#4F46E5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <ClipboardCheck className="w-4 h-4" />
      )}
      Daily Check-in
    </button>
  );
}