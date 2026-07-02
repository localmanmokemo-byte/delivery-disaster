import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class Player {
  constructor(scene, physics, skin = 'default') {
    this.scene = scene;
    this.physics = physics;
    this.skin = skin;
    this.speed = 15;
    this.jumpPower = 10;
    this.canJump = false;
    
    this.keys = {};
    this.setupControls();
    this.createMesh();
    this.createPhysics();
    
    console.log(`🎮 Player created with skin: ${skin}`);
  }
  
  setupControls() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }
  
  createMesh() {
    const geometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    
    const colors = {
      'default': 0x3498db,
      'red-racer': 0xff6b6b,
      'blue-speed': 0x3498db,
      'gold-luxury': 0xffd700,
      'neon-cyber': 0x00ff88
    };
    
    const material = new THREE.MeshStandardMaterial({ 
      color: colors[this.skin] || colors['default'],
      roughness: 0.5,
      metalness: 0.3
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 2, 0);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
  
  createPhysics() {
    const shape = new CANNON.Capsule(0.5, 2);
    this.body = new CANNON.Body({ mass: 1, shape });
    this.body.position.set(0, 2, 0);
    this.physics.addBody(this.body);
  }
  
  update(camera) {
    const moveDirection = new THREE.Vector3();
    
    if (this.keys['w']) moveDirection.z -= 1;
    if (this.keys['s']) moveDirection.z += 1;
    if (this.keys['a']) moveDirection.x -= 1;
    if (this.keys['d']) moveDirection.x += 1;
    
    moveDirection.normalize();
    moveDirection.multiplyScalar(this.speed);
    
    this.body.velocity.x = moveDirection.x;
    this.body.velocity.z = moveDirection.z;
    
    if (this.keys[' '] && this.canJump) {
      this.body.velocity.y = this.jumpPower;
      this.canJump = false;
    }
    
    // Check if grounded
    this.canJump = this.body.position.y < 2.5;
    
    // Update mesh
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
    
    // Update camera to follow
    const targetCamPos = new THREE.Vector3(
      this.body.position.x,
      this.body.position.y + 3,
      this.body.position.z + 8
    );
    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(this.body.position.x, this.body.position.y + 1, this.body.position.z);
  }
  
  getPosition() {
    return this.mesh.position;
  }
}
