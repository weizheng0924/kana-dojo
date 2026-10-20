# 50音學習 App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 做出一個純前端靜態網頁(Vanilla HTML/CSS/JS,無框架、無建構工具)的 PWA,讓使用者透過每日加權測驗認識 50 音,自動記錄錯題並可回顧複習,可直接部署到 GitHub Pages。

**Architecture:** 資料與邏輯(`data/kana.js`、`js/storage.js`、`js/quiz.js`、`js/unlock.js`、`js/streak.js`)寫成不碰 DOM 的純函式模組,方便用 Node.js 內建 `node --test` 驗證;UI 層(`js/views/*.js` + `js/router.js`)只負責讀取狀態、渲染 DOM、綁定事件,呼叫邏輯模組取得結果後寫回 `storage.js`。`app.js` 是唯一入口,負責初始化與掛載 router。

**Tech Stack:** 純 HTML / CSS / JavaScript(ES Modules,`<script type="module">`),瀏覽器內建 `localStorage`、`Web Speech API`、`Service Worker`;測試用 Node.js 內建 `node:test` + `node:assert`,不安裝任何 npm 套件。

參考規格:`docs/superpowers/specs/2026-10-20-kana-learning-app-design.md`

---

## 檔案結構總覽

```
/
├─ index.html
├─ styles.css
├─ app.js
├─ manifest.json
├─ sw.js
├─ icons/icon-192.png
├─ icons/icon-512.png
├─ data/kana.js
├─ js/storage.js
├─ js/streak.js
├─ js/unlock.js
├─ js/quiz.js
├─ js/tts.js
├─ js/router.js
├─ js/views/dashboard.js
├─ js/views/quiz.js
├─ js/views/result.js
├─ js/views/review.js
├─ test/streak.test.mjs
├─ test/unlock.test.mjs
├─ test/quiz.test.mjs
├─ test/storage.test.mjs
└─ README.md
```

---

### Task 1: 專案骨架(index.html + styles.css 基礎)

**Files:**
- Create: `index.html`
- Create: `styles.css`

- [ ] **Step 1: 建立 `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>50音道場</title>
<meta name="theme-color" content="#2d6a4f">
<link rel="icon" href="icons/icon-192.png">
<link rel="manifest" href="manifest.json">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<div id="banner" class="banner" hidden></div>
<main id="app"></main>
<script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: 建立 `styles.css`(mobile-first 基礎樣式與共用元件類別)**

```css
:root {
  --color-bg: #f7f7f2;
  --color-text: #1b1b1b;
  --color-primary: #2d6a4f;
  --color-primary-dark: #1b4332;
  --color-locked: #d9d9d9;
  --color-weak: #ffd166;
  --color-strong: #74c69d;
  --color-wrong: #e63946;
  --radius: 12px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, "Hiragino Sans", "Noto Sans TC", sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
}

#app {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  padding-bottom: 48px;
}

.banner {
  background: #fff3cd;
  color: #664d03;
  padding: 8px 16px;
  text-align: center;
  font-size: 14px;
}

.btn {
  display: block;
  width: 100%;
  min-height: 48px;
  border: none;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin: 8px 0;
}

.btn:active { background: var(--color-primary-dark); }

.btn-secondary {
  background: #fff;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.kana-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  margin: 12px 0;
}

.kana-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 8px;
  background: var(--color-locked);
  cursor: pointer;
  min-height: 44px;
}

