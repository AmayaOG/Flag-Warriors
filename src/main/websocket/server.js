 const WebSocket = require('ws');
const MAX_PLAYERS_PER_ROOM = 8;
const rooms = {};

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
                        players: []
                    };
                    console.log(`Se ha creado la sala: ${roomName}`);
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
                    team : data.team
                };

                const playerExists = rooms[roomName].players.some(player => player.id === newPlayer.id);
                if (!playerExists) {
                    rooms[roomName].players.push(newPlayer)
                    console.log(`Jugador ${newPlayer.name} añadido a la sala: ${roomName}`);

                }
                
                rooms[roomName].players.forEach(player => {
                        ws.send(JSON.stringify({
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

