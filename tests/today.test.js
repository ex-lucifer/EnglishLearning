import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWordStore } from '../src/lib/wordStore.js';
import { buildLearn, buildRecite, buildToday } from '../src/lib/today.js';
import { shanghaiInstant } from '../src/lib/shanghaiTime.js';

const store = createWordStore(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/words')
);

test('Monday 9:00 learn with words', () => {
  const payload = buildLearn(shanghaiInstant(2026, 9, 14, 9, 0), store);
  assert.equal(payload.mode, 'learn');
  assert.equal(payload.date, '2026-09-14');
  assert.equal(payload.words.length, 10);
  assert.equal(payload.heading, '今日新词 · 10 词');
  assert.equal(payload.message, null);
  assert.equal(payload.error, null);
});

test('Tuesday 8:00 recite Monday words, learn still closed', () => {
  const now = shanghaiInstant(2026, 9, 15, 8, 0);
  const recite = buildRecite(now, store);
  const learn = buildLearn(now, store);
  assert.equal(recite.mode, 'recite');
  assert.equal(recite.date, '2026-09-14');
  assert.equal(recite.heading, '今日抽背 · 10 词');
  assert.equal(recite.words[0].word, 'agenda');
  assert.equal(learn.mode, 'idle');
  assert.equal(learn.message, '未到出词时间');
});

test('Tuesday 9:00 keeps recite while showing new words', () => {
  const now = shanghaiInstant(2026, 9, 15, 9, 0);
  const today = buildToday(now, store);
  assert.equal(today.defaultPane, 'learn');
  assert.equal(today.learn.date, '2026-09-15');
  assert.equal(today.learn.words[0].word, 'clarify');
  assert.equal(today.recite.mode, 'recite');
  assert.equal(today.recite.date, '2026-09-14');
});

test('Tuesday 7:59 still recites Monday words', () => {
  const payload = buildRecite(shanghaiInstant(2026, 9, 15, 7, 59), store);
  assert.equal(payload.mode, 'recite');
  assert.equal(payload.date, '2026-09-14');
  assert.equal(payload.words[0].word, 'agenda');
});

test('Monday 8:59 learn idle not yet', () => {
  const payload = buildLearn(shanghaiInstant(2026, 9, 14, 8, 59), store);
  assert.equal(payload.mode, 'idle');
  assert.equal(payload.message, '未到出词时间');
});

test('Saturday learn idle, recite last Thursday', () => {
  const now = shanghaiInstant(2026, 9, 19, 10, 0);
  assert.equal(buildLearn(now, store).message, '今日无新词');
  const recite = buildRecite(now, store);
  assert.equal(recite.mode, 'recite');
  assert.equal(recite.date, '2026-09-17');
});

test('missing in-range day is DAY_MISSING', () => {
  const payload = buildLearn(shanghaiInstant(2026, 9, 16, 9, 0), store);
  assert.equal(payload.mode, 'learn');
  assert.equal(payload.error, 'DAY_MISSING');
  assert.equal(payload.message, '这一天没有词');
});

test('learning day after bank end is BANK_EXHAUSTED', () => {
  const payload = buildLearn(shanghaiInstant(2027, 9, 13, 9, 0), store);
  assert.equal(payload.mode, 'learn');
  assert.equal(payload.date, '2027-09-13');
  assert.equal(payload.error, 'BANK_EXHAUSTED');
  assert.equal(payload.message, '词库已用完，需要再生成一批');
});
