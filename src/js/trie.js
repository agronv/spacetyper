class TrieNode {
  constructor(letter) {
    this.letter = letter;
    this.isWord = false;
    this.children = {};
    this.enemy;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode(null);
  }

  addEnemies(enemies) {
    this.enemies = enemies;
  }

  insert(wordNode, enemy) {
    let currentNode = this.root;
    const word = wordNode.word;

    for (let letter of word) {
      if (!currentNode.children[letter]) {
        currentNode.children[letter] = new TrieNode(letter);
      }
      currentNode = currentNode.children[letter];
    }
    
    currentNode.isWord = true;
    currentNode.enemy = enemy;

    return this.root;
  }

  contains(word) {
    let currentNode = this.root;

    for (let letter of word) {
      if (currentNode.children[letter]) {
        currentNode = currentNode.children[letter];
      } else {
        return false;
      }
    }

    if (currentNode.isWord) {
      this.enemies.cancelColor();
      this.enemies.killEnemy(currentNode.enemy);
      this.delete(word);
      return true;
    }
  }

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

  delete(word) {
    const backtrack = (currentNode = this.root, index = 0) => {
      if (index === word.length) {
        if (!currentNode.isWord) return false;

        currentNode.isWord = false;
        return Object.keys(currentNode.children).length === 0;
      }

      const letter = word[index];
      const nextNode = currentNode.children[letter];

      if (!nextNode) return false;

      const shouldDelete = backtrack(nextNode, index + 1) && !nextNode.isWord;

      if (shouldDelete) {
        delete currentNode.children[letter];
        return Object.keys(currentNode.children).length === 0;
      }

      return false;
    }

    return backtrack();
  }
}

export default Trie;