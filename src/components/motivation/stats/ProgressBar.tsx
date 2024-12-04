import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: 'sm' | 'lg';
}

export function ProgressBar({
  value,
  max,
  label,
  color,
  size = 'sm',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        <span className="text-[#D89216]">
          {value}/{max}
        </span>
      </div>
      <div
        className={`relative bg-[#1A1B23] rounded-full overflow-hidden
        ${size === 'lg' ? 'h-3' : 'h-2'}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 relative
            bg-gradient-to-r ${color.replace(
              'text',
              'from'
            )}-500 to-${color.replace('text', '')}-600`}
          style={{ width: `${percentage}%` }}
        >
          <div
            className="absolute inset-0 w-full h-full animate-shine"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)',
              transform: 'skewX(-20deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
