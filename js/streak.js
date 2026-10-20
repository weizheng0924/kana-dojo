// js/streak.js

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return getLocalDateString(d);
}

export function updateStreakOnComplete(streak, todayStr) {
  if (streak.lastCompletedDate === todayStr) {
    return { ...streak };
  }
  const yesterday = addDays(todayStr, -1);
  const newCurrent = streak.lastCompletedDate === yesterday ? streak.current + 1 : 1;
  return {
    current: newCurrent,
    longest: Math.max(streak.longest, newCurrent),
    lastCompletedDate: todayStr,
  };
}

export function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
