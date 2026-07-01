export default class HUD {
  constructor() {
    this.timerElement = document.getElementById('timer');
    this.scoreElement = document.getElementById('score');
    this.packagesElement = document.getElementById('packages');
  }
  
  updateTimer(time) {
    if (this.timerElement) {
      this.timerElement.textContent = time;
      
      // Change color if time is running low
      if (time < 60) {
        this.timerElement.style.color = '#ff0000';
      } else {
        this.timerElement.style.color = '#ff6b6b';
      }
    }
  }
  
  updateScore(score) {
    if (this.scoreElement) {
      this.scoreElement.textContent = score;
    }
  }
  
  updatePackages(delivered) {
    if (this.packagesElement) {
      this.packagesElement.textContent = delivered;
    }
  }
}
