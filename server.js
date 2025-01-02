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

    // Envia uma mensagem para o cliente
    ws.send('Olá do servidor WebSocket!');

    // Recebe mensagens do cliente
    ws.on('message', message => {
        console.log('Recebido: %s', message);
    });

    // Opcional: Lidar com desconexões
    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
});

// Escutar na porta configurada
server.listen(PORT, () => {
    console.log(`Servidor HTTP e WebSocket rodando na porta ${PORT}`);
});
