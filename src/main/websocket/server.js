// src/main/websocket/server.js
const WebSocket = require('ws');

// Crear un servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('Nuevo jugador conectado');

    // Escuchar mensajes de cada cliente
    ws.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);

        // Transmitir el mensaje a todos los clientes conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Jugador desconectado');
    });
});

console.log('Servidor WebSocket en ejecución en ws://localhost:8081');
