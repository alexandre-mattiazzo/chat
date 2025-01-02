const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');

// Conectando ao WebSocket
const socket = new WebSocket('wss://chat-8uso.onrender.com'); // Substitua pelo endereço do servidor WebSocket

socket.onopen = () => {
    console.log('Conectado ao servidor WebSocket.');
};

socket.onmessage = async (event) => {
    try {
        let message;
        
        // Verifica se a mensagem recebida é um JSON ou uma string
        if (event.data.startsWith("{")) {
            message = JSON.parse(event.data); // Caso seja JSON, faz o parse
            console.log("Mensagem recebida do servidor (JSON):", message);
        } else {
            message = { message: event.data }; // Caso contrário, trata como string
            console.log("Mensagem recebida como string:", message.message);
        }

        // Traduz a mensagem recebida para o idioma do usuário
        let translatedMessage = message.message;
        if (typeof message.message === 'string') {
            translatedMessage = await translateText(message.message, message.lang, sourceLangSelect.value);
        }

        // Cria a mensagem traduzida ou original
        const translatedDiv = document.createElement('div');
        translatedDiv.classList.add('message', 'translated');
        translatedDiv.textContent = `Outro: ${translatedMessage}`;

        // Adiciona ao chat
        chatMessages.appendChild(translatedDiv);

        // Garante que o chat se move para o final
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Erro ao processar a mensagem recebida:', error);
    }
};

// Função para verificar se a mensagem é um JSON válido
function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        console.error('Erro:', e);
        return false;
    }
}

async function translateText(text, source, target) {
    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);

        if (!response.ok) {
            throw new Error('Falha na tradução');
        }

        const result = await response.json();
        return result[0][0][0];
    } catch (error) {
        console.error("Erro ao traduzir texto:", error);
        return text; // Caso ocorra erro, retorna o texto original
    }
}

function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;

    // Traduz a mensagem do usuário para o idioma do outro
    translateText(userMessage, sourceLangSelect.value, targetLangSelect.value)
        .then((translatedMessage) => {
            const messageData = {
                user: 'Você',
                message: translatedMessage, // A mensagem traduzida
                lang: sourceLangSelect.value, // Idioma do usuário atual
            };

            // Envia a mensagem traduzida para o servidor WebSocket
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(messageData));

                // Exibe a mensagem original no chat (no idioma do usuário)
                const userDiv = document.createElement('div');
                userDiv.classList.add('message', 'user');
                userDiv.textContent = `Você: ${userMessage}`;
                chatMessages.appendChild(userDiv);

                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                console.log("WebSocket não está aberto, tente novamente.");
            }
        })
        .catch((error) => {
            console.error('Erro ao traduzir a mensagem:', error);
        });
}
