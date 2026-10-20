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
      if (!correct) {
        [...allBtns].find(b => b.textContent === question.correctRomaji)?.classList.add('correct');
      }

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
