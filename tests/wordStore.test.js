import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWordStore } from '../src/lib/wordStore.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/words');

test('getDay reads a learning day', () => {
  const store = createWordStore(dir);
  const day = store.getDay('2026-09-14');
  assert.equal(day.date, '2026-09-14');
  assert.equal(day.words.length, 10);
  assert.equal(day.words[0].word, 'agenda');
});

test('getDay returns null when missing', () => {
  const store = createWordStore(dir);
  assert.equal(store.getDay('2026-09-16'), null);
});

test('listDates is descending', () => {
  const store = createWordStore(dir);
  assert.deepEqual(store.listDates(), ['2026-09-15', '2026-09-14']);
});
