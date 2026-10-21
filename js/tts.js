// js/tts.js

// 不同平台常見的日文女聲名稱(macOS/iOS、Chrome、Windows/Edge)
const FEMALE_VOICE_NAME_HINTS = [
  'kyoko', 'o-ren', 'ayumi', 'nanami', 'haruka', 'sayaka', 'mizuki', 'female',
];
// 已知的男聲名稱,優先排除
const MALE_VOICE_NAME_HINTS = ['otoya', 'ichiro', 'male'];

let cachedVoices = [];

export function isTtsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function refreshVoices() {
  if (!isTtsSupported()) return;
  cachedVoices = window.speechSynthesis.getVoices();
}

if (isTtsSupported()) {
  refreshVoices();
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
}

function pickJapaneseVoice() {
  const jaVoices = cachedVoices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ja'));
  if (jaVoices.length === 0) return null;

  const female = jaVoices.find(v => {
    const name = v.name.toLowerCase();
    return FEMALE_VOICE_NAME_HINTS.some(hint => name.includes(hint));
  });
  if (female) return female;

  const notMale = jaVoices.find(v => {
    const name = v.name.toLowerCase();
    return !MALE_VOICE_NAME_HINTS.some(hint => name.includes(hint));
  });
  return notMale || jaVoices[0];
}

export function speakKana(text) {
  if (!isTtsSupported()) return;
  try {
    refreshVoices(); // 有些瀏覽器第一次呼叫時語音清單才會就緒
    window.speechSynthesis.cancel(); // 避免排隊疊加
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    const voice = pickJapaneseVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch {
    // 靜默失敗,不影響測驗流程
  }
}
