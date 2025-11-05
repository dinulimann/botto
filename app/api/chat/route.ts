import { NextRequest, NextResponse } from 'next/server';
import { VectorStore } from '@/lib/vectorStore';
import { generateStreamResponse, ChatMessage } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Get the last user message for RAG search
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 });
    }

    // Search for relevant documents
    const vectorStore = new VectorStore();
    const relevantDocs = await vectorStore.similaritySearch(lastMessage.content, 3);

    // Build context from relevant documents
    const context = relevantDocs.length > 0
      ? relevantDocs.map((doc, i) => `[${i + 1}] ${doc.pageContent}`).join('\n\n')
      : undefined;

    // Generate streaming response
    const stream = await generateStreamResponse(messages as ChatMessage[], context);

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
