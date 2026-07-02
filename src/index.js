import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Player from './game/Player.js';
import Physics from './physics/Physics.js';

let scene, camera, renderer, physics, player, game;

export default function initGame(mode = 'classic') {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 100, 1000);

  // Camera setup
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('canvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowShadowMap;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 50, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Physics
  physics = new Physics();

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(200, 200);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2ecc71 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  physics.addBody(groundBody);

  // Player
  player = new Player(scene, physics, 'default');

  // Packages
  createPackages();

  // Game state
  game = {
    mode,
    score: 0,
    packagesDelivered: 0,
    totalPackages: 5,
    timeLeft: 360,
    packages: [],
    isRunning: true
  };

  window.game = game;

  // Event listeners
  window.addEventListener('resize', onWindowResize);

  // Start game loop
  animate();
}

function createPackages() {
  const positions = [
    { x: 20, z: -20 },
    { x: -20, z: 20 },
    { x: 30, z: 30 },
    { x: -30, z: -30 },
    { x: 0, z: 40 }
  ];

  positions.forEach((pos, index) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, 1, pos.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const body = new CANNON.Body({ mass: 1, shape });
    body.position.set(pos.x, 1, pos.z);
    physics.addBody(body);

    game.packages.push({
      mesh,
      body,
      delivered: false,
      index
    });
  });
}

function updateHUD() {
  const timerEl = document.getElementById('timer');
  const scoreEl = document.getElementById('score');
  const packagesEl = document.getElementById('packages');

  if (timerEl) timerEl.textContent = Math.floor(game.timeLeft);
  if (scoreEl) scoreEl.textContent = game.score;
  if (packagesEl) packagesEl.textContent = `${game.packagesDelivered}/${game.totalPackages}`;
}

function checkPackageCollisions() {
  if (!player || !player.mesh) return;

  game.packages.forEach((pkg) => {
    if (!pkg.delivered) {
      const distance = player.mesh.position.distanceTo(pkg.mesh.position);
      if (distance < 3) {
        pkg.delivered = true;
        scene.remove(pkg.mesh);
        physics.world.removeBody(pkg.body);
        game.packagesDelivered++;
        game.score += 100;
        console.log('📦 Package delivered!');
      }
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (game.isRunning) {
    game.timeLeft -= 1 / 60;

    if (game.timeLeft <= 0) {
      game.isRunning = false;
      alert(`Game Over!\nScore: ${game.score}\nPackages: ${game.packagesDelivered}/${game.totalPackages}`);
      return;
    }

    if (game.packagesDelivered >= game.totalPackages) {
      game.isRunning = false;
      alert(`You Won!\nScore: ${game.score}\nTime Left: ${Math.floor(game.timeLeft)}s`);
      return;
    }
  }

  physics.update();
  player.update(camera);
  checkPackageCollisions();
  updateHUD();

  // Update package positions
  game.packages.forEach((pkg) => {
    if (!pkg.delivered) {
      pkg.mesh.position.copy(pkg.body.position);
      pkg.mesh.quaternion.copy(pkg.body.quaternion);
    }
  });

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menu');
  if (menu && !menu.classList.contains('menu-hidden')) {
    // Menu is visible, wait for user to click
  }
});
