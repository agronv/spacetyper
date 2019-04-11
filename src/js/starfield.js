class Starfield {
  constructor(scene) {
    this.scene = scene;
    this.stars = [];

    this.addSphere();
  }

  addSphere() {
    var geometry = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let z = -1000; z < 1000; z += 20) {
      var sphere = new THREE.Mesh(geometry, material)

      sphere.position.x = (Math.random() * 1000) - 500;
      sphere.position.y = (Math.random() * 1000) - 500;
      sphere.position.z = z;

      this.scene.add(sphere);
      this.stars.push(sphere);
    }

  }

  animateStars() {
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      star.position.z += i / 10;
      if (star.position.z > 1) star.position.z -= 1000;
    }
  }
}

export default Starfield;