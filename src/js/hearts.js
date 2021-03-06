import Heart from './heart';

export default class Hearts {
  constructor(scene, health) {
    this.hearts = [];
    this.scene = scene;
    this.health = health;
  }

  spawnHearts() {
    for (let i = 0; i < 3; i++) {
      let heart = new Heart(this.scene, i);
      this.hearts.push(heart)
    }
  }

  drawHearts() {
    for (let heart of this.hearts) {
      heart.drawHeart();
    }
  }
}