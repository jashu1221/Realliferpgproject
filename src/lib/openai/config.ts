import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Some features may be limited.');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || 'dummy-key',
  dangerouslyAllowBrowser: true
});

// Utility to check if OpenAI is properly configured
export const isOpenAIConfigured = () => {
  return !!OPENAI_API_KEY;
};

// Default response when API is not configured
export const getFallbackResponse = (feature: string) => ({
  content: `Sorry, I can't help with ${feature} right now. The OpenAI API key is not configured.`,
  category: 'insight' as const
});