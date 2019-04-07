import Player from './player';
import Enemies from './enemies';
import Starfield from './starfield';
import Trie from './trie';
import KeyHandler from './key_handler';
import Timer from './timer';

import { addHighscore, getHighscores } from './firebase';


export default class Game {
  constructor() {
    this.timer = new Timer();
    this.playing = false;
    this.fieldOfView = 50;
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene = new THREE.Scene();
    this.speed = 400;
    this.playerPosition = {x: 0, y: -5, z: -11};
    this.enemyStartPos = -50;
    this.camera.position.z = 0;
    this.player = new Player(this.scene, this.playerPosition, this);
    this.trie = new Trie();
    this.enemies = new Enemies(this.scene, this.speed, this.fieldOfView, this.enemyStartPos, this.playerPosition, this.trie);
    this.trie.addEnemies(this.enemies);
    this.starfield = new Starfield(this.scene);
    this.keyHandler = new KeyHandler(this.enemies, this);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.background = new THREE.Color(0x000000);
    this.highscores = [];
    document.body.appendChild(this.renderer.domElement);
  }

  getScores() {
    this.highscores = [];
    getHighscores().then(snapshot => {
      snapshot.forEach(doc => {
        this.highscores[doc.id] = doc.data();
      });
    });
    this.loaded = true;
  }

  checkGuess() {
    const targets = this.trie.find(this.keyHandler.guess); 
    targets.forEach(target => {
      if (target.word.text) target.word.text.material.color.setHex(0xffff00);
    })  

    if (this.trie.contains(this.keyHandler.guess)) this.keyHandler.clearGuess();
  }

  gameOver() {
    this.playing = false;
    this.enemies.stopSpawning();
    this.timer.turnOff();

    document.getElementById('game-over').innerHTML = 'GAME OVER';

    document.getElementById('directions').classList.add('visible');
    document.getElementById('game-over').classList.add('visible');
  }

  startGame() {
    this.playing = true;
    this.enemies.spawnEnemies();
    this.timer.turnOn();

    document.getElementById('game-over').classList.remove('visible');
    document.getElementById('directions').classList.remove('visible');
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    this.update();
  }

  update() {
    this.player.update();

    let isHit = this.enemies.updateEnemy();
    if (isHit) {
      this.player.isHit();
    }
    this.starfield.animateStars();
    this.checkGuess();
    requestAnimationFrame(this.animate.bind(this));
  }
}