import Game from './game';
import Trie from './trie';
import { addHighscore, getHighscores } from './firebase';

document.addEventListener('DOMContentLoaded', () => {
  window.addHighscore = addHighscore;
  window.trie = new Trie();

  const game = new Game();
  game.animate();
});