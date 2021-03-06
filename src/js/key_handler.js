class KeyHandler {
  constructor(enemies, game) {
    this.guess = "";
    this.game = game;
    this.enemies = enemies;
    this.keyField = document.getElementById("text-field");

    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.onkeydown = this.handleKeyDown;
  }

  clearGuess() {
    this.guess = "";
    this.keyField.classList.add('red');
    const interval = setInterval(() => {
      this.keyField.innerText = this.guess;
      this.keyField.classList.remove('red');
      clearInterval(interval);
    }, 225);
  }

  deleteGuess() {
    this.guess = "";
    this.keyField.classList.add('red');
    const interval = setInterval(() => {
      this.keyField.innerText = this.guess;
      this.keyField.classList.remove('red');
      clearInterval(interval);
    }, 225);
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
          // this.enemies.cancelColor();
          this.guess += e.key;
          this.keyField.innerText = this.guess;
        } else if (e.keyCode === 32) {
          // Spacebar
          this.enemies.cancelColor();
          this.clearGuess();
        } else if (e.keyCode === 27) {
          // Escape

        } else if (e.keyCode === 13) {
          // Enter
          this.deleteGuess();
        } else if (e.keyCode === 8) {
          // Backspace
          this.guess = this.guess.slice(0,-1);
          this.keyField.innerText = this.guess;
          this.enemies.cancelColor();
        }
      } 
    }
  }
}

export default KeyHandler;