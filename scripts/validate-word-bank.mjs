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
