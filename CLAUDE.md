# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

- `npm run dev` - Start the development server (runs on http://localhost:3000)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code quality issues

## Project Architecture

This is a Next.js 15 AI application built with the AI SDK that demonstrates various AI integration patterns. The application uses TypeScript and Tailwind CSS for styling.

### Core Dependencies
- **AI SDK**: Uses `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/react`, and `ai` packages for AI functionality
- **Framework**: Next.js 15 with React 19, TypeScript
- **Validation**: Zod for schema validation and structured data generation
- **Styling**: Tailwind CSS v4 with Geist font family

### Application Structure

The app follows Next.js App Router conventions with the following key areas:

#### API Routes (`src/app/api/`)
- **`/api/chat`** - Basic streaming chat with OpenAI GPT-4-nano, includes few-shot learning examples and system prompts
- **`/api/multi-modal-chat`** - Chat with file/image upload capabilities 
- **`/api/completion`** - Text completion endpoint
- **`/api/stream`** - Basic text streaming
- **`/api/structured-data`** - Generates structured recipe data using Zod schemas
- **`/api/structured-array`** - Generates structured arrays with validation
- **`/api/structured-enum`** - Generates enumerated structured data

#### UI Pages (`src/app/ui/`)
Each API route has a corresponding UI page that demonstrates the functionality:
- Chat interfaces use the `useChat` hook from `@ai-sdk/react`
- Multi-modal chat supports file uploads with image preview
- Structured data pages show real-time streaming of validated object generation

### Key Patterns

#### Structured Data Generation
The app demonstrates structured AI output using Zod schemas:
- Schema definition in separate files (e.g., `schema.ts`)
- `streamObject()` for real-time structured generation
- Type-safe validation with Zod

#### Chat Implementation
- Uses `UIMessage` type and `convertToModelMessages()` helper
- Streaming responses with `streamText()` and `toUIMessageStreamResponse()`
- Error handling and loading states
- Token usage logging

#### Multi-modal Support
- File upload handling with `FileList` state
- Image preview functionality
- File attachment processing in chat messages

### Model Configuration
Currently configured to use OpenAI's `gpt-4.1-nano` model throughout the application. The AI SDK supports multiple providers including Anthropic (configured but not actively used).

### Development Notes
- All API routes include proper error handling and logging
- UI components follow consistent styling patterns with Tailwind CSS
- TypeScript paths are configured with `@/*` alias pointing to `src/*`
- The application demonstrates both basic chat and advanced structured generation capabilities