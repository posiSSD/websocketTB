// websocket_server.js
//const sessions = new Map(); //id sessions
const WebSocket = require('ws');
const moment = require('moment'); // Asegúrate de tener el módulo 'moment' instalado
const wss = new WebSocket.Server({ port: 8086 });

let authenticatedUser = null; // Variable para mantener los datos del usuario autenticado

const testUsers = [
    { user_id: "3333200", name: "mllaguno", balance: "5000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77", email: "mllaguno@totalbet.com"},
    { user_id: "132328430", name: "andrea", balance: "6000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77", email: "andrea@totalbet.com"},
    { user_id: "2926797", name: "gonzalo", balance: "7000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77", email: "gonzalo@totalbet.com"},
    { user_id: "102826577", name: "merino zw", balance: "8000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77", email: "merinozw@totalbet.com"},
    { user_id: "119273784", name: "merino peru", balance: "8500", auth_token: "FAE2579BC8325A2F60B432173CEF4D77", email: "merinoperu@totalbet.com"},
    { user_id: "120387760", name: "tania", balance: "9000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77", email: "tania@totalbet.com"},
    { user_id: "3586027", name: "helpdesk", balance: "10000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77", email: "helpdesk@totalbet.com"}
];

wss.on('connection', function(socket) {
    const sessionID = '1423ad';
    const clientIP = socket._socket.remoteAddress;
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(`[${timestamp}] - [${sessionID}] - [${clientIP}] Cliente conectado`);

    socket.on('message', function(message) {
        const obj = JSON.parse(message);
        console.log(`[${timestamp}] - [${sessionID}] - [${clientIP}] Mensaje recibido: ${message}`);

        if (obj.command === 'request_session') {
            // Generar respuesta para sw_open_session
            const response = {
                rid: 'sw_open_session',
                code: 0,
                data: {
                    sid: sessionID
                },
            };
            console.log(`[${timestamp}] - [${sessionID}]- [${clientIP}] Mensaje enviado: ${JSON.stringify(response)}`);
            socket.send(JSON.stringify(response));
        } else if (obj.command === 'restore_login') {
            // Realizar la comprobación y autenticación del usuario
            const user = testUsers.find(u => u.user_id == obj.params.user_id && u.auth_token == obj.params.auth_token);

            if (user) {
                // Usuario autenticado, guardamos sus datos en la variable authenticatedUser
                authenticatedUser = {
                    auth_token: obj.params.auth_token,
                    user_id: obj.params.user_id,
                    name: user.name,
                    balance: user.balance,
                    email: user.email
                };

                const response = {
                    rid: 'restore_login',
                    code: 0,
                    data: authenticatedUser
                };

                socket.send(JSON.stringify(response));
                console.log(`[${timestamp}] - [${sessionID}]- [${clientIP}] Mensaje enviado: ${JSON.stringify(response)}`);
            } else {
                const response = {
                    rid: 'restore_login',
                    code: 12,
                };
                socket.send(JSON.stringify(response));
                console.log(`[${timestamp}] - [${sessionID}]- [${clientIP}] Mensaje enviado: ${JSON.stringify(response)}`);
            }
        } else if (obj.command === 'get_user') {
            if (authenticatedUser) {
                // Utilizamos los datos del usuario autenticado sin necesidad de autenticación adicional
                const response = {
                    rid: 'sw_get_user_balance',
                    code: 0,
                    data: authenticatedUser
                };
                socket.send(JSON.stringify(response));
                console.log(`[${timestamp}] - [${sessionID}]- [${clientIP}] Mensaje enviado: ${JSON.stringify(response)}`);
            } else {
                const response = {
                    rid: 'sw_get_user_balance',
                    code: 12,
                };
                socket.send(JSON.stringify(response));
                console.log(`[${timestamp}] - [${sessionID}]- [${clientIP}] Mensaje enviado: ${JSON.stringify(response)}`);
            }
        }
    });

    socket.on('close', function() {
        console.log(`[${timestamp}] Client disconnected from IP: ${clientIP}`);
    });
});


