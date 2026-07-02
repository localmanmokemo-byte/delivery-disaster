export default class HUD {
  updateTimer(time) {
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.textContent = time;
  }
  
  updateScore(score) {
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = score;
  }
  
  updatePackages(count) {
    const pkgEl = document.getElementById('packages');
    if (pkgEl) pkgEl.textContent = count;
  }
}