.kana-cell.weak { background: var(--color-weak); }
.kana-cell.strong { background: var(--color-strong); color: #fff; }

.quiz-kana {
  font-size: 96px;
  text-align: center;
  margin: 32px 0;
  cursor: pointer;
}

.option-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.option-btn {
  min-height: 56px;
  font-size: 20px;
  border-radius: var(--radius);
  border: 2px solid var(--color-primary);
  background: #fff;
  color: var(--color-primary);
}

.option-btn.correct { background: var(--color-strong); color: #fff; border-color: var(--color-strong); }
.option-btn.wrong { background: var(--color-wrong); color: #fff; border-color: var(--color-wrong); }

.progress-bar {
  height: 10px;
  background: var(--color-locked);
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0 16px;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
}
```

- [ ] **Step 3: 瀏覽器開啟驗證**

用瀏覽器打開 `index.html`,確認頁面不報錯、`<title>` 顯示「50音道場」、畫面是空的(因為 `app.js` 還沒建立,之後任務會補上)。

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: scaffold index.html and base styles"
```

---

### Task 2: 50音資料表(data/kana.js)

**Files:**
- Create: `data/kana.js`
- Test: `test/kana.test.mjs`

- [ ] **Step 1: 建立 `data/kana.js`**

每個 tier 用 `[kana, romaji]` tuple 陣列定義,並標記所屬「音列群組」(`group`)供之後產生干擾選項使用(同群組的字發音相近,干擾效果較好)。

```javascript
// data/kana.js
export const TIERS = [
  {
    id: 0,
    name: '平假名清音',
    items: [
      ['あ','a','a'], ['い','i','a'], ['う','u','a'], ['え','e','a'], ['お','o','a'],
      ['か','ka','k'], ['き','ki','k'], ['く','ku','k'], ['け','ke','k'], ['こ','ko','k'],
      ['さ','sa','s'], ['し','shi','s'], ['す','su','s'], ['せ','se','s'], ['そ','so','s'],
      ['た','ta','t'], ['ち','chi','t'], ['つ','tsu','t'], ['て','te','t'], ['と','to','t'],
      ['な','na','n'], ['に','ni','n'], ['ぬ','nu','n'], ['ね','ne','n'], ['の','no','n'],
      ['は','ha','h'], ['ひ','hi','h'], ['ふ','fu','h'], ['へ','he','h'], ['ほ','ho','h'],
      ['ま','ma','m'], ['み','mi','m'], ['む','mu','m'], ['め','me','m'], ['も','mo','m'],
      ['や','ya','y'], ['ゆ','yu','y'], ['よ','yo','y'],
      ['ら','ra','r'], ['り','ri','r'], ['る','ru','r'], ['れ','re','r'], ['ろ','ro','r'],
      ['わ','wa','w'], ['を','wo','w'], ['ん','n','w'],
    ],
  },
  {
    id: 1,
    name: '平假名濁音・半濁音',
    items: [
      ['が','ga','g'], ['ぎ','gi','g'], ['ぐ','gu','g'], ['げ','ge','g'], ['ご','go','g'],
      ['ざ','za','z'], ['じ','ji','z'], ['ず','zu','z'], ['ぜ','ze','z'], ['ぞ','zo','z'],
      ['だ','da','d'], ['ぢ','ji','d'], ['づ','zu','d'], ['で','de','d'], ['ど','do','d'],
      ['ば','ba','b'], ['び','bi','b'], ['ぶ','bu','b'], ['べ','be','b'], ['ぼ','bo','b'],
      ['ぱ','pa','p'], ['ぴ','pi','p'], ['ぷ','pu','p'], ['ぺ','pe','p'], ['ぽ','po','p'],
    ],
  },
  {
    id: 2,
    name: '平假名拗音',
    items: [
      ['きゃ','kya','ky'], ['きゅ','kyu','ky'], ['きょ','kyo','ky'],
      ['しゃ','sha','sh'], ['しゅ','shu','sh'], ['しょ','sho','sh'],
      ['ちゃ','cha','ch'], ['ちゅ','chu','ch'], ['ちょ','cho','ch'],
      ['にゃ','nya','ny'], ['にゅ','nyu','ny'], ['にょ','nyo','ny'],
      ['ひゃ','hya','hy'], ['ひゅ','hyu','hy'], ['ひょ','hyo','hy'],
      ['みゃ','mya','my'], ['みゅ','myu','my'], ['みょ','myo','my'],
      ['りゃ','rya','ry'], ['りゅ','ryu','ry'], ['りょ','ryo','ry'],
      ['ぎゃ','gya','gy'], ['ぎゅ','gyu','gy'], ['ぎょ','gyo','gy'],
      ['じゃ','ja','j'], ['じゅ','ju','j'], ['じょ','jo','j'],
      ['びゃ','bya','by'], ['びゅ','byu','by'], ['びょ','byo','by'],
      ['ぴゃ','pya','py'], ['ぴゅ','pyu','py'], ['ぴょ','pyo','py'],
    ],
  },
  {
    id: 3,
    name: '片假名清音',
    items: [
      ['ア','a','a'], ['イ','i','a'], ['ウ','u','a'], ['エ','e','a'], ['オ','o','a'],
      ['カ','ka','k'], ['キ','ki','k'], ['ク','ku','k'], ['ケ','ke','k'], ['コ','ko','k'],
      ['サ','sa','s'], ['シ','shi','s'], ['ス','su','s'], ['セ','se','s'], ['ソ','so','s'],
      ['タ','ta','t'], ['チ','chi','t'], ['ツ','tsu','t'], ['テ','te','t'], ['ト','to','t'],
      ['ナ','na','n'], ['ニ','ni','n'], ['ヌ','nu','n'], ['ネ','ne','n'], ['ノ','no','n'],
      ['ハ','ha','h'], ['ヒ','hi','h'], ['フ','fu','h'], ['ヘ','he','h'], ['ホ','ho','h'],
      ['マ','ma','m'], ['ミ','mi','m'], ['ム','mu','m'], ['メ','me','m'], ['モ','mo','m'],
      ['ヤ','ya','y'], ['ユ','yu','y'], ['ヨ','yo','y'],
      ['ラ','ra','r'], ['リ','ri','r'], ['ル','ru','r'], ['レ','re','r'], ['ロ','ro','r'],
      ['ワ','wa','w'], ['ヲ','wo','w'], ['ン','n','w'],
    ],
  },
  {
    id: 4,
    name: '片假名濁音・半濁音',
    items: [
      ['ガ','ga','g'], ['ギ','gi','g'], ['グ','gu','g'], ['ゲ','ge','g'], ['ゴ','go','g'],
      ['ザ','za','z'], ['ジ','ji','z'], ['ズ','zu','z'], ['ゼ','ze','z'], ['ゾ','zo','z'],
      ['ダ','da','d'], ['ヂ','ji','d'], ['ヅ','zu','d'], ['デ','de','d'], ['ド','do','d'],
      ['バ','ba','b'], ['ビ','bi','b'], ['ブ','bu','b'], ['ベ','be','b'], ['ボ','bo','b'],
      ['パ','pa','p'], ['ピ','pi','p'], ['プ','pu','p'], ['ペ','pe','p'], ['ポ','po','p'],
    ],
  },
  {
    id: 5,
    name: '片假名拗音',
    items: [
      ['キャ','kya','ky'], ['キュ','kyu','ky'], ['キョ','kyo','ky'],
      ['シャ','sha','sh'], ['シュ','shu','sh'], ['ショ','sho','sh'],
      ['チャ','cha','ch'], ['チュ','chu','ch'], ['チョ','cho','ch'],
      ['ニャ','nya','ny'], ['ニュ','nyu','ny'], ['ニョ','nyo','ny'],
      ['ヒャ','hya','hy'], ['ヒュ','hyu','hy'], ['ヒョ','hyo','hy'],
      ['ミャ','mya','my'], ['ミュ','myu','my'], ['ミョ','myo','my'],
      ['リャ','rya','ry'], ['リュ','ryu','ry'], ['リョ','ryo','ry'],
      ['ギャ','gya','gy'], ['ギュ','gyu','gy'], ['ギョ','gyo','gy'],
      ['ジャ','ja','j'], ['ジュ','ju','j'], ['ジョ','jo','j'],
      ['ビャ','bya','by'], ['ビュ','byu','by'], ['ビョ','byo','by'],
      ['ピャ','pya','py'], ['ピュ','pyu','py'], ['ピョ','pyo','py'],
    ],
  },
];

// 攤平成 { kana: { romaji, group, tier } } 方便查找
export function buildKanaIndex() {
  const index = {};
  for (const tier of TIERS) {
    for (const [kana, romaji, group] of tier.items) {
      index[kana] = { romaji, group, tier: tier.id };
    }
  }
  return index;
}

export function getTierKanaList(tierId) {
  const tier = TIERS.find(t => t.id === tierId);
  return tier ? tier.items.map(([kana]) => kana) : [];
}
```

- [ ] **Step 2: 寫資料完整性測試 `test/kana.test.mjs`**

```javascript
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
```

- [ ] **Step 3: 執行測試**

Run: `node --test test/kana.test.mjs`
Expected: 4 個測試全部 PASS

- [ ] **Step 4: Commit**

```bash
git add data/kana.js test/kana.test.mjs
git commit -m "feat: add kana data table with tiers and integrity tests"
```

---

### Task 3: storage.js(localStorage 讀寫 + fallback)

**Files:**
- Create: `js/storage.js`
- Test: `test/storage.test.mjs`

- [ ] **Step 1: 寫失敗測試 `test/storage.test.mjs`**

用假的 `localStorage`(plain object 實作)注入測試,不依賴真瀏覽器環境。

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStorage, defaultState } from '../js/storage.js';

function makeFakeLocalStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
  };
}

