import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(currentDir, '..', 'dist');
const port = Number(process.env.PORT || 5173);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

const isInsideDist = (filePath) => filePath === distDir || filePath.startsWith(`${distDir}${path.sep}`);

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || '/', `http://${request.headers.host}`);
    const requestedPath = decodeURIComponent(requestUrl.pathname);
    const safePath = requestedPath === '/' ? '/index.html' : requestedPath;
    let filePath = path.resolve(distDir, `.${safePath}`);

    if (!isInsideDist(filePath)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    if (!existsSync(filePath) && path.extname(filePath)) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    if (!existsSync(filePath)) {
      filePath = path.resolve(distDir, 'index.html');
    }

    const extension = path.extname(filePath).toLowerCase();
    response.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream');
    response.end(await readFile(filePath));
  } catch {
    response.writeHead(500);
    response.end('Server error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Taffy English Walk is available at http://localhost:${port}`);
});
