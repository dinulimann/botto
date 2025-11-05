import { ChromaClient } from 'chromadb';
import { DefaultEmbeddingFunction } from '@chroma-core/default-embed';

// Initialize ChromaDB client
const client = new ChromaClient({
  path: process.env.CHROMA_URL || 'http://localhost:8000',
});

const embedder = new DefaultEmbeddingFunction();
const COLLECTION_NAME = 'documents';

export interface Document {
  pageContent: string;
  metadata: {
    source: string;
    [key: string]: any;
  };
}

// Simple text splitter function
function splitTextIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start = end - overlap;
  }

  return chunks;
}

export class VectorStore {
  private collectionName: string;

  constructor(collectionName: string = COLLECTION_NAME) {
    this.collectionName = collectionName;
  }

  async getOrCreateCollection() {
    try {
      const collection = await client.getOrCreateCollection({
        name: this.collectionName,
        embeddingFunction: embedder,
      });
      return collection;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  async addDocuments(documents: Document[]) {
    const collection = await this.getOrCreateCollection();

    const ids = documents.map((_, i) => `doc_${Date.now()}_${i}`);
    const texts = documents.map(doc => doc.pageContent);
    const metadatas = documents.map(doc => doc.metadata);

    await collection.add({
      ids,
      documents: texts,
      metadatas,
    });

    return ids;
  }

  async similaritySearch(query: string, k: number = 4) {
    const collection = await this.getOrCreateCollection();

    const results = await collection.query({
      queryTexts: [query],
      nResults: k,
    });

    if (!results.documents[0]) return [];

    return results.documents[0].map((text, i) => ({
      pageContent: text,
      metadata: results.metadatas?.[0]?.[i] || {},
    }));
  }

  async deleteCollection() {
    try {
      await client.deleteCollection({ name: this.collectionName });
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  }
}

export async function processDocument(text: string, source: string): Promise<Document[]> {
  const chunks = splitTextIntoChunks(text, 1000, 200);

  return chunks.map((chunk, index) => ({
    pageContent: chunk,
    metadata: {
      source,
      chunkIndex: index,
    },
  }));
}