test('沒有存過資料時回傳 defaultState', () => {
  const storage = createStorage(makeFakeLocalStorage());
  assert.deepEqual(storage.load(), defaultState());
});

test('save 後 load 可以拿回同樣的資料', () => {
  const storage = createStorage(makeFakeLocalStorage());
  const state = defaultState();
  state.unlockedTier = 2;
  storage.save(state);
  assert.equal(storage.load().unlockedTier, 2);
});

test('localStorage 損毀(JSON.parse 失敗)時回傳 defaultState 而不是丟出例外', () => {
  const fake = makeFakeLocalStorage();
  fake.setItem('kana-app-state', '{not valid json');
  const storage = createStorage(fake);
  assert.deepEqual(storage.load(), defaultState());
});

test('localStorage 完全不可用(getItem 丟例外)時自動退回記憶體模式,不丟出例外', () => {
  const broken = {
    getItem: () => { throw new Error('no storage'); },
    setItem: () => { throw new Error('no storage'); },
    removeItem: () => {},
  };
  const storage = createStorage(broken);
  assert.equal(storage.isPersistent(), false);
  const state = defaultState();
  state.unlockedTier = 3;
  storage.save(state);
  assert.equal(storage.load().unlockedTier, 3);
});
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `node --test test/storage.test.mjs`
Expected: FAIL,因為 `../js/storage.js` 還不存在

- [ ] **Step 3: 實作 `js/storage.js`**

```javascript
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
```

- [ ] **Step 4: 執行測試確認通過**

Run: `node --test test/storage.test.mjs`
Expected: 4 個測試全部 PASS

- [ ] **Step 5: Commit**

```bash
git add js/storage.js test/storage.test.mjs
git commit -m "feat: add storage module with in-memory fallback"
```

