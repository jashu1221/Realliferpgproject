import { openai, isOpenAIConfigured, getFallbackResponse } from './config';
import type { MotivationSettings } from '../../types/motivation';

interface GenerateResponse {
  content: string;
  category: 'insight' | 'recommendation';
}

export async function generateMotivationalResponse(
  prompt: string,
  character: string = 'Tyler Durden',
  style: 'intense' | 'balanced' | 'supportive' = 'intense',
  context?: {
    goals?: string[];
    achievements?: string[];
    currentStreak?: number;
    dailyProgress?: {
      habits: { total: number; completed: number; percentage: number };
      dailies: { total: number; completed: number; percentage: number };
      todos: { total: number; completed: number; percentage: number };
      dailyProgress: number;
    };
    settings?: MotivationSettings;
  }
): Promise<GenerateResponse> {
  if (!isOpenAIConfigured()) {
    return getFallbackResponse('motivation features');
  }

  try {
    const systemPrompt = `You are ${character}, speaking in first person. Your purpose is to motivate and push people beyond their limits.
    
    Style: ${style.toUpperCase()}
    Rudeness Level: ${context?.settings?.rudenessLevel || 5}/10
    Flexibility: ${context?.settings?.flexibility || 5}/10
    
    ${context?.settings?.systemInstructions || ''}
    
    Guidelines:
    1. Maintain ${character}'s personality and speaking style
    2. Be ${style === 'intense' ? 'very direct and uncompromising' : 
          style === 'balanced' ? 'firm but understanding' : 'supportive and encouraging'}
    3. ${style === 'intense' ? 'Challenge excuses aggressively' :
          style === 'balanced' ? 'Address concerns constructively' : 'Build confidence gradually'}
    4. Focus on immediate action steps
    5. Use powerful, emotionally charged language
    6. Keep responses concise (2-3 sentences)
    7. Reference character's philosophy and worldview
    
    Current Context:
    - Streak: ${context?.currentStreak || 0} days
    ${context?.goals ? `- Goals: ${context.goals.join(', ')}` : ''}
    ${context?.achievements ? `- Achievements: ${context.achievements.join(', ')}` : ''}
    ${context?.dailyProgress ? `
    - Daily Progress: ${Math.round(context.dailyProgress.dailyProgress)}%
    - Habits: ${context.dailyProgress.habits.completed}/${context.dailyProgress.habits.total}
    - Dailies: ${context.dailyProgress.dailies.completed}/${context.dailyProgress.dailies.total}
    - Todos: ${context.dailyProgress.todos.completed}/${context.dailyProgress.todos.total}
    ` : ''}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: getTemperature(style),
      max_tokens: 300,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No response generated');

    return {
      content,
      category: determineCategory(content)
    };
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    return {
      content: 'I encountered an error processing your request. Please try again.',
      category: 'insight'
    };
  }
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