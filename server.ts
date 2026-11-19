import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = path.resolve(__dirname, 'docs');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Gemini AI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // --- API Routes ---

  // 1. List all docs files
  app.get('/api/docs', (req, res) => {
    try {
      if (!fs.existsSync(DOCS_DIR)) {
        return res.json({ success: true, files: [] });
      }
      const entries = fs.readdirSync(DOCS_DIR, { withFileTypes: true });
      const files = entries
        .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
        .map(dirent => {
          const filePath = path.join(DOCS_DIR, dirent.name);
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf8');
          const match = content.match(/^#\s+(.+)$/m);
          const title = match ? match[1] : dirent.name.replace('.md', '');
          return {
            name: dirent.name,
            path: dirent.name,
            title: title.trim(),
            size: stats.size,
            updatedAt: stats.mtime,
          };
        });

      res.json({ success: true, files });
    } catch (error: any) {
      console.error('Error listing docs:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. Get specific doc content
  app.get('/api/docs/:filename', (req, res) => {
    try {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(DOCS_DIR, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }

      const content = fs.readFileSync(filePath, 'utf8');
      res.json({ success: true, filename, content });
    } catch (error: any) {
      console.error('Error reading doc:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 3. Create or update doc
  app.post('/api/docs', (req, res) => {
    try {
      let { filename, content } = req.body;
      if (!filename) {
        return res.status(400).json({ success: false, error: 'Filename is required' });
      }

      // Ensure .md extension
      if (!filename.endsWith('.md')) {
        filename += '.md';
      }

      const safeFilename = path.basename(filename);
      const filePath = path.join(DOCS_DIR, safeFilename);

      fs.writeFileSync(filePath, content || '', 'utf8');
      res.json({ success: true, filename: safeFilename, message: 'Document saved successfully' });
    } catch (error: any) {
      console.error('Error saving doc:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. Delete doc
  app.delete('/api/docs/:filename', (req, res) => {
    try {
      const filename = path.basename(req.params.filename);
      const filePath = path.join(DOCS_DIR, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }

      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Document deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting doc:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. AI Assistant generate / polish doc
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, currentContent, mode } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      let systemInstruction = 'You are an expert technical writer and software architect. Write clean, professional Markdown documentation with code blocks, headings, and lists.';
      let userQuery = prompt;

      if (mode === 'polish' && currentContent) {
        systemInstruction = 'You are an expert technical editor. Improve the grammar, flow, clarity, and formatting of the provided Markdown document while preserving key technical facts.';
        userQuery = `Please polish and enhance this markdown documentation:\n\n${currentContent}\n\nUser instructions: ${prompt}`;
      } else if (mode === 'code') {
        userQuery = `Write comprehensive code example or API documentation for: ${prompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: userQuery,
        config: {
          systemInstruction,
        },
      });

      res.json({ success: true, text: response.text });
    } catch (error: any) {
      console.error('AI generation error:', error);
      res.status(500).json({ success: false, error: error.message || 'Failed to generate AI content' });
    }
  });

  // --- Vite Dev Server Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DocsCraft server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
