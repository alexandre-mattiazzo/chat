const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');

// Conectando ao WebSocket
const socket = new WebSocket(process.env.WEBSOCKET_URL); // Substitua pelo endereço do servidor WebSocket

socket.onopen = () => {
    console.log('Conectado ao servidor WebSocket.');
};

socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);

    // Traduz e exibe a mensagem recebida
    const translatedMessage = await translateText(message.text, message.lang, targetLangSelect.value);
    const translatedDiv = document.createElement('div');
    translatedDiv.classList.add('message', 'translated');
    translatedDiv.textContent = `${message.user}: ${translatedMessage}`;
    chatMessages.appendChild(translatedDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
};

async function translateText(text, source, target) {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`);
    const result = await response.json();
    return result[0][0][0];
}

function sendMessage() {
    const userMessage = chatInput.value.trim();
    if (userMessage === '') return;

    const messageData = {
        user: 'Você',
        text: userMessage,
        lang: sourceLangSelect.value, // Idioma do usuário atual
    };

    // Envia a mensagem para o servidor WebSocket
    socket.send(JSON.stringify(messageData));

    // Exibe a mensagem original no chat
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user');
    userDiv.textContent = `Você: ${userMessage}`;
    chatMessages.appendChild(userDiv);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
