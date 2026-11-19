# AI Integration Guide

DocsCraft integrates seamlessly with Google's Gemini models via the official `@google/genai` TypeScript SDK.

## Server-Side Implementation

All generative AI requests are executed securely on the server side (`server.ts`), ensuring zero exposure of API keys to the browser client.

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function generateDocSection(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents: `Write professional technical documentation for the following request: \${prompt}`,
    config: {
      systemInstruction: "You are an expert technical writer producing clear, concise Markdown documentation with code examples.",
    }
  });
  return response.text;
}
\`\`\`

## AI Features in DocsCraft

1. **Auto-Complete & Draft Generation**: Describe a feature and let Gemini draft the markdown documentation.
2. **Grammar & Tone Polish**: Refine technical prose for clarity and conciseness.
3. **Code Snippet Generator**: Instantly generate clean code snippets in Python, JavaScript, TypeScript, or Go.
