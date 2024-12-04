export const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.warn('ElevenLabs API key not found. Voice features will be limited.');
}

export const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel - Female voice

export const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export const defaultVoiceSettings = {
  stability: 0.71,
  similarity_boost: 0.75,
  style: 0,
  use_speaker_boost: true
};

// Utility to check if ElevenLabs is properly configured
export const isElevenLabsConfigured = () => {
  return !!ELEVENLABS_API_KEY;
};

// Default response when API is not configured
export const getFallbackVoice = () => {
  const utterance = new SpeechSynthesisUtterance();
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Get available voices and select a good English voice
  const voices = speechSynthesis.getVoices();
  const englishVoice = voices.find(
    voice => voice.lang.startsWith('en-') && voice.name.includes('Google')
  ) || voices[0];
  
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  return utterance;
};