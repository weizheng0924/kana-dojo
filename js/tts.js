// js/tts.js

export function isTtsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakKana(text) {
  if (!isTtsSupported()) return;
  try {
    window.speechSynthesis.cancel(); // 避免排隊疊加
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  } catch {
    // 靜默失敗,不影響測驗流程
  }
}
