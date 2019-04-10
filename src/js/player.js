import 'three/examples/js/loaders/GLTFLoader';
import Hearts from './hearts';

export default class Player {
  constructor(scene, playerPos, game) {
    this.scene = scene;
    this.health = 3;
    this.playerPos = playerPos;
    this.game = game;
    this.down = true;

    this.startShip();
    this.hearts = new Hearts(this.scene, this.health);
  }

  isHit() {
    const object = this.scene.getObjectByName(`heart-${this.health}`);
    this.scene.remove(object);
    this.health--;

    if (this.health <= 0) this.game.gameOver();
  }

  restartHealth() {
    this.health = 3;
    this.hearts.spawnHearts();
  }

  update() {
    this.hearts.drawHearts();
    if (this.ship) {
      if (this.down) {
        this.ship.position.z -= 0.01;
        if (this.ship.position.z <= -0.25) this.down = false;
      } else {
        this.ship.position.z += 0.008;
        if (this.ship.position.z >= 0.4) this.down = true;
      }
    }
  }

  startShip() {
    var loader = new THREE.GLTFLoader();

    loader.load('src/models/player/scene.gltf', (ship) => {
      ship.scene.rotation.y = 3.15;
      ship.scene.position.z = this.playerPos.z;
      ship.scene.position.z = this.playerPos.z;
      ship.scene.position.y = this.playerPos.y;
      this.ship = ship.scene.children[0];

      return this.scene.add(ship.scene);
    }, undefined, function (error) {
      console.error(error);
    });
  }
}