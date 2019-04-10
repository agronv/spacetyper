import Enemy from './enemy';

export default class Enemies {
    constructor(scene, speed, view, startPos, playerPos, trie, enemyTemplate, font, bulletTemplate) {
        this.enemies = new Set();
        this.speed = speed;
        this.startPos = startPos;
        this.playerPos = playerPos;
        this.view = view;
        this.enemyTemplate = enemyTemplate;
        this.font = font;
        this.bulletTemplate = bulletTemplate;
        this.positions = this.setPositions();
        this.scene = scene; 
        this.trie = trie;
    }

  cancelColor() {
    this.enemies.forEach(enemy => {
      if (enemy.wordObject.text) enemy.wordObject.text.material.color.setHex(0xff0000)
    });
  }

  setPositions() {
    let positions = []
    for (let i = 10; i >= -10; i -= 10) {
      positions.push({ x: this.view - 5, y: i, z: this.startPos });
      positions.push({ x: -1 * this.view + 5, y: i, z: this.startPos });
    }
    for (let i = this.view; i >= this.view * -1; i -= this.view / 10) {
      positions.push({ x: i, y: Math.floor(this.view / 3), z: this.startPos });
    }
    return positions;
  }

  spawnEnemies() {
    this.difficulty = 1;
    let i = 1;

    this.difficultyInterval = setInterval(() => {
      this.difficulty *= 1.2;
    }, 8000);
    this.spawnInterval = setInterval(() => {
      i++;
      let random = Math.floor(Math.random() * this.positions.length);
      let position = this.positions[random]
      let enemy = new Enemy(position, this.scene, this.speed, this.playerPos, this.trie, this.enemyTemplate, this.font, this.bulletTemplate);
      this.enemies.add(enemy);
    }, 2000 / this.difficulty);
  }

  stopSpawning() {
    clearInterval(this.difficultyInterval);
    clearInterval(this.spawnInterval);

    this.enemies.forEach(enemy => {
      this.deleteEnemy(enemy)
    })
  }

  deleteEnemy(enemy) {
    this.enemies.delete(enemy);
    enemy.deleteEnemy();
  }

  killEnemy(enemy) {
    if (this.enemies.has(enemy)) enemy.shootEnemy();
  }

  updateEnemy() {
    let hit = false;
    this.enemies.forEach((enemy) => {
      switch (enemy.updatePos()) {
        case "KILL":
          this.deleteEnemy(enemy);
          break;
        case "HIT":
          hit = true;
          this.deleteEnemy(enemy);
      }
    });
    return hit;
  }
}