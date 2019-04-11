import dictionary from './dictionary.json';
import Word from './word';
import Bullet from './bullet';

export default class Enemy {
  constructor(position, scene, speed, playerPos, trie, enemyTemplate, font, bulletTemplate) {
    this.trie = trie;
    this.font = font;
    this.bullet = null;
    this.scene = scene;
    this.enemy = enemyTemplate.clone();
    this.bulletTemplate = bulletTemplate;

    this.speed = speed;
    this.position = position;
    this.playerPos = playerPos;
    this.word = dictionary[Math.floor(Math.random() * dictionary.length)];

    this.changeX = -1 * (this.position.x - this.playerPos.x) / this.speed;
    this.changeZ = -1 * (this.position.z - this.playerPos.z) / this.speed;
    this.changeY = -1 * (this.position.y - this.playerPos.y - 1) / this.speed;

    this.startEnemy();
  }
  
  startEnemy() {
    this.wordObject = new Word(this.scene, this.position, this.word, this.font);

    this.enemy.position.x = this.position.x;
    this.enemy.position.y = this.position.y;
    this.enemy.position.z = this.position.z;
    this.enemy.name = this.word;
    this.enemy.lookAt( 0, 0, 20);
    this.scene.add(this.enemy);
    this.enemy.children[0].scale.set(.005, .005, .005);

    this.trie.insert(this.wordObject, this);
  }

  shootEnemy() {
    this.bullet = new Bullet(this.scene, this.playerPos, this.enemy.position, this.speed, this.word, this.bulletTemplate)
  }

  deleteEnemy() {
    if (this.bullet) {
      const bulletObject = this.scene.getObjectByName(this.bullet.name);
      this.scene.remove(bulletObject);
    }
    const enemyObject = this.scene.getObjectByName(this.word);
    const wordObject = this.scene.getObjectByName(`${this.word}-word`);
    this.scene.remove(enemyObject);
    this.scene.remove(wordObject);
  }

  updatePos() {
    if (this.enemy) {
      this.enemy.position.z += this.changeZ;
      this.enemy.position.x += this.changeX;
      this.enemy.position.y += this.changeY;
      this.position = this.enemy.position;
      this.wordObject.updatePos(this.position);
      if (this.bullet) this.bullet.updatePos();
      if ( this.bullet && this.position.z > this.bullet.position.z-3) return "KILL";
      if (this.position.z > this.playerPos.z - 1) return "HIT"
    }
  }

}