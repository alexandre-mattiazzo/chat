const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Definir a porta a ser usada, com fallback para 10000
const PORT = process.env.PORT || 10000;

// Criar um servidor HTTP básico para suporte ao Render
const server = http.createServer((req, res) => {
    // Serve o arquivo index.html quando a rota raiz é acessada
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erro ao ler o arquivo index.html');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        // Serve outros arquivos (CSS, JS, etc.)
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Arquivo não encontrado!');
            } else {
                res.writeHead(200, { 'Content-Type': getContentType(filePath) });
                res.end(data);
            }
        });
    }
});

// Função para determinar o tipo de conteúdo de um arquivo
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.json': 'application/json',
    };
    return types[ext] || 'application/octet-stream';
}

// Vincular o WebSocket ao servidor HTTP
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Novo cliente conectado:', ws);

    // Envia uma mensagem JSON para o cliente logo após a conexão
    const message = { message: 'Olá do servidor WebSocket!' };
    ws.send(JSON.stringify(message));  // Envia a mensagem como JSON

    // Recebe mensagens dos clientes
    ws.on('message', message => {
        console.log('Mensagem recebida do cliente:', message);

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
