import fs from 'node:fs';

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const n = process.argv[2];
const tsv = fs.readFileSync(`scripts/examples/batch-${n}.tsv`, 'utf8').trim().split(/\n/);
const words = tsv.map((l) => l.split('\t')[2]);
const data = JSON.parse(fs.readFileSync(`scripts/examples/batch-${n}.json`, 'utf8'));
const keys = Object.keys(data);
const missing = words.filter((w) => !data[w]);
const wordSet = new Set(words);
const extra = keys.filter((k) => !wordSet.has(k));
const bad = [];
const frames = new Map();
for (const w of words) {
  const pair = data[w];
  if (!pair) continue;
  const [en, zh] = pair;
  if (!en || !zh) bad.push([w, 'empty']);
  const re = new RegExp(esc(w), 'i');
  if (en && !re.test(en)) bad.push([w, 'missing word', en]);
  if (/add the .+ to today|who will own the |shared drive|screenshot of the |backup server|would not open|Do not restart|clinic opens|night batch|on call for the /i.test(en || '')) {
    bad.push([w, 'template', en]);
  }
  const frame = (en || '').replace(new RegExp(esc(w), 'ig'), 'WORD');
  frames.set(frame, (frames.get(frame) || 0) + 1);
}
const dup = [...frames.entries()].filter(([, c]) => c > 2).sort((a, b) => b[1] - a[1]);
console.log(JSON.stringify({
  n,
  tsv: words.length,
  keys: keys.length,
  missing,
  extra,
  badCount: bad.length,
  bad: bad.slice(0, 25),
  dupFrames: dup.slice(0, 12)
}, null, 2));
