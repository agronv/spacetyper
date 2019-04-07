class KeyHandler {
  constructor(enemies, game) {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.enemies = enemies;
    this.game = game;
    this.guess = "";
    window.onkeydown = this.handleKeyDown;
  }

  clearGuess() {
    this.guess = "";
  }

  handleKeyDown(e) {
    if (e.target.id !== "name-input") {
      e.preventDefault();

      if (!this.game.playing) {
        if (e.keyCode === 32) {
          this.game.startGame();
        }
      } else {
        if (e.keyCode >= 65 && e.keyCode <= 90) {
          // Alphabet
          // e.key has the alphabet4-094er
          this.guess += e.key;
        } else if (e.keyCode === 32) {
          // Spacebar
          this.enemies.cancelColor();
          this.clearGuess();
        } else if (e.keyCode === 27) {
          // Escape

        } else if (e.keyCode === 15) {
          // Enter
          this.clearGuess();
        }
      }

    }
  }
}

export default KeyHandler;