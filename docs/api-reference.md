# API Reference & Endpoints

DocsCraft exposes a powerful RESTful API backend for managing markdown documents, syncing with the filesystem, and leveraging Gemini AI capabilities.

## Base URL

All API requests are relative to your server instance:
\`https://<your-domain>/api\`

---

## Document Endpoints

### 1. List Documents
Retrieve all markdown files available in the \`/docs\` folder.

- **URL**: \`/api/docs\`
- **Method**: \`GET\`
- **Success Response**: \`200 OK\`

\`\`\`json
{
  "success": true,
  "files": [
    {
      "name": "getting-started.md",
      "path": "getting-started.md",
      "title": "Getting Started with DocsCraft",
      "size": 1420,
      "updatedAt": "2026-11-19T14:00:00Z"
    },
    {
      "name": "api-reference.md",
      "path": "api-reference.md",
      "title": "API Reference & Endpoints",
      "size": 2150,
      "updatedAt": "2026-11-19T14:00:00Z"
    }
  ]
}
\`\`\`

### 2. Get Document Content
Retrieve the markdown content of a specific file.

- **URL**: \`/api/docs/:filename\`
- **Method**: \`GET\`
- **Params**: \`filename\` (e.g. \`getting-started.md\`)

### 3. Save Document
Create or update a markdown document in the \`/docs\` folder.

- **URL**: \`/api/docs\`
- **Method**: \`POST\`
- **Body**:
\`\`\`json
{
  "filename": "new-guide.md",
  "content": "# New Guide\\n\\nContent goes here..."
}
\`\`\`

---

## AI Assistant Endpoints

### 1. Generate Content
Leverage Gemini AI to generate or enhance documentation.

- **URL**: \`/api/ai/generate\`
- **Method**: \`POST\`
- **Body**:
\`\`\`json
{
  "prompt": "Write documentation for a Webhook retry mechanism",
  "topic": "Webhooks"
}
\`\`\`
