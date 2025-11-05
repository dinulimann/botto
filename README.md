# Botto - RAG Chatbot

Web-based chatbot dengan Retrieval-Augmented Generation (RAG) yang memungkinkan Anda untuk chat dengan dokumen Anda sendiri. Semua tech stack yang digunakan **100% GRATIS**!

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **LLM**: Groq API (Free tier dengan model Llama 3.1)
- **Vector Database**: ChromaDB (Local, gratis)
- **RAG Framework**: LangChain.js
- **Document Processing**: pdf-parse, mammoth, xlsx

## Fitur

- Upload dokumen (PDF, Word, TXT)
- Chat dengan dokumen menggunakan RAG
- Streaming responses untuk pengalaman real-time
- UI yang clean dan responsive
- Semua gratis, tidak ada biaya tersembunyi!

## Prerequisites

- Node.js 18+
- Python 3.10+ (untuk ChromaDB)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup ChromaDB

Install ChromaDB (vector database):

```bash
pip install chromadb
```

### 3. Get Groq API Key (GRATIS!)

1. Kunjungi [https://console.groq.com](https://console.groq.com)
2. Sign up / Login
3. Buat API key baru
4. Copy API key

### 4. Setup Environment Variables

Edit file [.env.local](.env.local) dan masukkan API key Anda:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 5. Jalankan ChromaDB Server

Di terminal pertama, jalankan ChromaDB:

```bash
npm run chroma
```

Atau langsung dengan:

```bash
chroma run --path ./chroma_db
```

### 6. Jalankan Development Server

Di terminal kedua, jalankan Next.js:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Cara Menggunakan

1. **Upload Dokumen**: Klik area upload di kiri dan pilih file (PDF, DOC, DOCX, atau TXT)
2. **Tunggu Processing**: Sistem akan memproses dan menyimpan dokumen ke vector database
3. **Mulai Chat**: Ketik pertanyaan tentang dokumen Anda di chat interface
4. **Dapatkan Jawaban**: AI akan menjawab berdasarkan context dari dokumen yang di-upload

## Struktur Project

```
botto/
├── app/
│   ├── api/
│   │   ├── chat/           # Chat endpoint dengan streaming
│   │   └── upload/         # Upload & process dokumen
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatInterface.tsx   # Komponen chat UI
│   └── FileUpload.tsx      # Komponen upload dokumen
├── lib/
│   ├── vectorStore.ts      # ChromaDB integration & RAG logic
│   ├── llm.ts              # Groq API integration
│   └── documentProcessor.ts # Extract text dari berbagai format
└── public/
    └── uploads/            # Temporary file storage
```

## Keunggulan

### 100% Gratis
- Groq API: Free tier dengan rate limit yang generous
- ChromaDB: Open source, local storage
- Next.js: Open source framework
- Semua dependencies: Free & open source

### Privacy First
- Dokumen disimpan secara local
- Vector database berjalan di mesin Anda sendiri
- Hanya query yang dikirim ke Groq API

### Mudah Dikustomisasi
- Code yang clean dan well-structured
- TypeScript untuk type safety
- Mudah di-extend dengan fitur baru

## Troubleshooting

### ChromaDB tidak bisa connect
- Pastikan ChromaDB server berjalan (`npm run chroma`)
- Check port 8000 tidak digunakan aplikasi lain

### Upload gagal
- Pastikan folder `public/uploads` ada dan writable
- Check format file yang di-support (PDF, DOC, DOCX, TXT)

### Error saat chat
- Pastikan `GROQ_API_KEY` sudah di-set dengan benar
- Check koneksi internet (untuk Groq API)

## Future Improvements

- [ ] Support lebih banyak format file (Excel, CSV, etc)
- [ ] Multiple document collections
- [ ] Chat history persistence
- [ ] Export chat conversations
- [ ] Better error handling & user feedback
- [ ] Dark mode

## License

ISC

## Credits

Built with love using free & open source technologies!