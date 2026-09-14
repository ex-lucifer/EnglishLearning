import { formatDate, shanghaiParts } from './shanghaiTime.js';

export function previousLearningDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const prev = new Date(Date.UTC(year, month - 1, day - 1));
  const y = prev.getUTCFullYear();
  const m = String(prev.getUTCMonth() + 1).padStart(2, '0');
  const d = String(prev.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function resolveView(now = new Date()) {
  const parts = shanghaiParts(now);
  const today = formatDate(parts);
  const { weekday, hour } = parts;

  if (weekday >= 1 && weekday <= 4 && hour >= 9) {
    return { mode: 'learn', date: today };
  }
  if (weekday >= 2 && weekday <= 5 && hour >= 8) {
    return { mode: 'recite', date: previousLearningDate(today) };
  }
  return { mode: 'idle', date: null };
}
