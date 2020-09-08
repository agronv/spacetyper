import Enemy from './enemy';

export default class Enemies {
    constructor(scene, speed, view, startPos, playerPos, trie, enemyTemplate, font, bulletTemplate, explosion, starfield) {
      this.font = font;
      this.trie = trie;
      this.scene = scene; 
      this.enemyTemplate = enemyTemplate;
      this.bulletTemplate = bulletTemplate;
      this.explosion = explosion
      this.starfield = starfield
      
      this.view = view;
      this.speed = speed;
      this.startPos = startPos;
      this.enemies = new Set();
      this.playerPos = playerPos;
      this.positions = this.setPositions();

      this.waveCount = 0;
      this.spawnRate = 2000;
      this.waveDuration = 30000;
      this.waveTitleDuration = 2500;
      this.difficultyMultiplier = 1.15;

      this.waveTitle = document.getElementById('wave-count');
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

  startGame() {
    this.initialInterval = setInterval(() => {
      clearInterval(this.initialInterval);
      this.spawnEnemies();
  
      this.difficultyInterval = setInterval(() => {
        this.stopSpawning();
  
        this.spawnRate /= this.difficultyMultiplier;
        this.spawnEnemies();
      }, this.waveDuration + this.waveTitleDuration);
    }, 1000)
  }

  spawnEnemies() {
    this.waveCount++;
    this.waveTitle.innerText = `WAVE ${this.waveCount}`;
    this.waveTitle.classList.add("visible");
    setTimeout(this.starfield.warpSpeed.bind(this.starfield), 500)
    this.waveCounter = setInterval(() => {
      clearInterval(this.waveCounter);
      this.spawnInterval = setInterval(() => {
        this.waveTitle.classList.remove("visible");
        this.starfield.regularSpeed();
        let random = Math.floor(Math.random() * this.positions.length);
        let position = this.positions[random];
        let enemy = new Enemy(position, this.scene, this.speed, this.playerPos, this.trie, this.enemyTemplate, this.font, this.bulletTemplate, this.explosion);
        this.enemies.add(enemy);
      }, this.spawnRate);
    }, this.waveTitleDuration);
  }

  stopSpawning() {
    clearInterval(this.waveCounter);
    clearInterval(this.spawnInterval);

    this.enemies.forEach(enemy => {
      this.deleteEnemy(enemy)
    })
  }

  endGame() {
    this.waveTitle.classList.remove("visible");
    this.waveCount = 0;
    this.spawnRate = 2000;
    clearInterval(this.difficultyInterval);
    this.stopSpawning();
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