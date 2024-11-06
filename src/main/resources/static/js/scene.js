class game extends Phaser.Scene {
    constructor() {
        super("gameMap");
        this.cursors = null;
        this.currentPlayer = null;
        this.playerId = null;
        this.bandera1 = null;
        this.bandera2 = null;
        this.getplayer();
    }

    getplayer() {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const params = new URLSearchParams(url.search);
        const id = params.get('id');

        if (!id) {
            console.error("ID no encontrado en la URL");
            return;
        }

        return new Promise((resolve, reject) => {
            apiclient.getPlayerById(id, (data) => {
                this.currentPlayer = data;
                this.playerId = data.id;
                this.load.spritesheet("player", this.currentPlayer.path, { frameWidth: 128, frameHeight: 128 });

                resolve();
            });
        });
    }

    preload() {
        this.load.image("textura", "../map/Textures-16.png");
        this.load.tilemapTiledJSON("mapa", "../map/mapa.json");
        this.load.image("banderaAzul", "../images/banderaAzul.png");
        this.load.image("banderaNaranja", "../images/banderaNaranja.png");
    }

    async create() {
        await this.getplayer();
        this.cursors = this.input.keyboard.createCursorKeys();

        // Animaciones
        this.anims.create({
            key: "caminar",
            frames: this.anims.generateFrameNumbers("player", { start: 1, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "quieto",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
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
        if (this.currentPlayer.path == "../images/playerA.png") {
            this.player = this.physics.add.sprite(500, 500, "player");
            this.player.setCollideWorldBounds(true);
            this.player.setScale(1);
            this.player.setSize(30, 80);
            this.player.setOffset(50, 47);
        } else {
            this.player = this.physics.add.sprite(500, 500, "player");
            this.player.setCollideWorldBounds(true);
            this.player.setScale(1);
            this.player.setSize(30, 80);
            this.player.setOffset(36, 47);
        }

        // Banderas
        this.bandera1 = this.physics.add.sprite(1280, 950, 'banderaAzul').setScale(0.3).setSize(100, 100);
        this.bandera2 = this.physics.add.sprite(180, 120, 'banderaNaranja').setScale(0.3).setSize(100, 100);

        // Conectar al servidor WebSocket
        this.connectToWebSocket();
    }

    connectToWebSocket() {
        this.ws = new WebSocket('ws://localhost:8081');

        this.ws.onopen = () => {
            console.log('Conectado al servidor de WebSocket');

            // Unirse a una sala al momento de la conexión (por ejemplo, una sala con código 'abc123')
            this.joinRoom('abc123');  
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Mensaje del servidor:', data);

            switch (data.type) {
                case 'updatePosition':
                    this.updateOtherPlayerPosition(data);
                    break;
                case 'flagCaptured':
                    actualizarPuntuaciones();
                    break;
            }
        };

        this.ws.onclose = () => {
            console.log('Desconectado del servidor WebSocket');
        };
    }

    // Método para unirse a una sala
    joinRoom(roomCode) {
        const joinMessage = {
            type: 'joinRoom', 
            code: roomCode, 
            playerId: this.playerId
        };
        
        this.ws.send(JSON.stringify(joinMessage));
    }

    update() {
        if (!this.cursors) return;

        // Movimiento del jugador (esto aún no se actualiza en el servidor)
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(150);
            this.player.anims.play("caminar", true);
            this.player.flipX = false;
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-150);
            this.player.anims.play("caminar", true);
            this.player.flipX = true;
        } else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-150);
            this.player.anims.play("caminar", true);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(150);
            this.player.anims.play("caminar", true);
        } else {
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
            this.player.anims.play("quieto", true);
        }
    }

    updateOtherPlayerPosition(data) {
        // Aquí puedes implementar la lógica para actualizar la posición de otros jugadores
        console.log(`Actualizar posición de otro jugador: ID=${data.id}, x=${data.x}, y=${data.y}`);
    }
}
