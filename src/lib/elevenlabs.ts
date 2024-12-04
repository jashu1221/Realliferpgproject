import { Voice, VoiceSettings } from '@elevenlabs/node';

const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel - Female voice

// Preload notification sound
const notificationSound = new Audio('/notification.mp3');
notificationSound.load();

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  try {
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('ElevenLabs API key is missing');
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.71,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          } as VoiceSettings,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to synthesize speech');
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    // Fallback to browser speech synthesis
    return fallbackSpeech(text);
  }
}

async function fallbackSpeech(text: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
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

      speechSynthesis.speak(utterance);
      
      // Create a simple beep sound as ArrayBuffer
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.1;
      
      const startTime = audioContext.currentTime;
      const duration = 0.1;
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
      
      // Return the buffer after the duration
      setTimeout(() => {
        const buffer = audioContext.createBuffer(1, 44100 * duration, 44100);
        resolve(buffer.getChannelData(0).buffer);
      }, duration * 1000);
    } catch (error) {
      reject(error);
    }
  });
}

export async function playAudioBuffer(buffer: ArrayBuffer) {
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    return new Promise((resolve) => {
      source.onended = resolve;
    });
  } catch (error) {
    console.error('Error playing audio buffer:', error);
    // Fallback to notification sound
    try {
      await notificationSound.play();
      return new Promise((resolve) => {
        notificationSound.onended = resolve;
      });
    } catch (fallbackError) {
      console.error('Error playing fallback notification:', fallbackError);
    }
  }
}

// Initialize speech synthesis voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener('voiceschanged', () => {
    speechSynthesis.getVoices();
  });
}