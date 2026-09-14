import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWordStore } from '../src/lib/wordStore.js';
import { buildToday } from '../src/lib/today.js';
import { shanghaiInstant } from '../src/lib/shanghaiTime.js';

const store = createWordStore(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/words')
);

test('Monday 9:00 learn with words', () => {
  const payload = buildToday(shanghaiInstant(2026, 9, 14, 9, 0), store);
  assert.equal(payload.mode, 'learn');
  assert.equal(payload.date, '2026-09-14');
  assert.equal(payload.words.length, 10);
  assert.equal(payload.heading, '今日新词 · 10 词');
  assert.equal(payload.message, null);
  assert.equal(payload.error, null);
});

test('Tuesday 8:00 recite Monday words', () => {
  const payload = buildToday(shanghaiInstant(2026, 9, 15, 8, 0), store);
  assert.equal(payload.mode, 'recite');
  assert.equal(payload.date, '2026-09-14');
  assert.equal(payload.heading, '今日抽背 · 10 词');
  assert.equal(payload.words[0].word, 'agenda');
});

test('Tuesday 7:59 idle too early', () => {
  const payload = buildToday(shanghaiInstant(2026, 9, 15, 7, 59), store);
  assert.equal(payload.mode, 'idle');
  assert.equal(payload.message, '未到抽背时间');
  assert.equal(payload.words.length, 0);
});

test('Monday 8:59 idle no words yet', () => {
  const payload = buildToday(shanghaiInstant(2026, 9, 14, 8, 59), store);
  assert.equal(payload.mode, 'idle');
  assert.equal(payload.message, '今日无新词');
});

test('Saturday idle', () => {
  const payload = buildToday(shanghaiInstant(2026, 9, 19, 10, 0), store);
  assert.equal(payload.mode, 'idle');
  assert.equal(payload.message, '今日无新词');
});

test('missing in-range day is DAY_MISSING', () => {
  const payload = buildToday(shanghaiInstant(2026, 9, 16, 9, 0), store);
  assert.equal(payload.mode, 'learn');
  assert.equal(payload.error, 'DAY_MISSING');
  assert.equal(payload.message, '这一天没有词');
});

test('learning day after bank end is BANK_EXHAUSTED', () => {
  const payload = buildToday(shanghaiInstant(2027, 9, 13, 9, 0), store);
  assert.equal(payload.mode, 'learn');
  assert.equal(payload.date, '2027-09-13');
  assert.equal(payload.error, 'BANK_EXHAUSTED');
  assert.equal(payload.message, '词库已用完，需要再生成一批');
});
