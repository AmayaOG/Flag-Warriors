const WebSocket = require('ws');
const MAX_PLAYERS_PER_ROOM = 8;
const COUNTDOWN_SECONDS = 10;
const rooms = {};

// Crear un servidor WebSocket en el puerto 8081
const wss = new WebSocket.Server({ port: 8081 });
wss.on('connection', (ws) => {
    console.log("Jugador conectado");

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const roomName = data.code;

        switch (data.type) {
            case 'startGame':
                rooms[roomName].players.forEach(player => {
                    player.ws.send(JSON.stringify({
                        type: 'startGame',
                        playersList: rooms[roomName].players
                    }));
                });
                break;

            case 'joinRoom':
                if (!rooms[roomName]) {
                    rooms[roomName] = {
                        players: [],
                        countdown: COUNTDOWN_SECONDS,
                        interval: null
                    };

                    rooms[roomName].interval = setInterval(() => {
                        rooms[roomName].countdown--;
                        rooms[roomName].players.forEach(player => {
                            player.ws.send(JSON.stringify({
                                type: 'countdown',
                                countdown: rooms[roomName].countdown
                            }));
                        });

                        if (rooms[roomName].countdown <= 0) {
                            clearInterval(rooms[roomName].interval);
                            rooms[roomName].players.forEach(player => {
                                player.ws.send(JSON.stringify({
                                    type: 'startToPlay',
                                    message: 'Tiempo terminado'
                                }));
                            });
                        }
                    }, 1000);
                }

                if (rooms[roomName].players.length >= MAX_PLAYERS_PER_ROOM) {
                    ws.send(JSON.stringify({ type: 'lobbyFull' }));
                    return;
                }

                const newPlayer = {
                    id: data.playerId,
                    name: data.name,
                    path: data.path,
                    team: data.team,
                    ws: ws
                };

                const playerExists = rooms[roomName].players.some(player => player.id === newPlayer.id);
                if (!playerExists) {
                    rooms[roomName].players.push(newPlayer);
                    console.log(`Jugador ${newPlayer.name} añadido a la sala: ${roomName}`);
                }

                rooms[roomName].players.forEach(player => {
                    player.ws.send(JSON.stringify({
                        type: 'newPlayer',
                        player: newPlayer,
                        players: rooms[roomName].players
                    }));
                });
                break;

            // Nueva lógica para manejar la solicitud de lista de jugadores
            case 'requestPlayersList':
                if (rooms[roomName]) {
                    ws.send(JSON.stringify({
                        type: 'playersList',
                        players: rooms[roomName].players
                    }));
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log('Jugador desconectado');
    });
});
