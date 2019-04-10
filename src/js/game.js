import Player from './player';
import Enemies from './enemies';
import Starfield from './starfield';
import Trie from './trie';
import KeyHandler from './key_handler';
import Timer from './timer';
import 'three/examples/js/loaders/GLTFLoader';

import { addHighscore, getHighscores } from './firebase';

export default class Game {
  constructor() {
    this.fieldOfView = 50;
    this.speed = 400;
    this.playerPosition = {x: 0, y: -5, z: -15};
    this.enemyStartPos = -60;
    this.playing = false;
    this.highscores = {};
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 0;

    
    this.timer = new Timer();
    this.trie = new Trie();
    this.player = new Player(this.scene, this.playerPosition, this);
    this.starfield = new Starfield(this.scene);
    
    const highscoreForm = document.getElementById('highscore-form');
    const nameInput = document.getElementById('name-input');
    
    highscoreForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (nameInput.value !== "" && this.timer.time > 0) {
        addHighscore(nameInput.value, this.timer.time);
        nameInput.value = "";
        nameInput.disabled = true;
        nameInput.placeholder = "Highscore submitted";
        this.getScores();
      }
    });
    
    this.getScores();
    
    // this.loader = new THREE.GLTFLoader();
    // this.loader.load('src/models/enemy/scene.gltf', (enemy) => {
    //   this.enemyTemplate = enemy.scene;
      this.enemies = new Enemies(this.scene, this.speed, this.fieldOfView, this.enemyStartPos, this.playerPosition, this.trie, this.enemyTemplate);
      this.trie.addEnemies(this.enemies);
      this.keyHandler = new KeyHandler(this.enemies, this);
      this.animate();
  //   }, undefined, function (error) {
  //     console.error(error);
  //   });
  }

  getScores() {
    getHighscores().then(snapshot => {
      snapshot.forEach(doc => {
        this.highscores[doc.id] = doc.data();
      });
    })
    .then(() => {
      const listNode = document.getElementById("highscore-ul");

      while(listNode.firstChild) {
        listNode.removeChild(listNode.firstChild);
      }
  
      Object.values(this.highscores).forEach(entry => {
        const node = document.createElement("LI");
        const textNode = document.createTextNode(`${entry.name} ${this.timer.parseTime(entry.time)}`)
        node.appendChild(textNode);
        listNode.appendChild(node);
      });
    })
    ;

  }

  checkGuess() {
    const targets = this.trie.find(this.keyHandler.guess); 
    targets.forEach(target => {
      if (target.wordObject.text) target.wordObject.text.material.color.setHex(0xffff00);
    })  

    if (this.trie.contains(this.keyHandler.guess)) this.keyHandler.clearGuess();
  }

  gameOver() {
    this.playing = false;
    this.keyHandler.clearGuess();
    this.enemies.stopSpawning();
    this.timer.turnOff();
    this.getScores();

    document.getElementById('game-over').innerHTML = 'GAME OVER';
    document.getElementById('highscores').classList.add('visible');
    document.getElementById('directions').classList.add('visible');
    document.getElementById('game-over').classList.add('visible');
    document.getElementById('text-field-container').classList.remove('visible');
  }

  startGame() {
    this.playing = true;
    this.player.restartHealth(); 
    this.enemies.spawnEnemies();
    this.timer.turnOn();

    document.getElementById('text-field-container').classList.add('visible');
    document.getElementById('highscores').classList.remove('visible');
    document.getElementById('game-over').classList.remove('visible');
    document.getElementById('directions').classList.remove('visible');
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    this.update();
  }

  update() {
    this.player.update();

    if (this.enemies.updateEnemy()) this.player.isHit();
    this.starfield.animateStars();
    this.checkGuess();
    requestAnimationFrame(this.animate.bind(this));
  }
}