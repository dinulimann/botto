import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { extractText } from '@/lib/documentProcessor';
import { VectorStore, processDocument } from '@/lib/vectorStore';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}_${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(filepath, buffer);

    // Extract text from document
    const text = await extractText(filepath, file.type);

    // Process and store in vector database
    const documents = await processDocument(text, file.name);
    const vectorStore = new VectorStore();
    await vectorStore.addDocuments(documents);

    return NextResponse.json({
      success: true,
      filename: file.name,
      chunks: documents.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
