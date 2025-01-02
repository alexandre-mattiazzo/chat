const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (socket) => {
    clients.add(socket);

    socket.on('message', (message) => {
        // Retransmite a mensagem para todos os clientes conectados
        clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        clients.delete(socket);
    });
});

console.log('Servidor WebSocket rodando na porta 8080');
