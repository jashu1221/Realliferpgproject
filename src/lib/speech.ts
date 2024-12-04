export function useSpeech() {
  const synth = window.speechSynthesis;

  const speak = (text: string) => {
    return new Promise((resolve, reject) => {
      if (!synth) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings
      utterance.rate = 1.0; // Normal speed
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume

      // Get available voices and select a good English voice
      const voices = synth.getVoices();
      const englishVoice = voices.find(
        voice => voice.lang.startsWith('en-') && voice.name.includes('Google')
      ) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      // Event handlers
      utterance.onend = () => resolve(undefined);
      utterance.onerror = (event) => reject(event);

      // Speak the text
      synth.speak(utterance);
    });
  };

  return { speak };
}