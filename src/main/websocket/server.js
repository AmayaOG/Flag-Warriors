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

                console.log(newPlayer )

                // Agregar jugador a la sala
                if(rooms[roomName].players.length == 0){
                    rooms[roomName].players.push(newPlayer)
                }else{
                    rooms[roomName].players.forEach(player => {
                        console.log(`este es el jugador de la lista que se va a analizar ${player}`)
                        if (player.id != newPlayer.id || rooms[roomName].players ==0  ) {
                            rooms[roomName].players.push(newPlayer);
                            ws.send(JSON.stringify({ type: 'joinedRoom', roomName: roomName,players: rooms[roomName].players }));
                        }
                    });
                }
                
                
                
                
                rooms[roomName].players.forEach(player => {
                    if (player.id != newPlayer.id || rooms[roomName].players.length==1 ) {
                        ws.send(JSON.stringify({
                            type: 'newPlayer',
                            player: newPlayer,
                            players: rooms[roomName].players
                        }));
                    }
                });
                console.log('Jugadores en la sala:', rooms[roomName].players);
                break;
        }
    });

    ws.on('close', () => {
        console.log('Jugador desconectado');
    });

    

    
});

