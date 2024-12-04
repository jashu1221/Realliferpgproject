import React, { useState } from 'react';
import { AlertCircle, MessageSquare, Zap, Brain, Target, Save } from 'lucide-react';
import { useMotivation } from '../../hooks/useMotivation';

export function SettingsContent() {
  const { settings, updateMotivationSettings, loading } = useMotivation();
  const [localSettings, setLocalSettings] = useState({
    style: settings.style,
    rudenessLevel: settings.rudenessLevel,
    flexibility: settings.flexibility,
    systemInstructions: settings.systemInstructions || ''
  });

  const handleSave = async () => {
    await updateMotivationSettings(localSettings);
  };

  return (
    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-6 space-y-6">
      {/* System Instructions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#4F46E5]" />
          System Instructions
        </h3>
        <div className="relative">
          <textarea
            value={localSettings.systemInstructions}
            onChange={(e) => setLocalSettings(prev => ({ 
              ...prev, 
              systemInstructions: e.target.value 
            }))}
            placeholder="Tell the system about your goals, challenges, or how you want it to interact with you. Share your story, failures, or anything that will help the system understand and motivate you better..."
            rows={6}
            className="w-full bg-[#2A2B35]/30 border border-[#2A2B35]/50 rounded-lg px-4 py-3
              text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#4F46E5]/50
              resize-none"
          />
        </div>
      </section>

      {/* Motivation Style */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Motivation Style</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              id: 'intense',
              name: 'Intense',
              description: 'No excuses, maximum pressure',
              icon: Zap
            },
            {
              id: 'balanced',
              name: 'Balanced',
              description: 'Mix of tough love and support',
              icon: Brain
            },
            {
              id: 'supportive',
              name: 'Supportive',
              description: 'Encouraging and understanding',
              icon: Target
            }
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setLocalSettings(prev => ({ ...prev, style: style.id as any }))}
              className={`p-4 rounded-lg border transition-all text-left ${
                localSettings.style === style.id
                  ? 'bg-[#4F46E5]/10 border-[#4F46E5]/30 text-[#4F46E5]'
                  : 'bg-[#2A2B35]/30 border-[#2A2B35]/50 text-gray-400 hover:border-[#4F46E5]/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <style.icon className="w-5 h-5" />
                <span className="font-medium">{style.name}</span>
              </div>
              <p className="text-xs text-gray-400">{style.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* System Personality */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-white">System Personality</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rudeness Level</span>
              <span className="text-[#4F46E5]">{localSettings.rudenessLevel}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={localSettings.rudenessLevel}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                rudenessLevel: parseInt(e.target.value) 
              }))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Higher levels result in more aggressive feedback
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">System Flexibility</span>
              <span className="text-[#4F46E5]">{localSettings.flexibility}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={localSettings.flexibility}
              onChange={(e) => setLocalSettings(prev => ({ 
                ...prev, 
                flexibility: parseInt(e.target.value) 
              }))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Determines how easily the system accepts excuses
            </p>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] 
          hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-medium transition-all
          flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-4 h-4" />
        {loading ? 'Saving...' : 'Save Configuration'}
      </button>
    </div>
  );
}