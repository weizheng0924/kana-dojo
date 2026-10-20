import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateStreakOnComplete } from '../js/streak.js';

test('第一次完成任務,streak 變成 1', () => {
  const result = updateStreakOnComplete(
    { current: 0, longest: 0, lastCompletedDate: null },
    '2026-10-20'
  );
  assert.deepEqual(result, { current: 1, longest: 1, lastCompletedDate: '2026-10-20' });
});

test('昨天完成過,今天再完成,streak +1', () => {
  const result = updateStreakOnComplete(
    { current: 5, longest: 5, lastCompletedDate: '2026-10-19' },
    '2026-10-20'
  );
  assert.deepEqual(result, { current: 6, longest: 6, lastCompletedDate: '2026-10-20' });
});

test('今天已經完成過,重複呼叫不會再累加', () => {
  const result = updateStreakOnComplete(
    { current: 6, longest: 6, lastCompletedDate: '2026-10-20' },
    '2026-10-20'
  );
  assert.deepEqual(result, { current: 6, longest: 6, lastCompletedDate: '2026-10-20' });
});

test('中斷超過一天,streak 重置為 1,但 longest 保留', () => {
  const result = updateStreakOnComplete(
    { current: 10, longest: 10, lastCompletedDate: '2026-10-15' },
    '2026-10-20'
  );
  assert.deepEqual(result, { current: 1, longest: 10, lastCompletedDate: '2026-10-20' });
});

test('新 streak 若超過 longest,longest 跟著更新', () => {
  const result = updateStreakOnComplete(
    { current: 3, longest: 3, lastCompletedDate: '2026-10-19' },
    '2026-10-20'
  );
  assert.equal(result.longest, 4);
});
