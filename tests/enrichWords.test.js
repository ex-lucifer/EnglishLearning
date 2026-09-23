import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { enrichEntry, looksTemplated, EXPANSIONS } from '../scripts/enrich-words.mjs';

const chunkDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../scripts/chunks');

function loadChunkRows() {
  const rows = [];
  for (const name of fs.readdirSync(chunkDir).filter((n) => n.endsWith('.txt')).sort()) {
    const category = name.startsWith('office') ? 'office' : 'it';
    for (const raw of fs.readFileSync(path.join(chunkDir, name), 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const parts = line.split('|');
      const [word, phonetic, meaning, kind, example = '', exampleZh = ''] = parts;
      rows.push({
        word: word.trim(),
        phonetic: phonetic.trim(),
        meaning: meaning.trim(),
        kind: kind.trim(),
        example: example.trim(),
        exampleZh: exampleZh.trim(),
        category
      });
    }
  }
  return rows;
}

function enrichAll() {
  return loadChunkRows().map((row) => ({
    kind: row.kind,
    ...enrichEntry({ ...row }, row.kind)
  }));
}

test('abbreviation meaning includes English expansion', () => {
  const his = enrichEntry({
    word: 'HIS',
    phonetic: '/ˌeɪtʃ aɪ ˈes/',
    meaning: '医院信息系统',
    example: '',
    exampleZh: '',
    category: 'it'
  }, 'acr');
  assert.match(his.meaning, /Hospital Information System/);
  assert.match(his.example, /Hospital Information System/);
  assert.equal(looksTemplated(his.example), false);
});

test('office RSVP uses please-reply, not a server test', () => {
  const row = enrichEntry({
    word: 'RSVP',
    phonetic: '/ˌɑːr es viː ˈpiː/',
    meaning: '回复出席',
    example: '',
    exampleZh: '',
    category: 'office'
  }, 'acr');
  assert.match(row.meaning, /please reply/i);
  assert.match(row.example, /please reply/i);
  assert.doesNotMatch(row.example, /server|Resource Reservation/i);
});

test('office noun example is not the old meeting template', () => {
  const row = enrichEntry({
    word: 'webinar',
    phonetic: '/ˈwebɪnɑː/',
    meaning: '网络研讨会',
    example: '',
    exampleZh: '',
    category: 'office'
  }, 'n');
  assert.equal(looksTemplated(row.example), false);
  assert.match(row.example, /webinar/);
});

test('every acronym gets an English expansion', () => {
  const missing = [];
  for (const row of enrichAll().filter((r) => r.kind === 'acr')) {
    const expansion = EXPANSIONS[row.word] || EXPANSIONS[row.word.toUpperCase()];
    if (!expansion) missing.push(row.word);
    else if (!row.meaning.includes(expansion) && !row.meaning.includes('（')) missing.push(`${row.word}:meaning`);
  }
  assert.deepEqual(missing, []);
});

test('office acronyms never use IT ops sentences', () => {
  const bad = /backup server|would not open|Do not restart|clinic opens|Resource Reservation/i;
  const hits = enrichAll()
    .filter((r) => r.category === 'office' && r.kind === 'acr' && bad.test(r.example))
    .map((r) => `${r.word}: ${r.example}`);
  assert.deepEqual(hits, []);
});

test('metrics people attacks and messages are not treated as restartable apps', () => {
  const words = new Set([
    'RTO', 'RPO', 'MTTR', 'MTBF', 'IOPS', 'SLO', 'SLI', 'QoS',
    'DBA', 'CAB', 'SOC', 'DDoS', 'CVE', 'ACK', 'NACK', 'MAR',
    'BYOD', 'UAT', 'CAPA', 'PIP', 'ETA', 'POC', 'SME', 'PMO'
  ]);
  const bad = /would not open|Do not restart|tested .+ on the backup server/i;
  const hits = enrichAll()
    .filter((r) => words.has(r.word) && bad.test(r.example))
    .map((r) => `${r.word}: ${r.example}`);
  assert.deepEqual(hits, []);
});

test('handwritten phrase examples are kept', () => {
  const row = enrichEntry({
    word: 'out of office',
    phonetic: '/aʊt əv ˈɒfɪs/',
    meaning: '不在办公室',
    example: 'I am out of office until Thursday.',
    exampleZh: '我周四前不在办公室。',
    category: 'office'
  }, 'phr');
  assert.equal(row.example, 'I am out of office until Thursday.');
  assert.doesNotMatch(row.example, /shared drive|today’s notes/);
});

test('awkward verbs stay grammatical', () => {
  const bank = enrichAll();
  const byWord = Object.fromEntries(bank.map((r) => [r.word, r.example]));
  assert.doesNotMatch(byWord.apologize, /apologize the urgent tickets/i);
  assert.doesNotMatch(byWord.checkout, /checkout it/i);
  assert.doesNotMatch(byWord.clone, /clone this with the duty nurse/i);
  assert.doesNotMatch(byWord.gpupdate, /gpupdate the urgent tickets/i);
  assert.match(byWord.apologize, /apolog/i);
});

test('awkward adjectives stay grammatical', () => {
  const bank = enrichAll();
  const byWord = Object.fromEntries(bank.map((r) => [r.word, r.example]));
  assert.doesNotMatch(byWord.overdue, /Stay overdue/i);
  assert.doesNotMatch(byWord.biweekly, /Stay biweekly/i);
  assert.doesNotMatch(byWord.accountable, /timeline looks accountable/i);
  assert.doesNotMatch(byWord.available, /This request is available/i);
});
