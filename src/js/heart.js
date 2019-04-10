import 'three/examples/js/loaders/GLTFLoader';
import { SpotLightHelper } from 'three';

export default class Heart {
  constructor(scene, index) {
    this.scene = scene;
    this.pivot;
    this.heart;
    this.index = index;

    this.startHeart();

    this.drawHeart = this.drawHeart.bind(this);
  }
  
  startHeart() {
    var x = 0, y = 0;

    var loader = new THREE.GLTFLoader();

    loader.load('src/models/heart/scene.gltf', (gltf) => {
      gltf.scene.children[0].scale.set(.1, .1, .1 );
      gltf.scene.position.set(62 + 11 * this.index , -45, -100);
      gltf.scene.name = `${this.index}`
      this.scene.add(gltf.scene);

      const spotlight = new THREE.PointLight(0xffffff);
      spotlight.position.set (1, 1, 1);
      spotlight.power = 2 * Math.PI;
      this.scene.add(spotlight);

      this.heart = gltf.scene.children[0];
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