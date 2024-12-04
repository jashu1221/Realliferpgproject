import { openai } from './config';
import type { AssistantContext } from '../../hooks/useVoiceAssistant';

export async function generateAssistantResponse(
  input: string,
  context: AssistantContext
) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional AI assistant helping ${context.userName} (Level ${context.level}) 
          manage their tasks and progress. You have access to their current stats:
          - ${context.stats.habits} total habits (${context.stats.activeHabits} active)
          - ${context.stats.dailies} dailies (${context.stats.completedDailies} completed)
          - ${context.stats.todos} todos (${context.stats.pendingTodos} pending)
          - ${context.coins} coins earned

          Keep responses vey concise and to the point, professional, and focused on productivity.
          Use their name and reference their level/progress when appropriate.
          Maintain an encouraging but professional tone.
          
          When responding to status/progress requests:
          1. Focus on providing current stats and achievements
          2. Highlight completion rates and streaks
          3. Offer brief, encouraging feedback
          4. Keep responses under 2-3 sentences
          
          When creating tasks:
          1. Extract clear titles from vague descriptions
          2. Generate detailed but concise descriptions
          3. Infer appropriate task types based on patterns
          4. Set reasonable priorities and durations
          5. Add relevant tags automatically
          6. Break down complex requests into manageable tasks`
        },
        { role: 'user', content: input },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return (
      completion.choices[0].message.content ||
      "I couldn't process that request."
    );
  } catch (error) {
    console.error('Error generating assistant response:', error);
    return 'I encountered an error processing your request. Please try again.';
  }
}

export async function parseCommand(input: string): Promise<{
  type:
    | 'create_habit'
    | 'create_daily'
    | 'create_todo'
    | 'status'
    | 'list'
    | 'conversation';
  data: {
    title?: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    days?: string[];
    dueDate?: string;
    type?: string;
  };
}> {
  try {
    const lowerInput = input.toLowerCase();

    // First check for status/progress requests
    if (isProgressRequest(lowerInput)) {
      return { type: 'status', data: {} };
    }

    // Then check for list requests
    if (isListRequest(lowerInput)) {
      if (lowerInput.includes('habit'))
        return { type: 'list', data: { type: 'habits' } };
      if (lowerInput.includes('daily') || lowerInput.includes('dailies'))
        return { type: 'list', data: { type: 'dailies' } };
      if (lowerInput.includes('todo') || lowerInput.includes('task'))
        return { type: 'list', data: { type: 'todos' } };
      return { type: 'list', data: { type: 'all' } };
    }

    // Determine task type first
    const taskType = determineTaskType(lowerInput);
    
    // Generate title and description based on task type
    let title = '';
    let description = '';

    try {
      const titlePrompt = getTitlePrompt(taskType);
      const titleResponse = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: titlePrompt
          },
          { role: 'user', content: input }
        ],
        temperature: 0.3,
        max_tokens: 50
      });

      title = titleResponse.choices[0].message.content?.trim() || '';

      if (title) {
        const descPrompt = getDescriptionPrompt(taskType, title);
        const descResponse = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: descPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 50
        });

        description = descResponse.choices[0].message.content?.trim() || '';
      }
    } catch (error) {
      console.error('Error getting title/description from OpenAI:', error);
      title = extractBasicTitle(input);
      description = generateBasicDescription(title);
    }

    // Return appropriate command type with data
    switch (taskType) {
      case 'habit':
        return {
          type: 'create_habit',
          data: {
            title,
            description,
            priority: inferPriority(input),
          },
        };
      case 'daily':
        return {
          type: 'create_daily',
          data: {
            title,
            description,
            priority: inferPriority(input),
            days: inferDays(input),
          },
        };
      case 'todo':
        return {
          type: 'create_todo',
          data: {
            title,
            description,
            priority: inferPriority(input),
            dueDate: inferDueDate(input),
          },
        };
      default:
        return { type: 'conversation', data: {} };
    }
  } catch (error) {
    console.error('Error parsing command:', error);
    return { type: 'conversation', data: {} };
  }
}

function getTitlePrompt(taskType: 'habit' | 'daily' | 'todo' | 'unknown'): string {
  const basePrompt = `Create a clear, concise title (2-4 words) that captures the essence of the task. Rules:
    1. Start with an action verb
    2. Be specific and descriptive
    3. Use proper capitalization
    4. No articles (a, an, the) at start
    5. No unnecessary words`;

  const examples = {
    habit: `Examples:
      "need to exercise" → "Daily Exercise"
      "want to read more" → "Book Reading"
      "should practice guitar" → "Guitar Practice"
      "meditate daily" → "Morning Meditation"`,
    daily: `Examples:
      "check emails" → "Email Management"
      "review tasks" → "Task Review"
      "team standup" → "Team Meeting"
      "plan tomorrow" → "Daily Planning"`,
    todo: `Examples:
      "buy groceries" → "Grocery Shopping"
      "finish report" → "Project Report"
      "call client" → "Client Call"
      "send invoice" → "Invoice Submission"`
  };

  return `${basePrompt}\n\n${examples[taskType] || examples.todo}`;
}

function getDescriptionPrompt(taskType: 'habit' | 'daily' | 'todo' | 'unknown', title: string): string {
  const basePrompt = `Create a clear, actionable description for "${title}". Rules:
    1. One concise sentence
    2. Focus on specific actions or goals
    3. Include measurable elements when possible
    4. Be motivating but professional
    5. No fluff or filler words`;

  const examples = {
    habit: `Examples:
      Complete 30 minutes of structured physical activity
      Read 20 pages of current book
      Practice mindfulness meditation for 10 minutes`,
    daily: `Examples:
      Process inbox and respond to priority messages
     Review and update project tasks and deadlines
     Plan key objectives and schedule for tomorrow`,
    todo: `Examples:
      Purchase items from weekly meal plan list
     Complete quarterly performance analysis report
     Discuss project milestones and next steps`
  };

  return `${basePrompt}\n\n${examples[taskType] || examples.todo}`;
}

function determineTaskType(input: string): 'habit' | 'daily' | 'todo' | 'unknown' {
  if (isFitnessRelated(input) || isHabitRequest(input)) return 'habit';
  if (isDailyRequest(input)) return 'daily';
  if (isTodoRequest(input)) return 'todo';
  return 'unknown';
}

function isProgressRequest(input: string): boolean {
  const progressKeywords = [
    'progress',
    'status',
    'how am i doing',
    'how\'s my progress',
    'show my progress',
    'show progress',
    'check progress',
    'view progress',
    'see progress',
    'tell me my progress',
    'tell me about my progress',
    'what\'s my progress',
    'what is my progress',
    'stats',
    'statistics',
    'overview',
    'summary'
  ];
  return progressKeywords.some(keyword => input.includes(keyword));
}

function isListRequest(input: string): boolean {
  const listKeywords = [
    'show',
    'list',
    'what are my',
    'view',
    'see',
    'display',
    'show me',
    'tell me about'
  ];
  return listKeywords.some(keyword => input.includes(keyword));
}

function isHabitRequest(input: string): boolean {
  const habitKeywords = [
    'habit',
    'routine',
    'regularly',
    'every day',
    'daily practice',
    'consistently'
  ];
  return habitKeywords.some(keyword => input.includes(keyword));
}

function isDailyRequest(input: string): boolean {
  const dailyKeywords = [
    'daily',
    'each day',
    'everyday',
    'weekday',
    'daily task',
    'daily goal'
  ];
  return dailyKeywords.some(keyword => input.includes(keyword));
}

function isTodoRequest(input: string): boolean {
  const todoKeywords = [
    'todo',
    'task',
    'remind',
    'need to',
    'have to',
    'should',
    'must',
    'got to'
  ];
  return todoKeywords.some(keyword => input.includes(keyword));
}

function isFitnessRelated(input: string): boolean {
  const fitnessKeywords = [
    'gym',
    'workout',
    'exercise',
    'training',
    'fitness',
    'cardio',
    'strength',
    'run',
    'running',
    'jog',
    'jogging',
    'lift',
    'lifting',
    'weights'
  ];
  return fitnessKeywords.some(keyword => input.includes(keyword));
}

function extractBasicTitle(input: string): string {
  const cleanInput = input
    .replace(/^(add|create|new|start|make|set up|remind me to|i need to|i want to|i have to|i should)/i, '')
    .replace(/(habit|daily|todo|task)$/i, '')
    .trim();

  return cleanInput.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function generateBasicDescription(title: string): string {
  return `Complete ${title.toLowerCase()} according to defined goals`;
}

function inferPriority(input: string): 'low' | 'medium' | 'high' {
  const lowPriority = /\b(maybe|sometime|when possible|low priority)\b/i;
  const highPriority = /\b(urgent|asap|important|high priority|must|critical)\b/i;

  if (highPriority.test(input)) return 'high';
  if (lowPriority.test(input)) return 'low';
  return 'medium';
}

function inferDays(input: string): string[] {
  const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weekendPattern = /\b(weekend|saturday|sunday)\b/i;
  const weekdayPattern = /\b(weekday|monday|tuesday|wednesday|thursday|friday)\b/i;

  if (weekendPattern.test(input)) return ['Sat', 'Sun'];
  if (weekdayPattern.test(input)) return defaultDays;

  const days = [];
  if (input.match(/\bmon(day)?\b/i)) days.push('Mon');
  if (input.match(/\btue(sday)?\b/i)) days.push('Tue');
  if (input.match(/\bwed(nesday)?\b/i)) days.push('Wed');
  if (input.match(/\bthu(rsday)?\b/i)) days.push('Thu');
  if (input.match(/\bfri(day)?\b/i)) days.push('Fri');
  if (input.match(/\bsat(urday)?\b/i)) days.push('Sat');
  if (input.match(/\bsun(day)?\b/i)) days.push('Sun');

  return days.length > 0 ? days : defaultDays;
}

function inferDueDate(input: string): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (input.match(/\b(today|now|asap)\b/i)) {
    return today.toISOString().split('T')[0];
  }
  if (input.match(/\b(tomorrow|tmr)\b/i)) {
    return tomorrow.toISOString().split('T')[0];
  }

  return tomorrow.toISOString().split('T')[0];
}