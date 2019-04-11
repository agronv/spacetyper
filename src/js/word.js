
class Word {
  constructor(scene, position, word, font) {
    this.word = word;
    this.font = font;
    this.scene = scene;
    this.wordDepth = 0.1;
    this.position = position;
    this.offset = { x : this.word.length/2.5, y: 2 , z: -0.5 }
    
    this.startWord();
  }

  updatePos(position) {
    if (this.text) {
      this.text.position.set(position.x - this.offset.x, position.y - this.offset.y , position.z - this.offset.z);
    }
  }

  startWord() {
    var textGeo = new THREE.TextGeometry( this.word, {
      font: this.font,
      size: 1,
      height: this.wordDepth,
    });

    var textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 } );

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set(this.position.x - this.offset.x, this.position.y - this.offset.y, this.position.z - this.offset.z);
    mesh.lookAt( 0, 0, 0);
    mesh.name = `${this.word}-word`
    this.scene.add( mesh );
    this.text = mesh;
  }
}

export default Word;