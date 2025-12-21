# ChronoTask (LearnLM) - PDF to Study Plan

Transform PDF documents into personalized, actionable study plans with AI.

## Overview

ChronoTask (LearnLM) is a Next.js application that uses MiniMax AI to analyze PDF documents and generate structured learning plans. Upload any educational PDF and get:

- **Key Concepts** - AI-extracted main ideas and topics
- **Action Tasks** - Structured checklist with time estimates
- **Interactive Chat** - Ask questions about the document content
- **Progress Tracking** - Visual progress indicators
- **Slide Export** - Generate presentation slides

## Features

- **PDF Upload** - Drag and drop or select PDF files (up to 10MB)
- **AI-Powered Analysis** - Uses MiniMax-M2 for intelligent content extraction
- **Interactive Dashboard** - 40/60 split layout with document info and tasks
- **Smart Q&A** - Ask questions about the document with AI assistance
- **Document Library** - Save and revisit your study plans
- **Slide Generation** - Export concepts and tasks as presentation slides
- **Civic Authentication** - Secure user authentication

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **AI Provider**: MiniMax (OpenAI-compatible API)
- **PDF Parsing**: pdf-parse
- **Authentication**: Civic Auth
- **State**: React hooks + localStorage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MiniMax API key
- Civic Auth client ID

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/chronoTask.git
cd chronoTask
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from the example:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
# Civic Authentication (Required)
NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id_here

# MiniMax API (Required for AI features)
MINIMAX_API_KEY=your_minimax_api_key_here

# Brave Search API (Optional - for web search in chat)
BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## MiniMax API Setup

This app uses the MiniMax API with OpenAI-compatible SDK. To get an API key:

1. Visit [https://platform.minimax.io](https://platform.minimax.io)
2. Create an account and get your API key
3. Add it to your `.env.local` as `MINIMAX_API_KEY`

The app uses the `MiniMax-M2` model for:
- Document analysis and concept extraction
- Task generation with time estimates
- Q&A chat functionality

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/       # PDF upload and text extraction
│   │   ├── analyze/      # Document analysis with MiniMax
│   │   ├── chat/         # Chat endpoint with context
│   │   ├── ask/          # Q&A endpoint
│   │   └── search/       # Brave web search
│   └── page.tsx          # Main app page
├── components/
│   └── chrono-task/      # Feature components
│       ├── DocumentPanel.tsx
│       ├── LearningDashboard.tsx
│       ├── TaskPanel.tsx
│       ├── AskWidget.tsx
│       ├── ChatWidget.tsx
│       ├── LibraryModal.tsx
│       └── ...
└── lib/
    ├── pdf.ts            # PDF utilities
    ├── chat.ts           # Chat utilities
    └── storage.ts        # LocalStorage utilities
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/upload` | POST | Upload PDF and extract text |
| `/api/analyze` | POST | Analyze document with AI |
| `/api/chat` | POST | Chat with AI context |
| `/api/ask` | POST | Q&A about document |
| `/api/search` | POST | Web search (optional) |

## Usage

1. **Sign In** - Authenticate with Civic Auth
2. **Upload PDF** - Drop or select a PDF file
3. **Review Analysis** - See extracted concepts and generated tasks
4. **Complete Tasks** - Check off items as you learn
5. **Ask Questions** - Use the chat widget for clarification
6. **Save to Library** - Keep your study plans for later
7. **Export Slides** - Generate presentation slides

## Supported PDF Types

- Text-based PDFs work best
- Scanned/image-only PDFs may have limited text extraction
- Maximum file size: 10MB

## Browser Storage

The app uses browser localStorage to persist:
- Saved documents and their content
- Task completion progress
- User learning history

No PDF files are stored on our servers.

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
