
class game extends Phaser.Scene {
    
    constructor() {
        super("gameMap");
        this.cursors = null;
        this.playerId = null;
        this.bandera1 = null;
        this.bandera2 = null;
        this.playersList = null
        this.oponentes =[];
        this.sceneWs=null;
        this.connectToWebSocket()
        //this.avatar=null
    }
    
    preload() {

        this.load.image("textura", "../map/Textures-16.png");
        this.load.tilemapTiledJSON("mapa", "../map/mapa.json");
        this.load.image("banderaAzul", "../images/banderaAzul.png");
        this.load.image("banderaNaranja", "../images/banderaNaranja.png");

    }
     initializeGame() {
     

            this.loadPlayersTextures();  // Cargar texturas de todos los jugadores
            this.load.on('complete', () => { // Espera a que todas las texturas terminen de cargarse
                this.renderPlayers();  // Llamar a renderPlayers después de cargar texturas
            });
            this.load.start();  // Iniciar la carga

        
    }
    loadPlayersTextures() {
        this.playersList.forEach(player => {
            if (player.id == this.currentPlayer.id) {

                this.load.spritesheet("avatar", player.path, { frameWidth: 128, frameHeight: 128 });
                this.avatar = this.physics.add.sprite(this.currentPlayer.x,this.currentPlayer.y,"avatar");

            } else {
                this.load.spritesheet(`opponentPlayer_${player.id}`, player.path, { frameWidth: 128, frameHeight: 128 });
                
            }
        });
    }

    initianValues(){
        this.playersList.forEach(player => {
            if (player.id == this.playerId) {
                this.currentPlayer=player;
            }
        });


        
    }
    async connectToWebSocket(){
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        const id = params.get('id');
        this.playerId = id;
  
        this.sceneWs =new WebSocket(`ws://localhost:8081?sessionId=${id}`)

        this.sceneWs.onopen = async () => {
            

                this.sendStartGameMessage()

        };
        this.sceneWs.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    
        
                    switch (data.type) {
                        //case 'startGame':
                          //  this.playersList = data.playersList;
                            
                            

                            
                           
                         //   break;
                        case 'updatePosition':
                            this.updateOtherPlayerPosition(data);
                            break;
                        
                        case 'flagCaptured':
                            actualizarPuntuaciones();
                            break;
                    }
                };



        
    }

    

    create() {
  


        this.cursors = this.input.keyboard.createCursorKeys();

        // Animaciones
        this.anims.create({
            key: "caminar",
            frames: this.anims.generateFrameNumbers("avatar", { start: 1, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "quieto",
            frames: this.anims.generateFrameNumbers("avatar", { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });

        // Mapa
        var map = this.make.tilemap({ key: "mapa" });
        var tileset = map.addTilesetImage("muros", "textura");
        var fondo = map.createLayer("pisosDelJuego", tileset);
        fondo.setScale(2.25);
        fondo.setCollisionByProperty({ colision: true });

        // Crear jugador


        


        // Banderas
        this.bandera1 = this.physics.add.sprite(1280, 950, 'banderaAzul').setScale(0.3).setSize(100, 100);
        this.bandera2 = this.physics.add.sprite(180, 120, 'banderaNaranja').setScale(0.3).setSize(100, 100);

        // Colisiones

        this.physics.add.collider(this.avatar, fondo);

        if (this.currentPlayer.path == "../images/playerA.png") {
            this.physics.add.overlap(this.avatar, this.bandera1, (player, flag) => this.collectFlag(player, flag), null, this);
        } else {
            this.physics.add.overlap(this.avatar, this.bandera2, (player, flag) => this.collectFlag(player, flag), null, this);
        }

        
    }

    

    async sendStartGameMessage(){
        return new Promise((resolve, reject) => {
            if (this.sceneWs.readyState === WebSocket.OPEN) {
                const joinMessage = { type: 'startGame' };
                this.sceneWs.send(JSON.stringify(joinMessage));

                this.sceneWs.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'startGame') {
                        this.playersList = data.playersList;
                        console.log(this.playersList)

                        this.initianValues()
                        this.initializeGame();

                        resolve(data);
                    }
                };
            } else {
                console.error("WebSocket no está abierto");
                reject("WebSocket no está abierto");
            }
        });
    }


     update() {
    //     if (!this.cursors) return;

    //     //Movimiento del jugador (esto aún no se actualiza en el servidor)
         if (this.cursors.right.isDown) {
            
            this.avatar.setVelocityX(150);
            this.avatar.anims.play("caminar", true);
            this.avatar.flipX = false;
         } 
         else if (this.cursors.left.isDown) {
            this.avatar.setVelocityX(-150);
            this.avatar.anims.play("caminar", true);
            this.avatar.flipX = true;
        } else if (this.cursors.up.isDown) {
            this.avatar.setVelocityY(-150);
            this.avatar.anims.play("caminar", true);
        } else if (this.cursors.down.isDown) {
            this.avatar.setVelocityY(150);
            this.avatar.anims.play("caminar", true);
        } else {
            this.avatar.setVelocityX(0);
            this.avatar.setVelocityY(0);
            this.avatar.anims.play("quieto", true);
        }
      }

    // updateOtherPlayerPosition(data) {
    //     // Aquí puedes implementar la lógica para actualizar la posición de otros jugadores
    //     console.log(`Actualizar posición de otro jugador: ID=${data.id}, x=${data.x}, y=${data.y}`);
    // }

    // collectFlag(player, flag) {
    //     if (!this.player) return;
    //     flag.disableBody(true, true);
    //     console.log("Player ID:", this.playerId);
  
    //     if (this.playerId) {
    //         const flagCaptureMessage = {
    //             type: 'flagCaptured',
    //             playerId: this.playerId,
    //             team: this.currentPlayer.team
    //         };
    //         this.ws.send(JSON.stringify(flagCaptureMessage));
  
    //         app.captureFlag(this.playerId, function(response) {
    //             if (response) {
    //                 console.log("Respuesta del servidor:", response);
    //             } else {
    //                 console.error("No se recibió respuesta del servidor.");
    //             }
    //         });
    //     } else {
    //         console.error("ID del jugador no encontrado.");
    //     }
    // }
    renderPlayers() {
        
         
        this.playersList.forEach(player => {

            if(player.id==this.currentPlayer.id){
                //this.load.spritesheet("avatar", player.path, { frameWidth: 128, frameHeight: 128 })
                //this.avatar = this.physics.add.sprite(this.currentPlayer.x,this.currentPlayer.y,"avatar");

                this.avatar.setScale(1);
                this.avatar.setCollideWorldBounds(true);
                this.avatar.setSize(30, 80);
                this.avatar.setOffset(50, 47);

                //this.avatar = avatar
                this.renderPlayer(player);
            }else{
                //this.load.spritesheet("opponentPlayer", player.path, { frameWidth: 128, frameHeight: 128 })
                var oponent = this.physics.add.sprite(player.x,player.y,`opponentPlayer_${player.id}`)
                oponent.setScale(1);
                oponent.setCollideWorldBounds(true);
                oponent.setSize(30, 80);
                oponent.setOffset(46, 47);

                this.oponentes.push(oponent)
                this.renderPlayer(player);
            }
            
        });
    }
    
    renderPlayer(player) {


        console.log(`Renderizando jugador ${player.id}`);
        console.log(player.path)
    }

}
    