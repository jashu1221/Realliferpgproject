import { openai } from './config';
import type { Quest } from '../../types/quest';

export interface GeneratedQuest {
  title: string;
  description: string;
  difficulty: 'S' | 'A' | 'B' | 'C' | 'D' | 'E';
  xp: number;
  daysLeft: number;
  type: 'daily' | 'habit';
}

const DEFAULT_QUESTS: GeneratedQuest[] = [
  {
    title: "Master a New Skill",
    description: "Dedicate 30 minutes daily to learning a new professional skill",
    difficulty: 'B',
    xp: 300,
    daysLeft: 7,
    type: 'daily'
  },
  {
    title: "Physical Excellence",
    description: "Complete your workout routine with perfect form",
    difficulty: 'C',
    xp: 200,
    daysLeft: 1,
    type: 'daily'
  },
  {
    title: "Knowledge Seeker",
    description: "Read or listen to educational content for 20 minutes",
    difficulty: 'D',
    xp: 150,
    daysLeft: 3,
    type: 'habit'
  },
  {
    title: "Productivity Master",
    description: "Complete all daily tasks before sunset",
    difficulty: 'A',
    xp: 500,
    daysLeft: 1,
    type: 'daily'
  }
];

export async function generateQuests(context?: {
  level?: number;
  interests?: string[];
  goals?: string[];
}): Promise<GeneratedQuest[]> {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.log('Using default quests due to missing API key');
      return DEFAULT_QUESTS;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a quest generator for a real-life RPG system. Generate 4 unique quests that are:
            1. Realistic and achievable
            2. Focused on personal development
            3. Measurable and time-bound
            4. Varied in difficulty (S, A, B, C, D, E ranks)
            
            Each quest should have:
            - A compelling title
            - A brief description
            - Difficulty rank
            - XP reward (100-1000)
            - Days to complete (1-30)
            - Type (daily or habit)
            
            Format as JSON array.
            ${context ? `Consider user context:
              Level: ${context.level}
              Interests: ${context.interests?.join(', ')}
              Goals: ${context.goals?.join(', ')}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0].message.content) {
      console.log('No response from OpenAI, using default quests');
      return DEFAULT_QUESTS;
    }

    const response = JSON.parse(completion.choices[0].message.content);
    return response.quests || DEFAULT_QUESTS;
  } catch (error: any) {
    console.error('Error generating quests:', error);
    // Return default quests as fallback
    return DEFAULT_QUESTS;
  }
}