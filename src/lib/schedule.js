import { formatDate, shanghaiParts } from './shanghaiTime.js';

export function previousLearningDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  let utc = Date.UTC(year, month - 1, day);
  for (;;) {
    utc -= 86400000;
    const prev = new Date(utc);
    const weekday = prev.getUTCDay();
    if (weekday >= 1 && weekday <= 4) {
      const y = prev.getUTCFullYear();
      const m = String(prev.getUTCMonth() + 1).padStart(2, '0');
      const d = String(prev.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
  }
}

export function resolveLearn(now = new Date()) {
  const parts = shanghaiParts(now);
  if (parts.weekday >= 1 && parts.weekday <= 4) {
    return { mode: 'learn', date: formatDate(parts) };
  }
  return { mode: 'idle', date: null };
}

export function resolveRecite(now = new Date()) {
  const parts = shanghaiParts(now);
  return { mode: 'recite', date: previousLearningDate(formatDate(parts)) };
}

export function defaultPane(now = new Date()) {
  const { weekday, hour } = shanghaiParts(now);
  if (weekday >= 1 && weekday <= 4 && hour >= 9) return 'learn';
  return 'recite';
}
