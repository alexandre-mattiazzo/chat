const WebSocket = require('ws');
const http = require('http');

// Use a porta definida pela variável de ambiente ou 8080 como padrão
const PORT = process.env.PORT || 8080;

// Criar um servidor HTTP básico para suporte ao Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket rodando!\n');
});

// Vincular o WebSocket ao servidor HTTP
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Cliente conectado!');

    // Envia uma mensagem JSON para o cliente
    const message = { message: 'Olá do servidor WebSocket!' };
    ws.send(JSON.stringify(message));  // Envia como JSON

    // Recebe mensagens do cliente
    ws.on('message', message => {
        console.log('Recebido: %s', message);
    });

    // Opcional: Lidar com desconexões
    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
});

// Inicia o servidor na porta configurada
server.listen(PORT, () => {
    console.log(`Servidor WebSocket rodando em http://localhost:${PORT}`);
});
