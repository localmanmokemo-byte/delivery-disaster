import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class NPC {
  constructor(scene, physics, x, z) {
    this.scene = scene;
    this.physics = physics;
    this.speed = 5;
    this.direction = new THREE.Vector3(
      Math.random() - 0.5,
      0,
      Math.random() - 0.5
    ).normalize();
    
    this.createMesh(x, z);
    this.createPhysics(x, z);
  }
  
  createMesh(x, z) {
    const geometry = new THREE.CapsuleGeometry(0.4, 1.8, 4, 8);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xff9800,
      roughness: 0.8
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, 1, z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
    
    // Add head
    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    this.mesh.add(head);
  }
  
  createPhysics(x, z) {
    const shape = new CANNON.Sphere(0.4);
    this.body = new CANNON.Body({ mass: 1, shape });
    this.body.position.set(x, 1, z);
    this.physics.addBody(this.body);
  }
  
  update() {
    // Random direction changes
    if (Math.random() < 0.01) {
      this.direction = new THREE.Vector3(
        Math.random() - 0.5,
        0,
        Math.random() - 0.5
      ).normalize();
    }
    
    // Move NPC
    this.body.velocity.x = this.direction.x * this.speed;
    this.body.velocity.z = this.direction.z * this.speed;
    
    // Keep NPC in bounds
    if (Math.abs(this.body.position.x) > 240) {
      this.direction.x *= -1;
    }
    if (Math.abs(this.body.position.z) > 240) {
      this.direction.z *= -1;
    }
    
    // Update mesh position
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
  
  getPosition() {
    return this.body.position;
  }
}
