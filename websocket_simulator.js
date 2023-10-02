const WebSocket = require('ws');

// URL del servidor WebSocket de prueba
const ws_url = 'wss://echo.websocket.org/';

// Crea una instancia de WebSocket
const socket = new WebSocket(ws_url);

// Manejador de evento cuando se abre la conexión
socket.on('open', () => {
    console.log('Conexión WebSocket abierta');

    // Envía un mensaje de prueba al servidor
    socket.send('¡Hola, servidor!');
});

// Manejador de evento cuando llegan mensajes
socket.on('message', (data) => {
    console.log('Mensaje recibido:', data);

    // Cierra la conexión después de recibir el mensaje de respuesta
    socket.close();
});

// Manejador de evento cuando se cierra la conexión
socket.on('close', () => {
    console.log('Conexión WebSocket cerrada');
});
