export default class Shop {
  constructor() {
    this.selectedSkin = 'default';
    this.purchasedSkins = ['default'];
  }
  
  buySkin(skinId) {
    if (!this.purchasedSkins.includes(skinId)) {
      this.purchasedSkins.push(skinId);
    }
  }
  
  getSelectedSkin() {
    return this.selectedSkin;
  }
  
  setSelectedSkin(skinId) {
    if (this.purchasedSkins.includes(skinId)) {
      this.selectedSkin = skinId;
    }
  }
}
