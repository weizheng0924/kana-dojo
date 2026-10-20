import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TIERS, buildKanaIndex } from '../data/kana.js';

test('每個 tier 都有唯一 id 且依序 0~5', () => {
  const ids = TIERS.map(t => t.id);
  assert.deepEqual(ids, [0, 1, 2, 3, 4, 5]);
});

test('所有假名在整個資料表中沒有重複', () => {
  const seen = new Set();
  for (const tier of TIERS) {
    for (const [kana] of tier.items) {
      assert.equal(seen.has(kana), false, `重複的假名: ${kana}`);
      seen.add(kana);
    }
  }
});

test('buildKanaIndex 攤平後筆數等於所有 tier items 總和', () => {
  const total = TIERS.reduce((sum, t) => sum + t.items.length, 0);
  const index = buildKanaIndex();
  assert.equal(Object.keys(index).length, total);
});

test('每筆資料都有 romaji 與 group', () => {
  const index = buildKanaIndex();
  for (const [kana, info] of Object.entries(index)) {
    assert.ok(info.romaji.length > 0, `${kana} 缺少 romaji`);
    assert.ok(info.group.length > 0, `${kana} 缺少 group`);
  }
});
