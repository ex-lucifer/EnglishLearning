# 医院信息中心每日英语出词 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 做一个无登录的 Node 网页服务：按东八区在周一至周四 9 点展示预生成的 10 个新词，周二至周五 8 点抽背上一学习日的 10 个词（中文点击才显示）。

**Architecture:** 原生 Node HTTP 读本地 `data/words/YYYY-MM-DD.json`。`shanghaiTime` 取东八区日历，`schedule` 判定 learn/recite/idle，`today` 拼主屏载荷，`wordStore` 读词库。前端单页调用 `/api/today`、`/api/history`、`/api/day/:date`。运行时不调用大模型。

**Tech Stack:** Node.js 20+（`node:test`、`node:http`、`node:fs`），无前端框架，Docker 部署。

**规格：** `docs/superpowers/specs/2026-09-14-daily-english-words-design.md`

---

## 文件地图

| 文件 | 职责 |
|---|---|
| `src/lib/shanghaiTime.js` | 把任意 `Date` 转成东八区年/月/日/时/星期 |
| `src/lib/schedule.js` | 根据东八区时刻返回 `{ mode, date }` |
| `src/lib/wordStore.js` | 读 `data/words` 下按日 JSON |
| `src/lib/today.js` | 组合 schedule + wordStore，带上 heading/message/error |
| `src/server.js` | HTTP：静态页 + 三个 API |
| `public/index.html` `public/styles.css` `public/app.js` | 主屏 / 抽背点开 / 历史 |
| `data/words/*.json` | 208 个学习日词表 |
| `scripts/learning-days.js` | 列出 2026-09-14～2027-09-09 的周一至周四 |
| `scripts/validate-word-bank.mjs` | 校验天数、配比、去重 |
| `tests/*.test.js` | 与上面一一对应 |
| `Dockerfile` `docker-compose.yml` `README.md` | 部署说明 |

词对象字段（全程一致）：`word` `phonetic` `meaning` `example` `exampleZh` `category`（仅 `office` \| `it`）。

`resolveView` 返回：`{ mode: 'learn' \| 'recite' \| 'idle', date: 'YYYY-MM-DD' \| null }`。

`buildToday` 返回：`{ mode, date, words, heading, message, error }`，其中 `error` 为 `null` \| `'DAY_MISSING'` \| `'BANK_EXHAUSTED'`。

---

### Task 1: 仓库脚手架

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `tests/smoke.test.js`

- [ ] **Step 1: 写失败的冒烟测试**

创建 `tests/smoke.test.js`：

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

test('package.json exists and is ESM', () => {
  const require = createRequire(import.meta.url);
  const pkg = require('../package.json');
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.scripts.test, 'node --test tests/**/*.test.js');
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/smoke.test.js`

Expected: FAIL，找不到 `package.json` 或 `type` 不对。

- [ ] **Step 3: 最小实现**

`package.json`：

```json
{
  "name": "hospital-it-daily-english",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "test": "node --test tests/**/*.test.js",
    "validate:words": "node scripts/validate-word-bank.mjs"
  }
}
```

`.gitignore`：

```
node_modules/
.superpowers/
```

- [ ] **Step 4: 再跑测试**

Run: `node --test tests/smoke.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json .gitignore tests/smoke.test.js
git commit -m "chore: scaffold node project"
```

---

### Task 2: 东八区时间

**Files:**
- Create: `src/lib/shanghaiTime.js`
- Test: `tests/shanghaiTime.test.js`

- [ ] **Step 1: 写失败测试**

`tests/shanghaiTime.test.js`：

```js
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
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/shanghaiTime.test.js`

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 实现**

`src/lib/shanghaiTime.js`：

```js
const TZ = 'Asia/Shanghai';

export function shanghaiInstant(year, month, day, hour = 0, minute = 0) {
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute, 0));
}

export function shanghaiParts(date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });
  const map = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
  const weekdayMap = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    weekday: weekdayMap[map.weekday]
  };
}