---

### Task 4: streak.js(連續天數計算)

**Files:**
- Create: `js/streak.js`
- Test: `test/streak.test.mjs`

- [ ] **Step 1: 寫失敗測試 `test/streak.test.mjs`**

```javascript
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
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `node --test test/streak.test.mjs`
Expected: FAIL,`js/streak.js` 不存在

- [ ] **Step 3: 實作 `js/streak.js`**

```javascript
// js/streak.js

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
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
```

- [ ] **Step 4: 執行測試確認通過**

Run: `node --test test/streak.test.mjs`
Expected: 5 個測試全部 PASS

- [ ] **Step 5: Commit**

```bash
git add js/streak.js test/streak.test.mjs
git commit -m "feat: add streak calculation module"
```

---

### Task 5: unlock.js(階段解鎖判斷)

**Files:**
- Create: `js/unlock.js`
- Test: `test/unlock.test.mjs`

- [ ] **Step 1: 寫失敗測試 `test/unlock.test.mjs`**

```javascript
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
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `node --test test/unlock.test.mjs`
Expected: FAIL,`js/unlock.js` 不存在

- [ ] **Step 3: 實作 `js/unlock.js`**

```javascript
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
```

- [ ] **Step 4: 執行測試確認通過**

Run: `node --test test/unlock.test.mjs`
Expected: 4 個測試全部 PASS

- [ ] **Step 5: Commit**

```bash
git add js/unlock.js test/unlock.test.mjs
git commit -m "feat: add tier unlock logic"
```

---

### Task 6: quiz.js(加權出題 + 干擾選項)

**Files:**
- Create: `js/quiz.js`
- Test: `test/quiz.test.mjs`

- [ ] **Step 1: 寫失敗測試 `test/quiz.test.mjs`**

`pickDailyQuestions` 與 `pickDistractors` 都接受一個 `rng`(回傳 0~1 亂數的函式)參數,方便測試時注入固定序列,確保結果可預期。

```javascript
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
```

- [ ] **Step 2: 執行測試確認失敗**

Run: `node --test test/quiz.test.mjs`
Expected: FAIL,`js/quiz.js` 不存在

- [ ] **Step 3: 實作 `js/quiz.js`**

```javascript
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
```

- [ ] **Step 4: 執行測試確認通過**

Run: `node --test test/quiz.test.mjs`
Expected: 5 個測試全部 PASS

- [ ] **Step 5: Commit**

```bash
git add js/quiz.js test/quiz.test.mjs
git commit -m "feat: add weighted quiz question generation"
```

---

### Task 7: 一次執行全部單元測試

**Files:** 無新檔案

- [ ] **Step 1: 執行完整測試套件**

Run: `node --test test/`
Expected: `kana.test.mjs`、`storage.test.mjs`、`streak.test.mjs`、`unlock.test.mjs`、`quiz.test.mjs` 全部 PASS,總計 22 個測試

- [ ] **Step 2:(若有測試失敗)回到對應 Task 修正後再執行一次,直到全綠**

---

### Task 8: tts.js(發音封裝)

**Files:**
- Create: `js/tts.js`

無自動化測試(瀏覽器專屬 API,無法在 Node 環境測試),改用 Task 15 的手動瀏覽器驗證。

- [ ] **Step 1: 實作 `js/tts.js`**

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add js/tts.js
git commit -m "feat: add TTS wrapper with feature detection"
```

---

### Task 9: router.js(簡易 hash 路由)

**Files:**
- Create: `js/router.js`

- [ ] **Step 1: 實作 `js/router.js`**

```javascript
// js/router.js

export function createRouter(routes, mountEl) {
  function render() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const view = routes[hash] || routes.dashboard;
    mountEl.innerHTML = '';
    view(mountEl);
  }

  function navigate(name) {
    window.location.hash = name;
  }

  window.addEventListener('hashchange', render);

  return { start: render, navigate };
}
```

- [ ] **Step 2: Commit**

```bash
git add js/router.js
git commit -m "feat: add minimal hash-based router"
```

---

### Task 10: views/dashboard.js

**Files:**
- Create: `js/views/dashboard.js`

- [ ] **Step 1: 實作 `js/views/dashboard.js`**

```javascript
// js/views/dashboard.js
import { TIERS } from '../../data/kana.js';
import { speakKana, isTtsSupported } from '../tts.js';

