var socket = io();

const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

messageInput.focus();

messageInput.addEventListener('keydown', event => {
    if ( event.key == 'Enter'){
        socket.emit('chat_message', messageInput.value);
        messageInput.value = '';
    }
});

socket.on('connection', userId => {
    const item = document.createElement('li');
    item.textContent = 'User ' + userId + ' connected';
    chatMessages.appendChild(item);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('chat_message', msg => {
    const item = document.createElement('li');
    item.textContent = msg;
    chatMessages.appendChild(item);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});