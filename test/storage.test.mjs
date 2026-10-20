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
