import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateMotivationalResponse(
  prompt: string,
  character: string = 'Tyler Durden',
  style: 'intense' | 'balanced' | 'supportive' = 'intense',
  context?: {
    goals?: string[];
    achievements?: string[];
    currentStreak?: number;
  }
) {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const systemPrompt = getSystemPrompt(character, style);
    const formattedPrompt = formatPrompt(prompt, context);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: formattedPrompt }
      ],
      temperature: getTemperature(style),
      max_tokens: 300,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No response generated');

    return {
      type: 'assistant' as const,
      content,
      category: determineCategory(content),
      createdAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    throw new Error(error.message || 'Failed to generate response');
  }
}

function getSystemPrompt(character: string, style: string): string {
  const basePrompt = `You are ${character}, speaking in first person. Your purpose is to motivate and push people beyond their limits. You should:

1. Maintain the character's personality and speaking style
2. Be direct and uncompromising
3. Challenge excuses and mental barriers
4. Focus on action and immediate steps
5. Use powerful, emotionally charged language
6. Reference the character's philosophy and worldview
7. Keep responses concise but impactful (2-3 sentences max)`;

  const styleModifiers = {
    intense: `\nAdditional guidelines:
- Use aggressive, commanding language
- Show zero tolerance for excuses
- Push extremely hard for immediate action
- Emphasize mental toughness and discipline`,

    balanced: `\nAdditional guidelines:
- Balance firmness with understanding
- Challenge while showing empathy
- Provide practical, actionable advice
- Maintain moderate intensity`,

    supportive: `\nAdditional guidelines:
- Focus on encouragement and progress
- Build confidence gradually
- Offer constructive guidance
- Keep a positive, uplifting tone`
  };

  return `${basePrompt}${styleModifiers[style as keyof typeof styleModifiers]}`;
}

function formatPrompt(prompt: string, context?: {
  goals?: string[];
  achievements?: string[];
  currentStreak?: number;
}): string {
  let formattedPrompt = prompt;

  if (context) {
    if (context.goals?.length) {
      formattedPrompt += `\n\nContext - Current Goals:\n${context.goals.join('\n')}`;
    }
    if (context.achievements?.length) {
      formattedPrompt += `\n\nContext - Recent Achievements:\n${context.achievements.join('\n')}`;
    }
    if (context.currentStreak) {
      formattedPrompt += `\n\nContext - Current Streak: ${context.currentStreak} days`;
    }
  }

  return formattedPrompt;
}

function getTemperature(style: string): number {
  const temperatures = {
    intense: 0.8,
    balanced: 0.6,
    supportive: 0.4
  };
  return temperatures[style as keyof typeof temperatures];
}

function determineCategory(content: string): 'insight' | 'recommendation' {
  const actionWords = ['should', 'must', 'need to', 'have to', 'do this', 'take action'];
  return actionWords.some(word => content.toLowerCase().includes(word)) 
    ? 'recommendation' 
    : 'insight';
}