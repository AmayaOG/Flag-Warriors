
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


const EquipoA = 'Equipo Azul'; // Define el nombre del equipo azul
const EquipoB = 'Equipo Naranja'; // Define el nombre del equipo naranja

// Llama a esta función cuando necesites actualizar las puntuaciones
function actualizarPuntuaciones() {
    // Obtén las puntuaciones de los equipos usando el método de apiclient
    const puntuacionA = apiclient.getTeamByName(EquipoA).getScore();
    const puntuacionB = apiclient.getTeamByName(EquipoB).getScore();

    // Actualiza el contenido de los párrafos
    document.getElementById('equipoA').textContent = `Equipo Azul: ${puntuacionA}`;
    document.getElementById('equipoB').textContent = `Equipo Naranja: ${puntuacionB}`;
}