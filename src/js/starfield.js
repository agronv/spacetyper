class Starfield {
  constructor(scene) {
    this.scene = scene;
    this.stars = [];
    this.slow = 100
    this.fast = 5
    this.decelerator = this.slow
    this.spehereSize = 0.75
    this.addSphere();
  }

  addSphere() {
    var geometry = new THREE.SphereGeometry(this.spehereSize, 32, 32)
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let x = 0; x < 500; x++) {
      var sphere = new THREE.Mesh(geometry, material)

      sphere.position.x = (Math.random() * 1000) - 500;
      sphere.position.y = (Math.random() * 1000) - 500;
      sphere.position.z = Math.random() * 1000;

      this.scene.add(sphere);
      this.stars.push(sphere);
    }
  }

  warpSpeed() {
    this.decelerator = this.fast;
  }

  regularSpeed() {
    this.decelerator = this.slow;
  }

  animateStars() {
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      star.position.z += i / this.decelerator;
      if (star.position.z > 1) {
        star.position.z -= 1000;
      }
    }
  }
}

export default Starfield;