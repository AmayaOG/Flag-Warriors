const WebSocket = require('ws');
const MAX_PLAYERS_PER_ROOM = 8;
const rooms = {};
const playesChannel = {};
const COUNTDOWN_SECONDS = 180;
var sendList = false
  
// Crear un servidor WebSocket en el puerto 8081
const wss = new WebSocket.Server({ port: 8081 });
wss.on('connection', (ws, req) => {
    // Extraer el sessionId desde la URL
    const url = new URL(req.url || '', `https://${req.headers.host}`);
    const sessionId = url.searchParams.get('sessionId') || '';

    console.log(`se conecto el jugador: ${sessionId}`);
    // pushear
    playesChannel[sessionId] = ws; // Almacenar el WebSocket con su sessionId

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'startGame':
                if(!sendList){
                    rooms["abc123"].players.forEach((player) => {
                        playesChannel[player.id].send(JSON.stringify({
                            type: 'startGame',
                            playersList: rooms.abc123.players
                        }));
                    });
                }
               sendList = true;
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

                        // Convertir los segundos restantes a minutos y segundos
                        const minutes = Math.floor(rooms[roomName].countdown / 60);
                        const seconds = rooms[roomName].countdown % 60;

                        // Formatear el tiempo en "mm:ss"
                        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                        // Enviar el tiempo restante a todos los jugadores en la sala
                        rooms[roomName].players.forEach((player) => {
                            playesChannel[player.id].send(JSON.stringify({
                                type: 'countdown',
                                countdown: formattedTime // Enviar el tiempo en formato "mm:ss"
                            }));
                        });

                        // Detener el temporizador cuando llega a 0 y notificar a los jugadores
                        if (rooms[roomName].countdown <= 0) {
                            clearInterval(rooms[roomName].interval);
                            rooms[roomName].players.forEach((player) => {
                                playesChannel[player.id].send(JSON.stringify({
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
                        playesChannel[player.id].send(JSON.stringify({
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
                    x: data.x,
                    y:data.y
                };


                // comunica a los demas jugadores sobre uno nuevo
                const playerExists = rooms[roomName].players.some(player => player.id === newPlayer.id);
                if (!playerExists) {
                    rooms[roomName].players.push(newPlayer)
                    rooms[roomName].players.forEach(player => {
                        playesChannel[player.id].send(JSON.stringify({
                            type: 'newPlayer',
                            player: newPlayer,
                            players: rooms[roomName].players
                        }));
                    
                    });
                    console.log(`Jugador ${newPlayer.name} añadido a la sala: ${roomName}`);
                }
                break;


            case 'updatePosition':
                const playerUpdate = rooms["abc123"].players.find(player => player.id === data.id);
                playerUpdate.x = data.x;
                playerUpdate.y=data.y
                
                rooms["abc123"].players.forEach((player) => {
                    if(player.id != sessionId){
                        playesChannel[player.id].send(JSON.stringify({
                            type: 'playerMoved',
                            id:playerUpdate.id,
                            x:playerUpdate.x,
                            y: playerUpdate.y,
                            message:"renderizar"
                        }));
                    }
                    
                });
                break;
                case "flagCaptured":
                    var team=null
                    var name = null;
                    console.log(sessionId)
                    rooms["abc123"].players.forEach((player) => {
                        console.log(player)

                        if(player.id == sessionId){
                            if(player.team==="A"){
                                team="B"
                            }else{
                                team="A"
        
                            }
                            name = player.name
                        }
                        
                    });
                    
                            
                    
                    rooms["abc123"].players.forEach((player) => {
                        
                            playesChannel[player.id].send(JSON.stringify({
                                type: 'flagCaptured',
                                name: name,
                                team:team
                            }));
                        
                        
                    });
                    break
        }
    });

    ws.on('close', () => {
        console.log('Jugador desconectado');
    });

    

    
}

);

// function updatePlayerPosition(playerId, velocity) {
//     const player = rooms["abc123"].players.some(player => player.id === playerId)

//      // Calcular la nueva posición en función de la velocidad y el tiempo transcurrido
//     player.position.x += velocity * (deltaTime / 1000); // Actualizar la posición
//         // Enviar la nueva posición a todos los jugadores
//     broadcastPlayerPosition(player);
    
// }

// function broadcastPlayerPosition(player) {
//     const message = JSON.stringify({
//         type: 'playerMoved',
//         id: player.id,
//         position: player.position // Enviar la nueva posición
//     });

//     rooms[roomName].players.forEach(player => {
//         playesChannel[player.id].send(JSON.stringify({
//             type: 'playerMoved',
//             id: player.id,
//             position: player.position
//         }));
//     });
//}


