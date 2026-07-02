export default class Settings {
  constructor() {
    this.volume = 80;
    this.graphicsQuality = 'medium';
    this.fov = 75;
  }
  
  getVolume() {
    return this.volume;
  }
  
  setVolume(value) {
    this.volume = value;
  }
}
