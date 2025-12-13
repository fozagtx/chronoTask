# ChronoTask - Turn Videos into Action

A Next.js application that transforms YouTube videos into actionable study plans using AI-powered transcript analysis and task generation.

## Features

- **AI-Powered Analysis**: Automatically extract key concepts and generate actionable tasks from YouTube videos
- **Interactive Learning Dashboard**: Track progress with visual task completion indicators
- **Smart Study Plans**: AI-generated, time-estimated tasks based on video content
- **Learning Assistant Chat**: AI chatbot with web search capabilities for questions about your learning
- **Course Library**: Save and organize your learning courses with progress tracking
- **Slide Generation**: Export study materials as interactive slides
- **Civic Authentication**: Secure authentication with Civic identity

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: lucide-react
- **AI**: OpenAI GPT-4o-mini
- **Authentication**: Civic Auth
- **Web Search**: Brave Search API (optional)
- **Video Transcripts**: youtubei.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env template and configure:
cp .env.example .env
```

### Environment Variables

Create a `.env` file with:

```env
# Required
NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id
OPENAI_API_KEY=your_openai_api_key

# Optional - for web search in chat
BRAVE_SEARCH_API_KEY=your_brave_search_api_key
```

### Running the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/         # Video analysis endpoint
│   │   ├── ask/             # Q&A endpoint
│   │   ├── chat/            # Chat with AI agent
│   │   ├── search/          # Web search endpoint
│   │   ├── transcript/      # YouTube transcript fetching
│   │   └── auth/            # Authentication endpoints
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles
├── components/
│   ├── chrono-task/         # Feature components
│   │   ├── ChatWidget.tsx   # AI chat interface
│   │   ├── LearningDashboard.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── prompt-kit/          # Reusable input components
│   │   ├── prompt-input.tsx
│   │   └── text-shimmer.tsx
│   └── ui/                  # shadcn/ui components
└── lib/
    ├── chat.ts              # Chat API client
    ├── youtube.ts           # YouTube utilities
    ├── openai.ts            # OpenAI utilities
    ├── storage.ts           # Browser storage management
    └── utils.ts             # Common utilities
```

## Key Components

### ChatWidget
Interactive chat interface with:
- Message history
- AI responses with web search integration
- Avatar support for user/assistant messages
- Loading states with shimmer effects
- Context-aware responses based on current video

### PromptInput
Flexible input component with:
- Textarea with auto-height
- Custom action buttons
- Loading state management
- Keyboard shortcuts

### TextShimmer
Visual feedback component showing:
- Loading states during YouTube processing
- Smooth shimmer animation effect

## API Endpoints

- `POST /api/analyze` - Analyze YouTube transcript and generate study plan
- `POST /api/ask` - Ask questions about video content
- `POST /api/chat` - Chat with AI agent (supports web search)
- `POST /api/search` - Web search using Brave API
- `GET /api/transcript` - Fetch YouTube transcript

## Features in Detail

### YouTube to Study Plan Conversion
1. User pastes YouTube URL
2. App fetches video transcript
3. AI analyzes content for key concepts
4. AI generates actionable tasks with time estimates
5. User can save course to personal library

### Learning Assistant Chat
- Ask questions about current video content
- Get answers based on transcript and context
- Ask general questions with web search fallback
- View conversation history
- AI understands the context of your learning

### Progress Tracking
- Mark tasks as complete
- Visual progress ring showing completion percentage
- Save progress to browser storage
- Resume learning sessions

## Development

### Build & Run
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Run production build
```

### Code Style
- Follow existing TypeScript conventions
- Use Tailwind CSS classes for styling
- Component files use .tsx extension
- Maintain consistent naming: PascalCase for components

## Browser Storage

The app uses browser localStorage to persist:
- Saved courses and their content
- Task completion progress
- User learning history

No data is sent to external servers (except API calls for AI services).

## License

This project is part of the ChronoTask learning platform.
