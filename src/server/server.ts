import express from 'express';
import path from 'path';
import fs from 'fs';
import { SQLiteDatabase } from './database/SQLite';
import { createApiRouter } from './routes/ApiRoute';
import { createPlayerRouter } from './routes/PlayerRoute';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function main(): Promise<void> {
  // Initialize database
  const db = new SQLiteDatabase();
  await db.initializeAsync();

  const app = express();

  // JSON body parsing
  app.use(express.json());

  // API routes
  app.use('/api', createApiRouter(db));
  app.use('/api/player', createPlayerRouter(db));

  // Serve webpack-built client files as static assets.
  // Support both ts-node (`src/server`) and compiled output (`dist/server/server`).
  const candidateClientPaths = [
    path.resolve(__dirname, '../../dist/client'),
    path.resolve(__dirname, '../../../dist/client'),
  ];
  const clientPath = candidateClientPaths.find((p) => fs.existsSync(path.join(p, 'index.html')))
    ?? candidateClientPaths[0];
  app.use(express.static(clientPath, {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-store');
    },
  }));

  // SPA fallback: serve index.html for any non-API route
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Wingspan server listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
