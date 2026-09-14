import { shanghaiParts } from './shanghaiTime.js';
import { defaultPane, resolveLearn, resolveRecite } from './schedule.js';

export const BANK_END = '2027-09-09';

function learnIdleMessage(now) {
  const { weekday, hour } = shanghaiParts(now);
  if (weekday >= 1 && weekday <= 4 && hour < 9) return '未到出词时间';
  return '今日无新词';
}

function reciteIdleMessage() {
  return '今日无抽背';
}

function fillPayload(view, store, now, labels) {
  if (view.mode === 'idle') {
    return {
      mode: 'idle',
      date: null,
      words: [],
      heading: labels.idleHeading,
      message: labels.idleMessage(now),
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
      heading: labels.heading,
      message: error === 'BANK_EXHAUSTED' ? '词库已用完，需要再生成一批' : '这一天没有词',
      error
    };
  }

  return {
    mode: view.mode,
    date: view.date,
    words: day.words,
    heading: labels.heading,
    message: null,
    error: null
  };
}

export function buildLearn(now, store) {
  return fillPayload(resolveLearn(now), store, now, {
    heading: '今日新词 · 10 词',
    idleHeading: '今日新词',
    idleMessage: learnIdleMessage
  });
}

export function buildRecite(now, store) {
  return fillPayload(resolveRecite(now), store, now, {
    heading: '今日抽背 · 10 词',
    idleHeading: '今日抽背',
    idleMessage: reciteIdleMessage
  });
}

export function buildToday(now, store) {
  return {
    defaultPane: defaultPane(now),
    learn: buildLearn(now, store),
    recite: buildRecite(now, store)
  };
}
