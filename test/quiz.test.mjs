import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeWeight, pickDailyQuestions, pickDistractors } from '../js/quiz.js';

test('從未作答過的假名(seen=0)權重為 1', () => {
  assert.equal(computeWeight({ seen: 0, correct: 0, wrong: 0 }), 1);
});

test('答錯率越高權重越高', () => {
  const allCorrect = computeWeight({ seen: 10, correct: 10, wrong: 0 });
  const halfWrong = computeWeight({ seen: 10, correct: 5, wrong: 5 });
  assert.ok(halfWrong > allCorrect);
});

test('pickDailyQuestions 回傳指定數量且不重複(題庫足夠時)', () => {
  const pool = ['あ', 'い', 'う', 'え', 'お'];
  const kanaStats = {};
  let i = 0;
  const rng = () => { i += 1; return (i * 0.137) % 1; }; // 固定但分散的序列
  const result = pickDailyQuestions(pool, kanaStats, 3, rng);
  assert.equal(result.length, 3);
  assert.equal(new Set(result).size, 3);
  for (const kana of result) assert.ok(pool.includes(kana));
});

test('pickDailyQuestions 當題庫小於題數時允許重複,但仍回傳要求的數量', () => {
  const pool = ['あ', 'い'];
  const result = pickDailyQuestions(pool, {}, 5, () => 0.5);
  assert.equal(result.length, 5);
});

test('pickDistractors 回傳指定數量、不含正確答案本身、且不重複', () => {
  const pool = [
    ['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e'], ['お', 'o'],
  ];
  const result = pickDistractors('あ', 'a', pool, 3, () => 0.4);
  assert.equal(result.length, 3);
  assert.ok(!result.includes('a'));
  assert.equal(new Set(result).size, 3);
});
