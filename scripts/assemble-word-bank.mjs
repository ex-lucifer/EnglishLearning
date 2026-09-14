import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const chunkDir = path.join(root, 'chunks');

function hash(str) {
  let h = 0;
  for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function pick(word, arr) {
  return arr[hash(word) % arr.length];
}

const FIXTURES = {
  agenda: ['Please send the agenda before the meeting.', '开会前请把议程发出来。'],
  'follow-up': ['I will send a follow-up email today.', '我今天会发一封跟进邮件。'],
  handover: ['Finish the handover before noon.', '请在中午前完成交接。'],
  deadline: ['The deadline is Friday afternoon.', '截止日期是周五下午。'],
  briefing: ['We have a short briefing at nine.', '我们九点有一个短简报。'],
  clarify: ['Can you clarify the requirement in writing?', '能否书面澄清一下这个需求？'],
  postpone: ['We had to postpone the upgrade to next week.', '我们不得不把升级推迟到下周。'],
  minutes: ['Please share the minutes after the meeting.', '会后请分享会议纪要。'],
  owner: ['Who is the owner of this project?', '这个项目的负责人是谁？'],
  update: ['Send a brief update by end of day.', '请在下班前发一个简短更新。'],
  deploy: ['We will deploy the patch tonight.', '我们今晚会部署这个补丁。'],
  outage: ['The HIS outage lasted 20 minutes.', 'HIS 中断持续了 20 分钟。'],
  EMR: ['The EMR is slow this morning.', '今天早上电子病历很慢。'],
  rollback: ['We had to rollback the release.', '我们不得不回滚这次发布。'],
  ticket: ['Please open a ticket for this bug.', '请为这个故障开一张工单。'],
  HIS: ['The HIS login is slow this morning.', '今天早上 HIS 登录很慢。'],
  patch: ['Apply the security patch tonight.', '今晚请安装这个安全补丁。'],
  backup: ['Verify the nightly backup completed.', '请确认夜间备份已完成。'],
  firewall: ['The firewall blocked the new port.', '防火墙拦截了这个新端口。'],
  latency: ['Network latency spiked during the outage.', '中断期间网络延迟明显升高。']
};

function makeFields(word, meaning, kind, category, customEn, customZh) {
  if (FIXTURES[word]) {
    return { example: FIXTURES[word][0], exampleZh: FIXTURES[word][1] };
  }
  if (customEn && customZh) {
    return { example: customEn, exampleZh: customZh };
  }
  if (kind === 'v') {
    return {
      example: pick(word, [
        `Please ${word} this before noon.`,
        `Can you ${word} it today?`,
        `We need to ${word} this by Friday.`,
        `I will ${word} it after the meeting.`,
        `Let's ${word} this first.`
      ]),
      exampleZh: pick(word, [
        `请在中午前${meaning}这个。`,
        `你今天能${meaning}一下吗？`,
        `我们周五前需要${meaning}这个。`,
        `会后我会${meaning}它。`,
        `我们先${meaning}这个吧。`
      ])
    };
  }
  if (kind === 'adj') {
    return {
      example: pick(word, [
        `This request is ${word}.`,
        `Please keep this ${word}.`,
        `The timeline looks ${word}.`,
        `Stay ${word} in the meeting.`
      ]),
      exampleZh: pick(word, [
        `这个请求是${meaning}的。`,
        `请保持${meaning}。`,
        `时间看起来${meaning}。`,
        `会上请保持${meaning}。`
      ])
    };
  }
  if (kind === 'adv') {
    return {
      example: `Please handle this ${word}.`,
      exampleZh: `请${meaning}处理这件事。`
    };
  }
  if (kind === 'acr') {
    return {
      example: category === 'it'
        ? `The ${word} is slow this morning.`
        : `Please put ${word} on the email.`,
      exampleZh: category === 'it'
        ? `今天早上 ${word} 很慢。`
        : `请在邮件里注明 ${word}。`
    };
  }
  const nounEn = category === 'it'
    ? [
        `Please check the ${word}.`,
        `We need the ${word} before go-live.`,
        `The ${word} is in production.`,
        `Who supports this ${word}?`,
        `Please review the ${word} after the patch.`
      ]
    : [
        `Please review the ${word}.`,
        `I updated the ${word} this morning.`,
        `The ${word} is ready for review.`,
        `Who is handling the ${word}?`,
        `Please share the ${word} after the meeting.`
      ];
  const nounZh = category === 'it'
    ? [
        `请检查一下这个${meaning}。`,
        `上线前我们需要这个${meaning}。`,
        `这个${meaning}已在生产环境。`,
        `谁支持这个${meaning}？`,
        `打补丁后请审阅这个${meaning}。`
      ]
    : [
        `请审阅一下这个${meaning}。`,
        `我今天早上更新了这个${meaning}。`,
        `这个${meaning}已经可以审阅了。`,
        `谁在处理这个${meaning}？`,
        `会后请分享这个${meaning}。`
      ];
  return { example: pick(word, nounEn), exampleZh: pick(word, nounZh) };
}

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
      const [word, phonetic, meaning, kind, customEn, customZh] = parts;
      if (!word || !phonetic || !meaning || !kind) {
        throw new Error(`bad line in ${name}: ${line}`);
      }
      const fields = makeFields(word, meaning, kind, category, customEn, customZh);
      rows.push({
        word: word.trim(),
        phonetic: phonetic.trim(),
        meaning: meaning.trim(),
        example: fields.example,
        exampleZh: fields.exampleZh,
        category
      });
    }
  }
  return rows;
}

const office = loadCategory('office-', 'office');
const it = loadCategory('it-', 'it');
console.log(`loaded office=${office.length} it=${it.length}`);

if (office.length < 1040) throw new Error(`need 1040 office words, got ${office.length}`);
if (it.length < 1040) throw new Error(`need 1040 it words, got ${it.length}`);

const officeUse = office.slice(0, 1040);
const itUse = it.slice(0, 1040);
const seen = new Set();
const dups = [];
for (const w of [...officeUse, ...itUse]) {
  const key = w.word.trim().toLowerCase();
  if (seen.has(key)) dups.push(w.word);
  seen.add(key);
}
if (dups.length) throw new Error(`duplicates: ${dups.join(', ')}`);

const bank = [];
for (let i = 0; i < 1040; i += 5) {
  bank.push(...officeUse.slice(i, i + 5), ...itUse.slice(i, i + 5));
}

fs.writeFileSync(path.join(root, 'word-bank-data.json'), `${JSON.stringify(bank)}\n`);
console.log(`wrote word-bank-data.json with ${bank.length} entries`);
