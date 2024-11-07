
export var players = [];
export var ws = null; // WebSocket globalmente accesible

var lobby = (function () { 
    var currentPlayer = null;
    var countdownTimer = null;


    return { 
        async connectToWebSocket() {
            ws = new WebSocket('ws://localhost:8081'); // Asigna directamente a `ws` global

            return new Promise((resolve, reject) => {
                ws.onopen = async () => {
                    //console.log('Conectado al servidor de WebSocket');
                    await this.getPlayer();
                    this.joinRoom('abc123'); 
                    resolve(); // Resuelve cuando la conexión esté lista
                };

                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    // Procesa el mensaje del servidor según el tipo de evento recibido
                    switch (data.type) {
                        case 'newPlayer':
                            players = data.players; // Actualiza la lista global de jugadores
                            this.renderPlayers();
                            console.log("desde jugador nuevo:")
                            console.log(players)
                            break;
                        case 'countdown':
                            console.log(data.countdown);
                            this.updateCountdown(data.countdown);
                            break;
                        case 'startToPlay':
                            this.goToGame()
                        break;

                    }
                };

                ws.onclose = () => {
                    console.log('Desconectado del servidor WebSocket');
                };

                ws.onerror = (error) => {
                    console.error('Error en WebSocket:', error);
                    reject(error); // Rechaza si hay un error
                };
            });
        },
        goToGame() {
            const currentUrl = window.location.href;
            const url = new URL(currentUrl);
            const params = new URLSearchParams(url.search);
            const id = params.get('id');
            window.location.href = `/game?id=${id}`;
        },
        updateCountdown(countdown) {
            $('#countdown-display').text(`Tiempo restante: ${countdown} segundos`);
        },

        // Método para unirse a una sala
        joinRoom(roomCode) {
            if (!currentPlayer) {
                console.error("Jugador no encontrado.");
                return;
            }
            players.push({
                id: currentPlayer.id,
                name: currentPlayer.name,
                path: currentPlayer.path,
                team: (currentPlayer.path).charAt((currentPlayer.path).indexOf("player")+6)
            });

            const joinMessage = {
                type: 'joinRoom', 
                code: roomCode, 
                playerId: currentPlayer.id,
                name: currentPlayer.name,
                path: currentPlayer.path,
                team: (currentPlayer.path).charAt((currentPlayer.path).indexOf("player")+6),
                lista:players
            };
            
            
            ws.send(JSON.stringify(joinMessage));
        },

        // Obtener datos del jugador
        async getPlayer() {
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
                    currentPlayer = data;
                    resolve();
                });
            });
        },



        // Renderizar la lista de jugadores por equipo en el lobby
        renderPlayers() {
            const playersList = $('#players-list'); 
            playersList.empty();

            // Filtrar y renderizar jugadores por equipos
            const teamA = players.filter(player => player.team === 'A');
            const teamB = players.filter(player => player.team === 'B');

            // Renderizar Equipo A
            playersList.append(`<h1>Equipo A</h1>`);
            if (teamA.length > 0) {
                teamA.forEach(player => {
                    playersList.append(`<tr><td>${player.name}</td></tr>`);
                });
            } else {
                playersList.append('<p>No hay jugadores en el Equipo A</p>');
            }

            // Renderizar Equipo B
            playersList.append(`<h1>Equipo B</h1>`);
            if (teamB.length > 0) {
                teamB.forEach(player => {
                    playersList.append(`<tr><td>${player.name}</td></tr>`);
                });
            } else {
                playersList.append('<p>No hay jugadores en el Equipo B</p>');
            }
        }
    };
})();

export { lobby }; // Exporta lobby para su uso en otros módulos

$(document).ready(function () {
    const currentPage = window.location.pathname;
    if (currentPage === '/lobby') {
        lobby.connectToWebSocket();  
    }
});


