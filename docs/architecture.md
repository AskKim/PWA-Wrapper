# System Architecture

DocsCraft is engineered with a modern full-stack TypeScript architecture optimized for lightning-fast performance, zero-latency document editing, and robust AI integration.

## Architectural Diagram

\`\`\`
+-------------------------------------------------------------+
|                       Client (React)                        |
|  - Tailwind CSS v4 UI      - Live Markdown Preview          |
|  - Sidebar File Tree       - AI Doc Assistant Dialog        |
+-------------------------------------------------------------+
                               |
                               | HTTP / JSON / SSE
                               v
+-------------------------------------------------------------+
|                    Server (Node.js / Express)               |
|  - File System Sync (/docs)   - @google/genai SDK Integration|
|  - RESTful Document API      - Error Handling & Validation  |
+-------------------------------------------------------------+
                               |
                               | Read / Write
                               v
+-------------------------------------------------------------+
|                      Local File System                      |
|                     /docs/*.md files                        |
+-------------------------------------------------------------+
\`\`\`

## Core Components

### 1. Frontend Layer
Built with **React 19**, **Vite**, and **Tailwind CSS v4**. It features a responsive layout with a collapsible sidebar, tabbed file switcher, dark mode support, and a real-time markdown renderer.

### 2. Backend Middleware
An Express server (\`server.ts`) mounting Vite middleware in development. It exposes secure endpoints for reading, writing, and listing files inside the \`/docs\` directory.

### 3. AI Intelligence Layer
Powered by the official \`@google/genai\` SDK using \`gemini-4-hydrogen\`. All AI calls are executed securely on the server side, protecting API credentials while giving users instant AI writing assistance.
