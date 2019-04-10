import 'three/examples/js/loaders/GLTFLoader';

export default class Heart {
  constructor(scene, index) {
    this.scene = scene;
    this.pivot;
    this.heart;
    this.index = index;

    this.startHeart();
  }
  
  startHeart() {
    var loader = new THREE.GLTFLoader();

    loader.load('src/models/heart/scene.gltf', (heart) => {
      heart.scene.children[0].scale.set(.1, .1, .1 );
      heart.scene.position.set(62 + 11 * this.index , -45, -100);
      heart.scene.name = `heart-${this.index}`
      this.scene.add(heart.scene);

      const pointlight = new THREE.PointLight(0xffffff);
      pointlight.position.set (1, 1, 1);
      pointlight.power = 2 * Math.PI;
      this.scene.add(pointlight);

      this.heart = heart.scene.children[0];
    }, undefined, function (error) {
      console.error(error);
    });
  }

  drawHeart() {
    if (this.heart) {
      this.heart.rotation.z += 0.05;
    }
  }
}