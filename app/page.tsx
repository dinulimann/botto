import ChatInterface from '@/components/ChatInterface';
import FileUpload from '@/components/FileUpload';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Botto</h1>
        <p className="text-center text-gray-600 mb-8">
          RAG Chatbot - Chat with Your Documents
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FileUpload />
          </div>

          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Groq AI (Free) + ChromaDB</p>
          <p className="mt-1">
            Tech Stack: Next.js, TypeScript, Tailwind CSS, LangChain
          </p>
        </div>
      </div>
    </main>
  );
}