export function formatDate(parts) {
  const m = String(parts.month).padStart(2, '0');
  const d = String(parts.day).padStart(2, '0');
  return `${parts.year}-${m}-${d}`;
}
```

- [ ] **Step 4: 再跑测试**

Run: `node --test tests/shanghaiTime.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/shanghaiTime.js tests/shanghaiTime.test.js
git commit -m "feat: add Asia/Shanghai time helpers"
```

---

### Task 3: 日程判定

**Files:**
- Create: `src/lib/schedule.js`
- Test: `tests/schedule.test.js`

- [ ] **Step 1: 写失败测试**

`tests/schedule.test.js`：

```js
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
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/schedule.test.js`

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 实现**

`src/lib/schedule.js`：

```js
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
```

- [ ] **Step 4: 再跑测试**

Run: `node --test tests/schedule.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/schedule.js tests/schedule.test.js
git commit -m "feat: resolve learn/recite/idle by Shanghai clock"
```

---

### Task 4: 词库读取

**Files:**
- Create: `src/lib/wordStore.js`
- Create: `tests/fixtures/words/2026-09-14.json`
- Create: `tests/fixtures/words/2026-09-15.json`
- Test: `tests/wordStore.test.js`

- [ ] **Step 1: 写夹具和失败测试**

`tests/fixtures/words/2026-09-14.json`（10 词，5 office + 5 it，字段齐全）：

```json
{
  "date": "2026-09-14",
  "words": [
    { "word": "agenda", "phonetic": "/əˈdʒendə/", "meaning": "议程", "example": "Please send the agenda before the meeting.", "exampleZh": "开会前请把议程发出来。", "category": "office" },
    { "word": "follow-up", "phonetic": "/ˈfɒləʊ ʌp/", "meaning": "跟进", "example": "I will send a follow-up email today.", "exampleZh": "我今天会发一封跟进邮件。", "category": "office" },
    { "word": "handover", "phonetic": "/ˈhændəʊvə/", "meaning": "交接", "example": "Finish the handover before noon.", "exampleZh": "请在中午前完成交接。", "category": "office" },
    { "word": "deadline", "phonetic": "/ˈdedlaɪn/", "meaning": "截止日期", "example": "The deadline is Friday afternoon.", "exampleZh": "截止日期是周五下午。", "category": "office" },
    { "word": "briefing", "phonetic": "/ˈbriːfɪŋ/", "meaning": "简报", "example": "We have a short briefing at nine.", "exampleZh": "我们九点有一个短简报。", "category": "office" },
    { "word": "deploy", "phonetic": "/dɪˈplɔɪ/", "meaning": "部署", "example": "We will deploy the patch tonight.", "exampleZh": "我们今晚会部署这个补丁。", "category": "it" },
    { "word": "outage", "phonetic": "/ˈaʊtɪdʒ/", "meaning": "停机中断", "example": "The HIS outage lasted 20 minutes.", "exampleZh": "HIS 中断持续了 20 分钟。", "category": "it" },
    { "word": "EMR", "phonetic": "/ˌiː em ˈɑː/", "meaning": "电子病历", "example": "The EMR is slow this morning.", "exampleZh": "今天早上电子病历很慢。", "category": "it" },
    { "word": "rollback", "phonetic": "/ˈrəʊlbæk/", "meaning": "回滚", "example": "We had to rollback the release.", "exampleZh": "我们不得不回滚这次发布。", "category": "it" },
    { "word": "ticket", "phonetic": "/ˈtɪkɪt/", "meaning": "工单", "example": "Please open a ticket for this bug.", "exampleZh": "请为这个故障开一张工单。", "category": "it" }
  ]
}
```

`tests/fixtures/words/2026-09-15.json`：把上面 10 个 `word` 全部换成另一组（如 `clarify` `postpone` `minutes` `owner` `update` `HIS` `patch` `backup` `firewall` `latency`），字段同样齐全，5 office + 5 it。

`tests/wordStore.test.js`：

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWordStore } from '../src/lib/wordStore.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/words');

test('getDay reads a learning day', () => {
  const store = createWordStore(dir);
  const day = store.getDay('2026-09-14');
  assert.equal(day.date, '2026-09-14');
  assert.equal(day.words.length, 10);
  assert.equal(day.words[0].word, 'agenda');
});

test('getDay returns null when missing', () => {
  const store = createWordStore(dir);
  assert.equal(store.getDay('2026-09-16'), null);
});

test('listDates is descending', () => {
  const store = createWordStore(dir);
  assert.deepEqual(store.listDates(), ['2026-09-15', '2026-09-14']);
});
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/wordStore.test.js`

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 实现**

