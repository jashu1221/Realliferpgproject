import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle, Save } from 'lucide-react';

interface FocusHeaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

export function FocusHeader({ onImageUpload, currentImage }: FocusHeaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      setIsProcessing(false);
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('Image size should be less than 20MB');
      setIsProcessing(false);
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setError('Error processing image');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error processing image');
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (tempImage) {
      onImageUpload(tempImage);
      setTempImage(null);
    }
  };

  const handleCancel = () => {
    setTempImage(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Main Content */}
      {!currentImage && !tempImage ? (
        <div className="relative w-full bg-[#1A1B23]/95 border-b border-[#2A2B35]/50">
          <div className="container mx-auto py-12 px-8">
            {/* Upload Area */}
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative w-full h-[500px] rounded-2xl border-[3px] border-dashed 
                transition-all duration-300 cursor-pointer overflow-hidden group ${
                isDragging
                  ? 'border-[#4F46E5] bg-[#4F46E5]/5'
                  : 'border-[#2A2B35]/50 hover:border-[#4F46E5]/50 bg-[#2A2B35]/20'
              }`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #2A2B35 25%, transparent 25%, transparent 75%, #2A2B35 75%, #2A2B35), linear-gradient(45deg, #2A2B35 25%, transparent 25%, transparent 75%, #2A2B35 75%, #2A2B35)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                  }}
                />
              </div>

              {/* Inner Border */}
              <div className={`absolute inset-3 rounded-xl border-2 transition-all duration-300 ${
                isDragging
                  ? 'border-[#4F46E5]/30'
                  : 'border-[#2A2B35]/30 group-hover:border-[#4F46E5]/30'
              }`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br transition-all duration-300
                  flex items-center justify-center ${
                  isDragging
                    ? 'from-[#4F46E5]/20 to-[#7C3AED]/20 border border-[#4F46E5]/30'
                    : 'from-[#2A2B35]/20 to-[#2A2B35]/10 border border-[#2A2B35]/30 group-hover:from-[#4F46E5]/10 group-hover:to-[#7C3AED]/10'
                }`}>
                  <Upload className={`w-10 h-10 transition-all duration-300 ${
                    isDragging ? 'text-[#4F46E5]' : 'text-gray-400 group-hover:text-[#4F46E5]'
                  }`} />
                </div>

                <div className="text-center max-w-md">
                  <h3 className={`text-2xl font-medium mb-3 transition-all duration-300 ${
                    isDragging ? 'text-[#4F46E5]' : 'text-white group-hover:text-[#4F46E5]'
                  }`}>
                    {isDragging ? 'Drop to Upload' : 'Upload Focus Image'}
                  </h3>
                  <p className="text-base text-gray-400 mb-2">
                    {isProcessing ? 'Processing image...' : 'Drag and drop your image here or click to browse'}
                  </p>
                  <p className="text-sm text-gray-500">Supports large images up to 20MB</p>
                </div>

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          {/* Image Container */}
          <div className="relative w-full h-[500px] overflow-hidden rounded-b-2xl border-x-2 border-b-2 border-[#2A2B35]/50">
            {/* Image */}
            <div className="absolute inset-0">
              <img 
                src={tempImage || currentImage} 
                alt="Focus" 
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Controls Overlay */}
            <div className="absolute top-6 right-6 flex items-center gap-3">
              {tempImage && (
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-[#4F46E5] text-white 
                    hover:bg-[#4338CA] transition-all flex items-center gap-2
                    shadow-lg shadow-[#4F46E5]/20 border border-[#4F46E5]/50"
                >
                  <Save className="w-4 h-4" />
                  Apply Image
                </button>
              )}
              <button
                onClick={tempImage ? handleCancel : () => onImageUpload('')}
                className="p-2.5 rounded-xl bg-black/50 hover:bg-black/70 text-white 
                  transition-colors backdrop-blur-sm border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload New Button */}
            <label className="absolute bottom-6 right-6 px-6 py-2.5 rounded-xl 
              bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm
              cursor-pointer flex items-center gap-2 border border-white/10">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">Change Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-red-500/10 border-t 
          border-red-500/20 backdrop-blur-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}
    </div>
  );
}