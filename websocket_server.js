// websocket_server.js

const WebSocket = require('ws');
const moment = require('moment'); // Asegúrate de tener el módulo 'moment' instalado
const wss = new WebSocket.Server({ port: 8086 });

const testUsers = [
    { user_id: "3333200", name: "mllaguno", balance: "5000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77" },
    { user_id: "132328430", name: "andrea", balance: "6000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77" },
    { user_id: "2926797", name: "gonzalo", balance: "7000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77" },
    { user_id: "102826577", name: "merino zw", balance: "8000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77" },
    { user_id: "119273784", name: "merino peru", balance: "8500", auth_token: "FAE2579BC8325A2F60B432173CEF4D77" },
    { user_id: "120387760", name: "tania", balance: "9000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77" },
    { user_id: "3586027", name: "helpdesk", balance: "10000", auth_token: "FAE2579BC8325A2F60B432173CEF4D77" }
];

wss.on('connection', function(socket) {
    const clientIP = socket._socket.remoteAddress;
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss'); // Formato de fecha y hora
    console.log(`[${timestamp}] Client connected from IP: ${clientIP}`);

    socket.on('message', function(message) {
        if(obj.rid === 'sw_open_session' && obj.site_id == '279') {
            // Aquí puedes generar la respuesta para sw_open_session
            var response = {
                rid: 'sw_open_session',
                code: 0, // Código para éxito (si aplicable)
                data: {
                    // Datos adicionales que desees enviar al cliente en respuesta a la solicitud
                    // Puedes incluir el session_id o cualquier otro dato relevante
                },
                message: 'La sesión se ha abierto exitosamente. WS:localhost' // Mensaje adicional
            };
            socket.send(JSON.stringify(response));
        }

        else if (obj.rid === 'restore_login') {
            var user = testUsers.find(u => u.user_id === obj.params.user_id && u.auth_token === obj.params.auth_token);
            if (user) {
                var response = {
                    rid: 'restore_login',
                    code: 0, // Código para autenticación exitosa
                    data: {
                        auth_token: obj.params.auth_token,
                        user_id: obj.params.user_id,
                        name: user.name,
                        balance: user.balance
                    }
                };
                socket.send(JSON.stringify(response));
            } else {
                var response = {
                    rid: 'restore_login',
                    code: 12, // Código para autenticación fallida
                    // Otros datos que desees enviar al cliente
                };
                socket.send(JSON.stringify(response));
            }
        }
        else if (obj.rid === 'sw_get_user_balance') {
            var user = testUsers.find(u => u.user_id === obj.params.user_id && u.auth_token === obj.params.auth_token);
            if (user) {
                var response = {
                    rid: 'sw_get_user_balance',
                    code: 0, // Código para éxito
                    data: {
                        auth_token: obj.params.auth_token,
                        user_id: obj.params.user_id,
                        balance: user.balance
                    }
                };
                socket.send(JSON.stringify(response));
            } else {
                var response = {
                    rid: 'sw_get_user_balance',
                    code: 12, // Código para error
                    // Otros datos que desees enviar al cliente
                };
                socket.send(JSON.stringify(response));
            }
        }
    });

    socket.on('close', function() {
        console.log('Client disconnected');
    });
});
