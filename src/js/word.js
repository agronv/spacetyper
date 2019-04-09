class Word {
  constructor(scene, position, word) {
    this.scene = scene;
    this.position = position;
    this.word = word;
    this.createText = this.createText.bind(this);
    this.offset = { x : this.word.length/2, y: 1.5 , z: 0.5 }
    this.startWord();
  }

  updatePos(position) {
    if (this.text) {
      this.text.position.set(position.x - this.offset.x, position.y - this.offset.y , position.z - this.offset.z);
    }
  }

  startWord() {
    var loader = new THREE.FontLoader();
    loader.load( 'src/fonts/Roboto_Regular.json', this.createText)
  }

  createText(font) {
    var textGeo = new THREE.TextGeometry( this.word, {
      font: font,
      size: 1,
      height: 0.1,
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