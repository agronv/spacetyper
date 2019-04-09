import 'three/examples/js/loaders/GLTFLoader';

export default class Bullet {
  constructor(scene, startPos, endPos, speed, word) {
    this.scene = scene;
    this.startPos = startPos;
    this.endPos = endPos;
    this.speed = speed;
    this.word = word;
    this.changeX = (this.endPos.x - this.startPos.x) / this.speed*10; 
    this.changeY = (this.endPos.y - this.startPos.y) / this.speed*10; 
    this.changeZ = (this.endPos.z - this.startPos.z) / this.speed*10; 

    this.startBullet();
  }
  
  startBullet() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.bullet = new THREE.Mesh( geometry, material );

    // this.bullet.lookAt( Object.keys(this.endPos) ); 
    this.bullet.position.set(this.startPos.x, this.startPos.y+1, this.startPos.z-1);

    this.bullet.name = `${this.word}-bullet`
    this.scene.add( this.bullet );
  }

  updatePos() {
      if (this.bullet) {
          this.bullet.position.x += this.changeX;
          this.bullet.position.y += this.changeY;
          this.bullet.position.z += this.changeZ;
          this.bullet.rotation.x += 0.1;
          this.bullet.rotation.y += 0.1;
          this.bullet.rotation.z += 0.1;
      } 
  }
}