export function renderDashboard(mountEl, { state, navigate }) {
  const wrapper = document.createElement('div');

  const totalDone = state.dailyTask && state.dailyTask.date === todayKey()
    ? state.dailyTask.answeredCount
    : 0;
  const totalQuestions = state.dailyTask && state.dailyTask.date === todayKey()
    ? state.dailyTask.questionIds.length
    : 15;
  const isCompletedToday = state.dailyTask
    && state.dailyTask.date === todayKey()
    && state.dailyTask.completed;

  wrapper.innerHTML = `
    <h1>50音道場</h1>
    <p>連續天數:<strong>${state.streak.current}</strong> 天(最長 ${state.streak.longest} 天)</p>
    <div class="progress-bar"><div class="progress-bar-fill" style="width:${(totalDone / totalQuestions) * 100}%"></div></div>
    <p>今日進度:${totalDone} / ${totalQuestions}</p>
    <div id="kana-grid-container"></div>
    <button class="btn" id="start-btn">${isCompletedToday ? '今日已完成 ✓,再複習一次' : '開始今日任務'}</button>
    <button class="btn btn-secondary" id="review-btn">錯題本</button>
  `;

  const gridContainer = wrapper.querySelector('#kana-grid-container');
  for (const tier of TIERS) {
    const section = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = `${tier.name}${tier.id > state.unlockedTier ? '(未解鎖)' : ''}`;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'kana-grid';
    for (const [kana] of tier.items) {
      const cell = document.createElement('div');
      cell.className = 'kana-cell';
      cell.textContent = kana;

      if (tier.id > state.unlockedTier) {
        cell.classList.add('locked');
      } else {
        const stat = state.kana[kana];
        if (stat && stat.seen > 0) {
          const accuracy = stat.correct / stat.seen;
          cell.classList.add(accuracy >= 0.8 ? 'strong' : 'weak');
        }
        if (isTtsSupported()) {
          cell.addEventListener('click', () => speakKana(kana));
        }
      }
      grid.appendChild(cell);
    }
    section.appendChild(grid);
    gridContainer.appendChild(section);
  }

  wrapper.querySelector('#start-btn').addEventListener('click', () => navigate('quiz'));
  wrapper.querySelector('#review-btn').addEventListener('click', () => navigate('review'));

  mountEl.appendChild(wrapper);
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add js/views/dashboard.js
git commit -m "feat: add dashboard view"
```

---

### Task 11: views/quiz.js

**Files:**
- Create: `js/views/quiz.js`

- [ ] **Step 1: 實作 `js/views/quiz.js`**

```javascript
// js/views/quiz.js
import { TIERS, buildKanaIndex, getTierKanaList } from '../../data/kana.js';
import { pickDailyQuestions, buildQuestion } from '../quiz.js';
import { updateStreakOnComplete, getLocalDateString } from '../streak.js';
import { shouldUnlockNextTier } from '../unlock.js';
import { speakKana, isTtsSupported } from '../tts.js';

export function renderQuiz(mountEl, { state, saveState, navigate }) {
  const today = getLocalDateString();
  const kanaIndex = buildKanaIndex();
  const allEntries = TIERS.flatMap(t => t.items);

  if (!state.dailyTask || state.dailyTask.date !== today) {
    const pool = TIERS.filter(t => t.id <= state.unlockedTier).flatMap(t => t.items.map(([k]) => k));
    state.dailyTask = {
      date: today,
      questionIds: pickDailyQuestions(pool, state.kana, 15),
      answeredCount: 0,
      correctCount: 0,
      completed: false,
    };
    saveState(state);
  }

  const task = state.dailyTask;

  if (task.answeredCount >= task.questionIds.length) {
    finishTask();
    return;
  }

  const currentKana = task.questionIds[task.answeredCount];
  const question = buildQuestion(currentKana, kanaIndex, allEntries);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <p>第 ${task.answeredCount + 1} / ${task.questionIds.length} 題</p>
    <div class="quiz-kana" id="kana-display">${question.kana}</div>
    <div class="option-grid" id="options"></div>
  `;

  const kanaDisplay = wrapper.querySelector('#kana-display');
  if (isTtsSupported()) {
    kanaDisplay.addEventListener('click', () => speakKana(question.kana));
  }

  const optionsEl = wrapper.querySelector('#options');
  for (const option of question.options) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => handleAnswer(option, btn));
    optionsEl.appendChild(btn);
  }

  mountEl.appendChild(wrapper);

  function handleAnswer(selected, btnEl) {
    const correct = selected === question.correctRomaji;
    const allBtns = optionsEl.querySelectorAll('.option-btn');
    allBtns.forEach(b => { b.disabled = true; });
    btnEl.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      [...allBtns].find(b => b.textContent === question.correctRomaji)?.classList.add('correct');
    }

    const stat = state.kana[currentKana] || { seen: 0, correct: 0, wrong: 0 };
    stat.seen += 1;
    if (correct) stat.correct += 1; else { stat.wrong += 1; stat.lastWrongAt = Date.now(); }
    state.kana[currentKana] = stat;

    task.answeredCount += 1;
    if (correct) task.correctCount += 1;

    const tierKanaList = getTierKanaList(state.unlockedTier);
    if (state.unlockedTier < TIERS.length - 1 && shouldUnlockNextTier(state.kana, tierKanaList)) {
      state.unlockedTier += 1;
    }

    saveState(state);

    setTimeout(() => {
      mountEl.innerHTML = '';
      renderQuiz(mountEl, { state, saveState, navigate });
    }, 800);
  }

  function finishTask() {
    if (!task.completed) {
      task.completed = true;
      state.streak = updateStreakOnComplete(state.streak, today);
      saveState(state);
    }
    navigate('result');
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/views/quiz.js
git commit -m "feat: add quiz view with answer handling and unlock check"
```

---

### Task 12: views/result.js

**Files:**
- Create: `js/views/result.js`

- [ ] **Step 1: 實作 `js/views/result.js`**

```javascript
// js/views/result.js
import { getLocalDateString } from '../streak.js';

export function renderResult(mountEl, { state, navigate }) {
  const today = getLocalDateString();
  const task = state.dailyTask && state.dailyTask.date === today ? state.dailyTask : null;
  const total = task ? task.questionIds.length : 0;
  const correct = task ? task.correctCount : 0;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <h1>今日任務完成!</h1>
    <p>正確率:${accuracy}%(${correct} / ${total})</p>
    <p>目前連續天數:${state.streak.current} 天</p>
    <button class="btn" id="back-btn">回首頁</button>
  `;
  wrapper.querySelector('#back-btn').addEventListener('click', () => navigate('dashboard'));
  mountEl.appendChild(wrapper);
}
```

- [ ] **Step 2: Commit**

```bash
git add js/views/result.js
git commit -m "feat: add result view"
```

---

### Task 13: views/review.js

**Files:**
- Create: `js/views/review.js`

- [ ] **Step 1: 實作 `js/views/review.js`**

```javascript
// js/views/review.js
import { TIERS, buildKanaIndex } from '../../data/kana.js';
import { pickDailyQuestions, buildQuestion } from '../quiz.js';
import { speakKana, isTtsSupported } from '../tts.js';

export function renderReview(mountEl, { state, saveState, navigate }) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <h1>錯題本</h1>
    <div id="list"></div>
    <button class="btn" id="practice-btn">只練錯題</button>
    <button class="btn btn-secondary" id="back-btn">回首頁</button>
  `;

  const entries = Object.entries(state.kana)
    .filter(([, stat]) => stat.seen > 0)
    .sort((a, b) => (b[1].lastWrongAt || 0) - (a[1].lastWrongAt || 0));

  const kanaIndex = buildKanaIndex();
  const listEl = wrapper.querySelector('#list');

  if (entries.length === 0) {
    listEl.innerHTML = '<p>還沒有任何作答紀錄,先去完成今日任務吧!</p>';
  }

  for (const [kana, stat] of entries) {
    const row = document.createElement('div');
    const accuracy = Math.round((stat.correct / stat.seen) * 100);
    row.innerHTML = `
      <span class="kana-cell" style="display:inline-flex">${kana}</span>
      <span>${kanaIndex[kana]?.romaji ?? ''}</span>
      <span>正確率 ${accuracy}%(${stat.correct}/${stat.seen})</span>
    `;
    if (isTtsSupported()) {
      row.querySelector('.kana-cell').addEventListener('click', () => speakKana(kana));
    }
    listEl.appendChild(row);
  }

  wrapper.querySelector('#back-btn').addEventListener('click', () => navigate('dashboard'));
  wrapper.querySelector('#practice-btn').addEventListener('click', () => {
    const weakKana = entries
      .filter(([, stat]) => stat.correct / stat.seen < 0.8)
      .map(([kana]) => kana);

    if (weakKana.length === 0) {
      alert('目前沒有正確率低於 80% 的假名,太厲害了!');
      return;
    }

    const count = Math.min(15, weakKana.length);
    state.reviewTask = {
      questionIds: pickDailyQuestions(weakKana, state.kana, count),
      answeredCount: 0,
      correctCount: 0,
    };
    saveState(state);
    navigate('review-quiz');
  });

  mountEl.appendChild(wrapper);
}

export function renderReviewQuiz(mountEl, { state, saveState, navigate }) {
  const task = state.reviewTask;
  if (!task || task.answeredCount >= task.questionIds.length) {
    const wrapper = document.createElement('div');
    const total = task ? task.questionIds.length : 0;
    const correct = task ? task.correctCount : 0;
    wrapper.innerHTML = `
      <h1>複習完成!</h1>
      <p>本次正確率:${total > 0 ? Math.round((correct / total) * 100) : 0}%(${correct}/${total})</p>
      <button class="btn" id="back-btn">回錯題本</button>
    `;
    wrapper.querySelector('#back-btn').addEventListener('click', () => {
      state.reviewTask = null;
      saveState(state);
      navigate('review');
    });
    mountEl.appendChild(wrapper);
    return;
  }

  const kanaIndex = buildKanaIndex();
  const allEntries = TIERS.flatMap(t => t.items);
  const currentKana = task.questionIds[task.answeredCount];
  const question = buildQuestion(currentKana, kanaIndex, allEntries);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <p>複習 ${task.answeredCount + 1} / ${task.questionIds.length}</p>
    <div class="quiz-kana" id="kana-display">${question.kana}</div>
    <div class="option-grid" id="options"></div>
  `;

  if (isTtsSupported()) {
    wrapper.querySelector('#kana-display').addEventListener('click', () => speakKana(question.kana));
  }

  const optionsEl = wrapper.querySelector('#options');
  for (const option of question.options) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option;
    btn.addEventListener('click', () => {
      const correct = option === question.correctRomaji;
      const allBtns = optionsEl.querySelectorAll('.option-btn');
      allBtns.forEach(b => { b.disabled = true; });
      btn.classList.add(correct ? 'correct' : 'wrong');

      const stat = state.kana[currentKana] || { seen: 0, correct: 0, wrong: 0 };
      stat.seen += 1;
      if (correct) stat.correct += 1; else { stat.wrong += 1; stat.lastWrongAt = Date.now(); }
      state.kana[currentKana] = stat;

      task.answeredCount += 1;
      if (correct) task.correctCount += 1;
      saveState(state);

      setTimeout(() => {
        mountEl.innerHTML = '';
        renderReviewQuiz(mountEl, { state, saveState, navigate });
      }, 800);
    });
    optionsEl.appendChild(btn);
  }

  mountEl.appendChild(wrapper);
}
```

- [ ] **Step 2: Commit**

```bash
git add js/views/review.js
git commit -m "feat: add review view with wrong-kana-only practice"
```

---

### Task 14: app.js(整合入口)

**Files:**
- Create: `app.js`

- [ ] **Step 1: 實作 `app.js`**

```javascript
// app.js
import { createBrowserStorage, defaultState } from './js/storage.js';
import { createRouter } from './js/router.js';
import { renderDashboard } from './js/views/dashboard.js';
import { renderQuiz } from './js/views/quiz.js';
import { renderResult } from './js/views/result.js';
import { renderReview, renderReviewQuiz } from './js/views/review.js';

