import { test } from 'node:test';
import assert from 'node:assert/strict';
import { previousLearningDate, resolveLearn, resolveRecite, defaultPane } from '../src/lib/schedule.js';
import { shanghaiInstant } from '../src/lib/shanghaiTime.js';

test('previousLearningDate skips Fri-Sun to last Mon-Thu', () => {
  assert.equal(previousLearningDate('2026-09-15'), '2026-09-14');
  assert.equal(previousLearningDate('2026-09-16'), '2026-09-15');
  assert.equal(previousLearningDate('2026-09-17'), '2026-09-16');
  assert.equal(previousLearningDate('2026-09-18'), '2026-09-17');
  assert.equal(previousLearningDate('2026-09-14'), '2026-09-10');
  assert.equal(previousLearningDate('2026-09-19'), '2026-09-17');
  assert.equal(previousLearningDate('2026-09-20'), '2026-09-17');
});

test('Monday 8:59: recite last Thursday, learn not ready', () => {
  const now = shanghaiInstant(2026, 9, 14, 8, 59);
  assert.deepEqual(resolveLearn(now), { mode: 'idle', date: null });
  assert.deepEqual(resolveRecite(now), { mode: 'recite', date: '2026-09-10' });
  assert.equal(defaultPane(now), 'recite');
});

test('Monday 9:00: default learn, recite still last Thursday', () => {
  const now = shanghaiInstant(2026, 9, 14, 9, 0);
  assert.deepEqual(resolveLearn(now), { mode: 'learn', date: '2026-09-14' });
  assert.deepEqual(resolveRecite(now), { mode: 'recite', date: '2026-09-10' });
  assert.equal(defaultPane(now), 'learn');
});

test('Tuesday 7:59: recite Monday, no 8am gate', () => {
  const now = shanghaiInstant(2026, 9, 15, 7, 59);
  assert.deepEqual(resolveRecite(now), { mode: 'recite', date: '2026-09-14' });
  assert.deepEqual(resolveLearn(now), { mode: 'idle', date: null });
  assert.equal(defaultPane(now), 'recite');
});

test('Tuesday 8:00: recite Monday, learn not yet', () => {
  const now = shanghaiInstant(2026, 9, 15, 8, 0);
  assert.deepEqual(resolveRecite(now), { mode: 'recite', date: '2026-09-14' });
  assert.deepEqual(resolveLearn(now), { mode: 'idle', date: null });
  assert.equal(defaultPane(now), 'recite');
});

test('Tuesday 9:00: both ready, default learn, recite still Monday', () => {
  const now = shanghaiInstant(2026, 9, 15, 9, 0);
  assert.deepEqual(resolveLearn(now), { mode: 'learn', date: '2026-09-15' });
  assert.deepEqual(resolveRecite(now), { mode: 'recite', date: '2026-09-14' });
  assert.equal(defaultPane(now), 'learn');
});

test('Friday any hour: recite Thursday, no new words', () => {
  const now = shanghaiInstant(2026, 9, 18, 7, 0);
  assert.deepEqual(resolveRecite(now), { mode: 'recite', date: '2026-09-17' });
  assert.deepEqual(resolveLearn(now), { mode: 'idle', date: null });
  assert.equal(defaultPane(now), 'recite');
});

test('Saturday and Sunday recite Thursday', () => {
  const sat = shanghaiInstant(2026, 9, 19, 10, 0);
  const sun = shanghaiInstant(2026, 9, 20, 10, 0);
  assert.deepEqual(resolveRecite(sat), { mode: 'recite', date: '2026-09-17' });
  assert.deepEqual(resolveRecite(sun), { mode: 'recite', date: '2026-09-17' });
  assert.equal(defaultPane(sat), 'recite');
});
