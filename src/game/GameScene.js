import * as THREE from 'three';
import Package from './Package.js';
import NPC from './NPC.js';

export default class GameScene {
  constructor(scene, physics, gameMode) {
    this.scene = scene;
    this.physics = physics;
    this.gameMode = gameMode;
    this.packages = [];
    this.npcs = [];
    this.obstacles = [];
    
    this.setupScene();
  }
  
  setupScene() {
    // Create ground
    this.createGround();
    
    // Add obstacles
    this.addObstacles();
    
    // Create delivery packages (for classic mode)
    if (this.gameMode.mode === 'classic') {
      this.createPackages();
    }
    
    // Create NPCs
    this.addNPCs();
    
    // Add some cars scattered around
    this.addCars();
    
    console.log('🎮 Game scene initialized!');
  }
  
  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2ecc71,
      roughness: 0.8
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  
  addObstacles() {
    const numberOfObstacles = Math.floor(Math.random() * 15) + 10;
    
    for (let i = 0; i < numberOfObstacles; i++) {
      const x = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      const width = Math.random() * 8 + 2;
      const height = Math.random() * 8 + 2;
      const depth = Math.random() * 8 + 2;
      
      this.createObstacle(x, height / 2, z, width, height, depth);
    }
  }
  
  createObstacle(x, y, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const colors = [0xff6b6b, 0x4ecdc4, 0xffd93d, 0x95e1d3, 0xf38181];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const material = new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.6,
      metalness: 0.2
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    
    this.obstacles.push(mesh);
  }
  
  createPackages() {
    const packageLocations = [
      { x: 80, z: 80 },
      { x: -80, z: 80 },
      { x: 80, z: -80 },
      { x: -80, z: -80 },
      { x: 0, z: 120 }
    ];
    
    packageLocations.forEach((loc, index) => {
      const pkg = new Package(this.scene, this.physics, loc);
      pkg.id = index + 1;
      this.packages.push(pkg);
    });
  }
  
  addNPCs() {
    const numberOfNPCs = Math.floor(Math.random() * 8) + 4;
    
    for (let i = 0; i < numberOfNPCs; i++) {
      const x = (Math.random() - 0.5) * 300;
      const z = (Math.random() - 0.5) * 300;
      const npc = new NPC(this.scene, this.physics, x, z);
      this.npcs.push(npc);
    }
  }
  
  addCars() {
    // Add some decorative cars around the map
    const carPositions = [
      { x: 100, z: -100 },
      { x: -100, z: 100 },
      { x: 150, z: 50 }
    ];
    
    carPositions.forEach((pos) => {
      this.createCar(pos.x, 0.5, pos.z);
    });
  }
  
  createCar(x, y, z) {
    // Simple car body
    const bodyGeometry = new THREE.BoxGeometry(2, 1.2, 4);
    const carMaterial = new THREE.MeshStandardMaterial({ 
      color: Math.random() * 0xffffff,
      metalness: 0.7,
      roughness: 0.2
    });
    
    const body = new THREE.Mesh(bodyGeometry, carMaterial);
    body.position.set(x, y + 0.6, z);
    body.castShadow = true;
    body.receiveShadow = true;
    this.scene.add(body);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const wheelPositions = [
      { x: -0.8, z: -1.2 },
      { x: 0.8, z: -1.2 },
      { x: -0.8, z: 1.2 },
      { x: 0.8, z: 1.2 }
    ];
    
    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x + pos.x, y + 0.5, z + pos.z);
      wheel.castShadow = true;
      this.scene.add(wheel);
    });
  }
  
  update() {
    // Update packages
    this.packages.forEach(pkg => {
      if (!pkg.delivered) {
        pkg.update();
      }
    });
    
    // Update NPCs
    this.npcs.forEach(npc => {
      npc.update();
    });
  }
  
  getPackages() {
    return this.packages.filter(pkg => !pkg.delivered);
  }
  
  removePackage(packageId) {
    const index = this.packages.findIndex(pkg => pkg.id === packageId);
    if (index !== -1) {
      this.packages[index].delivered = true;
      this.packages[index].remove();
    }
  }
}
