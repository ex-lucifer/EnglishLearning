import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shanghaiParts, formatDate, shanghaiInstant } from '../src/lib/shanghaiTime.js';

test('shanghaiInstant 09:00 maps to UTC 01:00', () => {
  const d = shanghaiInstant(2026, 9, 15, 9, 0);
  assert.equal(d.toISOString(), '2026-09-15T01:00:00.000Z');
});

test('shanghaiParts reads weekday and hour in Asia/Shanghai', () => {
  const parts = shanghaiParts(shanghaiInstant(2026, 9, 14, 8, 59));
  assert.equal(parts.year, 2026);
  assert.equal(parts.month, 9);
  assert.equal(parts.day, 14);
  assert.equal(parts.hour, 8);
  assert.equal(parts.minute, 59);
  assert.equal(parts.weekday, 1);
});

test('Sunday weekday is 7', () => {
  const parts = shanghaiParts(shanghaiInstant(2026, 9, 20, 10, 0));
  assert.equal(parts.weekday, 7);
  assert.equal(formatDate(parts), '2026-09-20');
});
