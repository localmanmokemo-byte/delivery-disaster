import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export default class Physics {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.defaultContactMaterial.friction = 0.4;
  }
  
  addBody(body) {
    this.world.addBody(body);
  }
  
  update() {
    this.world.step(1 / 60);
  }
}
