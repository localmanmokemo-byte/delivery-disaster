import * as THREE from 'three';

export default class Package {
  constructor(scene, physics, location) {
    this.scene = scene;
    this.physics = physics;
    this.location = location;
    this.delivered = false;
    
    this.createMesh();
  }
  
  createMesh() {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xffd700,
      metalness: 0.3,
      roughness: 0.4
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.location.x, 2, this.location.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
    
    // Add glow effect
    this.addGlow();
  }
  
  addGlow() {
    const glowGeometry = new THREE.SphereGeometry(2.5, 8, 8);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.15
    });
    
    this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.glow.position.copy(this.mesh.position);
    this.scene.add(this.glow);
  }
  
  update() {
    // Make package spin
    this.mesh.rotation.y += 0.02;
    this.glow.position.copy(this.mesh.position);
    
    // Pulsing glow effect
    this.glow.scale.set(
      1 + Math.sin(Date.now() * 0.005) * 0.2,
      1 + Math.sin(Date.now() * 0.005) * 0.2,
      1 + Math.sin(Date.now() * 0.005) * 0.2
    );
  }
  
  getPosition() {
    return this.mesh.position;
  }
  
  remove() {
    this.scene.remove(this.mesh);
    this.scene.remove(this.glow);
  }
}
