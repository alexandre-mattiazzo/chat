const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');

// Usando o HTTPS com certificados (Render cuida do SSL automaticamente)
const server = https.createServer({
  // Certificado SSL gerenciado automaticamente pelo Render
  // cert: fs.readFileSync('/path/to/cert.pem'),   // Certificado (Render gerencia)
  // key: fs.readFileSync('/path/to/key.pem'),     // Chave (Render gerencia)
});

// Criando o servidor WebSocket na porta 443 (padrão para HTTPS)
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Cliente conectado!');

  // Envia uma mensagem para o cliente
  ws.send('Olá do servidor WebSocket!');

  // Recebe mensagens do cliente
  ws.on('message', message => {
    console.log('Recebido: %s', message);
  });
});

server.listen(443, () => {
  console.log('Servidor WebSocket seguro rodando na porta 443');
});
