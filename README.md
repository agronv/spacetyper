# Space Typer

[Live Demo][link]

[link]: http://stephenchung.io/hack-attack/

## Inspiration
One of the main barriers to becoming an efficient software developer is having a good typing speed. We built this game to help children and those who didn't grow up using computers improve their typing speed, so everyone can be on an even playing field.

![gameplay](/public/images/game-demo.gif)

## How to Play
Enemy ships spawn and attack the player. Type out each enemy's corresponding word in order to shoot down it down!

## Technologies Used
For this project we used Three.js and Vanilla JavaScript, using requestAnimationFrame and heavy use of Object-Oriented-Programming to make an efficient, modular game. We implemented high scores using Google Firebase.

## Code Highlights
We implemented tries as our search tree data structure to match typed words to the words on the screen, as follows: 

```javascript
  find(prefix) {
    let currentNode = this.root;

    for(let letter of prefix) {
      if (currentNode.children[letter]) {
        currentNode = currentNode.children[letter];
      } else {
        this.enemies.cancelColor();
      }
    }

    if (currentNode.letter === null) return [];

    const queue = [currentNode];
    const targets = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (node.isWord) targets.push(node.enemy);
      for (let letter in node.children) queue.push(node.children[letter]);
    }

    return targets;
  }
  ```

## Future Features
* Combos give bombs to clear the screen of enemies
* Upgrades
* Develop additional games to furthur increase technological literacy!
