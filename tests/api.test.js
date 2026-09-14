import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../src/server.js';
import { shanghaiInstant } from '../src/lib/shanghaiTime.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const wordsDir = path.join(root, 'tests/fixtures/words');
const publicDir = path.join(root, 'public');

function listen(now) {
  const server = createServer({
    wordsDir,
    publicDir,
    now
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

describe('Tuesday 8:00', () => {
  let server;
  let base;

  before(async () => {
    ({ server, base } = await listen(() => shanghaiInstant(2026, 9, 15, 8, 0)));
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('GET /api/today defaults to recite and keeps learn idle', async () => {
    const res = await fetch(`${base}/api/today`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.defaultPane, 'recite');
    assert.equal(body.recite.mode, 'recite');
    assert.equal(body.recite.date, '2026-09-14');
    assert.equal(body.recite.words.length, 10);
    assert.equal(body.learn.mode, 'idle');
  });

  test('GET /api/recite returns Monday words', async () => {
    const res = await fetch(`${base}/api/recite`);
    const body = await res.json();
    assert.equal(body.mode, 'recite');
    assert.equal(body.date, '2026-09-14');
  });

  test('GET /api/learn is not ready yet', async () => {
    const res = await fetch(`${base}/api/learn`);
    const body = await res.json();
    assert.equal(body.mode, 'idle');
    assert.equal(body.message, '未到出词时间');
  });

  test('GET /api/history is descending', async () => {
    const res = await fetch(`${base}/api/history`);
    const body = await res.json();
    assert.deepEqual(body.dates, ['2026-09-15', '2026-09-14']);
  });

  test('GET /api/day/:date returns words', async () => {
    const res = await fetch(`${base}/api/day/2026-09-14`);
    const body = await res.json();
    assert.equal(body.date, '2026-09-14');
    assert.equal(body.words.length, 10);
  });

  test('GET /api/day/bad-date is 400', async () => {
    const res = await fetch(`${base}/api/day/14-09-2026`);
    assert.equal(res.status, 400);
  });

  test('GET /api/day/missing is 404', async () => {
    const res = await fetch(`${base}/api/day/2026-09-16`);
    assert.equal(res.status, 404);
  });
});

describe('Tuesday 9:00', () => {
  let server;
  let base;

  before(async () => {
    ({ server, base } = await listen(() => shanghaiInstant(2026, 9, 15, 9, 0)));
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('GET /api/today has both panes', async () => {
    const body = await fetch(`${base}/api/today`).then((r) => r.json());
    assert.equal(body.defaultPane, 'learn');
    assert.equal(body.learn.date, '2026-09-15');
    assert.equal(body.recite.date, '2026-09-14');
  });
});
