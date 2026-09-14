import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWordStore } from './lib/wordStore.js';
import { buildLearn, buildRecite, buildToday } from './lib/today.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

export function createServer(options) {
  const wordsDir = options.wordsDir;
  const publicDir = options.publicDir;
  const now = options.now || (() => new Date());
  const store = createWordStore(wordsDir);
  const publicRoot = path.normalize(publicDir + path.sep);

  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/api/today') {
      return json(res, 200, buildToday(now(), store));
    }

    if (req.method === 'GET' && url.pathname === '/api/learn') {
      return json(res, 200, buildLearn(now(), store));
    }

    if (req.method === 'GET' && url.pathname === '/api/recite') {
      return json(res, 200, buildRecite(now(), store));
    }

    if (req.method === 'GET' && url.pathname === '/api/history') {
      return json(res, 200, { dates: store.listDates() });
    }

    const dayMatch = url.pathname.match(/^\/api\/day\/([^/]+)$/);
    if (req.method === 'GET' && dayMatch) {
      const date = dayMatch[1];
      if (!DATE_RE.test(date)) return json(res, 400, { error: 'INVALID_DATE' });
      const day = store.getDay(date);
      if (!day) return json(res, 404, { error: 'DAY_MISSING' });
      return json(res, 200, day);
    }

    if (req.method === 'GET') {
      const rel = url.pathname === '/' ? '/index.html' : url.pathname;
      const file = path.normalize(path.join(publicDir, rel));
      const normalizedFile = path.normalize(file);
      if (!normalizedFile.startsWith(publicRoot) && normalizedFile !== path.normalize(publicDir)) {
        res.writeHead(403);
        return res.end();
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404);
        return res.end('Not found');
      }
      const ext = path.extname(file);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      return res.end(fs.readFileSync(file));
    }

    res.writeHead(405);
    res.end();
  });
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const thisFile = fileURLToPath(import.meta.url);
const argvFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
const isMain = argvFile && path.normalize(argvFile) === path.normalize(thisFile);
if (isMain) {
  const root = path.join(path.dirname(thisFile), '..');
  const port = Number(process.env.PORT || 3000);
  const server = createServer({
    wordsDir: path.join(root, 'data/words'),
    publicDir: path.join(root, 'public')
  });
  server.listen(port, '0.0.0.0', () => {
    console.log(`listening on ${port}`);
  });
}
