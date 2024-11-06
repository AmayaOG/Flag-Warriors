class game extends Phaser.Scene {

  constructor () {
      super ("gameMap"); // nombre escena
      this.cursors = null; // declara cursors como propiedad
      this.currentPlayer = null;
      this.playerId = null; // Declara playerId como propiedad
      this.bandera1=null;
      this.bandera2=null
      this.getplayer();
  }
  
  getplayer() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const id = params.get('id');

    if (!id) {
      console.error("ID no encontrado en la URL");
      return; // Finaliza la ejecución si id es undefined o null
    }
  
    return new Promise((resolve, reject) => {
      apiclient.getPlayerById(id, (data) => {
        this.currentPlayer = data; 
        this.playerId = data.id;
        this.load.spritesheet("player", this.currentPlayer.path, { frameWidth: 128, frameHeight: 128 });

        resolve(); // Resuelve la promesa
      });
    });
  }
  preload(){
    this.load.image("textura","../map/Textures-16.png");
    this.load.tilemapTiledJSON("mapa", "../map/mapa.json");
    this.load.image("banderaAzul","../images/banderaAzul.png");
    this.load.image("banderaNaranja","../images/banderaNaranja.png");
  }


  async create(){
    await this.getplayer();
    this.cursors = this.input.keyboard.createCursorKeys();


    //anikmaciones
    this.anims.create({
      key: "caminar",
      frames: this.anims.generateFrameNumbers("player",{start:1,end:7}),
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
    if(this.currentPlayer.path =="../images/playerA.png"){
      this.player = this.physics.add.sprite(500,500,"player")
      this.player.setCollideWorldBounds(true);
      this.player.setScale(1);
      this.player.setSize(30,80);
      this.player.setOffset(50,47);
    }else{
      this.player = this.physics.add.sprite(500,500,"player")
      this.player.setCollideWorldBounds(true);
      this.player.setScale(1);
      this.player.setSize(30,80);
      this.player.setOffset(36,47);
    }
    

    //banderas
    this.bandera1 = this.physics.add.sprite(1280, 950, 'banderaAzul');
    this.bandera1.setScale(0.3)
    this.bandera1.setSize(100,100)

    this.bandera2 = this.physics.add.sprite(180, 120, 'banderaNaranja');
    this.bandera2.setScale(0.3)
    this.bandera2.setSize(100,100)


    //teclas y coliciones
    this.physics.add.collider(this.player,fondo)
    
    if(this.currentPlayer.path =="../images/playerA.png"){
      this.physics.add.overlap(this.player, this.bandera1, (player, flag) => this.collectFlag(player,flag), null, this);
    }else{
      this.physics.add.overlap(this.player, this.bandera2, (player, flag) => this.collectFlag(player,flag), null, this);

    }


    
  }
  update(){
    if (!this.cursors) return;

    if(this.cursors.right.isDown){
      this.player.setVelocityX(150);
      this.player.anims.play("caminar",true);
      if(this.currentPlayer.path =="../images/playerA.png"){
        this.player.setOffset(50,47)
      }else{
        this.player.setOffset(38,47)
      }
      
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
      if(this.currentPlayer.path =="../images/playerA.png"){
        this.player.setOffset(50,47)
      }else{
        this.player.setOffset(62,47)
      }      
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


  collectFlag(player, flag) {
    if (!this.player) return;
    flag.disableBody(true, true);
    console.log("Player ID:", this.playerId);
  
    if (this.playerId) {
      app.captureFlag(this.playerId, function(response) {
        if (response) {
          console.log("Respuesta del servidor:", response);
        } else {
          console.error("No se recibió respuesta del servidor.");
        }
      });
    } else {
      console.error("ID del jugador no encontrado.");
    }
  }
  
}