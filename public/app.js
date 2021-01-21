var socket = io();

const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');
const userList = document.getElementById('user-list');

messageInput.focus();

messageInput.addEventListener('keydown', event => {
    if ( event.key == 'Enter'){
        socket.emit('chat_message', messageInput.value);
        messageInput.value = '';
    }
});

socket.on('updateUserList', userListObj => {
    for ( const userName in userListObj ) {
        const userLi = document.createElement('li');
        userLi.innerText = userName;
        userList.append(userLi);
    }
});

socket.on('chat_message', msg => {
    const item = document.createElement('li');
    item.textContent = msg;
    chatMessages.appendChild(item);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});