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
