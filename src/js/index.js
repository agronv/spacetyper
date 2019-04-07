import Game from './game';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.animate();
});

// "start": "./node_modules/webpack-dev-server/bin/webpack-dev-server.js --content-base",