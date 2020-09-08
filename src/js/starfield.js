class Starfield {
  constructor(scene) {
    this.scene = scene;
    this.stars = [];
    this.slow = 100
    this.fast = 5
    this.decelerator = this.slow
    this.small = 1
    this.big = 2
    this.addSphere();
  }

  randomColor() {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    return `rgb(${r}, ${g}, ${b})`
  }

  addSphere() {
    var geometry = new THREE.SphereGeometry(1, 32, 32)
    var material = new THREE.MeshBasicMaterial({ color: this.randomColor() });

    for (let x = 0; x < 500; x++) {
      var sphere = new THREE.Mesh(geometry, material)

      sphere.position.x = (Math.random() * 1000) - 500;
      sphere.position.y = (Math.random() * 1000) - 500;
      sphere.position.z = Math.random() * 1000;

      sphere.scale.x = this.small
      sphere.scale.y = this.small
      sphere.scale.z = this.small

      this.scene.add(sphere);
      this.stars.push(sphere);
    }
  }

  warpSpeed() {
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].scale.x = this.big
      this.stars[i].scale.y = this.big
      this.stars[i].scale.z = this.big
    }
    this.decelerator = this.fast;
  }

  regularSpeed() {
    if (this.decelerator != this.slow) {
      const r = Math.random()
      const g = Math.random()
      const b = Math.random()
      for (let i = 0; i < this.stars.length; i++) {
        this.stars[i].material.color.setRGB(r,g,b)
        this.stars[i].scale.x = this.small
        this.stars[i].scale.y = this.small
        this.stars[i].scale.z = this.small
      }
      this.decelerator = this.slow;
    }
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
