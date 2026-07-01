export default class Settings {
  constructor() {
    this.volume = 80;
    this.graphicsQuality = 'medium';
    this.fov = 75;
    this.controls = {
      forward: 'w',
      backward: 's',
      left: 'a',
      right: 'd',
      jump: ' '
    };
    
    this.loadSettings();
    this.setupEventListeners();
    
    console.log('⚙️ Settings initialized');
  }
  
  setupEventListeners() {
    const volumeSlider = document.getElementById('volumeSlider');
    const graphicsSelect = document.getElementById('graphicsQuality');
    const fovSlider = document.getElementById('fovSlider');
    
    if (volumeSlider) {
      volumeSlider.addEventListener('change', (e) => {
        this.volume = parseInt(e.target.value);
        this.saveSettings();
      });
    }
    
    if (graphicsSelect) {
      graphicsSelect.addEventListener('change', (e) => {
        this.graphicsQuality = e.target.value;
        this.saveSettings();
      });
    }
    
    if (fovSlider) {
      fovSlider.addEventListener('change', (e) => {
        this.fov = parseInt(e.target.value);
        this.saveSettings();
      });
    }
  }
  
  saveSettings() {
    localStorage.setItem('deliveryDisasterSettings', JSON.stringify({
      volume: this.volume,
      graphicsQuality: this.graphicsQuality,
      fov: this.fov,
      controls: this.controls
    }));
  }
  
  loadSettings() {
    const saved = localStorage.getItem('deliveryDisasterSettings');
    if (saved) {
      const data = JSON.parse(saved);
      this.volume = data.volume || 80;
      this.graphicsQuality = data.graphicsQuality || 'medium';
      this.fov = data.fov || 75;
      this.controls = data.controls || this.controls;
    }
  }
}
