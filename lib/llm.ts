import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateResponse(
  messages: ChatMessage[],
  context?: string
): Promise<string> {
  try {
    const systemMessage = context
      ? {
          role: 'system' as const,
          content: `You are a helpful AI assistant. Use the following context to answer the user's question. If the answer is not in the context, say so honestly.

Context:
${context}`,
        }
      : {
          role: 'system' as const,
          content: 'You are a helpful AI assistant.',
        };

    const completion = await groq.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: 'llama-3.1-8b-instant', // Free model dari Groq
      temperature: 0.7,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export async function generateStreamResponse(
  messages: ChatMessage[],
  context?: string
) {
  const systemMessage = context
    ? {
        role: 'system' as const,
        content: `You are a helpful AI assistant. Use the following context to answer the user's question. If the answer is not in the context, say so honestly.

Context:
${context}`,
      }
    : {
        role: 'system' as const,
        content: 'You are a helpful AI assistant.',
      };

  const stream = await groq.chat.completions.create({
    messages: [systemMessage, ...messages],
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    max_tokens: 1024,
    stream: true,
  });

  return stream;
}
