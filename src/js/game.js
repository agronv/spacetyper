import Trie from './trie';
import Timer from './timer';
import Player from './player';
import Enemies from './enemies';
import Audio from './audio';
import Explosion from './explosion';
import Starfield from './starfield';
import KeyHandler from './key_handler';
import 'three/examples/js/loaders/GLTFLoader';
import { addHighscore, getHighscores } from './firebase';
// import 'three/examples/js/loaders/FontLoader';
// import * as THREE from 'three';

export default class Game {
  constructor() {
    this.speed = 400;
    this.highscores = {};
    this.playing = false;
    this.fieldOfView = 50;
    this.enemyStartPos = -60;
    this.playerPosition = {x: 0, y: -5, z: -15};
    this.audio = new Audio()
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 0;

    // const spotlight = new THREE.PointLight(0xffffff);
    // spotlight.position.set(1, 1, 5);
    // spotlight.power = 40;
    // this.scene.add(spotlight);
    
    this.trie = new Trie();
    this.timer = new Timer();
    this.starfield = new Starfield(this.scene);
    this.player = new Player(this.scene, this.playerPosition, this);
    this.explosion = new Explosion(this.scene);
    
    const nameInput = document.getElementById('name-input');
    const highscoreForm = document.getElementById('highscore-form');
    
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
    
    this.loader = new THREE.GLTFLoader();
    this.loader.load('src/models/enemy/scene.gltf', (enemy) => {
      this.enemyTemplate = enemy.scene;
      const fontLoader = new THREE.FontLoader();
      fontLoader.load( 'src/fonts/Roboto_Regular.json', (font) => {
        this.font = font;
        const bulletLoader = new THREE.GLTFLoader();
        bulletLoader.load('src/models/bullet/Tomahawk Missile.gltf', (bullet) => {
          this.bulletTemplate = bullet.scene.children[0];
          this.bulletTemplate.scale.set( 0.15, 0.15, 0.15);

          this.enemies = new Enemies(this.scene, this.speed, 
            this.fieldOfView, this.enemyStartPos, 
            this.playerPosition, this.trie,
            this.enemyTemplate, this.font, this.bulletTemplate, this.audio, this.explosion);

          this.trie.addEnemies(this.enemies);
          this.keyHandler = new KeyHandler(this.enemies, this);
          this.animate();
        })
      })
    }, undefined, function (error) {
      console.error(error);
    });

    window.onresize = this.resize.bind(this)
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 0;
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
      if (target.wordObject.text) target.wordObject.text.material.color.setHex(0x12EDFD);
    })  

    if (this.trie.contains(this.keyHandler.guess)) this.keyHandler.clearGuess();
  }

  gameOver() {
    this.playing = false;
    this.audio.lowerVolume()
    this.keyHandler.clearGuess();
    this.enemies.endGame();
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
    this.audio.play();
    this.player.restartHealth(); 
    this.enemies.startGame();
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
    this.explosion.update()

    if (this.enemies.updateEnemy()) this.player.isHit();
    this.starfield.animateStars();
    this.checkGuess();
    requestAnimationFrame(this.animate.bind(this));
  }
}