`src/lib/wordStore.js`：

```js
import fs from 'node:fs';
import path from 'node:path';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function createWordStore(dir) {
  function filePath(date) {
    return path.join(dir, `${date}.json`);
  }

  return {
    getDay(date) {
      if (!DATE_RE.test(date)) return null;
      const fp = filePath(date);
      if (!fs.existsSync(fp)) return null;
      return JSON.parse(fs.readFileSync(fp, 'utf8'));
    },
    listDates() {
      return fs.readdirSync(dir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => name.slice(0, -5))
        .filter((date) => DATE_RE.test(date) && fs.existsSync(filePath(date)))
        .sort()
        .reverse();
    }
  };
}
```

- [ ] **Step 4: 再跑测试**

Run: `node --test tests/wordStore.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/wordStore.js tests/wordStore.test.js tests/fixtures/words
git commit -m "feat: read daily word JSON files"
```

---

### Task 5: 主屏载荷

**Files:**
- Create: `src/lib/today.js`
- Test: `tests/today.test.js`

- [ ] **Step 1: 写失败测试**

`tests/today.test.js`：

```js
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
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/today.test.js`

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 实现**

`src/lib/today.js`：

```js
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
```

- [ ] **Step 4: 再跑测试**

Run: `node --test tests/today.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/today.js tests/today.test.js
git commit -m "feat: build today payload with idle and bank errors"
```

---

### Task 6: HTTP API

**Files:**
- Create: `src/server.js`
- Test: `tests/api.test.js`

- [ ] **Step 1: 写失败测试**

`tests/api.test.js`：

```js
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../src/server.js';
import { shanghaiInstant } from '../src/lib/shanghaiTime.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const wordsDir = path.join(root, 'tests/fixtures/words');
const publicDir = path.join(root, 'public');

let server;
let base;

before(async () => {
  server = createServer({
    wordsDir,
    publicDir,
    now: () => shanghaiInstant(2026, 9, 15, 8, 0)
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  base = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /api/today uses injected clock', async () => {
  const res = await fetch(`${base}/api/today`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.mode, 'recite');
  assert.equal(body.date, '2026-09-14');
  assert.equal(body.words.length, 10);
});

test('GET /api/history is descending', async () => {
  const res = await fetch(`${base}/api/history`);
  const body = await res.json();
  assert.deepEqual(body.dates, ['2026-09-15', '2026-09-14']);
});

test('GET /api/day/:date returns words', async () => {
  const res = await fetch(`${base}/api/day/2026-09-14`);
  const body = await res.json();
  assert.equal(body.date, '2026-09-14');
  assert.equal(body.words.length, 10);
});

test('GET /api/day/bad-date is 400', async () => {
  const res = await fetch(`${base}/api/day/14-09-2026`);
  assert.equal(res.status, 400);
});

test('GET /api/day/missing is 404', async () => {
  const res = await fetch(`${base}/api/day/2026-09-16`);
  assert.equal(res.status, 404);
});
```

此任务跑测试前 `public/` 可以先放一个空的 `index.html`（Task 7 再补全），否则 `GET /` 不是本任务断言范围。

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/api.test.js`

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 实现**

`src/server.js`：

```js
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createWordStore } from './lib/wordStore.js';
import { buildToday } from './lib/today.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

