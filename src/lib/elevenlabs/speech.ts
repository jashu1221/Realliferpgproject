import { 
  ELEVENLABS_API_KEY, 
  VOICE_ID, 
  ELEVENLABS_API_URL, 
  defaultVoiceSettings,
  isElevenLabsConfigured,
  getFallbackVoice 
} from './config';

export async function synthesizeSpeech(text: string): Promise<ArrayBuffer> {
  try {
    if (!isElevenLabsConfigured()) {
      return fallbackSpeech(text);
    }

    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: defaultVoiceSettings,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to synthesize speech');
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return fallbackSpeech(text);
  }
}

async function fallbackSpeech(text: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    try {
      const utterance = getFallbackVoice();
      utterance.text = text;
      
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

export async function playAudioBuffer(buffer: ArrayBuffer): Promise<void> {
  try {
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
    return new Promise((resolve) => {
      source.onended = () => resolve();
    });
  } catch (error) {
    console.error('Error playing audio buffer:', error);
    throw error;
  }
}

// Initialize speech synthesis voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener('voiceschanged', () => {
    speechSynthesis.getVoices();
  });
}