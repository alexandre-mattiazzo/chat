const WebSocket = require('ws');

// Criando o servidor WebSocket na porta 8080 (Render gerencia a configuração HTTPS automaticamente)
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    console.log('Cliente conectado!');

    // Envia uma mensagem para o cliente
    ws.send('Olá do servidor WebSocket!');

    // Recebe mensagens do cliente
    ws.on('message', message => {
        console.log('Recebido: %s', message);
    });
});

console.log('Servidor WebSocket rodando na porta 8080');
