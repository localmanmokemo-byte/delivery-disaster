export default class GameMode {
  constructor(mode) {
    this.mode = mode;
    this.setupMode();
  }
  
  setupMode() {
    switch (this.mode) {
      case 'classic':
        this.setupClassicMode();
        break;
      case 'battle':
        this.setupBattleMode();
        break;
      case 'sandbox':
        this.setupSandboxMode();
        break;
    }
  }
  
  setupClassicMode() {
    console.log('📦 Classic Mode: Deliver packages before time runs out!');
    this.objectives = [
      { id: 1, location: { x: 50, z: 50 }, delivered: false },
      { id: 2, location: { x: -50, z: 50 }, delivered: false },
      { id: 3, location: { x: 50, z: -50 }, delivered: false },
      { id: 4, location: { x: -50, z: -50 }, delivered: false },
      { id: 5, location: { x: 0, z: 0 }, delivered: false }
    ];
  }
  
  setupBattleMode() {
    console.log('⚔️ Battle Mode: Race against other players!');
    this.players = [];
    this.racePath = [
      { x: 0, z: 100 },
      { x: 100, z: 100 },
      { x: 100, z: -100 },
      { x: -100, z: -100 },
      { x: 0, z: 0 }
    ];
  }
  
  setupSandboxMode() {
    console.log('🎮 Sandbox Mode: Experiment with physics!');
    this.freMode = true;
  }
  
  update(game) {
    switch (this.mode) {
      case 'classic':
        this.updateClassicMode(game);
        break;
      case 'battle':
        this.updateBattleMode(game);
        break;
      case 'sandbox':
        this.updateSandboxMode(game);
        break;
    }
  }
  
  updateClassicMode(game) {
    // Check if player is near objectives
    if (!game.player) return;
    
    const playerPos = game.player.getPosition();
    
    this.objectives.forEach((obj) => {
      if (!obj.delivered) {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - obj.location.x, 2) +
          Math.pow(playerPos.z - obj.location.z, 2)
        );
        
        if (distance < 10) {
          obj.delivered = true;
          game.packagesDelivered++;
          game.score += 100;
          console.log(`📦 Package ${obj.id} delivered!`);
        }
      }
    });
  }
  
  updateBattleMode(game) {
    // Track player progress on race path
    if (!game.player) return;
    
    const playerPos = game.player.getPosition();
    
    // Find closest checkpoint
    let closestCheckpoint = 0;
    let closestDistance = Infinity;
    
    this.racePath.forEach((checkpoint, index) => {
      const distance = Math.sqrt(
        Math.pow(playerPos.x - checkpoint.x, 2) +
        Math.pow(playerPos.z - checkpoint.z, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCheckpoint = index;
      }
    });
    
    // Award points based on progress
    const progress = closestCheckpoint / this.racePath.length;
    game.score = Math.floor(progress * 1000);
  }
  
  updateSandboxMode(game) {
    // Sandbox mode: just let physics do its thing
    // Spawn random objects occasionally
    if (Math.random() < 0.0001) {
      console.log('🎲 Random object spawned in sandbox!');
    }
  }
}
