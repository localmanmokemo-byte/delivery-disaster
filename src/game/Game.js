import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Player from './Player.js';
import Physics from '../physics/Physics.js';
import GameScene from './GameScene.js';
import GameMode from './GameMode.js';
import HUD from '../ui/HUD.js';

export default class Game {
  constructor(mode, settings, shop) {
    this.mode = mode;
    this.settings = settings;
    this.shop = shop;
    
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 500, 2000);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      this.settings.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 50, 100);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      canvas: document.getElementById('canvas')
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    
    // Lighting
    this.setupLighting();
    
    // Physics
    this.physics = new Physics();
    
    // Game objects
    this.player = null;
    this.gameScene = null;
    this.gameMode = new GameMode(mode);
    this.hud = new HUD();
    
    // Game state
    this.gameRunning = true;
    this.gameTime = 360; // 6 minutes
    this.score = 0;
    this.packagesDelivered = 0;
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    console.log(`🎮 Game initialized in ${mode} mode`);
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(100, 100, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -250;
    sunLight.shadow.camera.right = 250;
    sunLight.shadow.camera.top = 250;
    sunLight.shadow.camera.bottom = -250;
    this.scene.add(sunLight);
    
    // Point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0xff6b6b, 0.5, 200);
    pointLight1.position.set(100, 50, 100);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4ecdc4, 0.5, 200);
    pointLight2.position.set(-100, 50, -100);
    this.scene.add(pointLight2);
  }
  
  start() {
    // Create game scene with packages, NPCs, and obstacles
    this.gameScene = new GameScene(this.scene, this.physics, this.gameMode);
    
    // Create player
    this.player = new Player(this.scene, this.physics, this.shop.getSelectedSkin());
    
    // Start game loop
    this.gameLoop();
  }
  
  gameLoop = () => {
    if (!this.gameRunning) return;
    
    requestAnimationFrame(this.gameLoop);
    
    // Update physics
    this.physics.update();
    
    // Update player
    if (this.player) {
      this.player.update(this.camera);
    }
    
    // Update game scene
    if (this.gameScene) {
      this.gameScene.update();
      this.checkCollisions();
    }
    
    // Update game time
    this.gameTime -= 0.016; // ~60 FPS
    if (this.gameTime <= 0) {
      this.endGame();
    }
    
    // Update HUD
    this.hud.updateTimer(Math.ceil(this.gameTime));
    this.hud.updateScore(this.score);
    this.hud.updatePackages(this.packagesDelivered);
    
    // Handle game mode logic
    this.gameMode.update(this);
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
  
  checkCollisions() {
    if (!this.player) return;
    
    const playerPos = this.player.getPosition();
    
    // Check package collisions (classic mode)
    if (this.mode === 'classic') {
      this.gameScene.getPackages().forEach((pkg) => {
        const distance = playerPos.distanceTo(pkg.getPosition());
        
        if (distance < 5) {
          this.packagesDelivered++;
          this.score += 150;
          this.gameScene.removePackage(pkg.id);
          console.log(`📦 Package ${pkg.id} delivered! +150 points`);
          
          if (this.packagesDelivered >= 5) {
            this.gameWon();
          }
        }
      });
    }
  }
  
  gameWon() {
    this.gameRunning = false;
    const timeBonus = Math.max(0, Math.floor(this.gameTime) * 10);
    this.score += timeBonus;
    
    alert(`🎉 YOU WON!\n\nPackages Delivered: ${this.packagesDelivered}\nFinal Score: ${this.score}\nTime Bonus: ${timeBonus}`);
    
    // Reset menu
    const menu = document.getElementById('menu');
    menu.classList.remove('menu-hidden');
  }
  
  endGame() {
    this.gameRunning = false;
    alert(`⏱️ Game Over!\n\nPackages Delivered: ${this.packagesDelivered}/5\nFinal Score: ${this.score}`);
    
    // Reset menu
    const menu = document.getElementById('menu');
    menu.classList.remove('menu-hidden');
  }
  
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  cleanup() {
    this.gameRunning = false;
    window.removeEventListener('resize', () => this.onWindowResize());
  }
}
