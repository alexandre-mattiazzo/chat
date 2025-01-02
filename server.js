const WebSocket = require('ws');
const http = require('http');

// Use a porta definida pela variável de ambiente ou 8080 como padrão
const PORT = process.env.PORT || 10000;  // Altere aqui para garantir que o servidor use a porta correta

// Criar um servidor HTTP básico para suporte ao Render
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket rodando!\n');
});

// Vincular o WebSocket ao servidor HTTP
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Cliente conectado!');

    // Envia uma mensagem JSON para o cliente logo após a conexão
    const message = { message: 'Olá do servidor WebSocket!' };
    ws.send(JSON.stringify(message));  // Envia como JSON

    // Recebe mensagens dos clientes
    ws.on('message', message => {
        console.log('Recebido: %s', message);

        // Envia a mensagem para todos os clientes conectados, exceto o remetente
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message); // Envia para todos os outros clientes
            }
        });
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
