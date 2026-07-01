import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class MapGenerator {
  constructor(scene, physics) {
    this.scene = scene;
    this.physics = physics;
  }
  
  generateRandomMap() {
    // Create ground
    this.createGround();
    
    // Add random obstacles
    this.addRandomObstacles();
    
    // Add NPCs
    this.addNPCs();
    
    console.log('🗺️ Random map generated!');
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
  
  addRandomObstacles() {
    const numberOfObstacles = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < numberOfObstacles; i++) {
      const x = (Math.random() - 0.5) * 400;
      const z = (Math.random() - 0.5) * 400;
      const size = Math.random() * 5 + 2;
      
      this.createBox(x, size / 2, z, size, size, size);
    }
    
    console.log(`🎲 Added ${numberOfObstacles} obstacles`);
  }
  
  createBox(x, y, z, width, height, depth) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({ 
      color: Math.random() * 0xffffff,
      roughness: 0.7
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    
    // Physics body
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({ mass: 0, shape });
    body.position.set(x, y, z);
    this.physics.addBody(body);
  }
  
  addNPCs() {
    const numberOfNPCs = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numberOfNPCs; i++) {
      const x = (Math.random() - 0.5) * 300;
      const z = (Math.random() - 0.5) * 300;
      this.createNPC(x, 1, z);
    }
    
    console.log(`👥 Added ${numberOfNPCs} NPCs`);
  }
  
  createNPC(x, y, z) {
    const geometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xff9800 });
    
    const npc = new THREE.Mesh(geometry, material);
    npc.position.set(x, y, z);
    npc.castShadow = true;
    npc.receiveShadow = true;
    this.scene.add(npc);
    
    // Physics body
    const shape = new CANNON.Cylinder(0.5, 0.5, 2, 8);
    const body = new CANNON.Body({ mass: 1, shape });
    body.position.set(x, y, z);
    this.physics.addBody(body);
  }
}
