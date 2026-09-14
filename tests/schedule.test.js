import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveView, previousLearningDate } from '../src/lib/schedule.js';
import { shanghaiInstant } from '../src/lib/shanghaiTime.js';

test('previousLearningDate maps Tue-Fri to prior learning day', () => {
  assert.equal(previousLearningDate('2026-09-15'), '2026-09-14');
  assert.equal(previousLearningDate('2026-09-16'), '2026-09-15');
  assert.equal(previousLearningDate('2026-09-17'), '2026-09-16');
  assert.equal(previousLearningDate('2026-09-18'), '2026-09-17');
});

const cases = [
  ['周一 8:59 idle', 2026, 9, 14, 8, 59, 'idle', null],
  ['周一 9:00 learn', 2026, 9, 14, 9, 0, 'learn', '2026-09-14'],
  ['周二 7:59 idle', 2026, 9, 15, 7, 59, 'idle', null],
  ['周二 8:00 recite 周一', 2026, 9, 15, 8, 0, 'recite', '2026-09-14'],
  ['周二 9:00 learn 周二', 2026, 9, 15, 9, 0, 'learn', '2026-09-15'],
  ['周五 8:00 recite 周四', 2026, 9, 18, 8, 0, 'recite', '2026-09-17'],
  ['周六 idle', 2026, 9, 19, 10, 0, 'idle', null]
];

for (const [name, y, m, d, h, min, mode, date] of cases) {
  test(name, () => {
    const view = resolveView(shanghaiInstant(y, m, d, h, min));
    assert.equal(view.mode, mode);
    assert.equal(view.date, date);
  });
}
