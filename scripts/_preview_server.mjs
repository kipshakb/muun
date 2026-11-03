import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.gif': 'image/gif'
};

function resolveFile(urlPath) {
  let decoded = '/';
  try {
    decoded = decodeURIComponent((urlPath || '/').split('?')[0]);
  } catch {
    return null;
  }
  const rel = decoded.replace(/^\/+/, '');
  const candidates = rel.endsWith('/') || rel === ''
    ? [path.join(root, rel, 'index.html')]
    : [path.join(root, rel)];
  if (rel && !rel.endsWith('/') && !path.extname(rel)) {
    candidates.push(path.join(root, `${rel}.html`));
    candidates.push(path.join(root, rel, 'index.html'));
  }
  for (const file of candidates) {
    const normalized = path.normalize(file);
    if (!normalized.toLowerCase().startsWith(root.toLowerCase())) continue;
    if (fs.existsSync(normalized) && fs.statSync(normalized).isFile()) return normalized;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  const stream = fs.createReadStream(file);
  stream.on('error', (err) => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Error reading file');
    }
  });
  stream.pipe(res);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Unhandled exception in preview server:', err.message);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Preview http://127.0.0.1:${port}/`);
});

