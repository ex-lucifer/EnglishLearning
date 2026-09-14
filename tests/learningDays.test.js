import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listLearningDays } from '../scripts/learning-days.js';

test('covers 208 Mon-Thu days', () => {
  const days = listLearningDays();
  assert.equal(days[0], '2026-09-14');
  assert.equal(days.at(-1), '2027-09-09');
  assert.equal(days.length, 208);
  assert.ok(!days.includes('2026-09-18'));
  assert.ok(!days.includes('2026-09-19'));
});
