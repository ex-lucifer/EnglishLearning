import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listLearningDays } from './learning-days.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(root, 'word-bank-data.json'), 'utf8'));
const days = listLearningDays();
const outDir = path.join(root, '../data/words');
fs.mkdirSync(outDir, { recursive: true });

if (data.length !== days.length * 10) {
  throw new Error(`expected ${days.length * 10} words, got ${data.length}`);
}

for (let i = 0; i < days.length; i++) {
  const date = days[i];
  const words = data.slice(i * 10, i * 10 + 10);
  fs.writeFileSync(
    path.join(outDir, `${date}.json`),
    `${JSON.stringify({ date, words }, null, 2)}\n`
  );
}

console.log(`wrote ${days.length} day files`);
