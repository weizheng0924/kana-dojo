// js/quiz.js
const WRONG_RATE_FACTOR = 3;

export function computeWeight(stat) {
  if (!stat || stat.seen === 0) return 1;
  const wrongRate = stat.wrong / stat.seen;
  return 1 + wrongRate * WRONG_RATE_FACTOR;
}

function weightedPick(candidates, weights, rng) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < candidates.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return candidates.length - 1;
}

export function pickDailyQuestions(pool, kanaStats, count, rng = Math.random) {
  const result = [];
  const remaining = [...pool];

  for (let n = 0; n < count; n++) {
    if (remaining.length === 0) {
      // 題庫不足,從完整 pool 重新抽(允許重複)
      remaining.push(...pool);
    }
    const weights = remaining.map(k => computeWeight(kanaStats[k]));
    const idx = weightedPick(remaining, weights, rng);
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}

export function pickDistractors(correctKana, correctRomaji, pool, count, rng = Math.random) {
  const candidates = pool
    .filter(([kana, romaji]) => kana !== correctKana && romaji !== correctRomaji)
    .map(([, romaji]) => romaji);

  const uniqueCandidates = [...new Set(candidates)];
  const result = [];
  const remaining = [...uniqueCandidates];

  while (result.length < count && remaining.length > 0) {
    const idx = Math.floor(rng() * remaining.length);
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}

export function buildQuestion(kana, kanaIndex, allEntries, rng = Math.random) {
  const info = kanaIndex[kana];
  const sameGroup = allEntries.filter(([k, , g]) => g === info.group);
  const pool = sameGroup.length >= 4 ? sameGroup : allEntries;
  const distractors = pickDistractors(kana, info.romaji, pool, 3, rng);
  const options = [...distractors, info.romaji].sort(() => rng() - 0.5);
  return { kana, correctRomaji: info.romaji, options };
}
