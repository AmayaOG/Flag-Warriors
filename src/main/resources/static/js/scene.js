class game extends Phaser.Scene {

  constructor () {
      super ("gameMap"); // nombre escena
      this.cursors = null; // declara cursors como propiedad
      this.player = null;
      this.bandera1=null;
      this.bandera2=null
  }
  preload(){
    this.load.image("textura","../map/Textures-16.png");
    this.load.tilemapTiledJSON("mapa", "../map/mapa.json");
    this.load.spritesheet("player","../images/player.png",{ frameWidth: 48.4,frameHeight: 50})
    this.load.image("banderaAzul","../images/banderaAzul.png");
    this.load.image("banderaNaranja","../images/banderaNaranja.png");


  }
  create(){
  

    //anikmaciones
    this.anims.create({
      key: "caminar",
      frames: this.anims.generateFrameNumbers("player",{start:4,end:9}),
      frameRate:10,
      repeat:-1
  });
  this.anims.create({
    key: "quieto",
    frames: this.anims.generateFrameNumbers("player",{start:0,end:0}),
    frameRate:10,
    repeat:-1
});


    //mapa
    var map = this.make.tilemap({key:"mapa"})
    var tileset = map.addTilesetImage("muros","textura");
    var fondo = map.createLayer("pisosDelJuego",tileset);
    fondo.setScale(2.25)
    fondo.setCollisionByProperty({colision:true});

    //primer personaje
    this.player = this.physics.add.sprite(500,500,"player")
    this.player.setCollideWorldBounds(true);
    this.player.setScale(2);
    this.player.setSize(20,40);
    this.player.setOffset(5,10);

    //banderas
    this.bandera1 = this.physics.add.sprite(1280, 950, 'banderaAzul');
    this.bandera1.setScale(0.3)
    this.bandera1.setSize(100,100)

    this.bandera2 = this.physics.add.sprite(180, 120, 'banderaNaranja');
    this.bandera2.setScale(0.3)
    this.bandera2.setSize(100,100)


    //teclas y coliciones
    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player,fondo)
    this.physics.add.overlap(this.player, this.bandera1, collectFlag, null, this)
    this.physics.add.overlap(this.player, this.bandera2, collectFlag, null, this)


    
  }
  update(){
    if(this.cursors.right.isDown){
      this.player.setVelocityX(150);
      this.player.anims.play("caminar",true);
      this.player.setOffset(5,10)
      if(this.player.flipX==true) {
        this.player.x=this.player.x+19
      }
      this.player.flipX=false;
    }
    else if(this.cursors.left.isDown){
      this.player.setVelocityX(-150);
      this.player.anims.play("caminar",true);
      if(this.player.flipX==false) {
        this.player.x=this.player.x-19
      }
      this.player.flipX=true;
      this.player.setOffset(22,10)      
    }else if(this.cursors.up.isDown){
      this.player.setVelocityY(-150);
      this.player.anims.play("caminar",true);

    }else if(this.cursors.down.isDown){
      this.player.setVelocityY(150);
      this.player.anims.play("caminar",true);

    }
    else{
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
      this.player.anims.play("quieto",true);

    }
  }
}

function collectFlag(player, flag) {
  // Acción a ejecutar cuando el jugador toca la bandera
  flag.disableBody(true, true); // Oculta la bandera o la "recoge"
  // Aquí podrías incrementar un contador de puntos o iniciar otro evento
}

