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
