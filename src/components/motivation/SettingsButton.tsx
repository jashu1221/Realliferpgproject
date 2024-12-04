import React from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { SettingsContent } from './SettingsContent';

export function SettingsButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-lg bg-[#2A2B35]/50 text-gray-400 
          hover:text-white hover:bg-[#2A2B35] transition-all">
          <Settings className="w-5 h-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>System Settings</DialogTitle>
        </DialogHeader>
        <SettingsContent />
      </DialogContent>
    </Dialog>
  );
}