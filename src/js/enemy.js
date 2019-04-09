import 'three/examples/js/loaders/GLTFLoader';
import dictionary from './dictionary.json';
import Word from './word';

export default class Enemy {
  constructor(position, scene, speed, playerPos, trie) {
    this.position = position;
    this.scene = scene;
    this.speed = speed;
    this.playerPos = playerPos;
    this.trie = trie;
    this.changeX = -1 * (this.position.x / this.speed);
    this.changeY = -1 * ((this.position.y - this.playerPos.y) / this.speed);
    this.changeZ = -1 * (this.position.z - this.playerPos.z) / this.speed;
    this.word = dictionary[Math.floor(Math.random() * dictionary.length)];

    this.setEnemy = this.setEnemy.bind(this);
    this.startEnemy();
  }
  
  startEnemy() {
    this.wordObject = new Word(this.scene, this.position, this.word);

    var loader = new THREE.GLTFLoader();
    loader.load('src/models/enemy/scene.gltf', this.setEnemy, undefined, function (error) {
      console.error(error);
    });

    this.trie.insert(this.wordObject, this);
  }

  setEnemy(enemy) {
    enemy.scene.position.x = this.position.x;
    enemy.scene.position.y = this.position.y;
    enemy.scene.position.z = this.position.z;
    enemy.scene.name = this.word;
    enemy.scene.lookAt( 0, 0, 20);
    this.scene.add(enemy.scene);
    enemy.scene.children[0].scale.set(.005, .005, .005);
    this.enemy = enemy;
  }

  updatePos() {
    if (this.enemy) {
      this.enemy.scene.position.z += this.changeZ;
      this.enemy.scene.position.x += this.changeX;
      this.enemy.scene.position.y += this.changeY;
      this.wordObject.updatePos(this.enemy.scene.position);
      return this.enemy.scene.position.z > this.playerPos.z * 1.15
    }
  }

}