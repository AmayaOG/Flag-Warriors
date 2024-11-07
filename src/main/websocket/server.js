 const WebSocket = require('ws');
const MAX_PLAYERS_PER_ROOM = 8;
const rooms = {};
const COUNTDOWN_SECONDS = 10;

// Crear un servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8081 });
wss.on('connection', (ws) => {
    console.log("jugador conectado")

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'startGame':
            

                //esto toca cambiarlo amas a futuro
                 rooms.abc123.players.forEach(player => {
                    console.log("esto es el room que estoy enviando a;")
                    console.log(player)
                    console.log("-----------------------------------")
                    console.log(rooms.abc123.players)
                     player.ws.send(JSON.stringify({
                         type: 'startGame',
                        playersList: rooms.abc123.players
                     }));
                
             });
                break
            case 'joinRoom':
                const roomName = data.code;
                if (!rooms[roomName]) {
                    rooms[roomName] = {
                        players: [],
                        countdown: COUNTDOWN_SECONDS, 
                        interval: null
                    };

                    rooms[roomName].interval = setInterval(() => {
                        rooms[roomName].countdown--;
                        // Enviar el tiempo restante a todos los jugadores en la sala
                        rooms[roomName].players.forEach((player) => {
                            player.ws.send(JSON.stringify({
                                type: 'countdown',
                                countdown: rooms[roomName].countdown
                            }));
                        });

                        // Detener el temporizador cuando llega a 0 y notificar a los jugadores
                        if (rooms[roomName].countdown <= 0) {
                            clearInterval(rooms[roomName].interval);
                            rooms[roomName].players.forEach((player) => {
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
                    rooms[roomName].players.forEach(player => {
                        player.ws.send(JSON.stringify({
                            type: 'startToPlay',
                            message: 'Lobby lleno'
                        }));
                    });
                    return;
                }

                // Almacenar la información del jugador que se ha enviado desde el cliente
                const newPlayer = {
                    id: data.playerId,
                    name: data.name,
                    path: data.path,
                    team : data.team,
                    ws: ws
                };

                const playerExists = rooms[roomName].players.some(player => player.id === newPlayer.id);
                if (!playerExists) {
                    rooms[roomName].players.push(newPlayer)
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
        }
    });

    ws.on('close', () => {
        console.log('Jugador desconectado');
    });

    

    
});

