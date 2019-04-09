import Enemy from './enemy';
import Bullet from './bullet';

export default class Enemies {
    constructor(scene, speed, view, startPos, playerPos, trie) {
        this.enemies = new Set();
        this.bullets = new Set();
        this.bulletEnemy = {};
        this.speed = speed;
        this.startPos = startPos;
        this.playerPos = playerPos;
        this.view = view;
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

    this.difficultyInterval = setInterval(() => {
      this.difficulty *= 1.2;
    }, 8000);

    this.spawnInterval = setInterval(() => {
      let random = Math.floor(Math.random() * this.positions.length);
      let position = this.positions[random]
      let enemy = new Enemy(position, this.scene, this.speed, this.playerPos, this.trie);
      this.enemies.add(enemy);
    }, 2000 / this.difficulty);
  }

  stopSpawning() {
    clearInterval(this.difficultyInterval);
    clearInterval(this.spawnInterval);

    this.enemies.forEach(enemy => {
      this.deleteEnemy(enemy)
    })

    this.bullets.forEach(bullet => {
        this.deleteBullet(bullet);
      })
  }

  deleteEnemy(enemy) {
    const object = this.scene.getObjectByName(enemy.word);
    const object2 = this.scene.getObjectByName(`${enemy.word}-word`);
    this.scene.remove(object);
    this.scene.remove(object2);

    this.enemies.delete(enemy);
  }

  deleteBullet(bullet) {
    const object = this.scene.getObjectByName(bullet.name);
    this.scene.remove(object);

    this.bullets.delete(bullet);
  }

  killEnemy(enemy) {
    const bullet = new Bullet(this.scene, this.playerPos, enemy.enemy.scene.position, this.speed, enemy.word);
    this.bullets.add(bullet);
    this.bulletEnemy = {
        [enemy.word]: [enemy, bullet]
    }
  }

  updateEnemy() {
    let hit = false;
    this.enemies.forEach((enemy) => {
      if (enemy.updatePos()) {
        hit = true;
        this.deleteEnemy(enemy);
      }  
      else if (this.bulletEnemy[enemy.word]) {
        if (this.bulletEnemy[enemy.word][0].enemy.scene.position.z > this.bulletEnemy[enemy.word][1].bullet.position.z) {
            this.deleteEnemy(enemy);
            this.deleteBullet(this.bulletEnemy[enemy.word][1]);
            delete this.bulletEnemy[enemy]; 
        }
      }
    });

    this.bullets.forEach(bullet => {
        bullet.updatePos();
    });

    return hit;
  }
}