const mountEl = document.getElementById('app');
const bannerEl = document.getElementById('banner');
const storage = createBrowserStorage();

let state = storage.load();

if (!storage.isPersistent()) {
  bannerEl.hidden = false;
  bannerEl.textContent = '目前瀏覽模式無法保存進度,離開後資料將遺失';
}

function saveState(nextState) {
  state = nextState;
  storage.save(state);
}

const router = createRouter(
  {
    dashboard: (el) => renderDashboard(el, { state, saveState, navigate: router.navigate }),
    quiz: (el) => renderQuiz(el, { state, saveState, navigate: router.navigate }),
    result: (el) => renderResult(el, { state, saveState, navigate: router.navigate }),
    review: (el) => renderReview(el, { state, saveState, navigate: router.navigate }),
    'review-quiz': (el) => renderReviewQuiz(el, { state, saveState, navigate: router.navigate }),
  },
  mountEl
);

router.start();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // 離線快取非必要功能,註冊失敗不影響主流程
    });
  });
}
```

> 注意:每個 view 目前從 closure 捕捉的 `state` 是建立 router 當下的參照;因為 `saveState` 會直接 mutate 並重新指派模組層級的 `state` 變數,而每次 `navigate` 觸發 `hashchange` 都會重新呼叫對應的 view function(重新讀取最新的模組層級 `state`),所以畫面切換時資料都是最新的。

- [ ] **Step 2: 瀏覽器端對端手動測試**

用瀏覽器打開 `index.html`(或啟動簡易伺服器,見 Task 16),確認:
1. 首頁顯示 Tier 1(平假名清音)為可點擊狀態,其餘 Tier 顯示「(未解鎖)」
2. 點「開始今日任務」會跳轉顯示第 1 題
3. 答題後 0.8 秒自動跳下一題,15 題後進入結果頁
4. 回首頁後 streak 顯示 1 天,progress bar 顯示 15/15
5. 進入「錯題本」能看到剛才答錯的假名(如果有的話)

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: wire up app entry point with router and service worker registration"
```

