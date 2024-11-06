// src/main/websocket/server.js
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
                        players: [],
                    };
                    console.log(`Se ha creado la sala: ${roomName}`);
                }

                if (rooms[roomName].players.length >= MAX_PLAYERS_PER_ROOM) {
                    ws.send(JSON.stringify({ type: 'lobbyFull' }));
                    return;
                }

                // Agregar jugador a la sala
                rooms[roomName].players.push({ id: ws.id });
                console.log(`Jugador ${ws.id} se unió a la sala ${roomName}`);
                ws.send(JSON.stringify({ type: 'joinedRoom', roomName: roomName }));
                break;
        }
    });

    ws.on('close', () => {
        console.log('Jugador desconectado');
    });
});
