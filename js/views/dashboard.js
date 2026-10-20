// js/views/dashboard.js
import { TIERS } from '../../data/kana.js';
import { speakKana, isTtsSupported } from '../tts.js';
import { getLocalDateString } from '../streak.js';

export function renderDashboard(mountEl, { state, navigate }) {
  const wrapper = document.createElement('div');

  const today = getLocalDateString();
  const hasToday = state.dailyTask && state.dailyTask.date === today;
  const totalDone = hasToday ? state.dailyTask.answeredCount : 0;
  const totalQuestions = hasToday ? state.dailyTask.questionIds.length : 15;
  const isCompletedToday = hasToday && state.dailyTask.completed;

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