---

### Task 15: PWA 資源(manifest.json + sw.js + icons)

**Files:**
- Create: `manifest.json`
- Create: `sw.js`
- Create: `icons/icon-192.png`
- Create: `icons/icon-512.png`

- [ ] **Step 1: 建立 `manifest.json`**

```json
{
  "name": "50音道場",
  "short_name": "50音道場",
  "description": "每日測驗認識日文50音,自動記錄錯題並複習",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "background_color": "#f7f7f2",
  "theme_color": "#2d6a4f",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: 建立 `sw.js`(基本 cache-first 離線快取)**

```javascript
// sw.js
const CACHE_NAME = 'kana-app-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './data/kana.js',
  './js/storage.js',
  './js/streak.js',
  './js/unlock.js',
  './js/quiz.js',
  './js/tts.js',
  './js/router.js',
  './js/views/dashboard.js',
  './js/views/quiz.js',
  './js/views/result.js',
  './js/views/review.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

- [ ] **Step 3: 產生 PNG icon**

用 Node.js 內建方式畫不出 PNG,改用一段小工具腳本以 Canvas 風格的簡易 SVG 轉 PNG 太複雜;改採最直接可靠的作法 —— 寫一個產生純色圓角方塊 + 文字「音」的 PNG,使用 Node 內建 zlib 手刻 PNG 編碼器過於繁瑣,改用系統內建工具產生。

