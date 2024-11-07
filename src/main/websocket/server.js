 const WebSocket = require('ws');
const MAX_PLAYERS_PER_ROOM = 8;
const rooms = {};
const COUNTDOWN_SECONDS = 120;

// Crear un servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8081 });
wss.on('connection', (ws) => {
    console.log('Nuevo jugador conectado');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'joinRoom':
                const roomName = data.code;
                if (!rooms[roomName]) {
                    rooms[roomName] = {
                        players: [],
                        countdown: COUNTDOWN_SECONDS, 
                        interval: null
                    };
                    console.log(`Se ha creado la sala: ${roomName}`);

                    rooms[roomName].interval = setInterval(() => {
                        rooms[roomName].countdown--;
                        // Enviar el tiempo restante a todos los jugadores en la sala
                        rooms[roomName].players.forEach((player) => {
                            player.ws.send(JSON.stringify({
                                type: 'countdown',
                                countdown: rooms[roomName].countdown
                            }));
                        });

                        // Detener el temporizador cuando llega a 0
                        if (rooms[roomName].countdown <= 0) {
                            clearInterval(rooms[roomName].interval);
                        }
                    }, 1000);

                }

                if (rooms[roomName].players.length >= MAX_PLAYERS_PER_ROOM) {
                    ws.send(JSON.stringify({ type: 'lobbyFull' }));
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
                console.log('Jugadores en la sala:', rooms[roomName].players);
                break;
        }
    });

    ws.on('close', () => {
        console.log('Jugador desconectado');
    });

    

    
});

