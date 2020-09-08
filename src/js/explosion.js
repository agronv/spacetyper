export default class Explosion {
  constructor(scene) {
    this.scene = scene
    this.movementSpeed = 80;
    this.totalObjects = 1000;
    this.objectSize = 10;
    this.duration = 75;
    this.colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];
    this.dirs = []
    this.particleGroups = []
  }

  explode (x, y, z) {
    var geometry = new THREE.Geometry();

    for (let i = 0; i < this.totalObjects; i++) {
      var vertex = new THREE.Vector3();
      vertex.x = x;
      vertex.y = y;
      vertex.z = z;
      geometry.vertices.push(vertex);
      this.dirs.push({ x: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2), y: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2), z: (Math.random() * this.movementSpeed) - (this.movementSpeed / 2) });
    }
    var material = new THREE.ParticleBasicMaterial({ size: this.objectSize, color: this.colors[Math.round(Math.random() * this.colors.length)] });
    var particleGroup = new THREE.ParticleSystem(geometry, material);
    particleGroup.length = 0

    this.scene.add(particleGroup);
    this.particleGroups = this.particleGroups.concat(particleGroup)
  }

  update() {
    if (this.particleGroups.length) {
      for (let i = 0; i < this.particleGroups.length; i++) {
        let particleGroup = this.particleGroups[i]
        for (let j = 0; j < particleGroup.geometry.vertices.length; j++) {
          let particle = particleGroup.geometry.vertices[j]
          particle.y += this.dirs[i * this.totalObjects + j].y;
          particle.x += this.dirs[i * this.totalObjects + j].x;
          particle.z += this.dirs[i * this.totalObjects + j].z;
        }
        particleGroup.geometry.verticesNeedUpdate = true;
        particleGroup.length++;
      }

      if (this.particleGroups[0].length >= this.duration) {
        this.scene.remove(this.particleGroups[0]);
        this.particleGroups = this.particleGroups.slice(1);
        this.dirs = this.dirs.slice(this.totalObjects);
      }
    }
  }
}
