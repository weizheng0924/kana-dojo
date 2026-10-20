// js/unlock.js
const MIN_ATTEMPTS_PER_KANA = 3;
const UNLOCK_ACCURACY_THRESHOLD = 0.8;

export function shouldUnlockNextTier(kanaStats, tierKanaList) {
  if (tierKanaList.length === 0) return false;

  let totalSeen = 0;
  let totalCorrect = 0;

  for (const kana of tierKanaList) {
    const stat = kanaStats[kana];
    if (!stat || stat.seen < MIN_ATTEMPTS_PER_KANA) {
      return false;
    }
    totalSeen += stat.seen;
    totalCorrect += stat.correct;
  }

  return totalCorrect / totalSeen >= UNLOCK_ACCURACY_THRESHOLD;
}
