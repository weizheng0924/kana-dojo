import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldUnlockNextTier } from '../js/unlock.js';

test('tier 內有假名測不到 3 次,不解鎖', () => {
  const kanaStats = {
    'あ': { seen: 5, correct: 5, wrong: 0 },
    'い': { seen: 2, correct: 2, wrong: 0 }, // 未滿 3 次
  };
  assert.equal(shouldUnlockNextTier(kanaStats, ['あ', 'い']), false);
});

test('全部測滿 3 次但正確率低於 80%,不解鎖', () => {
  const kanaStats = {
    'あ': { seen: 10, correct: 5, wrong: 5 },
    'い': { seen: 10, correct: 5, wrong: 5 },
  };
  assert.equal(shouldUnlockNextTier(kanaStats, ['あ', 'い']), false);
});

test('全部測滿 3 次且整體正確率達 80%,解鎖', () => {
  const kanaStats = {
    'あ': { seen: 10, correct: 9, wrong: 1 },
    'い': { seen: 10, correct: 7, wrong: 3 },
  };
  // 整體正確率 = (9+7)/(10+10) = 0.8
  assert.equal(shouldUnlockNextTier(kanaStats, ['あ', 'い']), true);
});

test('tier 內有假名完全沒測過(不存在於 kanaStats),不解鎖', () => {
  const kanaStats = {
    'あ': { seen: 10, correct: 10, wrong: 0 },
  };
  assert.equal(shouldUnlockNextTier(kanaStats, ['あ', 'い']), false);
});