實際執行:用 `sips`(macOS 內建工具)從一張用 HTML Canvas 產生的 base64 PNG 來源轉存。最簡單可靠的方式是直接在瀏覽器裡產生:

建立 `scripts/generate-icons.html`(暫用,產生後可刪除或保留作為以後重製 icon 的工具):

```html
<!DOCTYPE html>
<html>
<body>
<canvas id="c192" width="192" height="192"></canvas>
<canvas id="c512" width="512" height="512"></canvas>
<script>
function draw(id, size) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#2d6a4f';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('あ', size / 2, size / 2 + size * 0.05);
  console.log(id, canvas.toDataURL('image/png'));
}
draw('c192', 192);
draw('c512', 512);
</script>
</body>
</html>
```

用瀏覽器打開這個檔案,開 DevTools Console,複製兩段 `data:image/png;base64,...` 字串,分別用以下指令還原成檔案(把 `<BASE64...>` 換成複製到的字串,去掉前綴 `data:image/png;base64,`):

```bash
mkdir -p icons
echo "<BASE64...>" | base64 -d > icons/icon-192.png
echo "<BASE64...>" | base64 -d > icons/icon-512.png
```

- [ ] **Step 4: 驗證 icon 檔案存在且可開啟**

Run: `file icons/icon-192.png icons/icon-512.png`
Expected: 兩個檔案都顯示為 `PNG image data`

- [ ] **Step 5: Commit**

```bash
git add manifest.json sw.js icons/ scripts/generate-icons.html
git commit -m "feat: add PWA manifest, service worker, and app icons"
```

---

### Task 16: 本機伺服器驗證 + 響應式/無障礙檢查

**Files:** 無新檔案

- [ ] **Step 1: 啟動本機靜態伺服器**

Run: `python3 -m http.server 8080`

(ES Modules 透過 `file://` 開啟在部分瀏覽器會被 CORS 政策擋下,必須用 http server 測試)

- [ ] **Step 2: 用瀏覽器開啟 `http://localhost:8080`,切換成手機尺寸(例如 375x812)檢查**

- 確認沒有水平捲動(無跑版)
- 確認按鈕、假名格子點擊區塊足夠大(不會誤觸旁邊元素)
- 確認 `manifest.json` 有被正確載入(DevTools → Application → Manifest)
- 確認 Service Worker 註冊成功(DevTools → Application → Service Workers)

- [ ] **Step 3: 檢查 Console 完全沒有 error/warning**

打開 DevTools Console,重新整理頁面,操作過一輪「開始任務 → 答 15 題 → 看結果 → 看錯題本 → 只練錯題」,確認全程沒有紅字 error

- [ ] **Step 4: 若發現任何 console error 或版面問題,回到對應檔案修正**

---

### Task 17: README + GitHub Pages 部署說明

**Files:**
- Create: `README.md`

- [ ] **Step 1: 建立 `README.md`**

```markdown
# 50音道場

每日測驗認識日文 50 音(平假名 + 片假名),自動記錄答錯的假名並可回顧複習。純前端靜態網頁,無需伺服器。

## 本機開發

```bash
python3 -m http.server 8080
```

打開 `http://localhost:8080` 即可使用。

## 執行測試

```bash
node --test test/
```

## 部署到 GitHub Pages

1. 把這個資料夾 push 到 GitHub repo
2. Repo → Settings → Pages → Source 選擇 `main` branch、資料夾選 `/ (root)`
3. 等待 1-2 分鐘,Pages 網址會顯示在同一個設定頁面
4. 手機瀏覽器打開網址後,可用「加入主畫面」安裝成 App 圖示
```

- [ ] **Step 2: 最終檢查:確認 `.git` 乾淨、所有檔案都已 commit**

Run: `git status`
Expected: `nothing to commit, working tree clean`

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with local dev and GitHub Pages deployment instructions"
```

---

## Self-Review 紀錄

- **Spec coverage**:六階段解鎖(Task 2/5)、每日15題加權出題(Task 6/11)、streak判定(Task 4)、錯題本+只練錯題(Task 13)、首頁50音總覽上色(Task 10)、localStorage+fallback(Task 3)、TTS降級(Task 8)、PWA icon/manifest/sw(Task 15)、響應式與console無錯誤(Task 16)、GitHub Pages部署(Task 17)——規格書每一節都有對應任務覆蓋。
- **Placeholder scan**:已確認每個 Step 都附完整程式碼,無「TBD」、「依上述類推」等字樣。
- **Type consistency**:`state.kana[kana] = { seen, correct, wrong, lastWrongAt }` 的欄位名稱在 Task 11、13 的 view 與 Task 3 的 `storage.js`、Task 5 的 `unlock.js`、Task 6 的 `quiz.js` 中保持一致;`pickDailyQuestions(pool, kanaStats, count, rng)` 簽名在 Task 6 定義後,於 Task 11、13 呼叫時參數順序一致。
