var socket = io();

const messageInput = document.getElementById('message-input');
const chatMessages = document.getElementById('chat-messages');

messageInput.focus();

// const msgUi = `
// <div class="chat-body p-4 flex-1 overflow-y-scroll">
//     <div class="flex flex-col justify-start">
//             <p class="font-bold text-xs mb-1">${ userId }</p>
//         <div class="messages text-sm text-gray-700 grid grid-flow-row gap-2">
//             <div class="flex items-center group">
//                 <p class="px-6 py-3 rounded-t-full rounded-r-full bg-gray-800 max-w-xs lg:max-w-md text-gray-200">${ msg }</p>
//             </div>
//         </div>
//     </div>
//     <div class="flex flex-row justify-end">
//         <div class="messages text-sm text-white grid grid-flow-row gap-2">
//             <div class="flex items-center flex-row-reverse group">
//                 <p class="px-6 py-3 rounded-t-full rounded-l-full bg-blue-700 max-w-xs lg:max-w-md">${ msg }</p>
//             </div>
//         </div>
//     </div>
// </div>`;

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

socket.on('chat_message', msgObj => {
    console.log(msgObj)
    const item = document.createElement('div');
    if (this.socket.id == msgObj.socketId) {
        item.innerHTML = `
        <div class="flex flex-row justify-end">
            <div class="messages text-sm text-white grid grid-flow-row gap-2">
                <div class="flex items-center flex-row-reverse group">
                    <p class="px-6 py-3 rounded-t-full rounded-l-full bg-blue-700 max-w-xs lg:max-w-md">${ msgObj.message }</p>
                </div>
            </div>
        </div>
    `
    } else {
        item.innerHTML = `
            <div class="flex flex-col justify-start">
            <p class="font-bold text-xs mb-1"></p>
                <div class="messages text-sm text-gray-700 grid grid-flow-row gap-2">
                    <div class="flex items-center group">
                        <p class="px-6 py-3 rounded-t-full rounded-r-full bg-gray-800 max-w-xs lg:max-w-md text-gray-200">${ msgObj.message }</p>
                    </div>
                </div>
            </div>
    `
    }
    chatMessages.appendChild(item);
    // item.textContent = msg;
});
