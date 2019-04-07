import Enemy from './enemy';

export default class Enemies {
    constructor(scene, speed) {
        this.enemies = [];
        this.speed = speed;
        this.positions = [[-180,-30], [-150,-50], [-120,-70], [-90, -70], [-60,-70], [-30,-70], [0,-70],
         [30,-70], [60,-70], [90, -70], [120, -70], [150, -50], [180, -30]]
        this.scene = scene; 
        this.spawnEnemies();
    }

    spawnEnemies() {
        setInterval(() => {
            let random = Math.floor(Math.random() * 13);
            let position = this.positions[random]
            let enemy = new Enemy(position, this.scene, this.speed)
            this.enemies.push(enemy);
        }, 100);
    }

    deleteEnemy() {
        this.scene.remove(this.enemies[0].enemy);
        this.enemies = this.enemies.splice(1);
    }

    updateEnemy() {
        this.enemies.forEach((enemy) => {
            enemy.updatePos();
        });
    }
}