export function createServer(options) {
  const wordsDir = options.wordsDir;
  const publicDir = options.publicDir;
  const now = options.now || (() => new Date());
  const store = createWordStore(wordsDir);

  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/api/today') {
      return json(res, 200, buildToday(now(), store));
    }

    if (req.method === 'GET' && url.pathname === '/api/history') {
      return json(res, 200, { dates: store.listDates() });
    }

    const dayMatch = url.pathname.match(/^\/api\/day\/([^/]+)$/);
    if (req.method === 'GET' && dayMatch) {
      const date = dayMatch[1];
      if (!DATE_RE.test(date)) return json(res, 400, { error: 'INVALID_DATE' });
      const day = store.getDay(date);
      if (!day) return json(res, 404, { error: 'DAY_MISSING' });
      return json(res, 200, day);
    }

    if (req.method === 'GET') {
      const rel = url.pathname === '/' ? '/index.html' : url.pathname;
      const file = path.normalize(path.join(publicDir, rel));
      if (!file.startsWith(path.normalize(publicDir))) {
        res.writeHead(403);
        return res.end();
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404);
        return res.end('Not found');
      }
      const ext = path.extname(file);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      return res.end(fs.readFileSync(file));
    }

    res.writeHead(405);
    res.end();
  });
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
  const port = Number(process.env.PORT || 3000);
  const server = createServer({
    wordsDir: path.join(root, 'data/words'),
    publicDir: path.join(root, 'public')
  });
  server.listen(port, '0.0.0.0', () => {
    console.log(`listening on ${port}`);
  });
}
```

先写 `public/index.html` 占位：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>每日英语</title></head>
<body>ok</body>
</html>
```

- [ ] **Step 4: 再跑测试**

Run: `node --test tests/api.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/server.js tests/api.test.js public/index.html
git commit -m "feat: serve today, history, and day APIs"
```

---

### Task 7: 前端页面

**Files:**
- Modify: `public/index.html`
- Create: `public/styles.css`
- Create: `public/app.js`

- [ ] **Step 1: 写页面结构**

