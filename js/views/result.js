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
