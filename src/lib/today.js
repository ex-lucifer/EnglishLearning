import { shanghaiParts } from './shanghaiTime.js';
import { resolveView } from './schedule.js';

export const BANK_END = '2027-09-09';

function idleMessage(now) {
  const { weekday, hour } = shanghaiParts(now);
  if (weekday >= 2 && weekday <= 5 && hour < 8) return '未到抽背时间';
  return '今日无新词';
}

export function buildToday(now, store) {
  const view = resolveView(now);
  if (view.mode === 'idle') {
    return {
      mode: 'idle',
      date: null,
      words: [],
      heading: '今日安排',
      message: idleMessage(now),
      error: null
    };
  }

  const day = store.getDay(view.date);
  if (!day) {
    const error = view.date > BANK_END ? 'BANK_EXHAUSTED' : 'DAY_MISSING';
    return {
      mode: view.mode,
      date: view.date,
      words: [],
      heading: view.mode === 'learn' ? '今日新词 · 10 词' : '今日抽背 · 10 词',
      message: error === 'BANK_EXHAUSTED' ? '词库已用完，需要再生成一批' : '这一天没有词',
      error
    };
  }

  return {
    mode: view.mode,
    date: view.date,
    words: day.words,
    heading: view.mode === 'learn' ? '今日新词 · 10 词' : '今日抽背 · 10 词',
    message: null,
    error: null
  };
}
