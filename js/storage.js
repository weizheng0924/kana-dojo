// js/storage.js
const KEY = 'kana-app-state';

export function defaultState() {
  return {
    version: 1,
    unlockedTier: 0,
    kana: {},
    dailyTask: null,
    streak: { current: 0, longest: 0, lastCompletedDate: null },
    settings: { ttsEnabled: true },
  };
}

export function createStorage(backend) {
  let persistent = true;
  let memoryState = null;

  // 啟動時探測 backend 是否真的可用
  try {
    backend.setItem('__probe__', '1');
    backend.removeItem('__probe__');
  } catch {
    persistent = false;
    memoryState = defaultState();
  }

  function load() {
    if (!persistent) return memoryState;
    try {
      const raw = backend.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed };
    } catch {
      return defaultState();
    }
  }

  function save(state) {
    if (!persistent) {
      memoryState = state;
      return;
    }
    try {
      backend.setItem(KEY, JSON.stringify(state));
    } catch {
      persistent = false;
      memoryState = state;
    }
  }

  function isPersistent() {
    return persistent;
  }

  return { load, save, isPersistent };
}

// 瀏覽器環境下的預設實例(app.js 使用這個)
export function createBrowserStorage() {
  return createStorage(window.localStorage);
}
