# Deployment & Production

Deploying DocsCraft to production is seamless and fully compatible with modern cloud hosting platforms like Cloud Run, Vercel, or Docker containers.

## Production Build

To build the application for production:

\`\`\`bash
# Generate optimized client bundle and server build
npm run build
\`\`\`

This command compiles the React frontend into \`/dist\` and bundles the Express server.

## Starting the Production Server

\`\`\`bash
# Run the production server
npm start
\`\`\`

Configured via \`package.json\`:
\`\`\`json
"scripts": {
  "dev": "tsx server.ts",
  "build": "vite build && esbuild server.ts --bundle --platform=node --target=node22 --outfile=dist/server.js",
  "start": "node dist/server.js"
}
\`\`\`

## Environment Variables

Ensure the following environment variable is configured in your production environment:

- \`GEMINI_API_KEY\`: Required for Gemini AI documentation generation and assistant features.
- \`PORT\`: Optional server port (defaults to 3000).
