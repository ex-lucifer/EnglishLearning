import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { enrichEntry } from './enrich-words.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const chunkDir = path.join(root, 'chunks');

function loadCategory(prefix, category) {
  const files = fs.readdirSync(chunkDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.txt'))
    .sort();
  const rows = [];
  for (const name of files) {
    const text = fs.readFileSync(path.join(chunkDir, name), 'utf8');
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const parts = line.split('|');
      const [word, phonetic, meaning, kind, example = '', exampleZh = ''] = parts;
      if (!word || !phonetic || !meaning || !kind) {
        throw new Error(`bad line in ${name}: ${line}`);
      }
      rows.push(enrichEntry({
        word: word.trim(),
        phonetic: phonetic.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        exampleZh: exampleZh.trim(),
        category
      }, kind.trim()));
    }
  }
  return rows;
}

const office = loadCategory('office-', 'office');
const it = loadCategory('it-', 'it');
console.log(`loaded office=${office.length} it=${it.length}`);
// Chunks are the source of truth and must parse to exactly 1040+1040
// (the same first 1040 of each category already shipped in data/words).

if (office.length !== 1040 || it.length !== 1040) {
  console.error(
    `assemble needs exactly 1040 office and 1040 it entries after parsing, got office=${office.length} it=${it.length}`
  );
  process.exit(1);
}

const seen = new Set();
const dups = [];
for (const w of [...office, ...it]) {
  const key = w.word.trim().toLowerCase();
  if (seen.has(key)) dups.push(w.word);
  seen.add(key);
}
if (dups.length) {
  console.error(`duplicates: ${dups.join(', ')}`);
  process.exit(1);
}

const bank = [];
for (let i = 0; i < 1040; i += 5) {
  bank.push(...office.slice(i, i + 5), ...it.slice(i, i + 5));
}

fs.writeFileSync(path.join(root, 'word-bank-data.json'), `${JSON.stringify(bank)}\n`);
console.log(`wrote word-bank-data.json with ${bank.length} entries`);
