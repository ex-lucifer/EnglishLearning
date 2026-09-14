import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

test('package.json exists and is ESM', () => {
  const require = createRequire(import.meta.url);
  const pkg = require('../package.json');
  assert.equal(pkg.type, 'module');
  assert.equal(pkg.scripts.test, 'node --test tests/**/*.test.js');
});
