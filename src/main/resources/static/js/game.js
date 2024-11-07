
import { ws, players, lobby } from './lobby.js';

// Espera a que la conexión WebSocket esté lista antes de inicializar la escena
lobby.connectToWebSocket().then(() => {
    // Ahora que ws y players están disponibles, puedes inicializar la escena
    const gameScene = new game(ws, players);

    var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT, // escala automáticamente
            autoCenter: Phaser.Scale.CENTER_BOTH, // centra automáticamente
            width: 1440, 
            height: 1080, 
        },
        physics: {
            default: "arcade", // tipo de física
            arcade: {
                gravity: { y: 0 }, // la gravedad
                debug: true // para depurar
            }
        },
        scene: [gameScene]
    }

    var juego = new Phaser.Game(config);
}).catch((error) => {
    console.error('Error al conectar al WebSocket:', error);
});




const EquipoA = 1; // Define el nombre del equipo azul
const EquipoB = 2; // Define el nombre del equipo naranja

// Llama a esta función cuando necesites actualizar las puntuaciones
function actualizarPuntuaciones() {
    // Obtén las puntuaciones de los equipos usando el método de apiclient
    const puntuacionA = apiclient.getTeamById().getScore();
    const puntuacionB = apiclient.getTeamById().getScore();

    // Actualiza el contenido de los párrafos
    document.getElementById('equipoA').textContent = `Equipo Azul: ${puntuacionA}`;
    document.getElementById('equipoB').textContent = `Equipo Naranja: ${puntuacionB}`;
}