`public/index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>信息中心 · 每日英语</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <header class="top">
    <p class="brand">信息中心 · 每日英语</p>
    <p id="clock" class="clock"></p>
  </header>
  <main>
    <section id="today"></section>
    <section class="history-block">
      <button type="button" id="history-toggle">查看历史</button>
      <div id="history" hidden></div>
    </section>
  </main>
  <script src="/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 写样式**

`public/styles.css`：白底、深字、卡片边框、最大宽度 720px 居中。抽背未展开时 `.zh` 使用 `display: none`；卡片 `.open .zh` 显示。不要渐变、不要阴影、不要 emoji。手机宽度下卡片内文字可完整阅读。

```css
:root {
  color: #1a1a1a;
  background: #f6f4ef;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
body { margin: 0; }
.top, main { max-width: 720px; margin: 0 auto; padding: 16px; }
.brand { margin: 0; font-size: 14px; letter-spacing: 0.04em; }
.clock { margin: 4px 0 0; color: #555; }
h1 { font-size: 22px; margin: 16px 0 8px; }
.note { color: #555; margin: 0 0 16px; }
.card {
  border: 1px solid #cfc8ba;
  background: #fff;
  padding: 14px 16px;
  margin: 0 0 10px;
  cursor: default;
}
.card.recite { cursor: pointer; }
.word { font-size: 20px; font-weight: 650; }
.phonetic { color: #666; margin-left: 8px; }
.example { margin: 8px 0 0; }
.zh { margin-top: 6px; }
.card.recite:not(.open) .zh { display: none; }
.hint { color: #888; font-size: 13px; }
button {
  border: 1px solid #444;
  background: #fff;
  padding: 8px 12px;
  cursor: pointer;
}
.history-block { margin-top: 24px; }
.history-list { list-style: none; padding: 0; }
.history-list button { margin: 6px 6px 0 0; }
```

- [ ] **Step 3: 写前端逻辑**

`public/app.js`：

```js
const weekdayNames = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function wordCard(word, recite) {
  return `
    <article class="card ${recite ? 'recite' : ''}">
      <div><span class="word">${escapeHtml(word.word)}</span><span class="phonetic">${escapeHtml(word.phonetic)}</span></div>
      <p class="zh">${escapeHtml(word.meaning)}</p>
      <p class="example">${escapeHtml(word.example)}</p>
      <p class="zh">${escapeHtml(word.exampleZh)}</p>
      ${recite ? '<p class="hint closed-only">点击显示中文</p>' : ''}
    </article>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderToday(payload, clockText) {
  document.getElementById('clock').textContent = clockText;
  const root = document.getElementById('today');
  const recite = payload.mode === 'recite';
  const cards = payload.words.map((w) => wordCard(w, recite)).join('');
  root.innerHTML = `
    <h1>${escapeHtml(payload.heading)}</h1>
    <p class="note">${escapeHtml(payload.message || (recite ? '来自上一学习日 · 现场口头，系统不记分' : ''))}</p>
    ${cards}
  `;
  root.querySelectorAll('.card.recite').forEach((card) => {
    card.addEventListener('click', () => card.classList.toggle('open'));
  });
}

async function loadToday() {
  const payload = await fetch('/api/today').then((r) => r.json());
  const now = new Date();
  const stamp = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).format(now);
  renderToday(payload, stamp);
}

async function loadHistory() {
  const box = document.getElementById('history');
  const data = await fetch('/api/history').then((r) => r.json());
  box.innerHTML = `<ul class="history-list">${data.dates.map((d) => `<li><button type="button" data-date="${d}">${d}</button></li>`).join('')}</ul><div id="history-day"></div>`;
  box.querySelectorAll('button[data-date]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const day = await fetch(`/api/day/${btn.dataset.date}`).then((r) => r.json());
      document.getElementById('history-day').innerHTML = `
        <h1>${day.date} · 复习</h1>
        ${day.words.map((w) => wordCard(w, false)).join('')}
      `;
    });
  });
}

document.getElementById('history-toggle').addEventListener('click', async () => {
  const box = document.getElementById('history');
  box.hidden = !box.hidden;
  if (!box.hidden && !box.dataset.loaded) {
    await loadHistory();
    box.dataset.loaded = '1';
  }
});

loadToday();
```

抽背提示「点击显示中文」在卡片 `.open` 后应隐藏。在 CSS 中补：

```css
.card.recite.open .closed-only { display: none; }
```

- [ ] **Step 4: 启动并手测**

Run: `node src/server.js`（先用夹具：临时把 `src/server.js` 的默认 `wordsDir` 对着 `tests/fixtures/words`，或先完成 Task 8 再测完整词库）。

本步至少用夹具启动，确认：卡片能渲染、历史能打开。抽背点开中文要在有 `mode=recite` 的时刻测（可用改系统时间，或临时把 `createServer` 的 `now` 写成周二 8:00；测完改回）。

Expected: 页面标题为「信息中心 · 每日英语」。

- [ ] **Step 5: 跑全部单测后 Commit**

Run: `npm test`

Expected: PASS

```bash
git add public/index.html public/styles.css public/app.js
git commit -m "feat: add daily words and recite-reveal UI"
```

---

### Task 8: 一年词库

**Files:**
- Create: `scripts/learning-days.js`
- Create: `scripts/validate-word-bank.mjs`
- Create: `data/words/YYYY-MM-DD.json`（208 个文件）
- Test: `tests/learningDays.test.js`

- [ ] **Step 1: 写学习日列表测试**

`tests/learningDays.test.js`：

```js
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
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/learningDays.test.js`

Expected: FAIL，`Cannot find module`。

- [ ] **Step 3: 实现日期列表**

`scripts/learning-days.js`：

```js
export function listLearningDays() {
  const days = [];
  let utc = Date.UTC(2026, 8, 14);
  const end = Date.UTC(2027, 8, 9);
  while (utc <= end) {
    const d = new Date(utc);
    const weekday = d.getUTCDay();
    if (weekday >= 1 && weekday <= 4) {
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      days.push(`${y}-${m}-${day}`);
    }
    utc += 86400000;
  }
  return days;
}
```

- [ ] **Step 4: 再跑日期测试**

Run: `node --test tests/learningDays.test.js`

Expected: PASS

- [ ] **Step 5: 写校验脚本**

`scripts/validate-word-bank.mjs`：

```js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listLearningDays } from './learning-days.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data/words');
const days = listLearningDays();
const seen = new Set();
const errors = [];

for (const date of days) {
  const fp = path.join(dir, `${date}.json`);
  if (!fs.existsSync(fp)) {
    errors.push(`missing ${date}`);
    continue;
  }
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (data.date !== date) errors.push(`${date}: date field mismatch`);
  if (!Array.isArray(data.words) || data.words.length !== 10) {
    errors.push(`${date}: need 10 words`);
    continue;
  }
  const office = data.words.filter((w) => w.category === 'office').length;
  const it = data.words.filter((w) => w.category === 'it').length;
  if (office !== 5 || it !== 5) errors.push(`${date}: need 5 office + 5 it`);
  for (const w of data.words) {
    for (const key of ['word', 'phonetic', 'meaning', 'example', 'exampleZh', 'category']) {
      if (!w[key]) errors.push(`${date}: missing ${key}`);
    }
    const key = String(w.word).trim().toLowerCase();
    if (seen.has(key)) errors.push(`duplicate word ${w.word}`);
    seen.add(key);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`ok: ${days.length} days, ${seen.size} unique words`);
```

- [ ] **Step 6: 生成 208 个词表文件**

在 `data/words/` 为 `listLearningDays()` 的每一天写一个 JSON，格式与规格和夹具相同。

内容约束（必须全部满足，校验脚本会卡住）：

- 职场常用，能在医院信息中心口头用
- 每天恰好 5 `office` + 5 `it`
- `word` 全年不重复（大小写不敏感）
- 短例句 + 中文译文 + IPA 音标
- 办公：开会、邮件、汇报、协作、时间、责任
- 信息化：HIS/EMR、网络、运维、发布、安全、数据、工单（缩写各只出现一次）

实现时按周批量写文件（每次 4 天），每写一批就跑校验看缺哪些日期。不要调用运行时大模型接口。可以把 Task 4 夹具里的 2026-09-14 / 2026-09-15 两天直接作为前两天内容，避免和测试词冲突——正式词库与夹具独立，正式库也可以复用这两天的词，只要全年不重复即可。

- [ ] **Step 7: 跑校验直到通过**

Run: `node scripts/validate-word-bank.mjs`

Expected: `ok: 208 days, 2080 unique words`，exit 0。

- [ ] **Step 8: 全量测试 + Commit**

Run: `npm test`

Expected: PASS

```bash
git add scripts/learning-days.js scripts/validate-word-bank.mjs tests/learningDays.test.js data/words
git commit -m "feat: add one-year hospital IT English word bank"
```

---

### Task 9: 部署文件

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `README.md`

- [ ] **Step 1: Dockerfile**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
COPY data ./data
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/server.js"]
```

- [ ] **Step 2: docker-compose.yml**

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
    restart: unless-stopped
```

- [ ] **Step 3: README.md**

写明：给医院信息中心用；无登录；周一至周四 9 点新词、周二至周五 8 点抽背；抽人不在本系统。

启动：

```bash
npm test
node scripts/validate-word-bank.mjs
node src/server.js
```

Docker：

```bash
docker compose up -d --build
```

内网访问 `http://服务器IP:3000`。时区按服务器 UTC 换算也可以，因为逻辑用 `Asia/Shanghai`，不依赖主机 TZ。可选：容器加 `TZ=Asia/Shanghai`，仅方便看日志。

- [ ] **Step 4: 用正式词库跑 API 抽检**

写一个一次性命令，确认服务能读到 2026-09-14：

```bash
node --input-type=module -e "import { createWordStore } from './src/lib/wordStore.js'; const s=createWordStore('data/words'); const d=s.getDay('2026-09-14'); if (!d || d.words.length!==10) process.exit(1); console.log('day ok', d.words.length);"
```

Expected: `day ok 10`

- [ ] **Step 5: Commit**

```bash
git add Dockerfile docker-compose.yml README.md
git commit -m "docs: add Docker deploy for daily English app"
```

---

## 自检

规格覆盖：

- 日程表全部时刻 → Task 3、Task 5、Task 6
- 抽背点开中文、新词/历史全文 → Task 7
- 一年词库与 5+5 去重 → Task 8
- API 三个端点、400/404、词库用尽 → Task 5、Task 6
- 无登录无管理页无大模型 → 全计划未引入
- Docker 部署 → Task 9

类型名：`resolveView` `buildToday` `createWordStore` `createServer` `BANK_END` 前后一致。
