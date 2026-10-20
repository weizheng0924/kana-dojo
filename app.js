// app.js
import { createBrowserStorage } from './js/storage.js';
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
