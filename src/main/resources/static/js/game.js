
var config = {
    type:Phaser.AUTO,
    scale: {
        mode:Phaser.Scale.FIT, // scala automaticamente
        autoCenter:Phaser.Scale.CENTER_BOTH, // centra automaticamente
        width: 1440, 
        height: 1080, 
    },
    physics : {
        default:"arcade", // tipo de fisica que va a utilizar 
        arcade: {
            gravity: { y : 0},// la gravedad del juego
            debug: true // debug
        }
    },
    scene:[game]
}
var juego = new Phaser.Game(config)
