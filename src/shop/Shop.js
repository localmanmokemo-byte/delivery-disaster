export default class Shop {
  constructor() {
    this.ownedSkins = ['default'];
    this.selectedSkin = 'default';
    this.coins = 1000;
    
    this.loadShopData();
    
    console.log('🛒 Shop initialized');
  }
  
  buySkin(skinId) {
    if (!this.ownedSkins.includes(skinId)) {
      this.ownedSkins.push(skinId);
      this.saveShopData();
      console.log(`✅ Purchased ${skinId}`);
      return true;
    }
    return false;
  }
  
  selectSkin(skinId) {
    if (this.ownedSkins.includes(skinId)) {
      this.selectedSkin = skinId;
      this.saveShopData();
      return true;
    }
    return false;
  }
  
  getSelectedSkin() {
    return this.selectedSkin;
  }
  
  addCoins(amount) {
    this.coins += amount;
    this.saveShopData();
  }
  
  saveShopData() {
    localStorage.setItem('deliveryDisasterShop', JSON.stringify({
      ownedSkins: this.ownedSkins,
      selectedSkin: this.selectedSkin,
      coins: this.coins
    }));
  }
  
  loadShopData() {
    const saved = localStorage.getItem('deliveryDisasterShop');
    if (saved) {
      const data = JSON.parse(saved);
      this.ownedSkins = data.ownedSkins || ['default'];
      this.selectedSkin = data.selectedSkin || 'default';
      this.coins = data.coins || 1000;
    }
  }
}
